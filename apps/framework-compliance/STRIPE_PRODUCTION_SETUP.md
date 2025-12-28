# Stripe Production Setup Guide

**Time Required:** 30-60 minutes  
**Status:** ⚠️ **REQUIRED BEFORE PRODUCTION**

---

## Step 1: Access Stripe Dashboard

1. Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Log in to your Stripe account
3. **Switch to Live Mode** (toggle in top right)

---

## Step 2: Get Production API Keys

1. Navigate to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_live_...`)
3. Copy your **Secret key** (starts with `sk_live_...`)
   - ⚠️ **Keep this secret!** Never commit to version control

**Save these keys:**
- Publishable key → Goes in `.env.production` as `VITE_STRIPE_PUBLISHABLE_KEY`
- Secret key → Goes in Supabase Edge Functions secrets as `STRIPE_SECRET_KEY`

---

## Step 3: Create Products in Stripe

1. Navigate to **Products** → **Add product**
2. Create products matching your ProductCatalog:
   - Privacy Toolkit Pro
   - Compliance Assessment Suite
   - GDPR Complete Kit
   - Policy & Template Library
   - Any bundles

3. For each product:
   - Set **Name** and **Description**
   - Set **Price** (one-time payment)
   - Set **Product tax code** (if using Stripe Tax)
   - Save product

4. **Note the Product IDs** - you may need to map them to your internal product IDs

---

## Step 4: Configure Stripe Tax (Optional but Recommended)

1. Navigate to **Tax** → **Settings**
2. Enable **Stripe Tax**
3. Configure tax settings:
   - Enable automatic tax calculation
   - Set default tax behavior
   - Configure tax codes for products

**Benefits:**
- Automatic tax calculation based on customer location
- Handles VAT, GST, sales tax automatically
- Reduces compliance burden

---

## Step 5: Set Up Webhook Endpoint

1. Navigate to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL:
   ```
   https://your-project-id.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`

5. Click **Add endpoint**
6. **Copy the webhook signing secret** (starts with `whsec_...`)
   - This goes in Supabase Edge Functions secrets as `STRIPE_WEBHOOK_SECRET`

---

## Step 6: Test in Test Mode First

Before going live, test everything in **Test Mode**:

1. Switch to **Test Mode** (toggle in top right)
2. Use test API keys:
   - Test publishable: `pk_test_...`
   - Test secret: `sk_test_...`
3. Test checkout flow:
   - Add products to cart
   - Complete checkout
   - Verify webhook receives events
   - Verify license keys generated
   - Verify email sent

4. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - 3D Secure: `4000 0025 0000 3155`

---

## Step 7: Switch to Live Mode

Once testing is complete:

1. Switch to **Live Mode**
2. Update environment variables with live keys
3. Update Supabase Edge Functions secrets with live keys
4. Test with a small real purchase
5. Monitor Stripe Dashboard for events

---

## Verification Checklist

- [ ] Stripe account created and verified
- [ ] Live API keys obtained
- [ ] Products created in Stripe Dashboard
- [ ] Stripe Tax enabled (if applicable)
- [ ] Webhook endpoint created
- [ ] Webhook secret copied
- [ ] Test mode checkout tested successfully
- [ ] Live mode tested with small purchase
- [ ] Webhook events received correctly
- [ ] License keys generated correctly
- [ ] Email delivery working

---

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook endpoint URL is correct
2. Verify webhook secret matches in Supabase
3. Check Supabase Edge Functions logs
4. Verify webhook is enabled in Stripe Dashboard

### Tax Not Calculating

1. Verify Stripe Tax is enabled
2. Check product tax codes are set
3. Verify customer location is provided
4. Check Stripe Tax settings

### Payment Failures

1. Check API keys are correct (live vs test)
2. Verify card details are correct
3. Check Stripe Dashboard for error details
4. Review Edge Function logs

---

## Security Best Practices

1. ✅ **Never commit API keys** to version control
2. ✅ **Use environment variables** for all secrets
3. ✅ **Rotate keys** if compromised
4. ✅ **Use webhook signatures** to verify requests
5. ✅ **Monitor Stripe Dashboard** for suspicious activity
6. ✅ **Enable 2FA** on Stripe account

---

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Stripe Status: https://status.stripe.com

---

**Last Updated:** February 2025

