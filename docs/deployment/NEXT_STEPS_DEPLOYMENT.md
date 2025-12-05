# Next Steps: Deploy License Activation System

**Status:** Code committed and pushed ✅  
**Next:** Deploy Edge Functions and configure secrets

---

## Immediate Next Steps

### 1. Deploy Edge Functions to Supabase

The new `create-one-time-checkout-session` function needs to be deployed.

#### Option A: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project-ref from Supabase Dashboard)
supabase link --project-ref your-project-ref

# Deploy the new function
supabase functions deploy create-one-time-checkout-session

# Update existing webhook function
supabase functions deploy stripe-webhook
```

#### Option B: Using Supabase Dashboard

1. Go to: Supabase Dashboard → Edge Functions
2. Click: **Create a new function**
3. Name: `create-one-time-checkout-session`
4. Copy contents from: `supabase/functions/create-one-time-checkout-session/index.ts`
5. Click: **Deploy**

For `stripe-webhook`:
1. Go to: Edge Functions → `stripe-webhook`
2. Click: **Edit**
3. Update with new code from: `supabase/functions/stripe-webhook/index.ts`
4. Click: **Deploy**

---

### 2. Configure Edge Function Secrets

#### For `stripe-webhook` Function

Go to: Supabase Dashboard → Edge Functions → `stripe-webhook` → Settings → Secrets

Add these secrets:

| Secret Name | Value | Status |
|------------|-------|--------|
| `SUPABASE_URL` | Your Supabase project URL | ⏭️ Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | ⏭️ Required |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (sk_live_...) | ⏭️ Required |
| `STRIPE_WEBHOOK_SECRET` | `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK` | ✅ Provided |
| `SITE_URL` | `https://www.cybercorrect.com` | ✅ Configured |
| `SENDGRID_API_KEY` | Your SendGrid API key | ⏭️ Optional |
| `RESEND_API_KEY` | Your Resend API key | ⏭️ Optional |
| `FROM_EMAIL` | `contact@ermits.com` | ✅ Default |

#### For `create-one-time-checkout-session` Function

Go to: Supabase Dashboard → Edge Functions → `create-one-time-checkout-session` → Settings → Secrets

Add these secrets:

| Secret Name | Value | Status |
|------------|-------|--------|
| `SUPABASE_URL` | Your Supabase project URL | ⏭️ Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | ⏭️ Required |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (sk_live_...) | ⏭️ Required |
| `SITE_URL` | `https://www.cybercorrect.com` | ✅ Configured |

---

### 3. Configure Stripe Webhook

1. Go to: Stripe Dashboard → Developers → Webhooks
2. Add endpoint or edit existing:
   - **URL:** `https://[your-project-id].supabase.co/functions/v1/stripe-webhook`
   - **Events to send:**
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.paid`
     - ✅ `invoice.payment_failed`
3. Copy the **Signing secret** (should match: `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`)
4. Add to Supabase Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

---

### 4. Test the System

#### Test Checkout Flow

1. Go to: `https://www.cybercorrect.com/store`
2. Add a product to cart
3. Proceed to checkout
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete purchase
6. Verify:
   - ✅ Redirects to success page
   - ✅ License keys auto-activate
   - ✅ Email received with license keys
   - ✅ Licenses visible in localStorage

#### Test Manual Activation

1. Go to: `https://www.cybercorrect.com/activate-license`
2. Enter a test license key: `PRIV-TEST123-TEST456`
3. Verify activation works

#### Test License Verification

```javascript
// In browser console
import { LicenseManager } from './utils/oneTimeProducts';
LicenseManager.hasPurchased('privacy-toolkit-pro'); // Should return true if activated
```

---

## Verification Checklist

### Deployment ✅
- [ ] `create-one-time-checkout-session` function deployed
- [ ] `stripe-webhook` function updated and deployed
- [ ] Both functions accessible in Supabase Dashboard

### Configuration ✅
- [ ] All required secrets added to `stripe-webhook`
- [ ] All required secrets added to `create-one-time-checkout-session`
- [ ] Stripe webhook endpoint configured
- [ ] Webhook events selected
- [ ] Webhook secret matches

### Testing ✅
- [ ] Test purchase completes successfully
- [ ] License keys generate correctly
- [ ] Auto-activation works from success page
- [ ] Email delivery works (if configured)
- [ ] Manual activation works
- [ ] License verification works in tools

---

## Troubleshooting

### Edge Function Not Deploying

**Check:**
- Supabase CLI is installed and logged in
- Project is linked correctly
- Function code has no syntax errors

**Solution:**
```bash
# Check deployment status
supabase functions list

# View function logs
supabase functions logs create-one-time-checkout-session
```

### Webhook Not Receiving Events

**Check:**
- Webhook URL is correct
- Events are selected in Stripe Dashboard
- Webhook secret matches

**Solution:**
- Test webhook in Stripe Dashboard → Webhooks → Send test webhook
- Check Supabase function logs for errors

### License Keys Not Generating

**Check:**
- Webhook is receiving `checkout.session.completed` events
- Function logs show license generation
- Product IDs match between checkout and webhook

**Solution:**
- Check webhook logs: `supabase functions logs stripe-webhook`
- Verify product IDs in session metadata

---

## Summary

**Completed:**
- ✅ Code implemented and committed
- ✅ Documentation created
- ✅ Production configuration documented

**Next Actions:**
1. ⏭️ Deploy Edge Functions
2. ⏭️ Configure secrets
3. ⏭️ Set up Stripe webhook
4. ⏭️ Test end-to-end flow

**Estimated Time:** 30-45 minutes

---

*Last Updated: January 2025*

