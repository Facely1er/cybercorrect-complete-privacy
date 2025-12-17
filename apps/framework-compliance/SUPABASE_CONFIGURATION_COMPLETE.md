# ✅ Supabase Configuration - Complete Setup Guide

**Date:** December 17, 2025  
**Status:** Ready to Configure

---

## 🎯 Overview

This guide will help you complete the Supabase configuration for CyberCorrect, including:
- Edge Function deployment
- Secret configuration
- Verification

**Estimated Time:** 20-30 minutes

---

## 📋 Prerequisites

- Access to Supabase Dashboard: https://app.supabase.com
- Project: **CORE_REVENUE** (`dfklqsdfycwjlcasfciu`)
- Stripe keys (already provided)

---

## 🚀 Step 1: Deploy Edge Functions

### Option A: Via Supabase Dashboard (Recommended)

1. **Go to:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/functions

2. **Deploy each function:**

   **Stripe Functions:**
   - `create-checkout-session`
   - `create-one-time-checkout-session`
   - `stripe-webhook`

   **Other Functions:**
   - `send-email-notification`
   - `generate-automated-reports`
   - `run-scheduled-assessments`
   - `track-compliance-health`
   - `check-regulatory-updates`

3. **For each function:**
   - Click on the function name
   - Click "Deploy" or verify it's already deployed
   - Status should show "Active" ✅

### Option B: Via CLI

```bash
cd apps/framework-compliance

# Login to Supabase
npx supabase login

# Link project
npx supabase link --project-ref dfklqsdfycwjlcasfciu

# Deploy functions
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-email-notification
npx supabase functions deploy generate-automated-reports
npx supabase functions deploy run-scheduled-assessments
npx supabase functions deploy track-compliance-health
npx supabase functions deploy check-regulatory-updates
```

---

## 🔑 Step 2: Configure Edge Function Secrets

**Go to:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions

For each function, click on it → **Settings** tab → **Secrets** section → **Add new secret**

### Function: `create-checkout-session`

**Required Secrets:**

| Secret Name | Secret Value |
|------------|--------------|
| `STRIPE_SECRET_KEY` | `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` |
| `SITE_URL` | `https://www.cybercorrect.com` |

**Optional Secrets (if you have Price IDs):**
- `STRIPE_PRICE_STARTER_MONTHLY` = `price_...`
- `STRIPE_PRICE_STARTER_ANNUAL` = `price_...`
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...`
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...`

### Function: `create-one-time-checkout-session`

**Required Secrets:**

| Secret Name | Secret Value |
|------------|--------------|
| `STRIPE_SECRET_KEY` | `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` |
| `SITE_URL` | `https://www.cybercorrect.com` |

### Function: `stripe-webhook`

**Required Secrets:**

| Secret Name | Secret Value |
|------------|--------------|
| `STRIPE_SECRET_KEY` | `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` |
| `SITE_URL` | `https://www.cybercorrect.com` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (get after Step 3 - creating webhook) |

### Function: `send-email-notification`

**Required Secrets:**

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://dfklqsdfycwjlcasfciu.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |

**Optional (if using SendGrid):**
- `SENDGRID_API_KEY` = (your SendGrid API key)
- `SENDGRID_FROM_EMAIL` = (your SendGrid from email)

### Functions: `generate-automated-reports`, `run-scheduled-assessments`, `track-compliance-health`, `check-regulatory-updates`

**Required Secrets (same for all):**

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://dfklqsdfycwjlcasfciu.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |

---

## 🔗 Step 3: Create Stripe Webhook

1. **Go to:** https://dashboard.stripe.com/webhooks

2. **Click:** "+ Add endpoint"

3. **Endpoint URL:**
   ```
   https://dfklqsdfycwjlcasfciu.supabase.co/functions/v1/stripe-webhook
   ```

4. **Select events to listen to:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`

5. **Click:** "Add endpoint"

6. **Copy the Signing secret:**
   - Click on the webhook you just created
   - Find "Signing secret" section
   - Click "Reveal" and copy (starts with `whsec_...`)

7. **Add to Supabase:**
   - Go back to Supabase Dashboard
   - Go to `stripe-webhook` function → Settings → Secrets
   - Add secret: `STRIPE_WEBHOOK_SECRET` = `whsec_...` (the value you copied)

---

## ✅ Step 4: Verification Checklist

After completing all steps, verify:

### Edge Functions
- [ ] All 8 functions are deployed and show "Active" status
- [ ] All functions have required secrets set

### Stripe Functions
- [ ] `create-checkout-session` has `STRIPE_SECRET_KEY` and `SITE_URL`
- [ ] `create-one-time-checkout-session` has `STRIPE_SECRET_KEY` and `SITE_URL`
- [ ] `stripe-webhook` has `STRIPE_SECRET_KEY`, `SITE_URL`, and `STRIPE_WEBHOOK_SECRET`

### Other Functions
- [ ] `send-email-notification` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `generate-automated-reports` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `run-scheduled-assessments` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `track-compliance-health` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `check-regulatory-updates` has `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Stripe Webhook
- [ ] Webhook created in Stripe Dashboard
- [ ] Webhook endpoint URL is correct
- [ ] Webhook secret added to `stripe-webhook` function

---

## 🧪 Step 5: Test Configuration

### Test Edge Functions

1. **Go to:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/functions

2. **Test `create-checkout-session`:**
   - Click on the function
   - Click "Invoke"
   - Use test payload (if function supports it)

3. **Test `stripe-webhook`:**
   - Go to Stripe Dashboard → Webhooks
   - Click on your webhook
   - Click "Send test webhook"
   - Select `checkout.session.completed`
   - Verify it's received

### Test Checkout Flow

1. Go to your site: `https://www.cybercorrect.com`
2. Navigate to `/store` or `/pricing`
3. Select a product
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify purchase completes

---

## 📊 Summary

### Functions to Deploy: 8
- ✅ `create-checkout-session`
- ✅ `create-one-time-checkout-session`
- ✅ `stripe-webhook`
- ✅ `send-email-notification`
- ✅ `generate-automated-reports`
- ✅ `run-scheduled-assessments`
- ✅ `track-compliance-health`
- ✅ `check-regulatory-updates`

### Secrets to Configure: ~20
- Stripe functions: 3-4 secrets each
- Other functions: 2 secrets each

### Time Required: 20-30 minutes

---

## 🎉 Completion

Once all steps are complete:
- ✅ All Edge Functions deployed
- ✅ All secrets configured
- ✅ Stripe webhook created
- ✅ Ready for production

**Next:** Test the checkout flow and verify everything works!

---

## 📚 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu
- **Edge Functions:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/functions
- **Function Secrets:** https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Stripe Webhooks:** https://dashboard.stripe.com/webhooks

---

**Last Updated:** December 17, 2025

