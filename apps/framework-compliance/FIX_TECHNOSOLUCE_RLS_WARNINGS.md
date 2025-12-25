# Fix TechnoSoluce RLS Performance Warnings

## Overview

This migration fixes the RLS performance warnings for `technosoluce_` tables (CyberSoluce project) that share the same Supabase instance.

## Warnings Fixed

### technosoluce_sbom_library
- **Issue**: Multiple permissive policies for roles: `anon`, `authenticated`, `authenticator`, `cli_login_postgres`, `dashboard_user`
- **Actions**: INSERT, SELECT
- **Fix**: Consolidates into single policies per role/action

### technosoluce_subscriptions
- **Issue**: Multiple permissive policies for roles: `anon`, `authenticated`, `authenticator`, `cli_login_postgres`, `dashboard_user`
- **Actions**: SELECT
- **Fix**: Consolidates into single policies per role/action

## How to Run

### Step 1: Open Supabase Dashboard
1. Go to: https://app.supabase.com
2. Login and select project: **achowlksgmwuvfbvjfrt**

### Step 2: Open SQL Editor
1. Click **SQL Editor** in left sidebar
2. Click **New query**

### Step 3: Copy Migration SQL
1. Open: `apps/framework-compliance/supabase/migrations/20250220000002_fix_rls_performance_technosoluce.sql`
2. Select all (Ctrl+A)
3. Copy (Ctrl+C)

### Step 4: Paste and Run
1. Paste into SQL Editor (Ctrl+V)
2. Click **Run** (or press Ctrl+Enter)
3. Wait for "Success" message

### Step 5: Verify
Run this query to check policies:

```sql
-- Check policies on technosoluce tables
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename LIKE 'technosoluce_%'
ORDER BY tablename, roles, cmd;
```

You should see only **one policy per role/action combination**.

## What Gets Fixed

### Before (Multiple Policies - Causes Warning)
```sql
-- Policy 1
CREATE POLICY "TechnoSoluce SBOM Library public read access"
  ON technosoluce_sbom_library FOR SELECT TO anon USING (true);

-- Policy 2 (Duplicate - causes warning)
CREATE POLICY "TechnoSoluce SBOM Library service role full access"
  ON technosoluce_sbom_library FOR SELECT TO anon USING (true);
```

### After (Single Policy - No Warning)
```sql
-- Only one policy per role/action
CREATE POLICY "TechnoSoluce SBOM Library anon select"
  ON technosoluce_sbom_library FOR SELECT TO anon USING (true);
```

## Important Notes

1. **Service Role**: Service role policies are removed because service role bypasses RLS automatically - no policy needed
2. **Public Access**: The `anon` role policies maintain public read/insert access as needed
3. **User Access**: The `authenticated` role policies maintain user-based access

## Safety

- ✅ Uses `DROP POLICY IF EXISTS` - safe to run multiple times
- ✅ Only affects `technosoluce_` tables
- ✅ Checks for table existence before fixing
- ✅ Maintains same security level (just consolidates policies)

---

**Time Required**: 1 minute  
**Risk**: Low (only consolidates existing policies)  
**Impact**: Removes all RLS performance warnings for TechnoSoluce tables

