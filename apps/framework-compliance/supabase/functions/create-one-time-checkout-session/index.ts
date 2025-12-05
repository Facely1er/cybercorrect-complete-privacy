// Supabase Edge Function for creating one-time product checkout sessions
// Generates Stripe checkout sessions for one-time product purchases

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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

serve(async (req) => {
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
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { items, userId, email, successUrl, cancelUrl } = await req.json();

    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build line items for Stripe API (form-encoded format)
    const formData = new URLSearchParams();
    formData.append('mode', 'payment');
    const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('VITE_APP_URL') || 'https://app.cybercorrect.com';
    formData.append('success_url', successUrl || `${siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`);
    formData.append('cancel_url', cancelUrl || `${siteUrl}/store`);
    
    if (email) {
      formData.append('customer_email', email);
    }
    
    formData.append('allow_promotion_codes', 'true');

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
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorMessage;
        console.error('Stripe API error:', errorJson);
      } catch {
        console.error('Stripe API error (raw):', errorText);
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
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

