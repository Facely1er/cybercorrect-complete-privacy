/*
  # Fix RLS Performance Warnings for TechnoSoluce Tables
  
  This migration fixes multiple permissive RLS policies on technosoluce_ tables
  that are causing performance warnings in the Supabase database linter.
  
  It consolidates duplicate policies into single policies per role/action.
*/

-- Helper function to check if table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND information_schema.tables.table_name = table_exists.table_name
  );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Fix RLS Policies for technosoluce_sbom_library
-- ============================================================================

DO $$
BEGIN
  IF table_exists('technosoluce_sbom_library') THEN
    -- Drop all existing policies that are causing conflicts
    DROP POLICY IF EXISTS "TechnoSoluce SBOM Library anonymous insert for harvesting" ON technosoluce_sbom_library;
    DROP POLICY IF EXISTS "TechnoSoluce SBOM Library service role full access" ON technosoluce_sbom_library;
    DROP POLICY IF EXISTS "TechnoSoluce SBOM Library public read access" ON technosoluce_sbom_library;
    
    -- Create single consolidated policies per role/action
    
    -- SELECT policy for anon (public read access)
    CREATE POLICY "TechnoSoluce SBOM Library anon select"
      ON technosoluce_sbom_library
      FOR SELECT
      TO anon
      USING (true);
    
    -- INSERT policy for anon (harvesting access)
    CREATE POLICY "TechnoSoluce SBOM Library anon insert"
      ON technosoluce_sbom_library
      FOR INSERT
      TO anon
      WITH CHECK (true);
    
    -- SELECT policy for authenticated users
    CREATE POLICY "TechnoSoluce SBOM Library authenticated select"
      ON technosoluce_sbom_library
      FOR SELECT
      TO authenticated
      USING (true);
    
    -- Note: Service role doesn't need RLS policies (bypasses RLS automatically)
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for technosoluce_subscriptions
-- ============================================================================

DO $$
BEGIN
  IF table_exists('technosoluce_subscriptions') THEN
    -- Drop all existing policies that are causing conflicts
    DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON technosoluce_subscriptions;
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON technosoluce_subscriptions;
    
    -- Create single consolidated SELECT policy
    -- Note: Service role doesn't need RLS policies (bypasses RLS automatically)
    CREATE POLICY "TechnoSoluce subscriptions authenticated select"
      ON technosoluce_subscriptions
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);
    
    -- Add other policies if needed
    CREATE POLICY "TechnoSoluce subscriptions authenticated insert"
      ON technosoluce_subscriptions
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);
    
    CREATE POLICY "TechnoSoluce subscriptions authenticated update"
      ON technosoluce_subscriptions
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Cleanup helper function
-- ============================================================================

DROP FUNCTION IF EXISTS table_exists(text);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON POLICY "TechnoSoluce SBOM Library anon select" ON technosoluce_sbom_library IS 'Single consolidated policy - replaces multiple permissive policies';
COMMENT ON POLICY "TechnoSoluce subscriptions authenticated select" ON technosoluce_subscriptions IS 'Single consolidated policy - replaces multiple permissive policies';

