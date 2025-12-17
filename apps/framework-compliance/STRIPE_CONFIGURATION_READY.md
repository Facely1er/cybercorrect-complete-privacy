# ✅ Stripe Configuration - Ready to Complete

**Date:** December 17, 2025  
**Status:** Keys Provided | Setup Instructions Ready

---

## ✅ Your Stripe Keys

**Publishable Key:**
```
pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O
```

**Secret Key:**
```
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
```

---

## 📋 Quick Setup (5 Steps)

### Step 1: Save Environment Variables

Create or update `.env.local` file in `apps/framework-compliance/`:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

### Step 2: Set Edge Function Secrets

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

**For each function, add these secrets:**

#### `create-checkout-session`
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`

#### `create-one-time-checkout-session`
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`

#### `stripe-webhook`
- `STRIPE_SECRET_KEY` = `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`
- `SITE_URL` = `https://www.cybercorrect.com`
- `STRIPE_WEBHOOK_SECRET` = (get after Step 3)

### Step 3: Deploy Edge Functions

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

Deploy all 3 functions:
- `create-checkout-session`
- `create-one-time-checkout-session`
- `stripe-webhook`

### Step 4: Create Stripe Webhook

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** "+ Add endpoint"
3. **Endpoint URL:** `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. **Events:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. **Copy webhook secret** (`whsec_...`)
6. **Add to `stripe-webhook` function secrets** as `STRIPE_WEBHOOK_SECRET`

### Step 5: Set Deployment Platform Variables

Set in Vercel/Netlify:
- `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`
- `VITE_SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = (your anon key)

---

## 📚 Detailed Instructions

- **Dashboard Setup:** See `STRIPE_DASHBOARD_SETUP.md`
- **CLI Commands:** See `STRIPE_EDGE_FUNCTION_SECRETS.txt`
- **Keys Summary:** See `STRIPE_KEYS_CONFIGURED.md`

---

## ✅ Verification Checklist

- [ ] `.env.local` file created with publishable key
- [ ] Edge Function secrets set (3 functions)
- [ ] Edge Functions deployed (3 functions)
- [ ] Stripe webhook created
- [ ] Webhook secret added
- [ ] Environment variables set in deployment platform

---

## 🎯 Next Steps

1. **Complete Steps 1-5 above**
2. **Test checkout flow**
3. **Verify webhook receives events**

**Once complete, Stripe will be fully configured!** 🎉

