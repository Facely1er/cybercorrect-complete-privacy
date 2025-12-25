# Run RLS Performance Fix Migration

## Overview

This migration fixes RLS performance warnings by ensuring all `cc_privacy_` tables have **single RLS policies** per role/action combination. This prevents "multiple permissive policies" warnings and improves query performance.

## What This Fixes

- ✅ Removes duplicate policies that cause performance warnings
- ✅ Consolidates multiple policies into single policies per role/action
- ✅ Uses optimized `(select auth.uid())` pattern for better performance
- ✅ Applies to all `cc_privacy_` tables

## Tables Fixed

1. `cc_privacy_risk_detections` (only if table exists - created by Privacy Risk Radar migration)
2. `cc_privacy_consent_records`
3. `cc_privacy_vendor_assessments`
4. `cc_privacy_retention_policies`
5. `cc_privacy_data_records`
6. `cc_privacy_dpias`
7. `cc_privacy_privacy_by_design_assessments`
8. `cc_privacy_service_providers`
9. `cc_privacy_privacy_incidents`
10. `cc_privacy_subscriptions`
11. `cc_privacy_subscription_history`
12. `cc_privacy_payment_methods`
13. `cc_privacy_invoices`
14. `cc_one_time_purchases`

## Prerequisites

⚠️ **Important:** If you want to fix `cc_privacy_risk_detections`, run the Privacy Risk Radar migration first:
- File: `20250220000000_privacy_risk_radar.sql`
- This creates the `cc_privacy_risk_detections` table

**Note:** The RLS fix migration will skip `cc_privacy_risk_detections` if the table doesn't exist, so it's safe to run even without the Privacy Risk Radar migration.

## How to Run

### Step 1: Open Supabase Dashboard
1. Go to: https://app.supabase.com
2. Login and select project: **achowlksgmwuvfbvjfrt**

### Step 2: Open SQL Editor
1. Click **SQL Editor** in left sidebar
2. Click **New query**

### Step 3: Copy Migration SQL
1. Open: `apps/framework-compliance/supabase/migrations/20250220000001_fix_rls_performance_cc_privacy.sql`
2. Select all (Ctrl+A)
3. Copy (Ctrl+C)

### Step 4: Paste and Run
1. Paste into SQL Editor (Ctrl+V)
2. Click **Run** (or press Ctrl+Enter)
3. Wait for "Success" message (30-60 seconds)

### Step 5: Verify
Run this query to check for any remaining multiple policies:

```sql
-- Check for tables with multiple policies per role/action
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  COUNT(*) OVER (PARTITION BY schemaname, tablename, roles, cmd) as policy_count
FROM pg_policies
WHERE tablename LIKE 'cc_privacy_%' OR tablename LIKE 'cc_one_time_%'
ORDER BY tablename, roles, cmd, policy_count DESC;
```

You should see `policy_count = 1` for all entries (one policy per role/action).

## What Gets Fixed

### Before (Multiple Policies - Causes Warning)
```sql
-- Policy 1
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

-- Policy 2 (Duplicate - causes warning)
CREATE POLICY "Service role can manage all subscriptions"
  ON cc_privacy_subscriptions FOR SELECT
  TO authenticated USING (true);
```

### After (Single Policy - No Warning)
```sql
-- Only one policy per role/action
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);
```

## Performance Benefits

1. **Faster Queries**: Only one policy evaluated per query instead of multiple
2. **No Warnings**: Eliminates Supabase linter warnings
3. **Optimized Pattern**: Uses `(select auth.uid())` for better performance at scale
4. **Cleaner Schema**: Single policy per role/action is easier to maintain

## Safety

- ✅ Uses `DROP POLICY IF EXISTS` - safe to run multiple times
- ✅ Only affects `cc_privacy_` and `cc_one_time_` tables
- ✅ Won't break existing functionality
- ✅ All policies maintain same security (user-based access)

## Notes

- This migration removes "Service role" policies that were causing conflicts
- Service role operations should use service role key directly (bypasses RLS)
- All user-facing operations maintain proper security with user-based policies

---

**Time Required**: 1-2 minutes  
**Risk**: Low (only consolidates existing policies)  
**Impact**: Improves performance and removes linter warnings

