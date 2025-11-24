/**
 * One-Time Product Checkout Service
 * 
 * Handles Stripe checkout integration for one-time product purchases.
 * Similar to subscriptionService but for one-time payments.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logWarning, logError } from '../utils/logger';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

export interface OneTimeCheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Calculate tax for a given subtotal
 * 
 * Note: Tax calculation is currently handled by Stripe when configured.
 * This function returns 0.00 as a placeholder. For production, either:
 * 1. Configure Stripe Tax (recommended) - Stripe will calculate tax server-side
 * 2. Integrate a tax calculation service (e.g., TaxJar, Avalara)
 * 3. Implement location-based tax calculation logic here
 * 
 * @param subtotal - The subtotal amount before tax
 * @param country - Optional country code for tax calculation
 * @param state - Optional state/province code for tax calculation
 * @returns Tax amount (currently always 0.00)
 */
export function calculateTax(_subtotal: number, _country?: string, _state?: string): number {
  // Tax calculation is handled by Stripe if configured
  // For custom tax calculation, implement logic here or integrate a tax service
  return 0.00;
}

/**
 * Create a Stripe Checkout session for one-time product purchase
 */
export async function createOneTimeCheckoutSession(
  items: OneTimeCheckoutItem[],
  successUrl?: string,
  cancelUrl?: string
): Promise<CheckoutSession | null> {
  try {
    // Validate items
    if (!items || items.length === 0) {
      logWarning('No items provided for checkout');
      return null;
    }

    // Check if Stripe is configured
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey) {
      logWarning('Stripe not configured. One-time checkout unavailable.');
      // Return mock session in dev, null in prod (graceful degradation)
      if (import.meta.env.DEV) {
        return {
          sessionId: `mock_session_${Date.now()}`,
          url: successUrl || `/store/success?session_id=mock_${Date.now()}`,
        };
      }
      return null;
    }

    // Get current user (optional for one-time purchases)
    let user;
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !authUser) {
        // User not authenticated - still allow checkout (guest checkout)
        logWarning('User not authenticated, proceeding with guest checkout');
      } else {
        user = authUser;
      }
    } catch (authErr) {
      logWarning('Error getting user for checkout', { error: authErr });
      // Continue with guest checkout
    }

    // If Supabase is configured, use Edge Function
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.functions.invoke('create-one-time-checkout-session', {
          body: {
            items,
            userId: user?.id,
            email: user?.email,
            successUrl: successUrl || `${window.location.origin}/store/success`,
            cancelUrl: cancelUrl || `${window.location.origin}/store`,
          },
        });

        if (error) {
          logError(error instanceof Error ? error : new Error('Edge Function error'), { context: 'one_time_checkout', error });
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
        logError(invokeError instanceof Error ? invokeError : new Error('Error invoking checkout function'), { context: 'one_time_checkout' });
        // Re-throw to show error to user
        if (invokeError instanceof Error) {
          throw invokeError;
        }
        throw new Error('Failed to connect to payment service. Please check your connection and try again.');
      }
    }

    // Fallback: Return mock session for development (never throw)
    if (import.meta.env.DEV) {
      logWarning('Using mock checkout session (Stripe/Supabase not configured or failed)');
      return {
        sessionId: `mock_session_${Date.now()}`,
        url: successUrl || `/store/success?session_id=mock_${Date.now()}`,
      };
    }

    // In production, return null if all services fail (graceful degradation)
    return null;
  } catch (error) {
    // Log error for monitoring
    logError(
      error instanceof Error ? error : new Error('Failed to create one-time checkout session'),
      {
        context: 'one_time_checkout_service',
        itemsCount: items?.length || 0,
      }
    );

    // Re-throw error so UI can show user-friendly message
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create checkout session. Please try again or contact support.');
  }
}

/**
 * Validate checkout items
 */
export function validateCheckoutItems(items: OneTimeCheckoutItem[]): { valid: boolean; error?: string } {
  if (!items || items.length === 0) {
    return { valid: false, error: 'Cart is empty' };
  }

  for (const item of items) {
    if (!item.productId || !item.name) {
      return { valid: false, error: 'Invalid product information' };
    }
    if (item.price <= 0) {
      return { valid: false, error: 'Invalid product price' };
    }
    if (item.quantity <= 0) {
      return { valid: false, error: 'Invalid product quantity' };
    }
  }

  return { valid: true };
}

