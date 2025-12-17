# Stripe Checkout Debugging Guide

Since environment variables are set, let's diagnose why checkout is still failing.

## Step 1: Check Browser Console

Open browser DevTools (F12) → Console tab, then try checkout again. Look for:
- Specific error messages
- Network requests to Edge Functions
- Any CORS errors

## Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try checkout again
3. Look for request to: `create-one-time-checkout-session`
4. Check:
   - Status code (200, 400, 500, etc.)
   - Response body (error message)
   - Request payload

## Step 3: Verify Edge Function is Deployed

Check if the Edge Function exists in Supabase:

```bash
# List deployed functions
supabase functions list

# Or check in Supabase Dashboard:
# Edge Functions → Should see "create-one-time-checkout-session"
```

## Step 4: Check Edge Function Logs

In Supabase Dashboard:
1. Go to Edge Functions → `create-one-time-checkout-session`
2. Click "Logs" tab
3. Try checkout again
4. Check for error messages

## Step 5: Test Edge Function Directly

You can test the Edge Function directly using curl or Postman:

```bash
curl -X POST https://[your-project-id].supabase.co/functions/v1/create-one-time-checkout-session \
  -H "Authorization: Bearer [your-anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "privacy-toolkit-pro",
        "name": "Privacy Toolkit Pro",
        "price": 599,
        "quantity": 1
      }
    ],
    "successUrl": "http://localhost:5173/store/success",
    "cancelUrl": "http://localhost:5173/store"
  }'
```

## Step 6: Verify Edge Function Secrets

In Supabase Dashboard → Edge Functions → `create-one-time-checkout-session` → Settings → Secrets:

Required secrets:
- ✅ `STRIPE_SECRET_KEY` (must start with `sk_`)
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `SITE_URL`

## Common Issues

### Issue 1: Edge Function Not Deployed
**Symptom:** 404 error in Network tab
**Fix:** Deploy the function:
```bash
supabase functions deploy create-one-time-checkout-session
```

### Issue 2: Missing Secrets
**Symptom:** Error message about "not configured" or "secret key"
**Fix:** Add all required secrets in Supabase Dashboard

### Issue 3: Wrong Stripe Key
**Symptom:** Stripe API errors
**Fix:** Ensure you're using the correct key:
- Test mode: `sk_test_...`
- Live mode: `sk_live_...`
- Must match your publishable key environment

### Issue 4: CORS Error
**Symptom:** CORS error in console
**Fix:** Edge Function should handle CORS, but check if it's deployed correctly

### Issue 5: Function Error
**Symptom:** 500 error with error message
**Fix:** Check Edge Function logs for specific error

## Quick Test

Run this in browser console to test the service directly:

```javascript
// Test checkout service
import { createOneTimeCheckoutSession } from './services/oneTimeCheckoutService';

const testItems = [{
  productId: 'privacy-toolkit-pro',
  name: 'Privacy Toolkit Pro',
  price: 599,
  quantity: 1
}];

try {
  const session = await createOneTimeCheckoutSession(
    testItems,
    'http://localhost:5173/store/success',
    'http://localhost:5173/store'
  );
  console.log('Success:', session);
} catch (error) {
  console.error('Error:', error.message);
}
```

