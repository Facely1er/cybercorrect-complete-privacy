# ⚡ CyberCorrect Quick Start

## 🎯 Current Status: 98% Complete → Ready for Final Configuration

---

## 🚀 Quick Setup (1.5-2 hours)

### 1️⃣ Create `.env` File (5 min)
```bash
cd apps/framework-compliance
# Create .env with:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
**Get credentials from**: Supabase Dashboard → Settings → API

### 2️⃣ Apply Migrations (20 min)
1. Go to: https://app.supabase.com → SQL Editor
2. Apply these 5 migrations in order:
   - `supabase/migrations/20250130000000_improve_security.sql`
   - `supabase/migrations/20250201000000_subscription_features.sql`
   - `supabase/migrations/20250201000001_cron_jobs.sql` (optional)
   - `supabase/migrations/20250202000000_privacy_tools_schema.sql` ⭐ **CRITICAL**
   - `supabase/migrations/20250202000001_subscriptions.sql`

### 3️⃣ Verify Setup (5 min)
```bash
npx tsx scripts/verify-supabase-setup.ts
```
Should show: ✅ All 12 tables exist

### 4️⃣ Deploy Edge Functions (30 min)
```bash
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

### 5️⃣ Configure Secrets (15 min)
In Supabase Dashboard → Edge Functions → [Function] → Settings → Secrets:
- Add `SUPABASE_URL` (your project URL)
- Add `SUPABASE_SERVICE_ROLE_KEY` (from Settings → API)

### 6️⃣ Configure Vercel (10 min)
Vercel Dashboard → Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
**Then redeploy!**

### 7️⃣ Test (30-60 min)
- Local: `npm run dev` → http://localhost:5173
- Production: https://www.cybercorrect.com
- See: `POST_DEPLOYMENT_TESTING.md`

---

## 📋 Required Tables (Verify in Supabase Dashboard)

After migrations, you should see:
- ✅ `cc_privacy_consent_records`
- ✅ `cc_privacy_vendor_assessments`
- ✅ `cc_privacy_retention_policies`
- ✅ `cc_privacy_data_records`
- ✅ `cc_privacy_dpias`
- ✅ `cc_privacy_privacy_by_design_assessments`
- ✅ `cc_privacy_service_providers`
- ✅ `cc_privacy_privacy_incidents`
- ✅ `cc_privacy_subscriptions`
- ✅ `cc_privacy_subscription_history`
- ✅ `cc_privacy_payment_methods`
- ✅ `cc_privacy_invoices`

---

## 📚 Full Documentation

- **Complete Guide**: `COMPLETE_SETUP_GUIDE.md`
- **Environment Setup**: `docs/setup/ENV_SETUP_GUIDE.md`
- **Edge Functions**: `docs/setup/CONFIGURE_EDGE_FUNCTION_SECRETS.md`
- **Production**: `docs/deployment/PRODUCTION_ENV_SETUP.md`
- **Testing**: `POST_DEPLOYMENT_TESTING.md`

---

## ✅ Success Checklist

- [ ] `.env` file created
- [ ] All 5 migrations applied
- [ ] All 12 tables exist
- [ ] Verification script passes
- [ ] All 6 Edge Functions deployed
- [ ] All secrets configured
- [ ] Vercel env vars set
- [ ] Production site working

---

**Time to Complete**: ~1.5-2 hours
**Status**: 98% → 100% after setup
**Last Updated**: 2024-12-05

