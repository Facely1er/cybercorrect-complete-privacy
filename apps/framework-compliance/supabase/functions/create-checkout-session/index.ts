// Supabase Edge Function for creating subscription checkout sessions
// Generates Stripe checkout sessions for subscription purchases

/// <reference path="../deno.d.ts" />

// @ts-expect-error - Deno HTTP imports are valid in Supabase Edge Functions runtime
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error - ESM imports are valid in Supabase Edge Functions runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubscriptionTier {
  tier: 'starter' | 'professional' | 'enterprise';
  billingPeriod: 'monthly' | 'annual';
}

// Price IDs mapping (should be configured via environment variables or database)
const PRICE_IDS: Record<string, Record<string, string>> = {
  starter: {
    monthly: Deno.env.get('STRIPE_PRICE_STARTER_MONTHLY') || '',
    annual: Deno.env.get('STRIPE_PRICE_STARTER_ANNUAL') || '',
  },
  professional: {
    monthly: Deno.env.get('STRIPE_PRICE_PROFESSIONAL_MONTHLY') || '',
    annual: Deno.env.get('STRIPE_PRICE_PROFESSIONAL_ANNUAL') || '',
  },
  enterprise: {
    monthly: Deno.env.get('STRIPE_PRICE_ENTERPRISE_MONTHLY') || '',
    annual: Deno.env.get('STRIPE_PRICE_ENTERPRISE_ANNUAL') || '',
  },
};

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
    const { tier, billingPeriod, userId, email }: SubscriptionTier & { userId?: string; email?: string } = await req.json();

    if (!tier || !billingPeriod) {
      return new Response(
        JSON.stringify({ error: 'Tier and billing period are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const priceId = PRICE_IDS[tier]?.[billingPeriod];
    if (!priceId || priceId.trim() === '') {
      console.error(`Price ID not configured for ${tier} ${billingPeriod}. Available tiers: ${Object.keys(PRICE_IDS).join(', ')}`);
      return new Response(
        JSON.stringify({ 
          error: `Price ID not configured for ${tier} ${billingPeriod}`,
          details: 'Please configure the STRIPE_PRICE environment variables in your Supabase Edge Function secrets',
          availableTiers: Object.keys(PRICE_IDS),
          requiredEnvVars: [
            `STRIPE_PRICE_${tier.toUpperCase()}_MONTHLY`,
            `STRIPE_PRICE_${tier.toUpperCase()}_ANNUAL`
          ]
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate price ID format (Stripe price IDs start with price_)
    if (!priceId.startsWith('price_')) {
      console.error(`Invalid price ID format for ${tier} ${billingPeriod}: ${priceId}`);
      return new Response(
        JSON.stringify({ 
          error: `Invalid price ID format for ${tier} ${billingPeriod}`,
          details: 'Stripe price IDs must start with "price_"'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has used a trial before (prevent abuse)
    let enableTrial = true;
    if (userId && tier !== 'enterprise') {
      try {
        const { data: historyData } = await supabase
          .from('cc_privacy_subscription_history')
          .select('*')
          .eq('user_id', userId)
          .eq('new_status', 'trialing')
          .limit(1)
          .single();
        
        if (historyData) {
          enableTrial = false; // User has already used a trial
        }
      } catch (err) {
        // If check fails, allow trial (graceful degradation)
        console.warn('Error checking trial history:', err);
      }
    }

    // Build form data for Stripe API
    const formData = new URLSearchParams();
    formData.append('mode', 'subscription');
    const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('VITE_APP_URL') || 'https://app.cybercorrect.com';
    formData.append('success_url', `${siteUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`);
    formData.append('cancel_url', `${siteUrl}/subscription`);
    formData.append('line_items[0][price]', priceId);
    formData.append('line_items[0][quantity]', '1');
    
    // Add trial period if eligible (14 days, requires payment method)
    if (enableTrial && tier !== 'enterprise') {
      formData.append('subscription_data[trial_period_days]', '14');
      formData.append('payment_method_collection', 'always'); // Require payment method for trial
    }
    
    if (userId) {
      formData.append('client_reference_id', userId);
    }
    
    if (email) {
      formData.append('customer_email', email);
    }

    // Add metadata
    formData.append('metadata[tier]', tier);
    formData.append('metadata[billing_period]', billingPeriod);
    formData.append('metadata[price_id]', priceId);
    if (userId) {
      formData.append('metadata[user_id]', userId);
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
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
