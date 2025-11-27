# CyberCorrect Privacy Platform - Database Schema Summary

## Overview

This document summarizes the database schema for the CyberCorrect Privacy Platform. All tables use the `cc_privacy_` prefix to differentiate from other projects in the same Supabase instance and avoid naming conflicts.

---

## Schema Prefix: `cc_privacy_`

**Why**: To avoid conflicts with other projects in the same Supabase instance.

**All tables follow this pattern**: `cc_privacy_<table_name>`

---

## Tables Created

### 1. `cc_privacy_consent_records`
**Purpose**: Consent Management data
**Key Fields**:
- `employee_name`, `employee_id`
- `consent_type`, `service_provider`
- `status`, `consent_given`
- `consent_date`, `withdrawal_date`, `expiry_date`
- `applicable_regulations` (array)

**Indexes**: `user_id`, `status`, `consent_type`, `created_at`

---

### 2. `cc_privacy_vendor_assessments`
**Purpose**: Vendor Risk Assessment data
**Key Fields**:
- `vendor_name`, `service_description`
- `risk_level`, `compliance_status`
- `assessment_score` (0-100)
- `contract_start_date`, `contract_end_date`
- `data_types_processed` (array)
- `security_certifications` (array)

**Indexes**: `user_id`, `risk_level`, `compliance_status`, `next_assessment_due`

---

### 3. `cc_privacy_retention_policies`
**Purpose**: Retention Policy Generator data
**Key Fields**:
- `name`, `description`, `data_category`
- `retention_period`, `legal_basis`
- `retention_start`, `retention_end`
- `disposal_method`
- `status`, `compliance_status`
- `exceptions` (array)

**Indexes**: `user_id`, `status`, `next_review`, `data_category`

---

### 4. `cc_privacy_data_records`
**Purpose**: Data records linked to retention policies
**Key Fields**:
- `data_type`, `data_category`, `subject`
- `retention_policy_id` (foreign key)
- `retention_end_date`
- `status`, `disposal_method`
- `sensitivity`

**Indexes**: `user_id`, `status`, `retention_policy_id`, `retention_end_date`

---

### 5. `cc_privacy_dpias`
**Purpose**: DPIA Manager data
**Key Fields**:
- `title`, `description`, `processing_activity`
- `status`, `priority`, `risk_level`
- `data_subjects` (array)
- `data_types` (array)
- `risks` (JSONB)
- `measures` (JSONB)
- `consultation` (JSONB)
- `approval` (JSONB)

**Indexes**: `user_id`, `status`, `priority`, `risk_level`, `due_date`

---

### 6. `cc_privacy_privacy_by_design_assessments`
**Purpose**: Privacy by Design Assessment data
**Key Fields**:
- `name`, `description`
- `system_type`
- `status`, `compliance_status`
- `overall_score` (0-100)
- `principles` (JSONB)
- `recommendations` (array)

**Indexes**: `user_id`, `status`, `compliance_status`, `next_review_date`

---

### 7. `cc_privacy_service_providers`
**Purpose**: Service Provider Manager data
**Key Fields**:
- `name`, `description`, `category`
- `status`, `priority`
- `data_volume`, `data_sensitivity`
- `contact_info` (JSONB)
- `agreement` (JSONB)
- `compliance` (JSONB)
- `security` (JSONB)
- `data_processing` (JSONB)
- `risk_assessment` (JSONB)
- `monitoring` (JSONB)
- `incidents` (JSONB)
- `costs` (JSONB)

**Indexes**: `user_id`, `status`, `category`, `priority`

---

### 8. `cc_privacy_privacy_incidents`
**Purpose**: Incident Response Manager data
**Key Fields**:
- `title`, `description`
- `type`, `severity`, `status`
- `reported_date`, `detected_date`
- `affected_data_subjects`
- `affected_data_types` (array)
- `regulatory_notifications` (JSONB)
- `data_subject_notifications` (JSONB)
- `lessons_learned` (array)
- `preventive_measures` (array)

**Indexes**: `user_id`, `status`, `type`, `severity`, `reported_date`

---

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that:
- Allow users to view only their own records
- Allow users to insert only their own records
- Allow users to update only their own records
- Allow users to delete only their own records

