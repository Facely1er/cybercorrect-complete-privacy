# 🚀 Complete Database Migration - Step-by-Step Guide

**Project**: CyberCorrect Privacy Platform  
**Database**: dfklqsdfycwjlcasfciu.supabase.co  
**Status**: Ready to Deploy  
**Time Required**: 10-15 minutes

---

## ✅ Prerequisites

- [x] Access to Supabase Dashboard
- [x] Consolidated migration file ready: `CONSOLIDATED_MIGRATIONS.sql`
- [x] All 29 migrations included (18 Framework + 11 Portal)

---

## 📋 Step 1: Access Supabase Dashboard

1. **Go to**: https://app.supabase.com
2. **Login** to your account
3. **Select project**: `dfklqsdfycwjlcasfciu`
   - If you don't see this project, verify you have access
   - Project URL: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu

---

## 📋 Step 2: Open SQL Editor

1. In the left sidebar, click **SQL Editor**
2. Click **New query** button (top right)
3. You should see an empty SQL editor window

---

## 📋 Step 3: Load Migration File

1. **Open the file**: `CONSOLIDATED_MIGRATIONS.sql` in your code editor
2. **Select ALL** content:
   - Press `Ctrl+A` (Windows) or `Cmd+A` (Mac)
3. **Copy** the content:
   - Press `Ctrl+C` (Windows) or `Cmd+C` (Mac)

---

## 📋 Step 4: Execute Migration

1. **Paste** into Supabase SQL Editor:
   - Press `Ctrl+V` (Windows) or `Cmd+V` (Mac)
2. **Review** the SQL (optional):
   - The file contains 29 migrations in order
   - Total: ~5,729 lines
3. **Run** the migration:
   - Click **Run** button (or press `Ctrl+Enter`)
   - **Wait** for completion (30-60 seconds)

---

## 📋 Step 5: Verify Migration Success

### Check Execution Status

After running, you should see:
- ✅ **Success** message in the results panel
- ⚠️ Some warnings are normal (e.g., "already exists" for objects that were previously created)

### Verify Tables Created

Run this query in SQL Editor:

```sql
-- Count all tables
SELECT COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected: 39+ tables
```

### Verify Key Tables

```sql
-- List all cc_privacy_* tables (Framework Compliance)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'cc_privacy_%'
ORDER BY table_name;

-- List all cc_portal_* tables (Privacy Portal)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'cc_portal_%'
ORDER BY table_name;
```

**Expected Framework Compliance Tables** (31 tables):
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_data_records`
- `cc_privacy_dpias`
- `cc_privacy_pbd_assessments`
- `cc_privacy_service_providers`
- `cc_privacy_incidents`
- `cc_one_time_purchases`
- `calendar_events`
- `ropa_entries`
- `evidence_vault`
- `cc_portal_beta_applications`
- `cc_automated_reports`
- `cc_compliance_health_scores`
- `cc_scheduled_assessments`
- `cc_alert_rules`
- `cc_regulatory_updates`
- `subscriptions`
- `subscription_history`
- `payment_methods`
- `invoices`
- `profiles`
- And 8+ more...

**Expected Privacy Portal Tables** (8 tables):
- `cc_portal_data_subject_requests`
- `cc_portal_privacy_incidents`
- `cc_portal_consent_records`
- `cc_portal_processing_activities`
- `cc_portal_data_breaches`
- `cc_portal_cookie_consents`
- `cc_portal_privacy_policies`
- `cc_portal_compliance_reports`

### Verify RLS Policies

```sql
-- Count RLS policies
SELECT COUNT(*) as total_policies
FROM pg_policies
WHERE schemaname = 'public';

-- Expected: 180+ policies
```

### Verify Indexes

```sql
-- Count indexes
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public';

-- Expected: 195+ indexes
```

### Verify Functions

```sql
-- Count functions
SELECT COUNT(*) as total_functions
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';

