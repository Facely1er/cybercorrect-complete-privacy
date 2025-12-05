// Supabase Edge Function for Stripe Webhooks
// Handles Stripe webhook events for subscription management

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

/**
 * Verify Stripe webhook signature
 * Implements Stripe's webhook signature verification algorithm
 * See: https://stripe.com/docs/webhooks/signatures
 */
async function verifyStripeSignatureAsync(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Parse signature header
    const elements = signature.split(',');
    let timestamp: string | null = null;
    const signatures: string[] = [];

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key.startsWith('v')) {
        signatures.push(value);
      }
    }

    if (!timestamp || signatures.length === 0) {
      return false;
    }

    // Check timestamp (prevent replay attacks)
    const currentTime = Math.floor(Date.now() / 1000);
    const signatureTimestamp = parseInt(timestamp, 10);
    const tolerance = 300; // 5 minutes
    if (Math.abs(currentTime - signatureTimestamp) > tolerance) {
      return false;
    }

    // Create signed payload
    const signedPayload = `${timestamp}.${payload}`;

    // Compute expected signature using HMAC SHA-256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(signedPayload);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    
    // Convert signature to hex string
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const expectedSignature = signatureArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Compare with provided signatures (constant-time comparison)
    for (const sig of signatures) {
      if (sig.length !== expectedSignature.length) {
        continue;
      }
      let result = 0;
      for (let i = 0; i < sig.length; i++) {
        result |= sig.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
      }
      if (result === 0) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error in signature verification:', error);
    return false;
  }
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

    // Verify webhook signature
    if (stripeWebhookSecret) {
      const isValid = await verifyStripeSignatureAsync(body, signature, stripeWebhookSecret);
      if (!isValid) {
        console.error('Invalid Stripe webhook signature');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.warn('Stripe webhook secret not configured. Skipping signature verification.');
    }

    // Parse webhook event
    let event;
    try {
      event = JSON.parse(body);
    } catch (parseError) {
      console.error('Error parsing webhook body:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in webhook body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Handle checkout session completed
async function handleCheckoutCompleted(supabase: any, session: any) {
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const clientReferenceId = session.client_reference_id; // Should be user_id
  const purchaseType = session.metadata?.purchase_type;

  // Handle one-time product purchases
  if (purchaseType === 'one_time') {
    await handleOneTimePurchase(supabase, session);
    return;
  }

  // Handle subscription purchases (existing logic)
  if (!subscriptionId || !clientReferenceId) {
    console.error('Missing subscription ID or client reference ID');
    return;
  }

  // Fetch subscription from Stripe API to get accurate trial status
  // The subscription object in checkout.session.completed contains basic info
  // We need to check the actual subscription status from Stripe
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
  
  let subscriptionStatus = 'active';
  let periodEnd = new Date((session.created + 30 * 24 * 60 * 60) * 1000).toISOString();
  
  // Fetch subscription details from Stripe API if subscription ID exists
  if (subscriptionId && stripeSecretKey) {
    try {
      const stripeResponse = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
        },
      });
      
      if (stripeResponse.ok) {
        const stripeSubscription = await stripeResponse.json();
        // Map Stripe status to our status
        if (stripeSubscription.status === 'trialing') {
          subscriptionStatus = 'trialing';
        } else if (stripeSubscription.status === 'active') {
          subscriptionStatus = 'active';
        }
        
        // Use actual period end from Stripe
        if (stripeSubscription.current_period_end) {
          periodEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString();
        }
      }
    } catch (err) {
      console.warn('Error fetching subscription from Stripe:', err);
      // Fallback: assume trialing if metadata suggests it
      if (session.metadata?.trial_period_days) {
        subscriptionStatus = 'trialing';
        periodEnd = new Date((session.created + 14 * 24 * 60 * 60) * 1000).toISOString();
      }
    }
  } else {
    // Fallback: check metadata for trial indication
    if (session.metadata?.trial_period_days) {
      subscriptionStatus = 'trialing';
      periodEnd = new Date((session.created + 14 * 24 * 60 * 60) * 1000).toISOString();
    }
  }
  
  const subscriptionData = {
    user_id: clientReferenceId,
    tier: session.metadata?.tier || 'starter',
    status: subscriptionStatus,
    billing_period: session.metadata?.billing_period || 'monthly',
    current_period_start: new Date(session.created * 1000).toISOString(),
    current_period_end: periodEnd,
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

// Handle one-time product purchase
async function handleOneTimePurchase(supabase: any, session: any) {
  const productIds = session.metadata?.product_ids?.split(',') || [];
  const customerEmail = session.customer_email || session.metadata?.customer_email;
  const userId = session.metadata?.user_id;
  const sessionId = session.id;

  if (productIds.length === 0) {
    console.error('No product IDs found in session metadata');
    return;
  }

  // Generate license keys for each product
  const licenseKeys: Array<{ productId: string; licenseKey: string; productName: string }> = [];
  
  for (const productId of productIds) {
    const licenseKey = generateLicenseKey(productId);
    
    // Get product name (you may want to fetch from database or use a mapping)
    const productName = getProductName(productId);
    
    licenseKeys.push({
      productId,
      licenseKey,
      productName,
    });

    // Store purchase record in database (optional)
    if (userId) {
      const { error } = await supabase
        .from('cc_one_time_purchases')
        .insert({
          user_id: userId,
          product_id: productId,
          license_key: licenseKey,
          stripe_session_id: sessionId,
          stripe_customer_id: session.customer,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'usd',
          status: 'active',
          purchased_at: new Date().toISOString(),
        });

      if (error) {
        console.error(`Error storing purchase for ${productId}:`, error);
        // Continue processing other products even if one fails
      }
    }
  }

  // Build success URL with license keys
  const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('VITE_APP_URL') || 'https://app.cybercorrect.com';
  const licenseParams = licenseKeys
    .map(l => `${l.productId}-${l.licenseKey}`)
    .join(',');
  
  const successUrl = `${siteUrl}/store/success?licenses=${encodeURIComponent(licenseParams)}&session_id=${sessionId}`;

  // Send email with license keys (if email service configured)
  if (customerEmail) {
    try {
      await sendLicenseKeysEmail(supabase, customerEmail, licenseKeys, successUrl);
    } catch (emailError) {
      console.error('Error sending license keys email:', emailError);
      // Don't fail the webhook if email fails
    }
  }

  // Update Stripe session metadata with license keys (for reference)
  // Note: This requires Stripe API call - implement if needed
  console.log('One-time purchase processed:', {
    sessionId,
    productIds,
    licenseKeys: licenseKeys.map(l => l.licenseKey),
  });
}

// Generate license key (matches client-side format)
function generateLicenseKey(productId: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const productCode = productId.substring(0, 4).toUpperCase();
  return `${productCode}-${timestamp}-${random}`.toUpperCase();
}

// Get product name (you may want to fetch from database)
function getProductName(productId: string): string {
  const productNames: Record<string, string> = {
    'privacy-toolkit-pro': 'Privacy Toolkit Pro',
    'compliance-assessment-suite': 'Compliance Assessment Suite',
    'gdpr-complete-kit': 'GDPR Complete Kit',
    'policy-template-library': 'Policy & Template Library',
  };
  return productNames[productId] || productId;
}

// Send license keys via email
async function sendLicenseKeysEmail(
  supabase: any,
  email: string,
  licenseKeys: Array<{ productId: string; licenseKey: string; productName: string }>,
  activationUrl: string
) {
  const siteUrl = Deno.env.get('SITE_URL') || Deno.env.get('VITE_APP_URL') || 'https://app.cybercorrect.com';
  
  // Build email content
  const licenseList = licenseKeys
    .map(l => `  • ${l.productName}: ${l.licenseKey}`)
    .join('\n');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .license-key { background: #fff; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; font-family: monospace; }
        .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your License Keys Are Ready!</h1>
        </div>
        <div class="content">
          <p>Thank you for your purchase! Your license keys have been generated and are ready to use.</p>
          
          <h2>Your License Keys:</h2>
          ${licenseKeys.map(l => `
            <div class="license-key">
              <strong>${l.productName}</strong><br>
              <code>${l.licenseKey}</code>
            </div>
          `).join('')}
          
          <p><strong>Quick Activation:</strong></p>
          <a href="${activationUrl}" class="button">Activate Licenses Now</a>
          
          <p>Or manually activate at: <a href="${siteUrl}/activate-license">${siteUrl}/activate-license</a></p>
          
          <h3>What's Next?</h3>
          <ul>
            <li>Click the activation link above to automatically activate your licenses</li>
            <li>Or copy your license keys and activate them manually</li>
            <li>Your licenses are stored locally in your browser for complete privacy</li>
          </ul>
          
          <p><strong>Need Help?</strong></p>
          <p>If you have any questions, contact us at <a href="mailto:contact@ermits.com">contact@ermits.com</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ERMITS LLC. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const emailText = `
Your License Keys Are Ready!

Thank you for your purchase! Your license keys have been generated:

${licenseList}

Quick Activation:
${activationUrl}

Or manually activate at: ${siteUrl}/activate-license

Need Help?
Contact us at contact@ermits.com
  `;

  // Use external email service (Resend, SendGrid, etc.)
  const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL') || 'contact@ermits.com';

  // Try SendGrid first
  if (sendGridApiKey) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendGridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email }],
            subject: 'Your License Keys - Privacy Compliance Platform',
          }],
          from: {
            email: fromEmail,
            name: 'ERMITS LLC',
          },
          content: [{
            type: 'text/html',
            value: emailHtml,
          }, {
            type: 'text/plain',
            value: emailText,
          }],
        }),
      });

      if (response.ok) {
        console.log('License keys email sent via SendGrid');
        return;
      } else {
        const errorText = await response.text();
        console.warn('SendGrid API error:', response.status, errorText);
      }
    } catch (err) {
      console.error('SendGrid error:', err);
    }
  }

  // Try Resend as fallback
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: 'Your License Keys - Privacy Compliance Platform',
          html: emailHtml,
          text: emailText,
        }),
      });

      if (response.ok) {
        console.log('License keys email sent via Resend');
        return;
      } else {
        const errorText = await response.text();
        console.warn('Resend API error:', response.status, errorText);
      }
    } catch (err) {
      console.error('Resend error:', err);
    }
  }

  // Log if no email service configured (don't fail webhook)
  if (!sendGridApiKey && !resendApiKey) {
    console.log('No email service configured. License keys:', licenseKeys.map(l => l.licenseKey));
    console.log('Activation URL:', activationUrl);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(supabase: any, subscription: any) {
  const subscriptionId = subscription.id;
  const customerId = subscription.customer;

  // Find user by customer ID or subscription ID
  let userData;
  const { data: subData } = await supabase
    .from('cc_privacy_subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();
  
  if (subData) {
    userData = subData;
  } else {
    // Fallback: find by customer ID
    const { data: customerData } = await supabase
      .from('cc_privacy_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();
    userData = customerData;
  }

  if (!userData) {
    console.error('User not found for subscription:', subscriptionId);
    return;
  }

  // Map Stripe status to our status
  let status: string;
  if (subscription.status === 'active') {
    status = 'active';
  } else if (subscription.status === 'trialing') {
    status = 'trialing';
  } else if (subscription.status === 'past_due') {
    status = 'past_due';
  } else if (subscription.status === 'canceled' || subscription.status === 'cancelled') {
    status = 'cancelled';
  } else {
    status = 'expired';
  }

  const subscriptionData = {
    tier: subscription.metadata?.tier || 'starter',
    status: status,
    billing_period: subscription.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 'annual' : 'monthly',
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end || false,
    canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
    stripe_price_id: subscription.items?.data?.[0]?.price?.id,
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


