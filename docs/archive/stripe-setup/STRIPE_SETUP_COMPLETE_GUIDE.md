# Complete Stripe Integration Setup Guide

This guide will help you complete the Stripe integration for CyberCorrect. Follow these steps in order.

## Prerequisites

1. **Stripe Account**: You need a Stripe account with API keys
2. **Supabase CLI**: Install and login to Supabase CLI
   ```bash
   npm install -g supabase
   supabase login
   ```
3. **Supabase Project**: Your project should be linked
   ```bash
   cd apps/framework-compliance
   supabase link --project-ref <your-project-ref>
   ```

## Step 1: Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_live_` or `sk_test_`)
4. Copy your **Publishable key** (starts with `pk_live_` or `pk_test_`)

**Important**: Make sure both keys are from the same mode (both test or both live).

## Step 2: Create Products and Prices in Stripe

1. Go to Stripe Dashboard → **Products**
2. Create products for each subscription tier:

### Starter Plan
- **Name**: `Starter Plan`
- **Description**: `Perfect for small teams starting their privacy compliance journey`
- **Pricing**:
  - Add **Recurring** price: `$49/month` → Save → Note the Price ID
  - Add **Recurring** price: `$39/month` (billed annually = $468/year) → Save → Note the Price ID

### Professional Plan
- **Name**: `Professional Plan`
- **Description**: `Complete privacy compliance suite for growing organizations`
- **Pricing**:
  - Add **Recurring** price: `$99/month` → Save → Note the Price ID
  - Add **Recurring** price: `$79/month` (billed annually = $948/year) → Save → Note the Price ID

### Enterprise Plan (Optional)
- **Name**: `Enterprise Plan`
- **Description**: `White-glove privacy compliance support for large organizations`
- **Pricing**: Custom (or create prices if needed)

**Note**: Price IDs start with `price_` (e.g., `price_1AbCdEfGhIjKlMnOpQrStUv`)

## Step 3: Get Price IDs Automatically (Recommended)

Instead of manually copying Price IDs, use the provided script:

```bash
cd apps/framework-compliance
tsx scripts/get-stripe-price-ids.ts <YOUR_STRIPE_SECRET_KEY>
```

This will list all your products and their Price IDs in the correct format.

## Step 4: Configure Webhook in Stripe

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://[your-project-id].supabase.co/functions/v1/stripe-webhook`
   - Replace `[your-project-id]` with your Supabase project ID
   - Example: `https://abcdefghijklmnop.supabase.co/functions/v1/stripe-webhook`
4. **Description**: `Supabase Edge Function Webhook`
5. **Events to send**: Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_...`)

## Step 5: Run Complete Setup Script

Use the automated setup script to configure everything:

```bash
cd apps/framework-compliance

# Option 1: Using environment variables (recommended)
STRIPE_SECRET_KEY=sk_live_... \
STRIPE_PUBLISHABLE_KEY=pk_live_... \
STRIPE_WEBHOOK_SECRET=whsec_... \
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key \
STRIPE_PRICE_STARTER_MONTHLY=price_... \
STRIPE_PRICE_STARTER_ANNUAL=price_... \
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_... \
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_... \
tsx scripts/complete-stripe-setup.ts

# Option 2: Using command line arguments
tsx scripts/complete-stripe-setup.ts \
  <STRIPE_SECRET_KEY> \
  <STRIPE_PUBLISHABLE_KEY> \
  <STRIPE_WEBHOOK_SECRET> \
  <SUPABASE_URL> \
  <SUPABASE_SERVICE_ROLE_KEY> \
  <SITE_URL> \
  <PRICE_STARTER_MONTHLY> \
  <PRICE_STARTER_ANNUAL> \
  <PRICE_PROFESSIONAL_MONTHLY> \
  <PRICE_PROFESSIONAL_ANNUAL>
```

The script will:
1. ✅ Create/update `.env` file with Stripe publishable key
2. ✅ Set all Edge Function secrets in Supabase
3. ✅ Deploy all Edge Functions
4. ✅ Verify the setup

## Step 6: Manual Configuration (If Script Fails)

If the automated script doesn't work, configure manually:

### 6.1: Set Frontend Environment Variable

Create/update `.env` file in `apps/framework-compliance/`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 6.2: Set Edge Function Secrets

For each Edge Function, set the required secrets:

```bash
# Common secrets (all functions)
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set SITE_URL=https://www.platform.cybercorrect.com

# Webhook secret (stripe-webhook only)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs (create-checkout-session only)
supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_...
supabase secrets set STRIPE_PRICE_STARTER_ANNUAL=price_...
supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
supabase secrets set STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...
```

### 6.3: Deploy Edge Functions

```bash
cd apps/framework-compliance/supabase
supabase functions deploy create-checkout-session
supabase functions deploy create-one-time-checkout-session
supabase functions deploy stripe-webhook
```

## Step 7: Verify Setup

Run the verification script:

```bash
cd apps/framework-compliance
tsx scripts/verify-stripe-integration.ts
```

This will check:
- ✅ Environment variables are set
- ✅ Stripe keys are in correct format
- ✅ All required variables are present

## Step 8: Test the Integration

### Test Subscription Checkout

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to `/pricing` page
3. Click "Subscribe Now" on a plan
4. Should redirect to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. Should redirect to success page

### Test One-Time Checkout

1. Go to `/store` page
2. Add product to cart
3. Go to checkout
4. Click "Complete Purchase"
5. Should redirect to Stripe Checkout
6. Complete payment
7. Should redirect to success page with license keys

## Troubleshooting

### Issue: "Stripe not configured"
**Fix**: Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env` and restart dev server

### Issue: "Payment service is not deployed"
**Fix**: Deploy Edge Functions to Supabase
```bash
cd apps/framework-compliance/supabase
supabase functions deploy
```

### Issue: "Payment service is not properly configured"
**Fix**: Add required secrets to Edge Functions (see Step 6.2)

### Issue: "Stripe secret key not configured"
**Fix**: Add `STRIPE_SECRET_KEY` to Edge Function secrets

### Issue: "Price ID not configured"
**Fix**: 
1. Get Price IDs: `tsx scripts/get-stripe-price-ids.ts <STRIPE_SECRET_KEY>`
2. Set them as secrets: `supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_...`

### Issue: Webhook not receiving events
**Fix**: 
1. Check webhook endpoint URL is correct
2. Verify webhook secret is set: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`
3. Check Edge Function logs in Supabase Dashboard

## Production Checklist

Before going live:

- [ ] Switch to **Live mode** keys in Stripe Dashboard
- [ ] Update all secrets with live keys
- [ ] Update `.env` file with live publishable key
- [ ] Redeploy Edge Functions
- [ ] Test with real payment (small amount)
- [ ] Verify webhook is receiving events
- [ ] Check subscription creation in database
- [ ] Test subscription cancellation
- [ ] Test payment failure handling

## Support

If you encounter issues:

1. Check Edge Function logs in Supabase Dashboard
2. Check browser console for errors
3. Verify all secrets are set correctly
4. Review Stripe Dashboard → Logs for API errors
5. Check `STRIPE_DEBUG_GUIDE.md` for detailed troubleshooting

---

**Last Updated**: January 2025
**Status**: Ready for Production

