# Deploy Edge Functions to Supabase

**Time Required:** 10-15 minutes  
**Status:** ⚠️ **REQUIRED BEFORE PRODUCTION**

---

## Prerequisites

1. Supabase project created
2. Supabase CLI installed: `npm install -g supabase`
3. Logged in to Supabase: `supabase login`
4. Project linked: `supabase link --project-ref your-project-ref`

---

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

---

## Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

---

## Step 3: Link Your Project

```bash
cd apps/framework-compliance
supabase link --project-ref your-project-ref
```

**Find your project ref:**
- Go to Supabase Dashboard → Project Settings → General
- Copy the "Reference ID"

---

## Step 4: Set Edge Function Secrets

Before deploying, set the required secrets in Supabase Dashboard:

1. Go to **Edge Functions** → **Secrets**
2. Add the following secrets:

```
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
SITE_URL=https://www.cybercorrect.com
```

**Optional (for email delivery):**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

**Or use CLI:**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
supabase secrets set SITE_URL=https://www.cybercorrect.com
```

---

## Step 5: Deploy Edge Functions

### Option 1: Deploy All Functions (Recommended)

```bash
cd apps/framework-compliance
supabase functions deploy create-one-time-checkout-session
supabase functions deploy stripe-webhook
```

### Option 2: Deploy Individual Functions

```bash
# Deploy checkout session function
supabase functions deploy create-one-time-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

### Option 3: Use Deployment Script

```bash
# Windows
.\scripts\deploy-edge-functions.ps1

# Linux/Mac
./scripts/deploy-edge-functions.sh
```

---

## Step 6: Verify Deployment

1. Go to Supabase Dashboard → **Edge Functions**
2. Verify functions are listed:
   - ✅ `create-one-time-checkout-session`
   - ✅ `stripe-webhook`

3. Check function logs:
   - Click on function → **Logs**
   - Verify no errors

---

## Step 7: Test Functions

### Test Checkout Session Function

```bash
curl -X POST \
  'https://your-project-id.supabase.co/functions/v1/create-one-time-checkout-session' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "productIds": ["privacy-toolkit-pro"],
    "successUrl": "https://www.cybercorrect.com/store/success",
    "cancelUrl": "https://www.cybercorrect.com/store"
  }'
```

### Test Webhook (Use Stripe CLI)

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local function
stripe listen --forward-to https://your-project-id.supabase.co/functions/v1/stripe-webhook

# Trigger test event
stripe trigger checkout.session.completed
```

---

## Functions to Deploy

### Required Functions:

1. **create-one-time-checkout-session**
   - Creates Stripe checkout sessions
   - Location: `supabase/functions/create-one-time-checkout-session/`

2. **stripe-webhook**
   - Handles Stripe webhook events
   - Generates license keys
   - Sends email notifications
   - Location: `supabase/functions/stripe-webhook/`

### Optional Functions:

- `create-checkout-session` (for subscriptions)
- `send-email-notification` (if using custom email service)
- `generate-automated-reports`
- `run-scheduled-assessments`

---

## Troubleshooting

### Deployment Fails

1. **Check authentication:**
   ```bash
   supabase login
   ```

2. **Verify project link:**
   ```bash
   supabase projects list
   ```

3. **Check function syntax:**
   ```bash
   supabase functions serve create-one-time-checkout-session
   ```

### Function Not Working

1. **Check logs:**
   - Supabase Dashboard → Edge Functions → Logs

2. **Verify secrets:**
   - Supabase Dashboard → Edge Functions → Secrets

3. **Test locally:**
   ```bash
   supabase functions serve create-one-time-checkout-session
   ```

### Webhook Not Receiving Events

1. Verify webhook URL in Stripe Dashboard
2. Check webhook secret matches
3. Verify function is deployed
4. Check function logs for errors

---

## Security Checklist

- [ ] Secrets set in Supabase (not in code)
- [ ] Webhook signature verification enabled
- [ ] HTTPS enforced for all endpoints
- [ ] CORS configured correctly
- [ ] Rate limiting configured (if applicable)

---

## Post-Deployment

1. ✅ Test checkout flow end-to-end
2. ✅ Verify webhook receives events
3. ✅ Check license key generation
4. ✅ Verify email delivery
5. ✅ Monitor function logs
6. ✅ Set up alerts for errors

---

## Rollback

If deployment causes issues:

1. Go to Supabase Dashboard → Edge Functions
2. Find previous deployment
3. Redeploy previous version
4. Or fix issues and redeploy

---

**Last Updated:** February 2025

