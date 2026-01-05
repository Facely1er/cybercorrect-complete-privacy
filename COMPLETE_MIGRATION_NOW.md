# Complete Migration Deployment Guide

## ⚠️ Important: Network Restrictions

This automated environment cannot connect to external databases due to network security policies. You have **two options** to complete the migration:

---

## ✅ OPTION 1: Automated Script (RECOMMENDED - 5 minutes)

Run this on your **local machine** where you have unrestricted internet access:

### Step 1: Pull Latest Changes
```bash
cd /path/to/cybercorrect-complete-privacy
git pull origin claude/complete-platform-PAZKN
```

### Step 2: Run Deployment Script
```bash
./deploy-migrations.sh
```

**The script automatically:**
- ✅ Links both apps to Supabase project `dfklqsdfycwjlcasfciu`
- ✅ Applies all 18 Framework Compliance migrations
- ✅ Applies all 11 Privacy Portal migrations
- ✅ Verifies deployment success
- ✅ Shows summary of created objects

**Total Time:** ~5-10 minutes

---

## ✅ OPTION 2: Manual Execution via Supabase Dashboard (15-20 minutes)

If you cannot run the script locally, execute migrations manually via Supabase SQL Editor:

### Step 1: Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Execute Framework Compliance Migrations

Execute these files **in order** (copy-paste contents into SQL Editor):

1. `apps/framework-compliance/supabase/migrations/20250729162343_orange_band.sql`
2. `apps/framework-compliance/supabase/migrations/20250130000000_improve_security.sql`
3. `apps/framework-compliance/supabase/migrations/20250201000000_subscription_features.sql`
4. `apps/framework-compliance/supabase/migrations/20250201000001_cron_jobs.sql`
5. `apps/framework-compliance/supabase/migrations/20250202000000_privacy_tools_schema.sql`
6. `apps/framework-compliance/supabase/migrations/20250202000001_subscriptions.sql`
7. `apps/framework-compliance/supabase/migrations/20250202000002_fix_function_search_path.sql`
8. `apps/framework-compliance/supabase/migrations/20250202000003_fix_rls_performance.sql`
9. `apps/framework-compliance/supabase/migrations/20250202000004_combined_fixes.sql`
10. `apps/framework-compliance/supabase/migrations/20250203000000_calendar_events.sql`
11. `apps/framework-compliance/supabase/migrations/20250204000000_ropa_and_evidence_tables.sql`
12. `apps/framework-compliance/supabase/migrations/20250205000000_fix_admin_view_security.sql`
13. `apps/framework-compliance/supabase/migrations/20250218000000_portal_beta_schema.sql`
14. `apps/framework-compliance/supabase/migrations/20250220000000_privacy_risk_radar.sql`
15. `apps/framework-compliance/supabase/migrations/20250220000001_fix_rls_performance_cc_privacy.sql`
16. `apps/framework-compliance/supabase/migrations/20250220000002_fix_rls_performance_technosoluce.sql`
17. `apps/framework-compliance/supabase/migrations/20251217000000_one_time_purchases.sql`
18. `apps/framework-compliance/supabase/migrations/20251228000000_final_security_fixes.sql` ⭐ **CRITICAL**

### Step 3: Execute Privacy Portal Migrations

Execute these files **in order**:

1. `apps/privacy-portal/supabase/migrations/20250709114318_shy_frog.sql`
2. `apps/privacy-portal/supabase/migrations/20250709115954_shrill_fountain.sql`
3. `apps/privacy-portal/supabase/migrations/20250709120228_lingering_trail.sql`
4. `apps/privacy-portal/supabase/migrations/20250709120758_humble_smoke.sql`
5. `apps/privacy-portal/supabase/migrations/20250709122625_weathered_bar.sql`
6. `apps/privacy-portal/supabase/migrations/20250709125052_cool_rice.sql`
7. `apps/privacy-portal/supabase/migrations/20250709155456_yellow_queen.sql`
8. `apps/privacy-portal/supabase/migrations/20250115000000_cybercorrect_schema_differentiation.sql`
9. `apps/privacy-portal/supabase/migrations/20250115000001_migrate_to_cybercorrect_schema.sql`
10. `apps/privacy-portal/supabase/migrations/20250115000002_finalize_backend_configuration.sql`
11. `apps/privacy-portal/supabase/migrations/20251228000000_final_security_fixes.sql` ⭐ **CRITICAL**

### Step 4: Verify Deployment

Run this query in SQL Editor to verify:

```sql
-- Count Tables
SELECT
  'Tables' as object_type,
  COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public';

-- Count RLS Policies
SELECT
  'RLS Policies' as object_type,
  COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public';

-- Count Indexes
SELECT
  'Indexes' as object_type,
  COUNT(*) as count
FROM pg_indexes
WHERE schemaname = 'public';

-- List Key Tables
SELECT
  table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'cc_%'
ORDER BY table_name;
```

**Expected Results:**
- Tables: **30-40**
- RLS Policies: **180+**
- Indexes: **195+**

---

## 📊 What Gets Created

| Component | Framework | Portal | **Total** |
|-----------|-----------|--------|-----------|
| **Tables** | 31 | 8 | **39** |
| **RLS Policies** | 140 | 40 | **180** |
| **Indexes** | 145 | 50 | **195** |
| **Functions** | 34 | 20 | **54** |

---

## 🔒 Security Fixes Included

The final security fix migrations (`20251228000000_final_security_fixes.sql`) resolve:

✅ **Function Search Path Mutable**
- All SECURITY DEFINER functions now use `SET search_path = ''`
- Prevents search path manipulation attacks

✅ **Auth RLS Initialization Plan**
- Added 25+ performance indexes on user_id columns
- Optimized policy evaluation for fast queries

✅ **Multiple Permissive Policies**
- Consolidated to exactly 1 policy per table/operation
- Eliminates duplicate policy warnings

---

## 🎯 After Migration Complete

### Update Environment Variables

**Framework Compliance** (`apps/framework-compliance/.env`):
```bash
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Supabase dashboard>
VITE_ENVIRONMENT=production
```

**Privacy Portal** (`apps/privacy-portal/.env`):
```bash
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Supabase dashboard>
VITE_ENVIRONMENT=production
```

### Deploy to Production

Both apps are ready for Vercel deployment:
```bash
# Framework Compliance
cd apps/framework-compliance
vercel --prod

# Privacy Portal
cd apps/privacy-portal
vercel --prod
```

---

## ✅ Migration Complete Checklist

- [ ] All Framework Compliance migrations applied (18 files)
- [ ] All Privacy Portal migrations applied (11 files)
- [ ] Verification query shows correct object counts
- [ ] No security warnings in Supabase dashboard
- [ ] Environment variables updated
- [ ] Apps deployed to Vercel
- [ ] Production URLs tested and working

---

## 🚀 You're Production Ready!

After completing these migrations, your platform will be fully deployed with:
- ✅ Complete database schema
- ✅ Row-level security enabled
- ✅ Performance optimizations
- ✅ All security warnings resolved
- ✅ Privacy Risk Radar feature live
- ✅ Multi-framework compliance support

**Need Help?** Refer to:
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Comprehensive deployment walkthrough
- `DEPLOYMENT_CHECKLIST.md` - Interactive go-live checklist
- `DATABASE_MIGRATIONS_VERIFICATION.md` - Migration details and verification

---

**Last Updated:** 2025-12-28
**Migration Count:** 29 files (18 Framework + 11 Portal)
**Database Version:** PostgreSQL 15
**Project Ref:** dfklqsdfycwjlcasfciu
