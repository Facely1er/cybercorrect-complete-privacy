/*
  # Remove Duplicate Permissive Policies
  
  This migration removes the descriptive-named duplicate policies that conflict
  with the generic-named policies created in the previous migration.
  
  Migration: 20250130000002_remove_duplicate_policies.sql
  Date: January 2025
*/

-- ============================================================================
-- Remove Duplicate Policies - Keep generic-named policies, remove descriptive ones
-- ============================================================================

-- calendar_events - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own calendar events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can insert their own calendar events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can view their own calendar events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update their own calendar events" ON public.calendar_events;

-- cc_privacy_consent_records - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own consent records" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can insert their own consent records" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can view their own consent records" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can update their own consent records" ON public.cc_privacy_consent_records;

-- cc_privacy_data_records - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own data records" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can insert their own data records" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can view their own data records" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can update their own data records" ON public.cc_privacy_data_records;

-- cc_privacy_dpias - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own DPIAs" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can insert their own DPIAs" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can view their own DPIAs" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can update their own DPIAs" ON public.cc_privacy_dpias;

-- cc_privacy_privacy_by_design_assessments - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own privacy by design assessments" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can insert their own privacy by design assessments" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can view their own privacy by design assessments" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can update their own privacy by design assessments" ON public.cc_privacy_privacy_by_design_assessments;

-- cc_privacy_privacy_incidents - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own privacy incidents" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can insert their own privacy incidents" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can view their own privacy incidents" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can update their own privacy incidents" ON public.cc_privacy_privacy_incidents;

-- cc_privacy_retention_policies - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own retention policies" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can insert their own retention policies" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can view their own retention policies" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can update their own retention policies" ON public.cc_privacy_retention_policies;

-- cc_privacy_risk_detections - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own risk detections" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "Users can insert their own risk detections" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "Users can view their own risk detections" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "Users can update their own risk detections" ON public.cc_privacy_risk_detections;

-- cc_privacy_service_providers - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own service providers" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can insert their own service providers" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can view their own service providers" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can update their own service providers" ON public.cc_privacy_service_providers;

-- cc_privacy_vendor_assessments - Remove descriptive policies
DROP POLICY IF EXISTS "Users can delete their own vendor assessments" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can insert their own vendor assessments" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can view their own vendor assessments" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can update their own vendor assessments" ON public.cc_privacy_vendor_assessments;

-- ============================================================================
-- Verification
-- ============================================================================

DO $$
DECLARE
  duplicate_count integer;
BEGIN
  -- Check for remaining duplicate policies
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT schemaname, tablename, roles, cmd, COUNT(*) as policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
      'calendar_events',
      'cc_privacy_consent_records',
      'cc_privacy_data_records',
      'cc_privacy_dpias',
      'cc_privacy_privacy_by_design_assessments',
      'cc_privacy_privacy_incidents',
      'cc_privacy_retention_policies',
      'cc_privacy_risk_detections',
      'cc_privacy_service_providers',
      'cc_privacy_vendor_assessments'
    )
    GROUP BY schemaname, tablename, roles, cmd
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count = 0 THEN
    RAISE NOTICE 'All duplicate policies removed successfully!';
    RAISE NOTICE 'Each table now has exactly one policy per operation.';
  ELSE
    RAISE WARNING 'Found % remaining duplicate policy groups', duplicate_count;
  END IF;
END $$;

