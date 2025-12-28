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
import { secureStorage } from '../utils/storage';
import { SubscriptionTier } from '../utils/monetization';
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
  billingPeriod: 'quarterly'
): Promise<CheckoutSession | null> {
  try {
    // Check if Stripe is configured
    // Default Stripe key from repository configuration
    // Can be overridden by environment variable
    const DEFAULT_STRIPE_PUBLISHABLE_KEY = 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O';
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || DEFAULT_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      const errorMsg = 'Stripe not configured. VITE_STRIPE_PUBLISHABLE_KEY environment variable is missing.';
      console.error(errorMsg);
      console.error('To fix this:');
      console.error('1. Create/update .env file in project root with: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...');
      console.error('2. Restart your dev server (npm run dev)');
      console.error('3. For production, set the variable in your deployment platform');
      
      // Return mock session in dev, throw error in prod
      if (import.meta.env.DEV) {
        console.warn('Using mock checkout session in development mode');
        return {
          sessionId: `mock_session_${Date.now()}`,
          url: `/subscription/success?tier=${tier}&billing=${billingPeriod}`,
        };
      }
      throw new Error('Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY environment variable and restart the application.');
    }

    // Get current user (with error handling)
    let user;
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.warn('User not authenticated, cannot create checkout session');
        return null; // Graceful degradation - don't throw
      }
      user = authUser;
    } catch (authErr) {
      console.warn('Error getting user for checkout:', authErr);
      return null; // Graceful degradation
    }

    // If Supabase is configured, use Edge Function
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            tier,
            billingPeriod,
            userId: user.id,
            email: user.email,
          },
        });

        if (error) {
          console.error('Supabase Edge Function error:', error);
          // Return error details for better user feedback
          if (error.message) {
            throw new Error(error.message);
          }
          throw new Error('Failed to create checkout session. Please try again or contact support.');
        } else if (data) {
          // Check if data contains an error
          if (data.error) {
            throw new Error(data.error);
          }
          return data as CheckoutSession;
        }
      } catch (invokeError) {
        console.error('Error invoking checkout session function:', invokeError);
        // Re-throw to show error to user
        if (invokeError instanceof Error) {
          throw invokeError;
        }
        throw new Error('Failed to connect to payment service. Please check your connection and try again.');
      }
    }

    // Fallback: Return mock session for development (never throw)
    if (import.meta.env.DEV) {
      console.warn('Using mock checkout session (Stripe/Supabase not configured or failed)');
      return {
        sessionId: `mock_session_${Date.now()}`,
        url: `/subscription/success?tier=${tier}&billing=${billingPeriod}`,
      };
    }

    // In production, return null if all services fail (graceful degradation)
    return null;
  } catch (error) {
    // Log error for monitoring
    console.error('Unexpected error in createCheckoutSession:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to create checkout session'), {
        context: 'subscription_service',
        tier,
        billingPeriod,
      });
    } catch (monitoringError) {
      // Even error monitoring failed - just log to console
      console.error('Error monitoring also failed:', monitoringError);
    }
    
    // Re-throw error so UI can show user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create checkout session. Please try again or contact support.');
  }
}

/**
 * Get user's current subscription
 */
export async function getUserSubscription(): Promise<SubscriptionStatus | null> {
  try {
    // First check localStorage (Privacy by Design - works offline)
    let localSubscription: SubscriptionStatus | null = null;
    try {
      localSubscription = secureStorage.getItem<SubscriptionStatus>('user_subscription');
      if (localSubscription) {
        // If subscription is still valid, return it
        if (new Date(localSubscription.currentPeriodEnd) > new Date()) {
          return localSubscription;
        }
      }
    } catch (storageError) {
      console.warn('Error reading subscription from localStorage:', storageError);
      // Continue to try other sources
    }

    // If Supabase is configured, sync from cloud (with error handling)
    if (isSupabaseConfigured()) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          // Not authenticated - return localStorage or default
          return localSubscription || getDefaultSubscription();
        }

        try {
          // Fetch active or trialing subscriptions
          const { data, error } = await supabase
            .from('cc_privacy_subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (error && error.code !== 'PGRST116') {
            // PGRST116 = no rows returned (expected for new users)
            console.warn('Error fetching subscription from Supabase:', error);
            return localSubscription || getDefaultSubscription();
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

            // Save to localStorage (Privacy by Design) - with error handling
            try {
              secureStorage.setItem('user_subscription', subscription);
            } catch (saveError) {
              console.warn('Error saving subscription to localStorage:', saveError);
              // Continue anyway - we still return the subscription
            }
            return subscription;
          }
        } catch (queryError) {
          console.warn('Error querying subscription from Supabase:', queryError);
          // Fall through to localStorage/default
        }
      } catch (supabaseError) {
        console.warn('Error accessing Supabase for subscription:', supabaseError);
        // Fall through to localStorage/default
      }
    }

    // Return localStorage subscription or default to free (never throw)
    return localSubscription || getDefaultSubscription();
  } catch (error) {
    // Never throw - always return a fallback
    console.error('Unexpected error in getUserSubscription:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to get subscription'), {
        context: 'subscription_service',
      });
    } catch (monitoringError) {
      console.error('Error monitoring also failed:', monitoringError);
    }
    
    // Always return a default subscription
    return getDefaultSubscription();
  }
}

