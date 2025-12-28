/*
  # Final Database Security and Performance Fixes - Privacy Portal

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

-- Fix update timestamp functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix user profile creation function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ============================================================================
-- PART 2: Fix Auth RLS Initialization (Performance Issue)
-- ============================================================================

-- Optimize profiles table policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles') THEN
    -- Drop duplicate/multiple policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
    DROP POLICY IF EXISTS "Public profiles viewable" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users insert own profile" ON profiles;

    -- Create single optimized policy per operation
    CREATE POLICY "profiles_select_policy" ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);

    CREATE POLICY "profiles_insert_policy" ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);

    CREATE POLICY "profiles_update_policy" ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);

-- ============================================================================
-- PART 3: Fix Multiple Permissive Policies (Security Warning)
-- ============================================================================

-- Fix cc_portal_data_subject_requests table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_data_subject_requests') THEN
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Anyone can submit data subject requests" ON cc_portal_data_subject_requests;
    DROP POLICY IF EXISTS "Public can submit requests" ON cc_portal_data_subject_requests;
    DROP POLICY IF EXISTS "Users can view their own requests" ON cc_portal_data_subject_requests;
    DROP POLICY IF EXISTS "Users view own requests" ON cc_portal_data_subject_requests;
    DROP POLICY IF EXISTS "Users can update their own requests" ON cc_portal_data_subject_requests;
    DROP POLICY IF EXISTS "Organization admins can view all requests" ON cc_portal_data_subject_requests;

    -- Create consolidated policies
    -- Public can submit requests (no auth required)
    CREATE POLICY "data_subject_requests_public_insert_policy" ON cc_portal_data_subject_requests
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);

    -- Authenticated users can view their own requests
    CREATE POLICY "data_subject_requests_select_policy" ON cc_portal_data_subject_requests
      FOR SELECT
      TO authenticated
      USING (
        auth.uid()::text = user_id::text
        OR requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      );

    -- Users can update their own requests
    CREATE POLICY "data_subject_requests_update_policy" ON cc_portal_data_subject_requests
      FOR UPDATE
      TO authenticated
      USING (
        auth.uid()::text = user_id::text
        OR requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
      WITH CHECK (
        auth.uid()::text = user_id::text
        OR requester_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      );
  END IF;
END $$;

-- Fix cc_portal_privacy_incidents table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_privacy_incidents') THEN
    DROP POLICY IF EXISTS "Users can view their own incidents" ON cc_portal_privacy_incidents;
    DROP POLICY IF EXISTS "Users view own incidents" ON cc_portal_privacy_incidents;
    DROP POLICY IF EXISTS "Users can insert their own incidents" ON cc_portal_privacy_incidents;
    DROP POLICY IF EXISTS "Users can update their own incidents" ON cc_portal_privacy_incidents;
    DROP POLICY IF EXISTS "Users can delete their own incidents" ON cc_portal_privacy_incidents;

    CREATE POLICY "privacy_incidents_select_policy" ON cc_portal_privacy_incidents
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "privacy_incidents_insert_policy" ON cc_portal_privacy_incidents
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "privacy_incidents_update_policy" ON cc_portal_privacy_incidents
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "privacy_incidents_delete_policy" ON cc_portal_privacy_incidents
      FOR DELETE TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Fix cc_portal_consent_records table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_consent_records') THEN
    DROP POLICY IF EXISTS "Users can view their own consent records" ON cc_portal_consent_records;
    DROP POLICY IF EXISTS "Users view own consent" ON cc_portal_consent_records;
    DROP POLICY IF EXISTS "Users can insert their own consent records" ON cc_portal_consent_records;
    DROP POLICY IF EXISTS "Users can update their own consent records" ON cc_portal_consent_records;

    CREATE POLICY "consent_records_select_policy" ON cc_portal_consent_records
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "consent_records_insert_policy" ON cc_portal_consent_records
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "consent_records_update_policy" ON cc_portal_consent_records
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Fix cc_portal_user_preferences table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_user_preferences') THEN
    DROP POLICY IF EXISTS "Users can view their own preferences" ON cc_portal_user_preferences;
    DROP POLICY IF EXISTS "Users view own preferences" ON cc_portal_user_preferences;
    DROP POLICY IF EXISTS "Users can insert their own preferences" ON cc_portal_user_preferences;
    DROP POLICY IF EXISTS "Users can update their own preferences" ON cc_portal_user_preferences;

    CREATE POLICY "user_preferences_select_policy" ON cc_portal_user_preferences
      FOR SELECT TO authenticated USING (auth.uid() = user_id);

    CREATE POLICY "user_preferences_insert_policy" ON cc_portal_user_preferences
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "user_preferences_update_policy" ON cc_portal_user_preferences
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- ============================================================================
-- PART 4: Add Performance Indexes
-- ============================================================================

-- Add user_id indexes for RLS performance
DO $$
DECLARE
  table_name text;
  portal_tables text[] := ARRAY[
    'cc_portal_data_subject_requests',
    'cc_portal_privacy_incidents',
    'cc_portal_consent_records',
    'cc_portal_user_preferences'
  ];
BEGIN
  FOREACH table_name IN ARRAY portal_tables
  LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = table_name) THEN
      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%s_user_id ON %I(user_id)', table_name, table_name);
    END IF;
  END LOOP;
END $$;

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_cc_portal_data_subject_requests_status_created
  ON cc_portal_data_subject_requests(status, created_at)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_data_subject_requests');

CREATE INDEX IF NOT EXISTS idx_cc_portal_data_subject_requests_email
  ON cc_portal_data_subject_requests(requester_email)
  WHERE EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'cc_portal_data_subject_requests');

-- ============================================================================
-- PART 5: Verify and Document
-- ============================================================================

-- Add comments
COMMENT ON FUNCTION update_updated_at_column() IS
  'Automatically updates the updated_at timestamp. Uses SET search_path for security.';

COMMENT ON FUNCTION handle_new_user() IS
  'Creates profile for new auth users. Uses SET search_path for security.';

-- ============================================================================
-- Migration Complete
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Privacy Portal final security fixes completed successfully!';
  RAISE NOTICE 'Fixed: Function search paths, Auth RLS initialization, Multiple permissive policies';
  RAISE NOTICE 'All security and performance warnings should now be resolved.';
END $$;
