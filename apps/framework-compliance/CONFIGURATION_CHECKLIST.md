# ✅ Configuration Checklist

**Date:** 2025-12-17

## ✅ Automated (Completed)

- [x] Environment variables file created (.env.local)
- [x] Secrets reference file created (SUPABASE_SECRETS_TO_SET.md)
- [x] Configuration documentation created

## ⚠️ Manual Steps Required

### Step 1: Deploy Edge Functions (10-15 min)

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

Deploy these 8 functions:
- [ ] create-checkout-session
- [ ] create-one-time-checkout-session
- [ ] stripe-webhook
- [ ] send-email-notification
- [ ] generate-automated-reports
- [ ] run-scheduled-assessments
- [ ] track-compliance-health
- [ ] check-regulatory-updates

### Step 2: Set Edge Function Secrets (10-15 min)

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

**Reference:** See SUPABASE_SECRETS_TO_SET.md for all secrets

For each function:
- [ ] create-checkout-session (2 secrets)
- [ ] create-one-time-checkout-session (2 secrets)
- [ ] stripe-webhook (3 secrets - webhook secret after Step 3)
- [ ] send-email-notification (2 secrets)
- [ ] generate-automated-reports (2 secrets)
- [ ] run-scheduled-assessments (2 secrets)
- [ ] track-compliance-health (2 secrets)
- [ ] check-regulatory-updates (2 secrets)

### Step 3: Create Stripe Webhook (5 min)

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** "+ Add endpoint"
3. **Endpoint URL:** `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. **Events:**
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
5. **Copy webhook secret** (whsec_...)
6. **Add to stripe-webhook function** as STRIPE_WEBHOOK_SECRET

### Step 4: Set Deployment Platform Variables (5 min)

Set in Vercel/Netlify/Your Platform:

- [ ] VITE_SUPABASE_URL = https://achowlksgmwuvfbvjfrt.supabase.co
- [ ] VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
- [ ] VITE_STRIPE_PUBLISHABLE_KEY = pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O

### Step 5: Verify (5 min)

- [ ] All functions deployed and active
- [ ] All secrets set
- [ ] Webhook created
- [ ] Test checkout flow

---

## 📊 Progress

**Automated:** ✅ Complete  
**Manual:** ⚠️ Requires Dashboard access

**Estimated Time Remaining:** 30-40 minutes

---

## 📚 Reference Files

- **Secrets:** SUPABASE_SECRETS_TO_SET.md
- **Complete Guide:** SUPABASE_CONFIGURATION_COMPLETE.md
- **Quick Reference:** SUPABASE_SECRETS_QUICK_REFERENCE.md
