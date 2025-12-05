# Configure Stripe Secret Key - SECURE SETUP

⚠️ **SECURITY WARNING:** The Stripe secret key you provided is a **LIVE** key. Keep it secure and never commit it to git!

## Where to Add Your Stripe Secret Key

### ✅ Correct: Supabase Edge Function Secrets

Add your Stripe secret key to **Supabase Edge Function secrets** (NOT in code files):

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Edge Functions** → Select a function (e.g., `create-checkout-session`)
4. Click **Settings** → **Secrets**
5. Add new secret:
   - **Name:** `STRIPE_SECRET_KEY`
   - **Value:** `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`
6. Click **Save**

### Repeat for All Edge Functions

Add `STRIPE_SECRET_KEY` to secrets for:
- ✅ `create-checkout-session`
- ✅ `create-one-time-checkout-session`
- ✅ `stripe-webhook`

## Using Supabase CLI (Alternative)

If you prefer CLI:

```bash
# Set secret for create-checkout-session
supabase secrets set STRIPE_SECRET_KEY=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 --project-ref your-project-ref

# Set for create-one-time-checkout-session
supabase secrets set STRIPE_SECRET_KEY=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 --project-ref your-project-ref

# Set for stripe-webhook
supabase secrets set STRIPE_SECRET_KEY=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 --project-ref your-project-ref
```

## ❌ DO NOT Add to Code Files

**Never add the secret key to:**
- ❌ `.env` files (unless using test key for local dev only)
- ❌ Code files (`.ts`, `.js`, etc.)
- ❌ Configuration files
- ❌ Git repository

**Why?** Secret keys are for server-side use only. Edge Functions run server-side, so they can safely use the secret key.

## Frontend vs Backend Keys

### Frontend (.env file)
Use **Publishable Key** (starts with `pk_live_...`):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
```

### Backend (Edge Function Secrets)
Use **Secret Key** (starts with `sk_live_...`):
```
STRIPE_SECRET_KEY=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
```

## Complete Secret Configuration Checklist

For each Edge Function, add these secrets:

### `create-checkout-session`
- [x] `STRIPE_SECRET_KEY` = `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`
- [ ] `STRIPE_PRICE_STARTER_MONTHLY` = `price_...` (get from Stripe Dashboard)
- [ ] `STRIPE_PRICE_STARTER_ANNUAL` = `price_...`
- [ ] `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...`
- [ ] `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...`
- [ ] `SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
- [ ] `SITE_URL` = `https://cybercorrect.com` (or your domain)

### `create-one-time-checkout-session`
- [x] `STRIPE_SECRET_KEY` = `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`
- [ ] `SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
- [ ] `SITE_URL` = `https://cybercorrect.com`

### `stripe-webhook`
- [x] `STRIPE_SECRET_KEY` = `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`
- [ ] `STRIPE_WEBHOOK_SECRET` = `whsec_...` (get from Stripe Dashboard → Webhooks)
- [ ] `SUPABASE_URL` = `https://your-project.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
- [ ] `SITE_URL` = `https://cybercorrect.com`

## Get Your Stripe Publishable Key

You'll also need the **publishable key** for the frontend:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy the **Publishable key** (starts with `pk_live_...`)
4. Add to `.env` file:
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
   ```

## Get Price IDs

1. Go to Stripe Dashboard → **Products**
2. Click on each product (Starter, Professional, Enterprise)
3. For each product, note the Price IDs for:
   - Monthly subscription (starts with `price_...`)
   - Annual subscription (starts with `price_...`)
4. Add these to Edge Function secrets as shown above

## Security Best Practices

1. ✅ Use Supabase Edge Function secrets (secure, encrypted)
2. ✅ Never commit secret keys to git
3. ✅ Use different keys for test and production
4. ✅ Rotate keys if compromised
5. ✅ Limit key permissions in Stripe Dashboard
6. ✅ Monitor Stripe Dashboard for suspicious activity

## Verification

After adding secrets:

1. Test Edge Function in Supabase Dashboard → Edge Functions → [function] → Logs
2. Try checkout flow
3. Check logs for any errors
4. Verify Stripe Dashboard shows successful API calls

## Next Steps

1. ✅ Add `STRIPE_SECRET_KEY` to all Edge Function secrets (you have the key)
2. ⚠️ Get and add Stripe Publishable Key to `.env` file
3. ⚠️ Create products/prices in Stripe Dashboard
4. ⚠️ Add Price IDs to Edge Function secrets
5. ⚠️ Configure webhook in Stripe Dashboard
6. ⚠️ Test checkout flows

---

**Remember:** This is a LIVE key. Handle it with care! 🔒

