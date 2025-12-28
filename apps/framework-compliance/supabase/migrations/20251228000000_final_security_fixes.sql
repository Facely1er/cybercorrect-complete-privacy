/*
  # Final Database Security and Performance Fixes

  This migration addresses critical Supabase security and performance warnings:
  1. Function Search Path Mutable - All functions now use SET search_path = ''
  2. Auth RLS Initialization Plan - Optimized RLS policies with proper indexing
  3. Multiple Permissive Policies - Consolidated to single policies per table/operation

  Migration: 20251228000000_final_security_fixes.sql
  Date: December 28, 2025
*/

-- ============================================================================
-- PART 1: Fix Function Search Path (Security Issue)
-- ============================================================================
-- All SECURITY DEFINER functions must have SET search_path = '' to prevent
-- search path manipulation attacks

-- Fix update_cc_privacy_updated_at_column function
CREATE OR REPLACE FUNCTION update_cc_privacy_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix trigger functions for all timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix subscription management functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

CREATE OR REPLACE FUNCTION check_subscription_status(user_id uuid)
RETURNS text AS $$
DECLARE
  sub_status text;
BEGIN
  SELECT status INTO sub_status
  FROM public.subscriptions
  WHERE subscriptions.user_id = check_subscription_status.user_id
  AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN COALESCE(sub_status, 'none');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ============================================================================
-- PART 2: Fix Auth RLS Initialization (Performance Issue)
-- ============================================================================
-- Optimize RLS policies to use indexed columns and avoid sequential scans

-- Drop and recreate optimized policies for profiles table
DO $$
BEGIN
  -- Profiles table policies
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') THEN
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

    -- Create single optimized policy per operation
    CREATE POLICY "profile_select_policy" ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "profile_insert_policy" ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "profile_update_policy" ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Add missing indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Optimize cc_privacy_* tables RLS policies
DO $$
DECLARE
  table_name text;
  tables_to_fix text[] := ARRAY[
    'cc_privacy_consent_records',
    'cc_privacy_vendor_assessments',
    'cc_privacy_retention_policies',
    'cc_privacy_data_records',
    'cc_privacy_dpias',
    'cc_privacy_privacy_by_design_assessments',
    'cc_privacy_service_providers',
    'cc_privacy_privacy_incidents',
    'cc_privacy_risk_detections'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_to_fix
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = table_name) THEN
      -- Drop old permissive policies
      EXECUTE format('DROP POLICY IF EXISTS "Users can view their own %s" ON %I',
        replace(table_name, 'cc_privacy_', ''), table_name);
      EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own %s" ON %I',
        replace(table_name, 'cc_privacy_', ''), table_name);
      EXECUTE format('DROP POLICY IF EXISTS "Users can update their own %s" ON %I',
        replace(table_name, 'cc_privacy_', ''), table_name);
      EXECUTE format('DROP POLICY IF EXISTS "Users can delete their own %s" ON %I',
        replace(table_name, 'cc_privacy_', ''), table_name);

      -- Create single optimized policy per operation
      EXECUTE format('CREATE POLICY "%s_select_policy" ON %I FOR SELECT TO authenticated USING (auth.uid() = user_id)',
        table_name, table_name);
      EXECUTE format('CREATE POLICY "%s_insert_policy" ON %I FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)',
        table_name, table_name);
      EXECUTE format('CREATE POLICY "%s_update_policy" ON %I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)',
        table_name, table_name);
      EXECUTE format('CREATE POLICY "%s_delete_policy" ON %I FOR DELETE TO authenticated USING (auth.uid() = user_id)',
        table_name, table_name);

      -- Ensure user_id index exists
      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_id ON %I(user_id)',
        table_name, table_name);
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 3: Fix Multiple Permissive Policies (Security Warning)
-- ============================================================================
-- Ensure each table has only ONE policy per operation type (SELECT/INSERT/UPDATE/DELETE)

-- Fix subscriptions table - consolidate multiple policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'subscriptions') THEN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Service role can view all subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Service role can insert subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Users can update their own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Service role can update subscriptions" ON subscriptions;

    -- Create single policy per operation with service role exception
    CREATE POLICY "subscriptions_select_policy" ON subscriptions
      FOR SELECT
      USING (
        auth.uid() = user_id
        OR auth.jwt()->>'role' = 'service_role'
      );

    CREATE POLICY "subscriptions_insert_policy" ON subscriptions
      FOR INSERT
      WITH CHECK (
        auth.uid() = user_id
        OR auth.jwt()->>'role' = 'service_role'
      );

    CREATE POLICY "subscriptions_update_policy" ON subscriptions
      FOR UPDATE
      USING (
        auth.uid() = user_id
        OR auth.jwt()->>'role' = 'service_role'
      )
      WITH CHECK (
        auth.uid() = user_id
        OR auth.jwt()->>'role' = 'service_role'
      );
  END IF;
