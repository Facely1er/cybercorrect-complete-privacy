# Stripe Integration - Next Steps Guide

## ✅ Step 1: Secret Key Added (Done!)

You've provided your Stripe secret key. Make sure it's added to Supabase Edge Function secrets for all 3 functions.

## 📋 Step 2: Get Stripe Publishable Key (Frontend)

### What You Need
The **Publishable Key** (starts with `pk_live_...`) for your frontend `.env` file.

### How to Get It

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Find the **Publishable key** (it should match your secret key - both are "Live mode" or both are "Test mode")
4. Copy the key (starts with `pk_live_...`)

### Add to Frontend

Add to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

**Then restart your dev server:**
```bash
npm run dev
```

---

## 📋 Step 3: Create Products & Prices in Stripe

### Create Subscription Products

1. Go to Stripe Dashboard → **Products**
2. Click **+ Add product**

#### Product 1: Starter Plan
- **Name:** `Starter Plan` (or similar)
- **Description:** `Perfect for small teams starting their privacy compliance journey`
- **Pricing:**
  - Add **Recurring** price: `$49/month` → Save → Note the Price ID
  - Add **Recurring** price: `$39/month` (billed annually = $468/year) → Save → Note the Price ID

#### Product 2: Professional Plan
- **Name:** `Professional Plan` (or similar)
- **Description:** `Complete privacy compliance suite for growing organizations`
- **Pricing:**
  - Add **Recurring** price: `$99/month` → Save → Note the Price ID
  - Add **Recurring** price: `$79/month` (billed annually = $948/year) → Save → Note the Price ID

#### Product 3: Enterprise Plan (Optional)
- **Name:** `Enterprise Plan`
- **Description:** `White-glove privacy compliance support for large organizations`
- **Pricing:** Custom (or create prices if needed)

### Get Price IDs

After creating products, you'll have Price IDs like:
- `price_1AbCdEfGhIjKlMnOpQrStUv` (Starter Monthly)
- `price_1XyZaBcDeFgHiJkLmNoPqRs` (Starter Annual)
- `price_1MnOpQrStUvWxYzAbCdEfGh` (Professional Monthly)
- `price_1IjKlMnOpQrStUvWxYzAbCd` (Professional Annual)

### Use Script to Get Price IDs

You can also use the provided script:

```bash
# Set your secret key as environment variable
export STRIPE_SECRET_KEY=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

# Run the script
tsx scripts/get-stripe-price-ids.ts
```

This will list all your products and their Price IDs.

---

## 📋 Step 4: Add Price IDs to Edge Function Secrets

After getting your Price IDs, add them to Supabase Edge Function secrets:

### For `create-checkout-session` function:

1. Go to Supabase Dashboard → Edge Functions → `create-checkout-session` → Settings → Secrets
2. Add these secrets:
   - `STRIPE_PRICE_STARTER_MONTHLY` = `price_...` (your Starter monthly price ID)
   - `STRIPE_PRICE_STARTER_ANNUAL` = `price_...` (your Starter annual price ID)
   - `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...` (your Professional monthly price ID)
   - `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...` (your Professional annual price ID)

---

## 📋 Step 5: Configure Stripe Webhook

### Create Webhook Endpoint

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL:** `https://[your-project-id].supabase.co/functions/v1/stripe-webhook`
   - Replace `[your-project-id]` with your Supabase project ID
   - Example: `https://abcdefghijklmnop.supabase.co/functions/v1/stripe-webhook`
4. **Description:** `Supabase Edge Function Webhook`
5. **Events to send:** Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
6. Click **Add endpoint**

### Get Webhook Secret

1. After creating the webhook, click on it
2. Find **Signing secret** (starts with `whsec_...`)
3. Click **Reveal** and copy it

### Add Webhook Secret to Edge Function

1. Go to Supabase Dashboard → Edge Functions → `stripe-webhook` → Settings → Secrets
2. Add secret:
   - Name: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (the signing secret you just copied)

---

## 📋 Step 6: Add Other Required Secrets

Make sure all Edge Functions have these secrets:

### Common Secrets (All Functions)
- `SUPABASE_URL` = `https://[your-project-id].supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (get from Supabase Dashboard → Settings → API → service_role key)
- `SITE_URL` = `https://cybercorrect.com` (or your production domain)

### Function-Specific Secrets

**create-checkout-session:**
- `STRIPE_SECRET_KEY` ✅ (you have this)
- `STRIPE_PRICE_STARTER_MONTHLY` ⚠️ (need Price ID)
- `STRIPE_PRICE_STARTER_ANNUAL` ⚠️ (need Price ID)
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` ⚠️ (need Price ID)
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` ⚠️ (need Price ID)

**create-one-time-checkout-session:**
- `STRIPE_SECRET_KEY` ✅ (you have this)

**stripe-webhook:**
- `STRIPE_SECRET_KEY` ✅ (you have this)
- `STRIPE_WEBHOOK_SECRET` ⚠️ (need from Stripe Dashboard)

---

## 🧪 Step 7: Test Everything

### Test Subscription Checkout

1. Go to `/pricing` page
2. Click "Subscribe Now" on Starter or Professional plan
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Should redirect to success page

### Test One-Time Checkout

1. Go to `/store` page
2. Add product to cart
3. Go to checkout
4. Click "Complete Purchase"
5. Should redirect to Stripe Checkout
6. Complete payment
7. Should redirect to success page with license keys

### Check Logs

- **Browser Console:** Should show no errors
- **Edge Function Logs:** Supabase Dashboard → Edge Functions → [function] → Logs
- **Stripe Dashboard:** Should show successful API calls and webhook events

---

## ✅ Quick Checklist

- [ ] Secret key added to all 3 Edge Functions
- [ ] Publishable key added to `.env` file
- [ ] Dev server restarted
- [ ] Products created in Stripe Dashboard
- [ ] Price IDs obtained
- [ ] Price IDs added to Edge Function secrets
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook secret added to Edge Function
- [ ] All other secrets configured (SUPABASE_URL, etc.)
- [ ] Tested subscription checkout
- [ ] Tested one-time checkout

---

## 🆘 Need Help?

If you get stuck:
1. Check `STRIPE_DEBUG_GUIDE.md` for troubleshooting
2. Check Edge Function logs in Supabase Dashboard
3. Check browser console for errors
4. Verify all secrets are set correctly

---

**Once all steps are complete, your Stripe integration will be fully functional!** 🚀

