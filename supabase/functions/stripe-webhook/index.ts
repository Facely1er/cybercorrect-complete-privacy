// Supabase Edge Function for Stripe Webhooks
// Handles Stripe webhook events for subscription management

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
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
    const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Verify webhook signature (in production, use Stripe SDK)
    // For now, we'll skip verification in development
    if (import.meta.env.PROD && stripeWebhookSecret) {
      // TODO: Implement Stripe webhook signature verification
      // const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '');
      // const event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    }

    // Parse webhook event
    const event = JSON.parse(body);

    console.log('Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutCompleted(supabase, session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(supabase, subscription);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handleInvoicePaymentFailed(supabase, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Handle checkout session completed
async function handleCheckoutCompleted(supabase: any, session: any) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const clientReferenceId = session.client_reference_id; // Should be user_id

  if (!subscriptionId || !clientReferenceId) {
    console.error('Missing subscription ID or client reference ID');
    return;
  }

  // Fetch subscription from Stripe (in production, use Stripe SDK)
  // For now, we'll create a basic subscription record
  const subscriptionData = {
    user_id: clientReferenceId,
    tier: session.metadata?.tier || 'starter',
    status: 'active',
    billing_period: session.metadata?.billing_period || 'monthly',
    current_period_start: new Date(session.created * 1000).toISOString(),
    current_period_end: new Date((session.created + 30 * 24 * 60 * 60) * 1000).toISOString(),
    cancel_at_period_end: false,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: customerId,
    stripe_price_id: session.metadata?.price_id,
  };

  const { error } = await supabase
    .from('cc_privacy_subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'stripe_subscription_id',
    });

  if (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }

  console.log('Subscription created/updated:', subscriptionId);
}

// Handle subscription updated
async function handleSubscriptionUpdated(supabase: any, subscription: any) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer;

  // Find user by customer ID
  const { data: userData } = await supabase
    .from('cc_privacy_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!userData) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const subscriptionData = {
    tier: subscription.metadata?.tier || 'starter',
    status: subscription.status === 'active' ? 'active' : 
            subscription.status === 'trialing' ? 'trialing' :
            subscription.status === 'past_due' ? 'past_due' :
            subscription.status === 'canceled' ? 'cancelled' : 'expired',
    billing_period: subscription.items?.data[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end || false,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    stripe_price_id: subscription.items?.data[0]?.price?.id,
  };

  const { error } = await supabase
    .from('cc_privacy_subscriptions')
    .update(subscriptionData)
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  console.log('Subscription updated:', subscriptionId);
}

// Handle subscription deleted
async function handleSubscriptionDeleted(supabase: any, subscription: any) {
  const subscriptionId = subscription.id;

  const { error } = await supabase
    .from('cc_privacy_subscriptions')
    .update({
      status: 'cancelled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }

  console.log('Subscription cancelled:', subscriptionId);
}

// Handle invoice paid
async function handleInvoicePaid(supabase: any, invoice: any) {
  const invoiceId = invoice.id;
  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;

  // Find user by customer ID
  const { data: userData } = await supabase
    .from('cc_privacy_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!userData) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const invoiceData = {
    subscription_id: subscriptionId,
    user_id: userData.user_id,
    stripe_invoice_id: invoiceId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'paid',
    paid_at: new Date(invoice.status_transitions.paid_at * 1000).toISOString(),
    due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
    invoice_pdf: invoice.invoice_pdf,
    invoice_url: invoice.hosted_invoice_url,
  };

  const { error } = await supabase
    .from('cc_privacy_invoices')
    .upsert(invoiceData, {
      onConflict: 'stripe_invoice_id',
    });

  if (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }

  console.log('Invoice recorded:', invoiceId);
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(supabase: any, invoice: any) {
  const invoiceId = invoice.id;
  const subscriptionId = invoice.subscription;

  // Update subscription status to past_due
  const { error } = await supabase
    .from('cc_privacy_subscriptions')
    .update({
      status: 'past_due',
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }

  console.log('Subscription marked as past_due:', subscriptionId);
}


