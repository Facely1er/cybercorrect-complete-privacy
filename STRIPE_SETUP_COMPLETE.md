# Stripe Integration Setup - Complete Checklist

## ✅ What We've Fixed

1. **Error Handling** - Improved error messages and logging
2. **Environment Variable Detection** - Better diagnostics for missing variables
3. **Console Logging** - Detailed logs to help debug issues
4. **Error Propagation** - Errors now properly shown to users

## 📋 Setup Checklist

### 1. Environment Variables ✅

**Frontend (.env file):**
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**After setting:**
- ✅ Restart dev server (`npm run dev`)
- ✅ Verify in browser console: `console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)`

### 2. Supabase Edge Functions ⚠️

**Deploy Functions:**
```bash
supabase functions deploy create-checkout-session
supabase functions deploy create-one-time-checkout-session
supabase functions deploy stripe-webhook
```

**Or deploy all:**
```bash
supabase functions deploy
```

### 3. Edge Function Secrets ⚠️

**For `create-checkout-session`:**
- `STRIPE_SECRET_KEY` (sk_test_... or sk_live_...)
- `STRIPE_PRICE_STARTER_MONTHLY` (price_...)
- `STRIPE_PRICE_STARTER_ANNUAL` (price_...)
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` (price_...)
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` (price_...)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

**For `create-one-time-checkout-session`:**
- `STRIPE_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

**For `stripe-webhook`:**
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (whsec_...)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SITE_URL`

### 4. Stripe Dashboard Setup ⚠️

1. **Create Products & Prices:**
   - Go to Stripe Dashboard → Products
   - Create products for Starter, Professional, Enterprise
   - Add monthly and annual prices
   - Note the Price IDs (start with `price_`)

2. **Configure Webhook:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://[project-id].supabase.co/functions/v1/stripe-webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy webhook signing secret (whsec_...)

### 5. Database Migrations ⚠️

**Apply migrations:**
```bash
supabase db push
```

**Or in Supabase Dashboard:**
- Go to SQL Editor
- Run migration: `supabase/migrations/20250202000001_subscriptions.sql`

### 6. Testing ✅

**Test Subscription Checkout:**
1. Go to `/pricing`
2. Click "Subscribe Now" on a plan
3. Should redirect to Stripe Checkout

**Test One-Time Checkout:**
1. Go to `/store`
2. Add product to cart
3. Go to checkout
4. Click "Complete Purchase"
5. Should redirect to Stripe Checkout

**Test with Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Use any future expiry date and any CVC

## 🔍 Verification

### Run Verification Script:
```bash
tsx scripts/verify-stripe-integration.ts
```

### Manual Checks:

1. **Browser Console:**
   ```javascript
   // Should show your Stripe key
   console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   
   // Should be true
   console.log('Stripe configured:', !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
   ```

2. **Network Tab:**
   - Try checkout
   - Look for request to `create-one-time-checkout-session` or `create-checkout-session`
   - Check status code (200 = success, 404 = not deployed, 500 = error)

3. **Edge Function Logs:**
   - Supabase Dashboard → Edge Functions → [function name] → Logs
   - Try checkout and check for errors

## 🐛 Troubleshooting

### Issue: "Stripe not configured"
**Fix:** Set `VITE_STRIPE_PUBLISHABLE_KEY` in `.env` and restart dev server

### Issue: "Payment service is not deployed"
**Fix:** Deploy Edge Functions to Supabase

### Issue: "Payment service is not properly configured"
**Fix:** Add required secrets to Edge Functions

### Issue: "Stripe secret key not configured"
**Fix:** Add `STRIPE_SECRET_KEY` to Edge Function secrets

### Issue: "Price ID not configured"
**Fix:** Add price ID secrets (STRIPE_PRICE_STARTER_MONTHLY, etc.)

## 📚 Documentation

- `STRIPE_VERIFICATION_REPORT.md` - Detailed verification report
- `STRIPE_DEBUG_GUIDE.md` - Debugging guide
- `QUICK_STRIPE_FIX.md` - Quick troubleshooting
- `FIX_STRIPE_ENV_VAR.md` - Environment variable fix guide

## ✅ Status

- [x] Code implementation complete
- [x] Error handling improved
- [x] Logging added
- [ ] Environment variables configured
- [ ] Edge Functions deployed
- [ ] Edge Function secrets configured
- [ ] Stripe products/prices created
- [ ] Webhook configured
- [ ] Database migrations applied
- [ ] End-to-end testing complete

## 🎯 Next Steps

1. ✅ Set environment variables (you've done this)
2. ⚠️ Deploy Edge Functions
3. ⚠️ Configure Edge Function secrets
4. ⚠️ Create Stripe products/prices
5. ⚠️ Configure webhook
6. ⚠️ Test checkout flows

Once all steps are complete, Stripe integration will be fully functional!

