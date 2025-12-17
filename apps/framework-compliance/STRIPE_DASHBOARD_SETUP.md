# 🎯 Stripe Configuration - Dashboard Setup Guide

**Date:** December 17, 2025  
**Status:** Keys Configured | Ready for Edge Function Setup

---

## ✅ What's Done

- [x] Stripe keys saved to `.env.local`
- [x] Publishable key: `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`
- [x] Secret key ready for Edge Functions

---

## 📋 Step-by-Step Setup

### Step 1: Set Edge Function Secrets

1. **Go to Supabase Dashboard:**
   - URL: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

2. **For each function, click on it and add secrets:**

#### Function: `create-checkout-session`

Click "Add secret" for each:
- **Name:** `STRIPE_SECRET_KEY`
  **Value:** `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`

- **Name:** `SITE_URL`
  **Value:** `https://www.cybercorrect.com`

- **Optional - Price IDs** (if you have them):
  - `STRIPE_PRICE_STARTER_MONTHLY` = `price_...`
  - `STRIPE_PRICE_STARTER_ANNUAL` = `price_...`
  - `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...`
  - `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...`

#### Function: `create-one-time-checkout-session`

- **Name:** `STRIPE_SECRET_KEY`
  **Value:** `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`

- **Name:** `SITE_URL`
  **Value:** `https://www.cybercorrect.com`

#### Function: `stripe-webhook`

- **Name:** `STRIPE_SECRET_KEY`
  **Value:** `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`

- **Name:** `SITE_URL`
  **Value:** `https://www.cybercorrect.com`

- **Name:** `STRIPE_WEBHOOK_SECRET`
  **Value:** (Get this after creating webhook in Step 3 - format: `whsec_...`)

---

### Step 2: Deploy Edge Functions

1. **Go to Functions:**
   - URL: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

2. **Deploy each function:**
   - Click on `create-checkout-session` → Click "Deploy" (or verify it's deployed)
   - Click on `create-one-time-checkout-session` → Click "Deploy"
   - Click on `stripe-webhook` → Click "Deploy"

3. **Verify Status:**
   - Each function should show "Active" status
   - Green checkmark indicates successful deployment

---

### Step 3: Create Stripe Webhook

1. **Go to Stripe Dashboard:**
   - URL: https://dashboard.stripe.com/webhooks

2. **Click "+ Add endpoint"**

3. **Endpoint URL:**
   ```
   https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook
   ```

4. **Select events to listen to:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`

5. **Click "Add endpoint"**

6. **Copy the Signing secret:**
   - Click on the webhook you just created
   - Find "Signing secret" section
   - Click "Reveal" and copy the secret (starts with `whsec_...`)

7. **Add to Supabase:**
   - Go back to Supabase Dashboard
   - Go to `stripe-webhook` function secrets
   - Add secret: `STRIPE_WEBHOOK_SECRET` = `whsec_...` (the value you copied)

---

### Step 4: Set Environment Variables in Deployment Platform

Set these in your deployment platform (Vercel, Netlify, etc.):

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add for Production:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`
   - `VITE_SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add the same variables as above

---

### Step 5: Verify Configuration

```bash
npm run verify:stripe
```

This will check:
- ✅ Edge Functions are deployed
- ✅ Secrets are configured
- ✅ Webhook is set up

---

## ✅ Completion Checklist

- [ ] All 3 Edge Functions have secrets set
- [ ] All 3 Edge Functions are deployed and active
- [ ] Stripe webhook created with correct endpoint
- [ ] Webhook secret added to `stripe-webhook` function
- [ ] Environment variables set in deployment platform
- [ ] Verification script passes

---

## 🧪 Test After Setup

1. **Test Checkout:**
   - Go to `/store` or `/pricing`
   - Select a product
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout
   - Verify purchase completes

2. **Test Webhook:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook
   - Click "Send test webhook"
   - Select `checkout.session.completed`
   - Verify it's received

---

## 📚 Quick Reference

- **Supabase Functions:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks
- **Verification:** `npm run verify:stripe`

---

**Once all steps are complete, Stripe will be fully configured!** 🎉

