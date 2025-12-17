# ✅ Stripe Configuration - Complete Guide

**Date:** December 17, 2025  
**Status:** Ready to Configure

---

## 🚀 Quick Start

### Interactive Setup (Recommended)

```bash
npm run stripe:complete
```

This will:
1. Prompt you for all required Stripe keys
2. Save environment variables
3. Generate setup instructions
4. Create CLI commands file

---

## 📋 What You Need

Before starting, gather these from Stripe Dashboard:

1. **Stripe API Keys** (https://dashboard.stripe.com/apikeys)
   - Secret Key: `sk_live_...` or `sk_test_...`
   - Publishable Key: `pk_live_...` or `pk_test_...`

2. **Price IDs** (https://dashboard.stripe.com/products)
   - Starter Monthly: `price_...`
   - Starter Annual: `price_...`
   - Professional Monthly: `price_...`
   - Professional Annual: `price_...`

3. **Supabase Info**
   - Project URL: `https://xxx.supabase.co`
   - Service Role Key (optional, for CLI)

4. **Site URL**
   - Your production domain: `https://your-domain.com`

---

## 🎯 Configuration Steps

### Step 1: Run Interactive Setup

```bash
npm run stripe:complete
```

Follow the prompts to enter all required information.

### Step 2: Choose Setup Method

After running the script, you'll have two options:

#### Option A: Supabase Dashboard (Recommended)

1. Open `STRIPE_DASHBOARD_INSTRUCTIONS.md`
2. Follow step-by-step instructions
3. Set secrets for each Edge Function
4. Deploy functions
5. Create webhook in Stripe

#### Option B: Supabase CLI

1. Run: `npx supabase login`
2. Run: `npx supabase link --project-ref YOUR_PROJECT_REF`
3. Run commands from `STRIPE_SECRETS_COMMANDS.txt`

### Step 3: Create Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy webhook signing secret (`whsec_...`)
6. Add to `stripe-webhook` function secrets: `STRIPE_WEBHOOK_SECRET`

### Step 4: Set Environment Variables

Set in your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 5: Verify

```bash
npm run verify:stripe
```

---

## 📊 Edge Functions Configuration

### create-checkout-session

**Required Secrets:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `SITE_URL` - Your site URL
- `STRIPE_PRICE_STARTER_MONTHLY` - Starter monthly price ID
- `STRIPE_PRICE_STARTER_ANNUAL` - Starter annual price ID
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` - Professional monthly price ID
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` - Professional annual price ID

### create-one-time-checkout-session

**Required Secrets:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `SITE_URL` - Your site URL

### stripe-webhook

**Required Secrets:**
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (from Stripe)
- `SITE_URL` - Your site URL

---

## ✅ Verification Checklist

After configuration, verify:

- [ ] Edge Functions deployed (3 functions)
- [ ] All secrets set for each function
- [ ] Stripe webhook created
- [ ] Webhook secret added to `stripe-webhook` function
- [ ] Environment variables set in deployment platform
- [ ] Test checkout flow works
- [ ] Webhook receives events

---

## 🧪 Testing

### Test Checkout Flow

1. Go to `/store` or `/pricing`
2. Select a product
3. Complete checkout with test card: `4242 4242 4242 4242`
4. Verify purchase completes
5. Check webhook events in Stripe Dashboard

### Test Webhook

1. Go to Stripe Dashboard → Webhooks
2. Click on your webhook
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Verify it's received by your function

---

## 📚 Additional Resources

- **Setup Script:** `scripts/complete-stripe-config-now.ts`
- **Verification:** `npm run verify:stripe`
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Supabase Dashboard:** https://app.supabase.com

---

## 🆘 Troubleshooting

### Edge Functions Not Deploying

- Check Supabase CLI is logged in: `npx supabase login`
- Verify project is linked: `npx supabase link`
- Check function code for errors

### Webhook Not Receiving Events

- Verify webhook URL is correct
- Check webhook secret matches
- Verify events are selected in Stripe
- Check Edge Function logs in Supabase Dashboard

### Checkout Fails

- Verify publishable key is set correctly
- Check Edge Function secrets are set
- Verify Price IDs are correct
- Check browser console for errors

---

## ✅ Status

Once all steps are complete:
- ✅ Stripe keys configured
- ✅ Edge Functions deployed
- ✅ Webhook configured
- ✅ Environment variables set
- ✅ Ready for production

**Run:** `npm run verify:stripe` to verify everything is working.

---

**Last Updated:** December 17, 2025

