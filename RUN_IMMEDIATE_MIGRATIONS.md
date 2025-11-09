# Run Immediate Migrations - Step-by-Step Guide

## 🎯 Objective

Apply the two critical migrations to fix security and performance warnings in your Supabase database.

## ⏱️ Estimated Time: 10 minutes

---

## 📋 Prerequisites

- Access to Supabase Dashboard
- Project: **achowlksgmwuvfbvjfrt**
- SQL Editor access

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com
2. Select your project: **achowlksgmwuvfbvjfrt**
3. Navigate to: **SQL Editor** (left sidebar)
4. Click: **New query**

---

### Step 2: Run Function Search Path Migration

**Purpose**: Fixes 7 security warnings about mutable search_path in functions.

1. Open the file: `supabase/migrations/20250202000002_fix_function_search_path.sql`
2. **Copy ALL content** from the file
3. **Paste** into the SQL Editor
4. Click: **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. Wait for: ✅ **Success** message

**Expected Result**: 
- ✅ All 7 functions updated with `SET search_path = ''`
- ✅ No errors

---

### Step 3: Run RLS Performance Migration

**Purpose**: Fixes 64+ performance warnings about auth.uid() re-evaluation in RLS policies.

1. Open the file: `supabase/migrations/20250202000003_fix_rls_performance.sql`
2. **Copy ALL content** from the file
3. **Paste** into the SQL Editor (you can clear the previous query or use a new tab)
4. Click: **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. Wait for: ✅ **Success** message

**Expected Result**:
- ✅ All RLS policies updated with `(select auth.uid())`
- ✅ Multiple permissive policies fixed on `compliance_health_scores`
- ✅ No errors

---

### Step 4: Verify Migrations Applied

1. Go to: **Database** → **Migrations** (left sidebar)
2. Verify both migrations appear in the list:
   - `20250202000002_fix_function_search_path`
   - `20250202000003_fix_rls_performance`
3. Both should show: ✅ **Applied**

---

### Step 5: Verify Linter Warnings Resolved

1. Go to: **Database** → **Linter** (left sidebar)
2. Check for warnings:
   - **Function Search Path Mutable**: Should be 0 warnings
   - **Auth RLS Initialization Plan**: Should be 0 warnings
   - **Multiple Permissive Policies**: Should be 0 warnings

**Expected Result**: 
- ✅ All security warnings resolved
- ✅ All performance warnings resolved

---

## 🔍 Verification Checklist

After running both migrations, verify:

- [ ] Function search_path migration completed successfully
- [ ] RLS performance migration completed successfully
- [ ] Both migrations appear in Database → Migrations
- [ ] Database → Linter shows 0 warnings for:
  - [ ] Function Search Path Mutable
  - [ ] Auth RLS Initialization Plan
  - [ ] Multiple Permissive Policies

---

## ⚠️ Troubleshooting

### Error: "relation does not exist"

**Cause**: Migration trying to modify a table/function that doesn't exist yet.

**Solution**: 
- Check if you've run all previous migrations
- Run migrations in order:
  1. `20250130000000_improve_security.sql`
  2. `20250201000000_subscription_features.sql`
  3. `20250202000000_privacy_tools_schema.sql`
  4. `20250202000001_subscriptions.sql`
  5. Then run the fix migrations

### Error: "policy already exists"

**Cause**: Policy was already created by a previous migration.

**Solution**: 
- The migration uses `DROP POLICY IF EXISTS`, so this shouldn't happen
- If it does, the migration will still work (DROP then CREATE)

### Error: "function does not exist"

**Cause**: Function hasn't been created yet.

**Solution**: 
- Make sure you've run all previous migrations
- Functions are created in earlier migrations

---

## 📊 What Gets Fixed

### Security Fixes (Migration 1)

**7 Functions Fixed**:
1. `set_audit_fields`
2. `cleanup_anonymous_data`
3. `anonymize_user_data`
4. `update_updated_at_column` (multiple instances)
5. `cleanup_expired_notifications`
6. `update_cc_privacy_updated_at_column`
7. `create_subscription_history`

**Security Improvement**:
- All functions now have `SET search_path = ''`
- Prevents search path manipulation attacks
- Explicit schema qualification for security

### Performance Fixes (Migration 2)

**64+ RLS Policies Optimized**:
- All policies now use `(select auth.uid())` instead of `auth.uid()`
- Prevents re-evaluation for each row
- Improves query performance at scale

**Tables Fixed**:
- `notifications`
- `automated_reports`
- `compliance_health_scores` (also fixed multiple permissive policies)
- `scheduled_assessments`
- `alert_rules`
- `notification_preferences`
- All `cc_privacy_*` tables (8 tables)
- `cc_privacy_subscriptions`, `cc_privacy_subscription_history`, `cc_privacy_payment_methods`, `cc_privacy_invoices`
- `policy_generators` and `toolkit_analytics`

---

## ✅ Success Criteria

After completing both migrations:

1. ✅ **No security warnings** in Database → Linter
2. ✅ **No performance warnings** in Database → Linter
3. ✅ **All functions secured** with immutable search_path
4. ✅ **All RLS policies optimized** for performance
5. ✅ **Database ready** for production use

---

## 🎉 Next Steps

After completing these migrations:

1. **Configure Edge Function secrets** (15 minutes)
   - See: `EDGE_FUNCTIONS_DEPLOYED.md`

2. **Test Supabase connection** (15 minutes)
   - Run: `npm run dev`
   - Create a test record
   - Verify it saves to Supabase

3. **Optional: Configure external services**
   - Stripe (for payments)
   - SendGrid (for emails)
   - Sentry (for error monitoring)

---

## 📚 Related Documentation

- **Migration Files**: `supabase/migrations/`
- **Edge Functions**: `EDGE_FUNCTIONS_DEPLOYED.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Next Steps**: `NEXT_STEPS_AFTER_MIGRATIONS.md`

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Review the migration files for syntax errors
3. Check Supabase Dashboard → **Database** → **Logs** for detailed error messages
4. Verify all previous migrations have been applied

---

**Last Updated**: 2025-02-02
**Status**: Ready to run
**Estimated Time**: 10 minutes

