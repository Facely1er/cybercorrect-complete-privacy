# ⚡ Stripe Setup - Quick Start

## ✅ Ready to Go!

All configuration files have been generated. Choose your preferred method:

---

## 🎯 Fastest Path: Supabase Dashboard (5 minutes)

### 1. Set Secrets
Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions

Open `STRIPE_SETUP_FINAL_STEPS.md` for exact values to copy-paste.

### 2. Deploy Functions
In the same dashboard, click "Deploy" for:
- `create-checkout-session`
- `create-one-time-checkout-session`  
- `stripe-webhook`

### 3. Create Webhook
1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
3. Select events (see `STRIPE_SETUP_FINAL_STEPS.md`)
4. Copy webhook secret (`whsec_...`)
5. Add `STRIPE_WEBHOOK_SECRET` to `stripe-webhook` function in Supabase

**Done!** 🎉

---

## 📁 Generated Files

- ✅ `STRIPE_SETUP_FINAL_STEPS.md` - Complete step-by-step guide
- ✅ `stripe-secrets-config.json` - All secrets in JSON format
- ✅ `scripts/set-all-secrets.ps1` - PowerShell script (if using CLI)

---

## 🔑 All Values Ready

All API keys, URLs, and configuration values are in:
- `STRIPE_SETUP_FINAL_STEPS.md` (Method 1 section)
- `stripe-secrets-config.json`

No need to look elsewhere - everything is ready to copy-paste!

---

## ⏱️ Estimated Time

- Dashboard method: **5 minutes**
- CLI method: **10 minutes** (if login works)

---

**Next:** Open `STRIPE_SETUP_FINAL_STEPS.md` and follow Method 1.