// Helper function to get default subscription (never throws)
function getDefaultSubscription(): SubscriptionStatus {
  return {
    tier: 'free',
    status: 'active',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false,
  };
}

/**
 * Cancel user's subscription
 */
export async function cancelSubscription(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription || !subscription.stripeSubscriptionId) {
      console.warn('No active subscription found to cancel');
      return false; // Don't throw - graceful degradation
    }

    // If Supabase is configured, call Edge Function to cancel
    if (isSupabaseConfigured()) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.warn('User not authenticated, cannot cancel subscription via Stripe');
          // Fall through to local cancellation
        } else {
          try {
            const { error } = await supabase.functions.invoke('cancel-subscription', {
              body: {
                subscriptionId: subscription.stripeSubscriptionId,
                userId: user.id,
              },
            });

            if (error) {
              console.warn('Error canceling subscription via Stripe:', error);
              // Fall through to local cancellation
            } else {
              // Successfully cancelled via Stripe - update local
              try {
                const updatedSubscription: SubscriptionStatus = {
                  ...subscription,
                  cancelAtPeriodEnd: true,
                };
                secureStorage.setItem('user_subscription', updatedSubscription);
                return true;
              } catch (saveError) {
                console.warn('Error saving cancellation to localStorage:', saveError);
                return true; // Still return true - cancellation succeeded
              }
            }
          } catch (invokeError) {
            console.warn('Error invoking cancel subscription function:', invokeError);
            // Fall through to local cancellation
          }
        }
      } catch (supabaseError) {
        console.warn('Error accessing Supabase for cancellation:', supabaseError);
        // Fall through to local cancellation
      }
    }

    // Fallback: Mark as cancelled locally (works even without Stripe/Supabase)
    try {
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        cancelAtPeriodEnd: true,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      if (import.meta.env.DEV) {
        console.warn('Using local cancellation (Stripe/Supabase not configured or failed)');
      }
      return true; // Successfully cancelled locally
    } catch (saveError) {
      console.error('Error saving cancellation locally:', saveError);
      return false; // Failed to save, but don't throw
    }
  } catch (error) {
    // Never throw - always return false on error
    console.error('Unexpected error in cancelSubscription:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to cancel subscription'), {
        context: 'subscription_service',
      });
    } catch (monitoringError) {
      console.error('Error monitoring also failed:', monitoringError);
    }
    return false; // Graceful degradation
  }
}

/**
 * Update subscription tier
 */
export async function updateSubscription(newTier: SubscriptionTier): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription || subscription.tier === 'enterprise') {
      console.warn('Cannot update subscription - no subscription or enterprise tier');
      return false; // Don't throw - graceful degradation
    }

    // If Supabase is configured, call Edge Function to update
    if (isSupabaseConfigured()) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.warn('User not authenticated, cannot update subscription via Stripe');
          // Fall through to local update
        } else {
          try {
            const { error } = await supabase.functions.invoke('update-subscription', {
              body: {
                subscriptionId: subscription.stripeSubscriptionId,
                newTier,
                userId: user.id,
              },
            });

            if (error) {
              console.warn('Error updating subscription via Stripe:', error);
              // Fall through to local update
            } else {
              // Successfully updated via Stripe - update local
              try {
                const updatedSubscription: SubscriptionStatus = {
                  ...subscription,
                  tier: newTier,
                };
                secureStorage.setItem('user_subscription', updatedSubscription);
                return true;
              } catch (saveError) {
                console.warn('Error saving update to localStorage:', saveError);
                return true; // Still return true - update succeeded
              }
            }
          } catch (invokeError) {
            console.warn('Error invoking update subscription function:', invokeError);
            // Fall through to local update
          }
        }
      } catch (supabaseError) {
        console.warn('Error accessing Supabase for update:', supabaseError);
        // Fall through to local update
      }
    }

    // Fallback: Update locally (works even without Stripe/Supabase)
    try {
      const updatedSubscription: SubscriptionStatus = {
        ...subscription,
        tier: newTier,
      };
      secureStorage.setItem('user_subscription', updatedSubscription);
      if (import.meta.env.DEV) {
        console.warn('Using local update (Stripe/Supabase not configured or failed)');
      }
      return true; // Successfully updated locally
    } catch (saveError) {
      console.error('Error saving update locally:', saveError);
      return false; // Failed to save, but don't throw
    }
  } catch (error) {
    // Never throw - always return false on error
    console.error('Unexpected error in updateSubscription:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to update subscription'), {
        context: 'subscription_service',
        newTier,
      });
    } catch (monitoringError) {
      console.error('Error monitoring also failed:', monitoringError);
    }
    return false; // Graceful degradation
  }
}

