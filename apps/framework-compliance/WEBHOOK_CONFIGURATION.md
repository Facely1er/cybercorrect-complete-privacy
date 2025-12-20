# Stripe Webhook Configuration Guide

## Overview

The Stripe webhook processes payment completion events and generates license keys for one-time purchases.

---

## Step 1: Create Webhook Endpoint

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/webhooks
2. **Click:** "+ Add endpoint"
3. **Endpoint URL:**
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
   ```
   Replace `YOUR_PROJECT_REF` with your Supabase project reference.
   
   Example:
   ```
   https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook
   ```

4. **Description:** "CyberCorrect One-Time Purchase Webhook"

---

## Step 2: Select Events

Select these events to listen for:

### Required Events
- ✅ `checkout.session.completed` - Triggers license key generation

### Optional Events (for subscriptions)
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`

---

## Step 3: Copy Webhook Secret

After creating the webhook:

1. **Click on the webhook** you just created
2. **Find "Signing secret"** section
3. **Click "Reveal"** to show the secret
4. **Copy the secret** (starts with `whsec_...`)
5. **Store securely** - you'll need this for Step 4

**Important:** Keep this secret secure. It's used to verify webhook authenticity.

---

## Step 4: Configure Edge Function Secret

1. **Go to Supabase Dashboard:** https://app.supabase.com
2. **Navigate to:** Edge Functions → `stripe-webhook` → Settings → Secrets
3. **Add Secret:**
   - **Name:** `STRIPE_WEBHOOK_SECRET`
   - **Value:** The webhook secret from Step 3 (`whsec_...`)
4. **Save**

---

## Step 5: Verify Webhook

### Test Mode Verification

1. **Use Stripe Test Mode:**
   - Switch to test mode in Stripe Dashboard
   - Use test API keys
   - Make a test purchase

2. **Check Webhook Delivery:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook
   - View "Recent events"
   - Verify `checkout.session.completed` event appears
   - Check event status (should be "Succeeded")

3. **Verify Processing:**
   - Check Supabase Edge Function logs
   - Verify license key generated
   - Check database for purchase record
   - Verify email sent (if configured)

### Production Verification

1. **Switch to Production Mode:**
   - Use production API keys
   - Make a small test purchase

2. **Monitor:**
   - Stripe Dashboard → Webhooks → Recent events
   - Supabase Dashboard → Edge Functions → Logs
   - Database → `cc_one_time_purchases` table

---

## Troubleshooting

### Webhook Not Receiving Events

**Symptoms:**
- Events not appearing in Stripe Dashboard
- License keys not generated

**Solutions:**
1. **Verify URL is correct:**
   - Check endpoint URL matches exactly
   - Ensure HTTPS is used
   - Verify Supabase project reference is correct

2. **Check Edge Function:**
   - Verify function is deployed
   - Check function logs for errors
   - Verify function is accessible

3. **Check Stripe:**
   - Verify webhook is enabled
   - Check webhook status in Stripe Dashboard
   - Review webhook event logs

### Webhook Signature Verification Fails

**Symptoms:**
- Events received but processing fails
- "Invalid signature" errors in logs

**Solutions:**
1. **Verify Secret:**
   - Check `STRIPE_WEBHOOK_SECRET` is set correctly
   - Ensure secret matches Stripe Dashboard
   - Copy secret again if needed

2. **Check Code:**
   - Verify `verifyStripeSignatureAsync` function works
   - Check webhook handler code

### Events Received But Not Processed

**Symptoms:**
- Events appear in Stripe but nothing happens
- No license keys generated

**Solutions:**
1. **Check Event Type:**
   - Verify `checkout.session.completed` is selected
   - Check event payload structure

2. **Check Function Logs:**
   - Review Supabase Edge Function logs
   - Look for error messages
   - Check database connection

3. **Verify Metadata:**
   - Check `purchase_type` metadata is `one_time`
   - Verify `product_ids` metadata is present

---

## Webhook Event Flow

```
1. Customer completes payment in Stripe Checkout
   ↓
2. Stripe sends checkout.session.completed event
   ↓
3. Webhook endpoint receives event
   ↓
4. Signature verified using STRIPE_WEBHOOK_SECRET
   ↓
5. Event processed:
   - Extract product IDs from metadata
   - Generate license keys
   - Store purchase in database
   - Send email with license keys
   ↓
6. Return 200 OK to Stripe
```

---

## Security Best Practices

1. **Always verify webhook signatures**
   - Prevents unauthorized requests
   - Ensures events are from Stripe

2. **Use HTTPS only**
   - Webhook endpoint must use HTTPS
   - Stripe requires secure connections

3. **Keep secrets secure**
   - Never commit webhook secrets to code
   - Use environment variables/secrets
   - Rotate secrets if exposed

4. **Monitor webhook health**
   - Set up alerts for failed deliveries
   - Review webhook logs regularly
   - Monitor error rates

---

## Testing Webhooks Locally

For local development, use Stripe CLI:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

---

## Additional Resources

- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Webhook Security](https://stripe.com/docs/webhooks/signatures)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Last Updated:** 2025-01-27