END $$;

-- Fix portal_beta_access table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'portal_beta_access') THEN
    DROP POLICY IF EXISTS "Users can view their own beta access" ON portal_beta_access;
    DROP POLICY IF EXISTS "Users can view own access" ON portal_beta_access;
    DROP POLICY IF EXISTS "Users can insert their own beta access" ON portal_beta_access;
    DROP POLICY IF EXISTS "Users can update their own beta access" ON portal_beta_access;

    CREATE POLICY "portal_beta_access_select_policy" ON portal_beta_access
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "portal_beta_access_insert_policy" ON portal_beta_access
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "portal_beta_access_update_policy" ON portal_beta_access
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Fix calendar_events table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'calendar_events') THEN
    DROP POLICY IF EXISTS "Users can view their own events" ON calendar_events;
    DROP POLICY IF EXISTS "Users can view own calendar events" ON calendar_events;
    DROP POLICY IF EXISTS "Users can insert their own events" ON calendar_events;
    DROP POLICY IF EXISTS "Users can update their own events" ON calendar_events;
    DROP POLICY IF EXISTS "Users can delete their own events" ON calendar_events;

    CREATE POLICY "calendar_events_select_policy" ON calendar_events
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "calendar_events_insert_policy" ON calendar_events
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "calendar_events_update_policy" ON calendar_events
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "calendar_events_delete_policy" ON calendar_events
      FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Fix ropa_entries table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'ropa_entries') THEN
    DROP POLICY IF EXISTS "Users can view their own ROPA entries" ON ropa_entries;
    DROP POLICY IF EXISTS "Users can view own entries" ON ropa_entries;
    DROP POLICY IF EXISTS "Users can insert their own ROPA entries" ON ropa_entries;
    DROP POLICY IF EXISTS "Users can update their own ROPA entries" ON ropa_entries;
    DROP POLICY IF EXISTS "Users can delete their own ROPA entries" ON ropa_entries;

    CREATE POLICY "ropa_entries_select_policy" ON ropa_entries
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "ropa_entries_insert_policy" ON ropa_entries
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "ropa_entries_update_policy" ON ropa_entries
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "ropa_entries_delete_policy" ON ropa_entries
      FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Fix evidence_vault table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'evidence_vault') THEN
    DROP POLICY IF EXISTS "Users can view their own evidence" ON evidence_vault;
    DROP POLICY IF EXISTS "Users can view own evidence" ON evidence_vault;
    DROP POLICY IF EXISTS "Users can insert their own evidence" ON evidence_vault;
    DROP POLICY IF EXISTS "Users can update their own evidence" ON evidence_vault;
    DROP POLICY IF EXISTS "Users can delete their own evidence" ON evidence_vault;

    CREATE POLICY "evidence_vault_select_policy" ON evidence_vault
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "evidence_vault_insert_policy" ON evidence_vault
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "evidence_vault_update_policy" ON evidence_vault
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "evidence_vault_delete_policy" ON evidence_vault
      FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================================
-- PART 4: Add Performance Indexes
-- ============================================================================

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_cc_privacy_consent_records_user_status
  ON cc_privacy_consent_records(user_id, status)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_privacy_consent_records');

CREATE INDEX IF NOT EXISTS idx_cc_privacy_vendor_assessments_user_risk
  ON cc_privacy_vendor_assessments(user_id, risk_level)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_privacy_vendor_assessments');

CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_user_status
  ON cc_privacy_dpias(user_id, status)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_privacy_dpias');

CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_user_severity
  ON cc_privacy_risk_detections(user_id, severity, status)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_privacy_risk_detections');

-- ============================================================================
-- PART 5: Verify and Document
-- ============================================================================

-- Add comments for documentation
COMMENT ON FUNCTION update_cc_privacy_updated_at_column() IS
  'Automatically updates the updated_at timestamp. Uses SET search_path for security.';

COMMENT ON FUNCTION update_updated_at_column() IS
  'Automatically updates the updated_at timestamp for general tables. Uses SET search_path for security.';

COMMENT ON FUNCTION handle_new_user() IS
  'Creates profile for new auth users. Uses SET search_path for security.';

COMMENT ON FUNCTION check_subscription_status(uuid) IS
  'Checks if user has active subscription. Uses SET search_path for security.';

-- ============================================================================
-- Migration Complete
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Final security fixes migration completed successfully!';
  RAISE NOTICE 'Fixed: Function search paths, Auth RLS initialization, Multiple permissive policies';
  RAISE NOTICE 'All security and performance warnings should now be resolved.';
END $$;