/**
 * Check if user has access to a feature
 */
export async function checkSubscriptionAccess(feature: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription) {
      return false; // No subscription = no access (safe default)
    }

    // Check subscription status (with error handling)
    try {
      if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        return false;
      }

      // Check if subscription is expired (with error handling)
      const periodEnd = new Date(subscription.currentPeriodEnd);
      if (isNaN(periodEnd.getTime()) || periodEnd < new Date()) {
        return false;
      }

      // For trials, grant access based on the tier being trialed
      // Trials get the same access as the paid tier they're trialing
      const effectiveTier = subscription.tier; // Trial tier = target paid tier
      
      switch (feature) {
        case 'premium_templates':
          return effectiveTier === 'professional' || effectiveTier === 'enterprise';
        case 'unlimited_exports':
          return effectiveTier === 'professional' || effectiveTier === 'enterprise';
        case 'advanced_analytics':
          return effectiveTier === 'professional' || effectiveTier === 'enterprise';
        case 'regulatory_intelligence':
          return effectiveTier === 'professional' || effectiveTier === 'enterprise';
        case 'api_access':
          return effectiveTier === 'professional' || effectiveTier === 'enterprise';
        case 'white_glove_support':
          return effectiveTier === 'enterprise';
        case 'custom_integrations':
          return effectiveTier === 'enterprise';
        default:
          return effectiveTier !== 'free';
      }
    } catch (checkError) {
      console.warn('Error checking subscription access:', checkError);
      return false; // Safe default - deny access on error
    }
  } catch (error) {
    // Never throw - always return false (safe default)
    console.error('Unexpected error in checkSubscriptionAccess:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to check subscription access'), {
        context: 'subscription_service',
        feature,
      });
    } catch (monitoringError) {
      console.error('Error monitoring also failed:', monitoringError);
    }
    return false; // Safe default - deny access on error
  }
}

/**
 * Check if user is currently on a trial
 */
export async function isOnTrial(): Promise<boolean> {
  try {
    const subscription = await getUserSubscription();
    return subscription?.status === 'trialing' || false;
  } catch (error) {
    console.warn('Error checking trial status:', error);
    return false;
  }
}

/**
 * Get trial days remaining
 */
export async function getTrialDaysRemaining(): Promise<number> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription || subscription.status !== 'trialing') {
      return 0;
    }

    const periodEnd = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const diffTime = periodEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  } catch (error) {
    console.warn('Error calculating trial days remaining:', error);
    return 0;
  }
}

/**
 * Check if user has used a trial before (prevent abuse)
 */
export async function hasUsedTrial(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false; // Can't check without database
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('cc_privacy_subscription_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('new_status', 'trialing')
      .limit(1)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Get effective subscription tier (for trials, returns the tier being trialed)
 */
export async function getEffectiveTier(): Promise<SubscriptionTier> {
  try {
    const subscription = await getUserSubscription();
    if (!subscription) return 'free';

    // Trials grant access to the tier they're trialing
    return subscription.tier;
  } catch (error) {
    console.warn('Error getting effective tier:', error);
    return 'free';
  }
}

/**
 * Check if user has access to the Privacy Portal
 * Portal access is granted to:
 * 1. Paid subscribers (Professional/Enterprise tiers)
 * 2. Beta participants with portal_access_granted = true
 */
export async function checkPortalAccess(): Promise<boolean> {
  try {
    // Check if user has an active paid subscription
    const subscription = await getUserSubscription();
    if (subscription &&
        (subscription.status === 'active' || subscription.status === 'trialing') &&
        (subscription.tier === 'professional' || subscription.tier === 'enterprise')) {
      return true;
    }

    // Check if user is a beta participant with portal access
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
          .from('portal_beta_participants')
          .select('portal_access_granted, status')
          .eq('application_id', user.id)
          .eq('status', 'active')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('Error checking portal beta access:', error);
          return false;
        }

        if (data && data.portal_access_granted) {
          return true;
        }
      } catch (dbError) {
        console.warn('Error querying portal_beta_participants:', dbError);
        // Continue to return false
      }
    }

    return false;
  } catch (error) {
    console.error('Unexpected error in checkPortalAccess:', error);
    try {
      errorMonitoring.captureException(error instanceof Error ? error : new Error('Failed to check portal access'), {
        context: 'subscription_service',
      });
    } catch (monitoringError) {
      console.error('Error monitoring also failed:', monitoringError);
    }
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

    // Fetch from Supabase (include trialing subscriptions)
    const { data, error } = await supabase
      .from('cc_privacy_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
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