-- Expected: 54+ functions
```

---

## 📋 Step 6: Verify Security Fixes

### Check for Security Warnings

1. Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/advisors/security
2. Verify:
   - ✅ **Zero** "Function Search Path Mutable" warnings
   - ✅ **Zero** "Multiple Permissive Policies" warnings
   - ✅ **Zero** "Auth RLS Initialization" warnings

### Verify RLS is Enabled

```sql
-- Check if any tables have RLS disabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- Should return ZERO rows (all tables should have RLS enabled)
```

---

## 📋 Step 7: Test Data Operations

### Test Insert (Framework Compliance)

```sql
-- Test inserting a consent record
-- Note: Replace 'YOUR_USER_ID' with actual auth.uid() if logged in
INSERT INTO cc_privacy_consent_records (
  user_id,
  employee_name,
  consent_type,
  status
) VALUES (
  auth.uid(),  -- or use a test UUID
  'Test User',
  'data_processing',
  'active'
);

-- Verify it was inserted
SELECT * FROM cc_privacy_consent_records
WHERE employee_name = 'Test User';
```

### Test Insert (Privacy Portal)

```sql
-- Test inserting a data subject request
INSERT INTO cc_portal_data_subject_requests (
  requestor_email,
  request_type,
  status
) VALUES (
  'test@example.com',
  'access',
  'pending'
);

-- Verify it was inserted
SELECT * FROM cc_portal_data_subject_requests
WHERE requestor_email = 'test@example.com';
```

---

## 🎯 Post-Migration Checklist

After successful migration:

- [ ] ✅ All 39 tables created
- [ ] ✅ 180+ RLS policies active
- [ ] ✅ 195+ indexes created
- [ ] ✅ 54+ functions created
- [ ] ✅ Zero security warnings
- [ ] ✅ RLS enabled on all tables
- [ ] ✅ Test data operations successful

---

## 🔧 Troubleshooting

### Error: "Migration already applied"

**Solution**: This is normal if migrations were partially applied. Supabase tracks applied migrations and skips them automatically. Check the execution log for "already exists" messages - these are safe to ignore.

### Error: "Permission denied"

**Solution**: 
- Verify you have SQL Editor access
- Check that you're logged into the correct Supabase account
- Ensure you have admin/owner permissions on the project

### Warning: "pg_cron extension not available"

**Solution**: Migration `20250201000001_cron_jobs.sql` requires `pg_cron`. If not available:
- This is OK to skip - platform works without scheduled jobs
- You can enable it later if you upgrade to Pro plan

### Performance: "Queries still slow"

**Solution**: Run `ANALYZE` on all tables:

```sql
ANALYZE;
```

This updates table statistics for the query planner.

---

## 📊 Migration Summary

| Component | Count | Status |
|-----------|-------|--------|
| **Tables** | 39 | ✅ Created |
| **RLS Policies** | 180+ | ✅ Active |
| **Indexes** | 195+ | ✅ Created |
| **Functions** | 54+ | ✅ Created |
| **Security Warnings** | 0 | ✅ Fixed |

---

## 🚀 Next Steps

After migration is complete:

1. **Update Environment Variables**:
   - Update `.env` files with Supabase credentials
   - Get anon key from: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api

2. **Test Locally**:
   ```bash
   cd apps/framework-compliance
   npm run dev
   ```

3. **Deploy to Production**:
   - Follow production deployment guide
   - Deploy to Vercel or your hosting platform

---

## 📞 Support

If you encounter issues:

1. **Check Migration Logs**: Review the SQL Editor execution results
2. **Verify Project Access**: Ensure you have access to project `dfklqsdfycwjlcasfciu`
3. **Review Documentation**: Check `MIGRATION_COMPLETE_GUIDE.md` for detailed information
4. **Supabase Support**: Contact Supabase support if database access issues persist

---

**Migration File**: `CONSOLIDATED_MIGRATIONS.sql`  
**Project**: dfklqsdfycwjlcasfciu  
**Status**: ✅ Ready to Deploy  
**Last Updated**: January 2025

