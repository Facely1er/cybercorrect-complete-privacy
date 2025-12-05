# Production Configuration Summary

**Date:** January 2025  
**Status:** Ready for Configuration

---

## Production Domain

**Production URL:** `https://www.cybercorrect.com`

---

## Supabase Edge Function Secrets

### For `stripe-webhook` Function

Configure these secrets in Supabase Dashboard → Edge Functions → `stripe-webhook` → Settings → Secrets:

| Secret Name | Secret Value | Status |
|------------|--------------|--------|
| `SUPABASE_URL` | Your Supabase project URL | ⏭️ To configure |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ⏭️ To configure |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (sk_live_...) | ⏭️ To configure |
| `STRIPE_WEBHOOK_SECRET` | `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK` | ✅ Provided |
| `SITE_URL` | `https://www.cybercorrect.com` | ✅ Configured |
| `SENDGRID_API_KEY` | Your SendGrid API key (optional) | ⏭️ Optional |
| `RESEND_API_KEY` | Your Resend API key (optional) | ⏭️ Optional |
| `FROM_EMAIL` | `contact@ermits.com` | ✅ Default |

### For `create-one-time-checkout-session` Function

Configure these secrets in Supabase Dashboard → Edge Functions → `create-one-time-checkout-session` → Settings → Secrets:

| Secret Name | Secret Value | Status |
|------------|--------------|--------|
| `SUPABASE_URL` | Your Supabase project URL | ⏭️ To configure |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ⏭️ To configure |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (sk_live_...) | ⏭️ To configure |
| `SITE_URL` | `https://www.cybercorrect.com` | ✅ Configured |

---

## Stripe Webhook Configuration

### Webhook Endpoint

**URL:** `https://[your-project-id].supabase.co/functions/v1/stripe-webhook`

### Events to Listen For

- ✅ `checkout.session.completed` (for one-time purchases and subscriptions)
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.paid`
- ✅ `invoice.payment_failed`

### Webhook Secret

**Signing Secret:** `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`

**Note:** This should match the `STRIPE_WEBHOOK_SECRET` in your Supabase Edge Function secrets.

---

## License Activation URLs

With `SITE_URL=https://www.cybercorrect.com`, license activation will use:

- **Success Page:** `https://www.cybercorrect.com/store/success?licenses=...`
- **Manual Activation:** `https://www.cybercorrect.com/activate-license`
- **Store:** `https://www.cybercorrect.com/store`

---

## Quick Configuration Steps

### 1. Configure Stripe Webhook Secret

1. Go to: Supabase Dashboard → Edge Functions → `stripe-webhook`
2. Settings → Secrets → Add new secret
3. Name: `STRIPE_WEBHOOK_SECRET`
4. Value: `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`
5. Save

### 2. Configure SITE_URL

1. Go to: Supabase Dashboard → Edge Functions → `stripe-webhook`
2. Settings → Secrets → Add new secret
3. Name: `SITE_URL`
4. Value: `https://www.cybercorrect.com`
5. Save

Repeat for `create-one-time-checkout-session` function.

### 3. Configure Stripe Webhook in Stripe Dashboard

1. Go to: Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://[your-project-id].supabase.co/functions/v1/stripe-webhook`
3. Select events (listed above)
4. Copy signing secret (should match: `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`)

---

## Testing

After configuration, test the license activation flow:

1. **Test Purchase:**
   - Go to: `https://www.cybercorrect.com/store`
   - Add product to cart
   - Complete checkout with Stripe test card: `4242 4242 4242 4242`

2. **Verify Auto-Activation:**
   - Should redirect to: `https://www.cybercorrect.com/store/success?licenses=...`
   - Licenses should auto-activate
   - Check localStorage: `ermits_licenses`

3. **Verify Email:**
   - Check customer email for license keys
   - Click activation link
   - Verify licenses activate

---

## Complete Configuration Checklist

### Supabase Edge Functions

- [ ] `stripe-webhook` function deployed
- [ ] `create-one-time-checkout-session` function deployed
- [ ] `SUPABASE_URL` configured for both functions
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured for both functions
- [ ] `STRIPE_SECRET_KEY` configured for both functions
- [ ] `STRIPE_WEBHOOK_SECRET` configured: `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`
- [ ] `SITE_URL` configured: `https://www.cybercorrect.com`
- [ ] `SENDGRID_API_KEY` or `RESEND_API_KEY` configured (optional)
- [ ] `FROM_EMAIL` configured: `contact@ermits.com`

### Stripe Configuration

- [ ] Webhook endpoint created
- [ ] Webhook events selected
- [ ] Webhook secret matches: `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`
- [ ] Test webhook delivery

### Production Site

- [ ] Site deployed at: `https://www.cybercorrect.com`
- [ ] SSL certificate active
- [ ] Routes working: `/store`, `/store/success`, `/activate-license`
- [ ] Environment variables configured

---

## Summary

✅ **Production Domain:** `https://www.cybercorrect.com`  
✅ **Webhook Secret:** `whsec_hemWkqLQbICWwWT9UtXamRPVndv9S2HK`  
⏭️ **Remaining:** Configure other secrets in Supabase Dashboard

---

*Last Updated: January 2025*

