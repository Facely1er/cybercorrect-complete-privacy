# 🚀 Quick Start - Deploy Functions

**Fastest way to deploy all Edge Functions**

---

## ✅ Recommended: Use Supabase Dashboard

**This is the easiest and most reliable method.**

### Steps:

1. **Open Supabase Dashboard:**
   - Go to: https://app.supabase.com
   - Find your project (search or browse)

2. **Go to Edge Functions:**
   - Click your project
   - Click **Edge Functions** in sidebar
   - Or go directly: `https://app.supabase.com/project/[YOUR_PROJECT]/functions`

3. **Deploy Functions:**
   - For each function, click **Deploy** or **Create Function**
   - Functions are in: `supabase/functions/[function-name]/index.ts`

4. **Functions to Deploy (8 total):**
   - ✅ create-checkout-session
   - ✅ create-one-time-checkout-session
   - ✅ stripe-webhook
   - ✅ send-email-notification
   - ✅ generate-automated-reports
   - ✅ run-scheduled-assessments
   - ✅ track-compliance-health
   - ✅ check-regulatory-updates

**Time:** 10-15 minutes

---

## 🔧 Alternative: CLI Deployment

If you know the correct project ref:

```bash
# Deploy all at once (after linking)
npx supabase link --project-ref [PROJECT_REF]
npm run deploy:functions

# Or deploy individually
npx supabase functions deploy [function-name] --project-ref [PROJECT_REF]
```

---

## 📋 After Deployment

1. **Set Secrets:**
   - Go to: Settings → Edge Functions → Secrets
   - See: `SUPABASE_SECRETS_TO_SET.md`

2. **Create Stripe Webhook:**
   - See: `STRIPE_DASHBOARD_SETUP.md`

---

**Start with Dashboard method - it's the fastest!** 🚀

