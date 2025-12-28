# Database Migration Order

## ⚠️ Important: Run Migrations in This Order

### Step 1: Privacy Risk Radar Migration (If Needed)
**File:** `20250220000000_privacy_risk_radar.sql`

**Run this FIRST** if you want to use the Privacy Risk Radar feature.

This creates the `cc_privacy_risk_detections` table.

### Step 2: RLS Performance Fix Migration
**File:** `20250220000001_fix_rls_performance_cc_privacy.sql`

**Run this AFTER** the Privacy Risk Radar migration (or skip if you don't need Privacy Risk Radar).

This fixes RLS performance warnings for all `cc_privacy_` tables.

**Note:** The migration will skip `cc_privacy_risk_detections` if the table doesn't exist yet.

---

## Quick Start

### Option A: With Privacy Risk Radar

1. Run `20250220000000_privacy_risk_radar.sql` first
2. Then run `20250220000001_fix_rls_performance_cc_privacy.sql`

### Option B: Without Privacy Risk Radar

1. Skip `20250220000000_privacy_risk_radar.sql`
2. Run `20250220000001_fix_rls_performance_cc_privacy.sql` (it will skip the risk_detections table)

---

## Error: Table Does Not Exist

If you see: `ERROR: relation "cc_privacy_risk_detections" does not exist`

**Solution:** 
- Either run the Privacy Risk Radar migration first, OR
- The RLS fix migration has been updated to skip missing tables automatically

---

## All Other Tables

The RLS fix migration will work on all other `cc_privacy_` tables regardless of whether the Privacy Risk Radar table exists.

