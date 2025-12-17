# Quick Stripe Checkout Fix

Since environment variables are set, the issue is likely one of these:

## Most Common Issues

### 1. Edge Function Not Deployed ⚠️ **MOST LIKELY**

The Edge Function `create-one-time-checkout-session` may not be deployed to Supabase.

**Check:**
- Go to Supabase Dashboard → Edge Functions
- Look for `create-one-time-checkout-session`
- If missing, deploy it

**Fix:**
```bash
# Deploy the function
supabase functions deploy create-one-time-checkout-session

# Or deploy all functions
supabase functions deploy
```

### 2. Edge Function Secrets Not Configured ⚠️ **VERY LIKELY**

Even if the function is deployed, it needs secrets configured.

**Check:**
- Supabase Dashboard → Edge Functions → `create-one-time-checkout-session` → Settings → Secrets
- Must have:
  - `STRIPE_SECRET_KEY` (your Stripe secret key starting with `sk_`)
  - `SUPABASE_URL` (your Supabase project URL)
  - `SUPABASE_SERVICE_ROLE_KEY` (service role key, not anon key)
  - `SITE_URL` (your site URL, e.g., `https://cybercorrect.com`)

**Fix:**
Add all required secrets in Supabase Dashboard.

### 3. Check Browser Console for Specific Error

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try checkout again
4. Look for the specific error message

The improved error handling should now show:
- "Payment service is not deployed" → Function not deployed
- "Payment service is not properly configured" → Missing secrets
- "Stripe secret key not configured" → Missing STRIPE_SECRET_KEY
- Other specific error messages

### 4. Check Network Tab

1. Open DevTools → Network tab
2. Try checkout
3. Find request to `create-one-time-checkout-session`
4. Check:
   - Status code (404 = not deployed, 500 = function error, etc.)
   - Response tab for error message

### 5. Check Edge Function Logs

1. Supabase Dashboard → Edge Functions → `create-one-time-checkout-session`
2. Click "Logs" tab
3. Try checkout again
4. Check for error messages in logs

## Quick Test

After deploying and configuring, test with:

```bash
# Test the Edge Function directly
curl -X POST https://[your-project-id].supabase.co/functions/v1/create-one-time-checkout-session \
  -H "Authorization: Bearer [your-anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{
      "productId": "test",
      "name": "Test Product",
      "price": 100,
      "quantity": 1
    }],
    "successUrl": "https://cybercorrect.com/store/success",
    "cancelUrl": "https://cybercorrect.com/store"
  }'
```

Replace:
- `[your-project-id]` with your Supabase project ID
- `[your-anon-key]` with your Supabase anon key

## Next Steps

1. ✅ Verify Edge Function is deployed
2. ✅ Verify all secrets are configured
3. ✅ Check browser console for specific error
4. ✅ Check Edge Function logs
5. ✅ Test Edge Function directly

The improved error messages should now tell you exactly what's wrong!

