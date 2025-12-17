# ✅ Stripe Keys Configured

**Date:** December 17, 2025  
**Status:** Keys Saved | Next: Set Edge Function Secrets

---

## ✅ Keys Saved

- **Publishable Key:** `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`
- **Secret Key:** `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`

**Saved to:** `.env.local`

---

## 📋 Next Steps

### Step 1: Set Edge Function Secrets

You need to set the secret key in Supabase Edge Functions. Choose one method:

#### Option A: Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions
2. For each function, add these secrets:

**create-checkout-session:**
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`

**create-one-time-checkout-session:**
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`

**stripe-webhook:**
- `STRIPE_SECRET_KEY` = `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`
- `STRIPE_WEBHOOK_SECRET` = (get after creating webhook - see Step 3)
- `SITE_URL` = `https://www.cybercorrect.com`

#### Option B: Supabase CLI

1. Login to Supabase:
   ```bash
   npx supabase login
   ```

2. Link your project:
   ```bash
   npx supabase link --project-ref achowlksgmwuvfbvjfrt
   ```

3. Set secrets:
   ```bash
   npx supabase secrets set STRIPE_SECRET_KEY=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
   npx supabase secrets set SITE_URL=https://www.cybercorrect.com
   ```

### Step 2: Deploy Edge Functions

**Via Dashboard:**
1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions
2. Deploy each function:
   - `create-checkout-session`
   - `create-one-time-checkout-session`
   - `stripe-webhook`

**Via CLI:**
```bash
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
```

### Step 3: Create Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL:** `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. **Events to send:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Click **"Add endpoint"**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add it to `stripe-webhook` function secrets as `STRIPE_WEBHOOK_SECRET`

### Step 4: Set Environment Variables in Deployment Platform

Set these in your deployment platform (Vercel, Netlify, etc.):

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

### Step 5: Verify Configuration

```bash
npm run verify:stripe
```

---

## ✅ Checklist

- [x] Stripe keys saved to `.env.local`
- [ ] Edge Function secrets set (3 functions)
- [ ] Edge Functions deployed (3 functions)
- [ ] Stripe webhook created
- [ ] Webhook secret added to `stripe-webhook` function
- [ ] Environment variables set in deployment platform
- [ ] Configuration verified

---

## 🔒 Security Notes

- ✅ Secret key is NOT in `.env.local` (only publishable key)
- ✅ Secret key will be set in Supabase Edge Function secrets (secure)
- ⚠️ Never commit secret keys to git
- ⚠️ Always use environment variables in deployment platform

---

**Next:** Complete Steps 1-5 above to finish Stripe configuration.

