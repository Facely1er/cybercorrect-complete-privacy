# Complete Database Migration Guide

**Last Updated**: December 17, 2025  
**Purpose**: Step-by-step guide to apply all database migrations for CyberCorrect Privacy Platform

---

## Overview

This guide will help you apply all database migrations to set up the complete database schema for the CyberCorrect Privacy Platform. The migrations create:

- **8 Privacy Tools Tables** (consent, vendors, retention, DPIA, etc.)
- **Subscription Management Tables** (subscriptions, invoices, payment methods)
- **One-Time Purchase Tables** (license keys, purchase history)
- **Calendar & Events** (compliance deadlines)
- **RoPA & Evidence Vault** (data processing records, evidence storage)
- **Portal Beta Tables** (beta program management)
- **Automation Tables** (reports, assessments, alerts, regulatory updates)

**Total**: 20+ tables with indexes, RLS policies, triggers, and functions

---

## Prerequisites

Before starting, ensure you have:

1. ✅ **Supabase Project Access**
   - Your Supabase project URL (from `VITE_SUPABASE_URL`)
   - Access to Supabase Dashboard: https://app.supabase.com
   - SQL Editor permissions

2. ✅ **Environment Variables Set**
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

3. ✅ **Backup (Recommended)**
   - If you have existing data, create a backup first
   - Go to Supabase Dashboard → Database → Backups

---

## Method 1: Apply All Migrations at Once (Recommended)

This is the fastest method - applies all migrations in a single operation.

### Step 1: Generate Combined Migration File

```bash
cd apps/framework-compliance
npm run migrate:generate
```

This creates `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql` with all migrations in order.

### Step 2: Open Supabase Dashboard

1. Go to: https://app.supabase.com
2. Login to your account
3. Select your project (use project ID from `VITE_SUPABASE_URL`)

### Step 3: Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click **New query** button

### Step 4: Apply Migration

1. Open file: `apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
2. **Copy ALL content** (Ctrl+A, Ctrl+C)
3. **Paste into SQL Editor** (Ctrl+V)
4. Click **Run** button (or press `Ctrl+Enter`)
5. Wait for "Success" message (may take 30-60 seconds)

### Step 5: Verify Migration

```bash
npm run verify:migrations
```

Or manually check in Supabase Dashboard:
1. Go to **Table Editor**
2. Verify these tables exist:
   - `cc_privacy_consent_records`
   - `cc_privacy_vendor_assessments`
   - `cc_privacy_retention_policies`
   - `cc_privacy_data_records`
   - `cc_privacy_dpias`
   - `cc_privacy_privacy_by_design_assessments`
   - `cc_privacy_service_providers`
   - `cc_privacy_privacy_incidents`
   - `cc_privacy_subscriptions`
   - `cc_one_time_purchases`
   - And more...

---

## Method 2: Apply Migrations Individually

If you prefer to apply migrations one at a time (for better error tracking):

### Migration Order

Apply migrations in this exact order:

1. ✅ `20250130000000_improve_security.sql`
2. ✅ `20250201000000_subscription_features.sql`
3. ⚠️ `20250201000001_cron_jobs.sql` (Optional - requires pg_cron extension)
4. ✅ `20250202000000_privacy_tools_schema.sql` ⭐ **CRITICAL**
5. ✅ `20250202000001_subscriptions.sql`
6. ✅ `20250202000002_fix_function_search_path.sql`
7. ✅ `20250202000003_fix_rls_performance.sql`
8. ✅ `20250202000004_combined_fixes.sql`
9. ✅ `20250203000000_calendar_events.sql`
10. ✅ `20250204000000_ropa_and_evidence_tables.sql`
11. ✅ `20250218000000_portal_beta_schema.sql`
12. ✅ `20250729162343_orange_band.sql`
13. ✅ `20251217000000_one_time_purchases.sql` ⭐ **LATEST**

### Steps for Each Migration

For each migration file:

1. Open `apps/framework-compliance/supabase/migrations/[filename].sql`
2. Copy ALL SQL content
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Wait for "Success" message
6. Move to next migration

---

## Expected Results

After successful migration, you should have:

### Tables Created (20+)

**Privacy Tools:**
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_data_records`
- `cc_privacy_dpias`
- `cc_privacy_privacy_by_design_assessments`
- `cc_privacy_service_providers`
- `cc_privacy_privacy_incidents`

**Subscriptions:**
- `cc_privacy_subscriptions`
- `cc_privacy_subscription_history`
- `cc_privacy_payment_methods`
- `cc_privacy_invoices`