### Foreign Keys
- All tables reference `auth.users(id)` via `user_id`
- `cc_privacy_data_records` references `cc_privacy_retention_policies(id)`
- All foreign keys use `ON DELETE CASCADE` for user_id
- Data records use `ON DELETE SET NULL` for retention_policy_id

### Data Validation
- CHECK constraints on enum fields (status, type, severity, etc.)
- Numeric ranges (scores 0-100)
- Array fields default to empty arrays
- JSONB fields default to empty objects

---

## Performance Optimizations

### Indexes Created
Each table has indexes on:
- `user_id` (for RLS filtering)
- Status/enum fields (for filtering)
- Date fields (for sorting and filtering)
- Foreign keys (for joins)

**Total Indexes**: 32 indexes across 8 tables

### Triggers
- `updated_at` timestamp automatically updated on row changes
- Trigger function: `update_cc_privacy_updated_at_column()`

---

## Migration File

**File**: `supabase/migrations/20250202000000_privacy_tools_schema.sql`

**To Apply**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the migration file content
3. Run the migration
4. Verify tables are created
5. Verify RLS policies are active

---

## Table Relationships

```
auth.users
  └── cc_privacy_consent_records (user_id)
  └── cc_privacy_vendor_assessments (user_id)
  └── cc_privacy_retention_policies (user_id)
  └── cc_privacy_data_records (user_id)
  └── cc_privacy_dpias (user_id)
  └── cc_privacy_privacy_by_design_assessments (user_id)
  └── cc_privacy_service_providers (user_id)
  └── cc_privacy_privacy_incidents (user_id)

cc_privacy_retention_policies
  └── cc_privacy_data_records (retention_policy_id)
```

---

## Naming Conventions

### Tables
- Prefix: `cc_privacy_`
- Format: `cc_privacy_<snake_case>`
- Example: `cc_privacy_consent_records`

### Columns
- Format: `snake_case`
- Examples: `user_id`, `created_at`, `updated_at`

### Indexes
- Format: `idx_cc_privacy_<table>_<column>`
- Example: `idx_cc_privacy_consent_records_user_id`

### Policies
- Format: `"Users can <action> their own <table>"`
- Example: `"Users can view their own consent records"`

### Functions
- Format: `update_cc_privacy_<table>_updated_at`
- Example: `update_cc_privacy_consent_records_updated_at`

---

## Data Types Used

### Standard Types
- `uuid` - Primary keys and foreign keys
- `text` - String fields
- `date` - Date fields (without time)
- `timestamptz` - Timestamp with timezone
- `boolean` - Boolean fields
- `integer` - Integer fields
- `numeric(5,2)` - Decimal scores (0-100)

### Array Types
- `text[]` - Arrays of strings
- Default: `'{}'` (empty array)

### JSON Types
- `jsonb` - JSON objects
- Default: `'{}'` (empty object) or `'[]'` (empty array)

---

## Migration Order

1. ✅ `20250130000000_improve_security.sql` (existing)
2. ✅ `20250201000000_subscription_features.sql` (existing)
3. ⚠️ `20250201000001_cron_jobs.sql` (existing, needs pg_cron)
4. ✅ `20250202000000_privacy_tools_schema.sql` (NEW - this migration)

---

## Verification Checklist

After applying the migration:

- [ ] All 8 tables created
- [ ] RLS enabled on all tables
- [ ] All RLS policies created (32 policies)
- [ ] All indexes created (32 indexes)
- [ ] All triggers created (8 triggers)
- [ ] Foreign keys working correctly
- [ ] Test insert/update/delete with authenticated user
- [ ] Test RLS policies (users can only see their own data)

---

## Notes

1. **Differentiated Schema**: All tables use `cc_privacy_` prefix to avoid conflicts
2. **Privacy by Design**: Data is isolated per user via RLS policies
3. **Performance**: Indexes on all frequently queried fields
4. **Data Integrity**: Foreign keys and CHECK constraints ensure data quality
5. **Audit Trail**: `created_at` and `updated_at` timestamps on all tables

---

**Last Updated**: 2025-02-02
**Migration File**: `20250202000000_privacy_tools_schema.sql`
**Status**: Ready to apply

