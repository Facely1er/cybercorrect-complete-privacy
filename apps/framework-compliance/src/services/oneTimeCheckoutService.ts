/**
 * One-Time Product Checkout Service
 * 
 * Handles Stripe checkout integration for one-time product purchases.
 * Similar to subscriptionService but for one-time payments.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { logWarning, logError, logDebug } from '../utils/common';

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

/**
 * Type guard for errors with HTTP status codes
 */
interface ErrorWithStatus extends Error {
  status?: number;
}

function hasStatus(error: unknown): error is ErrorWithStatus {
  return error instanceof Error && 'status' in error;
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // Return mock session in dev, throw error in prod
      if (import.meta.env.DEV) {
        return {
          sessionId: `mock_session_${Date.now()}`,
          url: successUrl || `/store/success?session_id=mock_${Date.now()}`,
        };
      }
      throw new Error('Stripe is not configured. Please contact support to enable payment processing.');
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

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      const errorMsg = 'Supabase is not configured. Payment processing requires Supabase to be set up.';
      logWarning(errorMsg, {
        hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      });
      
      if (import.meta.env.DEV) {
        logWarning('Supabase not configured, using mock session');
        return {
          sessionId: `mock_session_${Date.now()}`,
          url: successUrl || `/store/success?session_id=mock_${Date.now()}`,
        };
      }
      throw new Error('Payment service is not configured. Please configure Supabase (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) to enable payment processing.');
    }

    // Use Edge Function to create checkout session
    try {
      const requestBody = {
        items,
        userId: user?.id,
        email: user?.email,
        successUrl: successUrl || `${window.location.origin}/store/success`,
        cancelUrl: cancelUrl || `${window.location.origin}/store`,
      };
      
      logDebug('Invoking Edge Function', { 
        function: 'create-one-time-checkout-session',
        itemsCount: items.length,
        hasUser: !!user,
        items: requestBody.items,
        userId: user?.id,
        email: user?.email,
      });
      
      const { data, error } = await supabase.functions.invoke('create-one-time-checkout-session', {
        body: requestBody,
      });
      
      logDebug('Edge Function Response', {
        hasData: !!data,
        hasError: !!error,
        error: error ? {
          message: error.message,
          status: hasStatus(error) ? error.status : undefined,
          details: error,
        } : null,
        data: data ? {
          hasSessionId: !!data.sessionId,
          hasUrl: !!data.url,
          url: data.url,
        } : null,
      });

      if (error) {
        logError(error instanceof Error ? error : new Error('Edge Function error'), { 
          context: 'one_time_checkout', 
          error: error,
          errorMessage: error.message,
          errorStatus: hasStatus(error) ? error.status : undefined,
        });
        
        // Provide specific error message based on error type
        if (error.message) {
          // Check for common error messages
          if (error.message.includes('not configured') || error.message.includes('Stripe secret key not configured')) {
            throw new Error('Payment service is not properly configured. The Stripe secret key may be missing. Please contact support.');
          }
          if (error.message.includes('Function not found') || error.message.includes('404') || (hasStatus(error) && error.status === 404)) {
            throw new Error('Payment service is not deployed. The checkout function may not be available. Please contact support.');
          }
          if (error.message.includes('CORS') || error.message.includes('cors')) {
            throw new Error('Payment service configuration error. CORS settings may be incorrect. Please contact support.');
          }
          if (error.message.includes('No items provided')) {
            throw new Error('Cart is empty. Please add items to your cart before checkout.');
          }
          if (error.message.includes('Invalid API Key') || error.message.includes('authentication')) {
            throw new Error('Payment service authentication error. The Stripe API key may be invalid. Please contact support.');
          }
          // Return the error message from the Edge Function if available
          throw new Error(error.message);
        }
        
        // Check error status code for more specific messages
        const errorStatus = hasStatus(error) ? error.status : undefined;
        if (errorStatus === 500) {
          throw new Error('Payment service encountered an error. Please try again or contact support if the problem persists.');
        }
        if (errorStatus === 503 || errorStatus === 502) {
          throw new Error('Payment service is temporarily unavailable. Please try again in a few moments.');
        }
        
        throw new Error('Failed to create checkout session. The payment service may be unavailable. Please try again or contact support.');
      } else if (data) {
        logDebug('Edge Function response received', { hasData: !!data, hasUrl: !!data?.url });
        // Check if data contains an error
        if (data.error) {
          throw new Error(data.error);
        }
        return data as CheckoutSession;
      } else {
        // No data and no error - unexpected
        throw new Error('Payment service returned an unexpected response. Please try again or contact support.');
      }
    } catch (invokeError) {
      logError(invokeError instanceof Error ? invokeError : new Error('Error invoking checkout function'), { context: 'one_time_checkout' });
      // Re-throw to show error to user
      if (invokeError instanceof Error) {
        throw invokeError;
      }
      throw new Error('Failed to connect to payment service. Please check your connection and try again.');
    }

    // Fallback: Return mock session for development
    if (import.meta.env.DEV) {
      logWarning('Using mock checkout session (Stripe/Supabase not configured or failed)');
      return {
        sessionId: `mock_session_${Date.now()}`,
        url: successUrl || `/store/success?session_id=mock_${Date.now()}`,
      };
    }

    // In production, throw error if all services fail
    throw new Error('Payment service is currently unavailable. Please check your connection and try again, or contact support if the problem persists.');
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

