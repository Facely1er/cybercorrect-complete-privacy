/**
 * Subscription Service
 * 
 * Handles subscription management, Stripe integration, and subscription-related operations.
 * This service bridges the frontend with Stripe Checkout and Supabase for subscription data.
 * 
 * Features:
 * - Create Stripe Checkout sessions
 * - Handle subscription updates/cancellations
 * - Check subscription access to features
 * - Sync subscription data with Supabase
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { secureStorage } from '../utils/secureStorage';
import { SubscriptionTier, UserSubscription } from '../utils/monetization';
import { errorMonitoring } from '../lib/errorMonitoring';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  status: 'active' | 'expired' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  tier: 'starter' | 'professional' | 'enterprise',
  billingPeriod: 'monthly' | 'annual'
): Promise<CheckoutSession | null> {
  try {
    // Check if Stripe is configured
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      console.warn('Stripe not configured. Subscription checkout unavailable.');
      return null;
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create checkout session');
    }

    // Call Supabase Edge Function to create checkout session
    // In production, this would call: supabase.functions.invoke('create-checkout-session', {...})
    // For now, we'll use a direct Stripe API call pattern
    
    // If Supabase is configured, use Edge Function
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          tier,
          billingPeriod,
          userId: user.id,
          email: user.email,
        },
      });

      if (error) {
        throw error;
      }

      return data as CheckoutSession;
    }

    // Fallback: Return mock session for development
    if (import.meta.env.DEV) {
      console.warn('Using mock checkout session (Stripe not configured)');
      return {
        sessionId: `mock_session_${Date.now()}`,
        url: `/subscription/success?tier=${tier}&billing=${billingPeriod}`,
      };
    }

    return null;
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to create checkout session'), {
      context: 'subscription_service',
      tier,
      billingPeriod,
    });
    throw error;
  }
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(): Promise<SubscriptionStatus | null> {
  try {
    // First check localStorage (Privacy by Design - works offline)
    const localSubscription = secureStorage.getItem<SubscriptionStatus>('user_subscription');
    if (localSubscription) {
      // If subscription is still valid, return it
      if (new Date(localSubscription.currentPeriodEnd) > new Date()) {
        return localSubscription;
      }
    }

    // If Supabase is configured, sync from cloud
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return localSubscription || null;
      }

      const { data, error } = await supabase
        .from('cc_privacy_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned (expected for new users)
        console.warn('Error fetching subscription:', error);
        return localSubscription || null;
      }

      if (data) {
        const subscription: SubscriptionStatus = {
          tier: data.tier as SubscriptionTier,
          status: data.status as SubscriptionStatus['status'],
          currentPeriodStart: data.current_period_start,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end || false,
          stripeSubscriptionId: data.stripe_subscription_id,
          stripeCustomerId: data.stripe_customer_id,
        };

        // Save to localStorage (Privacy by Design)
        secureStorage.setItem('user_subscription', subscription);
        return subscription;
      }
    }

    // Return localStorage subscription or default to free
    return localSubscription || {
      tier: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to get subscription'), {
      context: 'subscription_service',
    });
    
    // Fallback to localStorage
    const localSubscription = secureStorage.getItem<SubscriptionStatus>('user_subscription');
    return localSubscription || {
      tier: 'free',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    };
  }
}

/**
 * Cancel user's subscription
 */
export async function cancelSubscription(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // If Supabase is configured, call Edge Function to cancel
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to cancel subscription');
      }

      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId,
          userId: user.id,
        },
      });

      if (error) {
        throw error;
      }

      // Update local subscription
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        cancelAtPeriodEnd: true,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      return true;
    }

    // Fallback: Mark as cancelled locally
    if (import.meta.env.DEV) {
      console.warn('Using mock cancellation (Stripe not configured)');
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        cancelAtPeriodEnd: true,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      return true;
    }

    return false;
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to cancel subscription'), {
      context: 'subscription_service',
    });
    throw error;
  }
}

/**
 * Update subscription tier
 */
export async function updateSubscription(newTier: SubscriptionTier): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription || subscription.tier === 'enterprise') {
      throw new Error('Cannot update subscription');
    }

    // If Supabase is configured, call Edge Function to update
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User must be authenticated to update subscription');
      }

      const { error } = await supabase.functions.invoke('update-subscription', {
        body: {
          subscriptionId: subscription.stripeSubscriptionId,
          newTier,
          userId: user.id,
        },
      });

      if (error) {
        throw error;
      }

      // Update local subscription
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        tier: newTier,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      return true;
    }

    // Fallback: Update locally
    if (import.meta.env.DEV) {
      console.warn('Using mock update (Stripe not configured)');
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        tier: newTier,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      return true;
    }

    return false;
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to update subscription'), {
      context: 'subscription_service',
      newTier,
    });
    throw error;
  }
}

/**
 * Check if user has access to a feature
 */
export async function checkSubscriptionAccess(feature: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription) {
      return false;
    }

    // Check subscription status
    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return false;
    }

    // Check if subscription is expired
    if (new Date(subscription.currentPeriodEnd) < new Date()) {
      return false;
    }

    // Feature-based access checks
    const tier = subscription.tier;
    
    switch (feature) {
      case 'premium_templates':
        return tier === 'professional' || tier === 'enterprise';
      case 'unlimited_exports':
        return tier === 'professional' || tier === 'enterprise';
      case 'advanced_analytics':
        return tier === 'professional' || tier === 'enterprise';
      case 'regulatory_intelligence':
        return tier === 'professional' || tier === 'enterprise';
      case 'api_access':
        return tier === 'professional' || tier === 'enterprise';
      case 'white_glove_support':
        return tier === 'enterprise';
      case 'custom_integrations':
        return tier === 'enterprise';
      default:
        return tier !== 'free';
    }
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to check subscription access'), {
      context: 'subscription_service',
      feature,
    });
    return false;
  }
}

/**
 * Sync subscription from Supabase to localStorage
 */
export async function syncSubscriptionFromSupabase(): Promise<void> {
  try {
    if (!isSupabaseConfigured()) {
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    const subscription = await getUserSubscription();
    if (subscription) {
      // Already synced
      return;
    }

    // Fetch from Supabase
    const { data, error } = await supabase
      .from('cc_privacy_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error syncing subscription:', error);
      return;
    }

    if (data) {
      const subscriptionStatus: SubscriptionStatus = {
        tier: data.tier as SubscriptionTier,
        status: data.status as SubscriptionStatus['status'],
        currentPeriodStart: data.current_period_start,
        currentPeriodEnd: data.current_period_end,
        cancelAtPeriodEnd: data.cancel_at_period_end || false,
        stripeSubscriptionId: data.stripe_subscription_id,
        stripeCustomerId: data.stripe_customer_id,
      };

      secureStorage.setItem('user_subscription', subscriptionStatus);
    }
  } catch (error) {
    errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to sync subscription'), {
      context: 'subscription_service',
    });
  }
}