**One-Time Purchases:**
- `cc_one_time_purchases`

**Calendar & Events:**
- `cc_privacy_calendar_events`

**RoPA & Evidence:**
- `cc_privacy_ropa_records`
- `cc_privacy_evidence_vault`

**Portal Beta:**
- `portal_beta_applications`

**Automation:**
- `automated_reports`
- `compliance_health_scores`
- `scheduled_assessments`
- `alert_rules`
- `regulatory_updates`

### Security Features

- ✅ **RLS Enabled** on all tables
- ✅ **RLS Policies** for user-based access control
- ✅ **Indexes** on all frequently queried columns
- ✅ **Triggers** for automatic timestamp updates
- ✅ **Foreign Keys** with proper cascade rules

---

## Troubleshooting

### Error: "relation already exists"

**Solution**: This means the table already exists. The migration uses `CREATE TABLE IF NOT EXISTS`, so this is safe to ignore. The migration will continue.

### Error: "permission denied"

**Solution**: 
- Make sure you're using the **SQL Editor** (which has admin privileges)
- Not a regular query or API call
- Verify you have admin access to the project

### Error: "function already exists"

**Solution**: Some functions may have been created before. The migration uses `CREATE OR REPLACE FUNCTION`, so this should be handled automatically. If errors persist, you can manually drop and recreate:

```sql
DROP FUNCTION IF EXISTS function_name CASCADE;
```

### Error: "policy already exists"

**Solution**: Policies may have been created before. You can drop and recreate:

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

Then re-run the CREATE POLICY statement from the migration.

### Error: "extension pg_cron is not available"

**Solution**: The `cron_jobs` migration requires the `pg_cron` extension, which may require a Pro plan. You can:
- Skip this migration (it's optional)
- Upgrade to Supabase Pro plan
- Or comment out the cron-related sections

### Migration Takes Too Long

**Solution**: 
- Large migrations can take 30-60 seconds
- Be patient and wait for completion
- Don't refresh or close the SQL Editor
- Check Supabase Dashboard for any background processes

### Tables Not Showing After Migration

**Solution**:
1. **Refresh** the Table Editor (click refresh button)
2. Check you're looking at the **public** schema
3. Verify migration completed successfully (check SQL Editor history)
4. Run verification script: `npm run verify:migrations`

---

## Verification Checklist

After applying migrations, verify:

- [ ] All expected tables exist (check Table Editor)
- [ ] RLS is enabled on all tables (check table settings)
- [ ] Indexes are created (check table structure)
- [ ] Can insert test data (with authenticated user)
- [ ] RLS policies work (users can only see their own data)
- [ ] Foreign keys work correctly
- [ ] Triggers update `updated_at` automatically

### Quick Verification Script

```bash
cd apps/framework-compliance
npm run verify:migrations
```

This will check all expected tables and report any missing ones.

---

## Post-Migration Steps

After successful migration:

1. ✅ **Verify Tables**: Run `npm run verify:migrations`
2. ⏭️ **Configure Edge Functions**: See `docs/setup-supabase.md`
3. ⏭️ **Configure Stripe**: See `docs/STRIPE_SETUP_COMPLETE.md`
4. ⏭️ **Set Environment Variables**: See `docs/ENV_SETUP_GUIDE.md`
5. ⏭️ **Test Features**: Test creating records in each tool

---

## Migration Files Reference

All migration files are located in:
```
apps/framework-compliance/supabase/migrations/
```

Key files:
- `ALL_MIGRATIONS_COMBINED.sql` - All migrations in one file (auto-generated)
- `SCHEMA_SUMMARY.md` - Detailed schema documentation
- Individual migration files (20250130000000_*.sql, etc.)

---

## Support

If you encounter issues:

1. **Check Error Messages**: Read the full error in SQL Editor
2. **Check Migration Logs**: Review SQL Editor history
3. **Verify Credentials**: Ensure Supabase URL and keys are correct
4. **Check Supabase Status**: Visit https://status.supabase.com
5. **Review Documentation**: See `docs/APPLY_MIGRATIONS.md` for detailed instructions

---

## Summary

**Time Required**: 5-10 minutes  
**Difficulty**: Easy (copy-paste SQL)  
**Risk**: Low (uses `IF NOT EXISTS` clauses)  
**Rollback**: Can drop tables if needed (data will be lost)

**Recommended Approach**: Use Method 1 (combined migration) for fastest setup.

---

*Context improved by Giga AI - Used Main Overview describing core privacy compliance platform database schema and migration requirements*

