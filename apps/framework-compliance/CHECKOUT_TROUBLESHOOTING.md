# Stripe Checkout Troubleshooting Guide

## Quick Diagnostic

Run the diagnostic script to identify issues:

```bash
npm run checkout:diagnose
```

This will check:
- ✅ Environment variables (VITE_STRIPE_PUBLISHABLE_KEY)
- ✅ Supabase configuration
- ✅ Edge Function files
- ⚠️ Edge Function deployment status (requires manual check)
- ⚠️ Edge Function secrets (requires manual check)

## Common Issues and Solutions

### 1. "Stripe not configured" Error

**Symptom:** Error message says "Stripe is not configured" or "VITE_STRIPE_PUBLISHABLE_KEY environment variable is missing"

**Solution:**
1. Create or update `.env` file in the project root:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O
   ```
2. Restart your development server:
   ```bash
   npm run dev
   ```

### 2. "Payment service is not deployed" Error

**Symptom:** Error message says "Payment service is not deployed" or "Function not found"

**Solution:**
1. Deploy the Edge Function:
   ```bash
   npx supabase functions deploy create-one-time-checkout-session
   ```
2. Verify deployment in Supabase Dashboard:
   - Go to: https://supabase.com/dashboard
   - Navigate to: Edge Functions → create-one-time-checkout-session
   - Status should show "Active"

### 3. "Stripe secret key not configured" Error

**Symptom:** Error message says "Stripe secret key not configured" or "STRIPE_SECRET_KEY is missing"

**Solution:**
1. Go to Supabase Dashboard → Edge Functions → create-one-time-checkout-session → Secrets
2. Add the secret:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `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`
3. Also add:
   - **Name:** `SITE_URL`
   - **Value:** `https://www.cybercorrect.com`

### 4. "Invalid Stripe API key" Error

**Symptom:** Error message says "Invalid API Key provided" or "Invalid Stripe API key"

**Solution:**
1. Verify the Stripe secret key is correct:
   - Should start with `sk_live_` (production) or `sk_test_` (test)
   - Check in Supabase Dashboard → Edge Functions → create-one-time-checkout-session → Secrets
2. Verify the publishable key matches:
   - Should start with `pk_live_` (production) or `pk_test_` (test)
   - Check in `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`

### 5. "Supabase is not configured" Error

**Symptom:** Error message says "Supabase is not configured" or "Payment service is not configured"

**Solution:**
1. Add Supabase configuration to `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
2. Restart your development server

### 6. "CORS" or "Network" Error

**Symptom:** Error message mentions CORS or network issues

**Solution:**
1. Check Edge Function CORS settings (should be configured in the function code)
2. Verify `SITE_URL` secret matches your actual domain
3. Check browser console for detailed error messages

### 7. Checkout Session Created But No Redirect

**Symptom:** Checkout session is created but user is not redirected to Stripe

**Solution:**
1. Check browser console for errors
2. Verify `session.url` is present in the response
3. Check if popup blockers are interfering
4. Verify the redirect URL is valid

## Manual Verification Steps

### Step 1: Check Environment Variables

```bash
# In your project root, check .env file exists and contains:
cat .env | grep VITE_STRIPE_PUBLISHABLE_KEY
cat .env | grep VITE_SUPABASE_URL
cat .env | grep VITE_SUPABASE_ANON_KEY
```

### Step 2: Verify Edge Function Deployment

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Navigate to: Edge Functions
4. Find: `create-one-time-checkout-session`
5. Status should be: **Active**

### Step 3: Verify Edge Function Secrets

1. In Supabase Dashboard → Edge Functions → create-one-time-checkout-session
2. Click on "Secrets" tab
3. Verify these secrets exist:
   - ✅ `STRIPE_SECRET_KEY` (should start with `sk_live_` or `sk_test_`)
   - ✅ `SITE_URL` (e.g., `https://www.cybercorrect.com`)

### Step 4: Test Edge Function Directly

You can test the Edge Function using curl or Postman:

```bash
curl -X POST https://your-project.supabase.co/functions/v1/create-one-time-checkout-session \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "test-product",
        "name": "Test Product",
        "price": 10.00,
        "quantity": 1
      }
    ],
    "successUrl": "https://www.cybercorrect.com/store/success",
    "cancelUrl": "https://www.cybercorrect.com/store"
  }'
```

### Step 5: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try to checkout
4. Look for error messages
5. Check Network tab for failed requests

## Testing Checklist

- [ ] Environment variables are set in `.env` file
- [ ] Development server restarted after adding env vars
- [ ] Edge Function is deployed and shows "Active" status
- [ ] Edge Function secrets are configured (STRIPE_SECRET_KEY, SITE_URL)
- [ ] Stripe keys are correct (publishable key matches secret key mode: live/test)
- [ ] Supabase is configured (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [ ] Browser console shows no errors
- [ ] Network requests to Edge Function succeed (check Network tab)

## Getting Help

If checkout still doesn't work after following these steps:

1. Run the diagnostic script: `npm run checkout:diagnose`
2. Check Edge Function logs in Supabase Dashboard
3. Check browser console for detailed error messages
4. Verify all configuration values match the expected format

## Related Files

- Checkout Page: `src/pages/Checkout.tsx`
- Checkout Service: `src/services/oneTimeCheckoutService.ts`
- Edge Function: `supabase/functions/create-one-time-checkout-session/index.ts`
- Diagnostic Script: `scripts/diagnose-checkout-issue.ts`

