# Fix RLS Performance Warnings

## Understanding the Warnings

The Supabase database linter is warning about **multiple permissive RLS policies** on certain tables. This happens when:

1. Multiple policies exist for the same role and action (e.g., SELECT)
2. All policies are permissive (not restrictive)
3. Each policy must be evaluated for every query, impacting performance

## Current Warnings

The warnings are for **`technosoluce_`** tables (CyberSoluce project), not our `cc_privacy_` tables:

- `public.technosoluce_sbom_library` - Multiple policies for INSERT and SELECT
- `public.technosoluce_subscriptions` - Multiple policies for SELECT

## Solution

### For Privacy Risk Radar Migration

✅ **Already Fixed**: The Privacy Risk Radar migration now uses `DROP POLICY IF EXISTS` before creating policies to prevent conflicts.

### For TechnoSoluce Tables (If You Have Access)

To fix the `technosoluce_` table warnings, you need to consolidate multiple policies into single policies. Here's an example:

**Before (Multiple Policies - Causes Warning):**
```sql
-- Policy 1
CREATE POLICY "TechnoSoluce SBOM Library public read access"
  ON technosoluce_sbom_library
  FOR SELECT
  TO anon
  USING (true);

-- Policy 2 (Duplicate for same role/action)
CREATE POLICY "TechnoSoluce SBOM Library service role full access"
  ON technosoluce_sbom_library
  FOR SELECT
  TO anon
  USING (true);
```

**After (Single Policy - No Warning):**
```sql
-- Drop both policies
DROP POLICY IF EXISTS "TechnoSoluce SBOM Library public read access" ON technosoluce_sbom_library;
DROP POLICY IF EXISTS "TechnoSoluce SBOM Library service role full access" ON technosoluce_sbom_library;

-- Create single consolidated policy
CREATE POLICY "TechnoSoluce SBOM Library access"
  ON technosoluce_sbom_library
  FOR SELECT
  TO anon
  USING (true);
```

## Best Practices

1. **One Policy Per Role/Action**: Only create one policy per role and action combination
2. **Use DROP IF EXISTS**: Always drop existing policies before creating new ones in migrations
3. **Consolidate Logic**: If you need multiple conditions, combine them in a single policy using `OR` or `AND`

## Privacy Risk Radar Migration

The Privacy Risk Radar migration is now safe and follows best practices:

- ✅ Uses `DROP POLICY IF EXISTS` before creating policies
- ✅ Only creates one policy per role/action combination
- ✅ Won't cause multiple permissive policy warnings

## Verification

After running the Privacy Risk Radar migration, verify there are no warnings:

```sql
-- Check policies on our table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'cc_privacy_risk_detections'
ORDER BY cmd, roles;
```

You should see exactly 4 policies (one for each action: SELECT, INSERT, UPDATE, DELETE) for the `authenticated` role.

---

**Note**: The `technosoluce_` table warnings are from a different project (CyberSoluce) and don't affect the Privacy Risk Radar functionality. If you have access to fix those, follow the consolidation pattern above.

