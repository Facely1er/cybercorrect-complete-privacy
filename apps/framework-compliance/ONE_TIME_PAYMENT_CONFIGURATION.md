# One-Time Payment System - Complete Configuration Guide

**Last Updated:** 2025-01-27  
**Status:** Production Ready (Configuration Required)

---

## Overview

This guide provides complete configuration instructions for the CyberCorrect™ one-time payment system. Follow these steps to enable production-ready payment processing.

---

## Prerequisites

- Stripe account (Production or Test mode)
- Supabase project configured
- Domain configured for production
- SSL certificate (HTTPS required)

---

## Step 1: Stripe Configuration

### 1.1 Enable Stripe Tax (Recommended)

**Why:** Automatic tax calculation ensures compliance with tax regulations worldwide.

1. **Go to Stripe Dashboard:** https://dashboard.stripe.com/settings/tax
2. **Enable Automatic Tax:**
   - Click "Enable automatic tax"
   - Configure your tax registration information
   - Add business locations where you're registered for tax
3. **Verify Settings:**
   - Tax calculation is now automatic
   - Stripe will calculate tax based on customer location
   - Tax is included in checkout automatically

**Note:** The code is already configured to use Stripe Tax. No code changes needed.

### 1.2 Get Stripe API Keys

1. **Go to:** https://dashboard.stripe.com/apikeys
2. **Copy Keys:**
   - **Publishable Key** (starts with `pk_live_` for production)
   - **Secret Key** (starts with `sk_live_` for production)
3. **Store Securely:** Never commit keys to version control

### 1.3 Configure Stripe Webhook

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** "+ Add endpoint"
3. **Endpoint URL:**
   ```
   https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripe-webhook
   ```
   Replace `YOUR_SUPABASE_PROJECT` with your Supabase project reference.
4. **Select Events:**
   - `checkout.session.completed` (Required)
   - `customer.subscription.updated` (Optional, for subscriptions)
   - `customer.subscription.deleted` (Optional, for subscriptions)
   - `invoice.payment_succeeded` (Optional, for subscriptions)
5. **Copy Webhook Secret:**
   - After creating webhook, copy the "Signing secret" (starts with `whsec_`)
   - This is needed for Step 3.3

---

## Step 2: Environment Variables

### 2.1 Frontend Environment Variables

Create or update `.env.local` in `apps/framework-compliance/`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY

# Site Configuration
VITE_SITE_URL=https://www.cybercorrect.com
```

**For Production Deployment (Vercel/Netlify/etc.):**
- Add these same variables in your deployment platform's environment settings
- Use production values (not test/development values)

### 2.2 Verify Environment Variables

Run this check to verify all required variables are set:

```bash
# Check if variables are loaded
npm run check:env
```

Or manually verify:
- `VITE_SUPABASE_URL` is set and accessible
- `VITE_SUPABASE_ANON_KEY` is set
- `VITE_STRIPE_PUBLISHABLE_KEY` starts with `pk_live_` (production) or `pk_test_` (test)
- `VITE_SITE_URL` matches your production domain

---

## Step 3: Supabase Edge Functions Configuration

### 3.1 Deploy Edge Functions

Deploy the following Edge Functions to Supabase:

1. **create-one-time-checkout-session**
   ```bash
   cd apps/framework-compliance
   supabase functions deploy create-one-time-checkout-session
   ```

2. **stripe-webhook**
   ```bash
   supabase functions deploy stripe-webhook
   ```

### 3.2 Set Edge Function Secrets

**Go to:** Supabase Dashboard → Edge Functions → [Function Name] → Settings → Secrets

#### For `create-one-time-checkout-session`:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Your Stripe secret key |
| `SITE_URL` | `https://www.cybercorrect.com` | Your production site URL |

#### For `stripe-webhook`:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signing secret from Step 1.3 |
| `SITE_URL` | `https://www.cybercorrect.com` | Your production site URL |

### 3.3 Verify Edge Functions

1. **Test Function Deployment:**
   ```bash
   supabase functions list
   ```
   Both functions should appear in the list.

2. **Check Function Logs:**
   - Go to Supabase Dashboard → Edge Functions → Logs
   - Verify no errors in recent invocations

---

## Step 4: Database Migration

### 4.1 Apply Migration

The one-time purchases table must be created:

1. **Go to:** Supabase Dashboard → SQL Editor
2. **Run Migration:**
   - Open: `apps/framework-compliance/supabase/migrations/20251217000000_one_time_purchases.sql`
   - Copy entire SQL content
   - Paste into SQL Editor
   - Click "Run"

### 4.2 Verify Table Creation

Run this query to verify:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'cc_one_time_purchases';
```

Should return: `cc_one_time_purchases`

### 4.3 Verify RLS Policies

Check that Row Level Security is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'cc_one_time_purchases';
```

