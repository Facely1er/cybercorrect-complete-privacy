# 🚀 Stripe Setup - Final Steps

## ✅ What's Already Done

1. ✅ Stripe publishable key configured in `.env`
2. ✅ Stripe secret key obtained
3. ✅ Price IDs found:
   - Starter Monthly: `price_1SDUjIA6UggvM46N1rjxGuFR`
   - Professional Monthly: `price_1SDUjJA6UggvM46NXU5Jrizp`
4. ✅ All configuration values ready

## 📋 Remaining Steps (Choose One Method)

---

## Method 1: Supabase Dashboard (Recommended - 5 minutes)

### Step 1: Set Edge Function Secrets

1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions
2. Click on each function and set these secrets:

#### For `create-checkout-session`:
```
STRIPE_SECRET_KEY=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
STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

#### For `create-one-time-checkout-session`:
```
STRIPE_SECRET_KEY=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
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

#### For `stripe-webhook` (set after creating webhook):
```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_[GET_FROM_STRIPE_AFTER_CREATING_WEBHOOK]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

### Step 2: Deploy Edge Functions

1. In Supabase Dashboard, go to Edge Functions
2. Click "Deploy" for each function:
   - `create-checkout-session`
   - `create-one-time-checkout-session`
   - `stripe-webhook`

### Step 3: Create Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Go back to Supabase Dashboard and set `STRIPE_WEBHOOK_SECRET` for `stripe-webhook` function

---

## Method 2: CLI (If you can login)

### Step 1: Login to Supabase

```powershell
npx supabase login
```

### Step 2: Link Project

```powershell
npx supabase link --project-ref achowlksgmwuvfbvjfrt
```

### Step 3: Set Secrets

Run the generated script:

```powershell
.\scripts\set-all-secrets.ps1
```

Or manually:

```powershell
# Common secrets
npx supabase secrets set STRIPE_SECRET_KEY=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
npx supabase secrets set SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
npx supabase secrets set SITE_URL=https://www.platform.cybercorrect.com

# Price IDs
npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp
```

### Step 4: Deploy Functions

```powershell
cd supabase
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
cd ..
```

### Step 5: Create Webhook (Same as Method 1, Step 3)

---

## ✅ Verification Checklist

After completing setup, verify:

- [ ] All Edge Functions deployed successfully
- [ ] All secrets set in Supabase Dashboard
- [ ] Stripe webhook created and secret configured
- [ ] Test subscription checkout flow
- [ ] Test one-time purchase checkout flow
- [ ] Verify webhook receives events in Stripe Dashboard

---

## 🧪 Testing

1. **Test Subscription Checkout:**
   - Go to pricing page
   - Click "Get Started" on Starter or Professional
   - Complete test checkout
   - Verify subscription created in Stripe Dashboard

2. **Test One-Time Purchase:**
   - Go to pricing page
   - Click on a one-time product
   - Complete test checkout
   - Verify payment succeeded in Stripe Dashboard

3. **Test Webhook:**
   - Check Stripe Dashboard → Webhooks → Recent events
   - Should see events being received

---

## 🆘 Troubleshooting

### Webhook not receiving events
- Verify webhook URL is correct
- Check webhook secret is set correctly
- Verify function is deployed
- Check Supabase function logs

### Checkout not working
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is in `.env`
- Check browser console for errors
- Verify Edge Functions are deployed
- Check function logs in Supabase Dashboard

### Secrets not working
- Verify secrets are set for the correct function
- Check secret names match exactly (case-sensitive)
- Verify no extra spaces in secret values

---

## 📞 Support

If you encounter issues:
1. Check Supabase function logs
2. Check Stripe Dashboard → Webhooks → Recent events
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

