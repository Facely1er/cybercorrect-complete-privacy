# ✅ Stripe Setup - Complete Guide

## 🎯 Current Status

All configuration files have been generated and are ready to use. The setup is **90% complete**.

---

## 📋 What's Ready

✅ **Frontend Configuration**
- Stripe publishable key configured in `.env`
- All frontend code ready

✅ **Backend Configuration**
- All API keys collected
- Price IDs found and documented
- Edge Functions code exists

✅ **Documentation**
- Step-by-step guides created
- All values ready to copy-paste

---

## 🚀 Complete Setup (Choose Your Method)

### Method 1: Supabase Dashboard (Recommended - 5 minutes)

**Step 1: Set Secrets**

1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions
2. For each function, click on it and add these secrets:

#### `create-checkout-session` Secrets:
```
STRIPE_SECRET_KEY=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
STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

#### `create-one-time-checkout-session` Secrets:
```
STRIPE_SECRET_KEY=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
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

#### `stripe-webhook` Secrets (set after creating webhook):
```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_[GET_FROM_STRIPE_AFTER_CREATING_WEBHOOK]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

**Step 2: Deploy Functions**

1. In Supabase Dashboard → Edge Functions
2. Click "Deploy" for each function:
   - `create-checkout-session`
   - `create-one-time-checkout-session`
   - `stripe-webhook`

**Step 3: Create Stripe Webhook**

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
7. Go back to Supabase Dashboard and add `STRIPE_WEBHOOK_SECRET` to `stripe-webhook` function

**Done!** 🎉

---

### Method 2: CLI (If Login Works)

**Step 1: Login**
```powershell
npx supabase login
```

**Step 2: Link Project**
```powershell
npx supabase link --project-ref achowlksgmwuvfbvjfrt
```

**Step 3: Run Setup Script**
```powershell
.\scripts\set-all-secrets.ps1
```

**Step 4: Create Webhook** (Same as Method 1, Step 3)

---

## 🧪 Testing After Setup

1. **Test Subscription Checkout:**
   - Go to pricing page
   - Click "Get Started" on Starter or Professional
   - Complete test checkout
   - Verify in Stripe Dashboard

2. **Test One-Time Purchase:**
   - Go to pricing page
   - Click on a one-time product
   - Complete test checkout
   - Verify payment succeeded

3. **Test Webhook:**
   - Check Stripe Dashboard → Webhooks → Recent events
   - Should see events being received

---

## 📁 Available Files

- `STRIPE_QUICK_START.md` - Quick reference
- `STRIPE_SETUP_FINAL_STEPS.md` - Detailed steps
- `stripe-secrets-config.json` - All secrets in JSON
- `scripts/set-all-secrets.ps1` - PowerShell script for CLI

---

## 🔍 Verify Setup

### Check Setup Status
```powershell
npm run stripe:verify
```

### Test Integration (After Setup)
```powershell
npm run stripe:test
```

### Interactive Checklist
```powershell
npm run stripe:checklist
```

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

## ✅ Completion Checklist

- [ ] All secrets set in Supabase Dashboard
- [ ] All Edge Functions deployed
- [ ] Stripe webhook created
- [ ] Webhook secret configured
- [ ] Test subscription checkout
- [ ] Test one-time purchase checkout
- [ ] Verify webhook receives events

---

**Ready to launch!** 🚀