`rowsecurity` should be `true`.

---

## Step 5: Email Configuration (License Key Delivery)

### 5.1 Configure Email Service

License keys are sent via email after purchase. Configure email delivery:

1. **Option A: Supabase Email (Recommended)**
   - Go to Supabase Dashboard → Settings → Auth → Email Templates
   - Configure SMTP settings if using custom SMTP
   - Or use Supabase's built-in email service

2. **Option B: Custom Email Service**
   - Update `sendLicenseKeysEmail` function in `stripe-webhook/index.ts`
   - Integrate with your email service (SendGrid, Mailgun, etc.)

### 5.2 Test Email Delivery

1. Make a test purchase (use Stripe test mode)
2. Verify email is received with license keys
3. Check spam folder if email doesn't arrive

---

## Step 6: Testing Checklist

### 6.1 Test Mode Testing

Use Stripe test mode first:

1. **Set Test Keys:**
   - Use `pk_test_...` for publishable key
   - Use `sk_test_...` for secret key

2. **Test Scenarios:**
   - [ ] Guest checkout (no account)
   - [ ] Authenticated user checkout
   - [ ] Multiple products in cart
   - [ ] Single product purchase
   - [ ] Bundle purchase
   - [ ] Successful payment
   - [ ] Payment failure handling
   - [ ] Webhook receives events
   - [ ] License keys generated
   - [ ] Email with license keys sent
   - [ ] License activation works

3. **Test Cards:**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

### 6.2 Production Testing

After switching to production keys:

1. **Small Test Purchase:**
   - Make a real purchase with a small amount
   - Verify complete flow works
   - Check license key delivery

2. **Monitor:**
   - Stripe Dashboard → Payments (verify payment appears)
   - Supabase Dashboard → Edge Functions → Logs (check for errors)
   - Database → `cc_one_time_purchases` table (verify record created)

---

## Step 7: Production Deployment

### 7.1 Pre-Deployment Checklist

- [ ] All environment variables set in production
- [ ] Stripe production keys configured
- [ ] Edge Functions deployed with production secrets
- [ ] Database migration applied
- [ ] Webhook endpoint configured in Stripe
- [ ] Stripe Tax enabled (if applicable)
- [ ] Email delivery tested
- [ ] Test purchases completed successfully

### 7.2 Deployment Steps

1. **Update Environment Variables:**
   - Set production values in deployment platform
   - Verify all variables are correct

2. **Deploy Application:**
   ```bash
   npm run build
   # Deploy to your platform (Vercel, Netlify, etc.)
   ```

3. **Verify Deployment:**
   - Check application loads correctly
   - Test checkout flow
   - Monitor for errors

### 7.3 Post-Deployment Verification

- [ ] Application accessible at production URL
- [ ] Store page loads correctly
- [ ] Checkout page accessible
- [ ] Test purchase completes successfully
- [ ] License keys generated and delivered
- [ ] Webhook receives and processes events
- [ ] No errors in logs

---

## Step 8: Monitoring & Maintenance

### 8.1 Set Up Monitoring

1. **Stripe Dashboard:**
   - Monitor payments and webhooks
   - Set up alerts for failed payments

2. **Supabase Dashboard:**
   - Monitor Edge Function logs
   - Set up alerts for function errors

3. **Application Logs:**
   - Monitor error logs
   - Track checkout success/failure rates

### 8.2 Regular Maintenance

- **Weekly:**
  - Review failed payments
  - Check webhook delivery status
  - Review error logs

- **Monthly:**
  - Verify tax calculations (if using Stripe Tax)
  - Review license key generation
  - Check email delivery rates

---

## Troubleshooting

### Common Issues

#### Issue: "Stripe secret key not configured"
**Solution:** Verify `STRIPE_SECRET_KEY` is set in Edge Function secrets

#### Issue: "Webhook not receiving events"
**Solution:** 
- Verify webhook URL is correct
- Check webhook secret matches
- Verify webhook is enabled in Stripe Dashboard

#### Issue: "License keys not generated"
**Solution:**
- Check webhook is receiving `checkout.session.completed` events
- Verify Edge Function logs for errors
- Check database table exists

#### Issue: "Email not sent"
**Solution:**
- Verify email service is configured
- Check `sendLicenseKeysEmail` function
- Review email service logs

---

## Support

For configuration assistance:
- **Email:** cybercorrect@ermits.com
- **Subject:** "One-Time Payment Configuration Help"

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Tax Setup](https://stripe.com/docs/tax)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Database](https://supabase.com/docs/guides/database)

---

**Configuration Status:** ✅ Complete  
**Last Verified:** 2025-01-27

