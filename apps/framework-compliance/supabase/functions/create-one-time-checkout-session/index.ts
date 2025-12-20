/**
 * Supabase Edge Function: Create One-Time Checkout Session
 * 
 * Generates Stripe checkout sessions for one-time product purchases.
 * Supports both authenticated users and guest checkout.
 * 
 * Handles:
 * - Creating Stripe checkout sessions with line items
 * - Setting up metadata for webhook processing
 * - Configuring success/cancel URLs
 * - Error handling and validation
 */

/// <reference path="../deno.d.ts" />

// @ts-expect-error - Deno HTTP imports are valid in Supabase Edge Functions runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error - ESM imports are valid in Supabase Edge Functions runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface StripeErrorDetails {
  type?: string;
  code?: string;
  param?: string;
}

/**
 * Main Edge Function handler for creating one-time checkout sessions
 * 
 * @param req - HTTP request containing checkout items and user information
 * @returns Response with checkout session ID and URL, or error details
 */
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY is not set in Edge Function secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Stripe secret key not configured',
          message:
            'The STRIPE_SECRET_KEY secret is missing from the Edge Function configuration. ' +
            'Please add it in Supabase Dashboard → Edge Functions → ' +
            'create-one-time-checkout-session → Secrets.'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { items, userId, email, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      console.error('No items provided in checkout request');
      return new Response(
        JSON.stringify({ 
          error: 'No items provided',
          message: 'At least one item is required to create a checkout session.'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build line items for Stripe API (form-encoded format)
    const formData = new URLSearchParams();
    formData.append('mode', 'payment');
    const siteUrl =
      Deno.env.get('SITE_URL') ||
      Deno.env.get('VITE_APP_URL') ||
      'https://app.cybercorrect.com';
    formData.append(
      'success_url',
      successUrl || `${siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`
    );
    formData.append('cancel_url', cancelUrl || `${siteUrl}/store`);
    
    if (email) {
      formData.append('customer_email', email);
    }
    
    formData.append('allow_promotion_codes', 'true');
    
    // Enable automatic tax calculation if Stripe Tax is configured
    // Stripe will automatically calculate tax based on customer location
    // To enable: Stripe Dashboard → Settings → Tax → Enable "Automatic tax calculation"
    formData.append('automatic_tax[enabled]', 'true');

    // Add line items in Stripe's expected format
    items.forEach((item: CheckoutItem, index: number) => {
      const prefix = `line_items[${index}]`;
      formData.append(`${prefix}[price_data][currency]`, 'usd');
      formData.append(`${prefix}[price_data][product_data][name]`, item.name);
      formData.append(`${prefix}[price_data][product_data][metadata][product_id]`, item.productId);
      formData.append(`${prefix}[price_data][unit_amount]`, Math.round(item.price * 100).toString());
      formData.append(`${prefix}[quantity]`, item.quantity.toString());
    });

    // Add metadata
    formData.append('metadata[purchase_type]', 'one_time');
    formData.append('metadata[product_ids]', items.map((item: CheckoutItem) => item.productId).join(','));
    if (userId) {
      formData.append('metadata[user_id]', userId);
    }
    if (email) {
      formData.append('metadata[customer_email]', email);
    }

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!stripeResponse.ok) {
      const errorText = await stripeResponse.text();
      let errorMessage = 'Failed to create checkout session';
      let errorDetails: StripeErrorDetails = {};
      
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
        errorDetails = {
          type: errorJson.error?.type,
          code: errorJson.error?.code,
          param: errorJson.error?.param,
        };
        console.error('Stripe API error:', {
          message: errorMessage,
          type: errorDetails.type,
          code: errorDetails.code,
          status: stripeResponse.status,
        });
      } catch {
        console.error('Stripe API error (raw):', errorText);
      }
      
      // Provide more helpful error messages based on Stripe error types
      if (
        errorDetails.type === 'invalid_request_error' &&
        errorMessage.includes('Invalid API Key')
      ) {
        errorMessage =
          'Invalid Stripe API key. ' +
          'Please check the STRIPE_SECRET_KEY secret in the Edge Function configuration.';
      } else if (errorDetails.type === 'api_connection_error') {
        errorMessage =
          'Unable to connect to Stripe. ' +
          'Please check your internet connection and try again.';
      } else if (errorDetails.type === 'api_error') {
        errorMessage = 'Stripe API error. Please try again in a few moments.';
      }
      
      return new Response(
        JSON.stringify({ 
          error: errorMessage,
          details: errorDetails,
        }),
        { status: stripeResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const session = await stripeResponse.json();

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error && 'type' in error ? (error as any).type : undefined;
    
    // Return more detailed error information
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: errorMessage,
        details: errorDetails,
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

