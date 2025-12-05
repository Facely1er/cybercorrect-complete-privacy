# Quick Setup: Stripe Secret Key

## ✅ Your Stripe Secret Key

```
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
```

## 🎯 Where to Add It

### Option 1: Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com
2. Select your project
3. **Edge Functions** → Select function → **Settings** → **Secrets**
4. Add secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: `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`

**Add to these 3 functions:**
- `create-checkout-session`
- `create-one-time-checkout-session`
- `stripe-webhook`

### Option 2: Supabase CLI

```bash
# For each function, run:
supabase secrets set STRIPE_SECRET_KEY=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
```

## ⚠️ Important

- ✅ Add to **Supabase Edge Function secrets** (server-side)
- ❌ Do NOT add to `.env` file (this is a secret key, not publishable key)
- ❌ Do NOT commit to git

## 📋 Still Need

1. **Stripe Publishable Key** (for frontend `.env` file)
   - Get from: Stripe Dashboard → Developers → API keys
   - Add to `.env`: `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`

2. **Price IDs** (for subscription checkout)
   - Create products in Stripe Dashboard
   - Get Price IDs and add to Edge Function secrets

3. **Webhook Secret** (for webhook function)
   - Configure webhook in Stripe Dashboard
   - Copy webhook signing secret
   - Add to Edge Function secrets as `STRIPE_WEBHOOK_SECRET`

## ✅ After Adding

1. Test checkout flow
2. Check Edge Function logs for errors
3. Verify in Stripe Dashboard that API calls are successful

