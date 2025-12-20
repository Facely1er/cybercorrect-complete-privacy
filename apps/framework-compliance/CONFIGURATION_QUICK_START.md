# Quick Start Configuration Guide

**Time Required:** 30-45 minutes  
**Difficulty:** Intermediate

---

## 🚀 Quick Setup Steps

### 1. Stripe Setup (10 minutes)

1. **Get API Keys:**
   - Go to: https://dashboard.stripe.com/apikeys
   - Copy: Publishable Key (`pk_live_...`) and Secret Key (`sk_live_...`)

2. **Enable Stripe Tax:**
   - Go to: https://dashboard.stripe.com/settings/tax
   - Click "Enable automatic tax"
   - Configure your tax registration

3. **Create Webhook:**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Select event: `checkout.session.completed`
   - Copy webhook secret (`whsec_...`)

### 2. Supabase Setup (10 minutes)

1. **Apply Database Migration:**
   - Go to: Supabase Dashboard → SQL Editor
   - Run: `supabase/migrations/20251217000000_one_time_purchases.sql`

2. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy create-one-time-checkout-session
   supabase functions deploy stripe-webhook
   ```

3. **Set Edge Function Secrets:**
   - `create-one-time-checkout-session`:
     - `STRIPE_SECRET_KEY` = your Stripe secret key
     - `SITE_URL` = your production URL
   - `stripe-webhook`:
     - `STRIPE_SECRET_KEY` = your Stripe secret key
     - `STRIPE_WEBHOOK_SECRET` = webhook secret from Step 1.3
     - `SITE_URL` = your production URL

### 3. Environment Variables (5 minutes)

**Frontend (.env.local or deployment platform):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
VITE_SITE_URL=https://www.cybercorrect.com
```

### 4. Test (10 minutes)

1. **Test Mode:**
   - Use test keys (`pk_test_...`, `sk_test_...`)
   - Make test purchase
   - Verify license key generated
   - Check email delivery

2. **Production:**
   - Switch to production keys
   - Make small test purchase
   - Verify complete flow

---

## 📚 Detailed Guides

- **Complete Configuration:** `ONE_TIME_PAYMENT_CONFIGURATION.md`
- **Environment Variables:** `ENVIRONMENT_VARIABLES.md`
- **Webhook Setup:** `WEBHOOK_CONFIGURATION.md`
- **Deployment Checklist:** `PRODUCTION_DEPLOYMENT_CHECKLIST.md`

---

## ✅ Verification Checklist

- [ ] Stripe API keys configured
- [ ] Stripe Tax enabled
- [ ] Webhook created and secret copied
- [ ] Database migration applied
- [ ] Edge Functions deployed
- [ ] Edge Function secrets set
- [ ] Environment variables configured
- [ ] Test purchase successful
- [ ] License key generated
- [ ] Email delivered

---

## 🆘 Need Help?

**Email:** cybercorrect@ermits.com  
**Subject:** "One-Time Payment Configuration"

---

**Last Updated:** 2025-01-27

