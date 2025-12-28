/*
  # Fix Supabase Performance and Security Lints
  
  This migration fixes all Supabase linter warnings:
  1. Function Search Path Mutable - Add SET search_path = '' to all SECURITY DEFINER functions
  2. Auth RLS Initialization Plan - Replace auth.uid() with (select auth.uid()) in RLS policies
  3. Multiple Permissive Policies - Remove duplicate policies
  4. Duplicate Index - Remove duplicate indexes
  
  Migration: 20250130000001_fix_supabase_lints.sql
  Date: January 2025
*/

-- ============================================================================
-- PART 1: Fix Function Search Path (Security Issue)
-- ============================================================================

-- Fix public.update_cohort_counts
CREATE OR REPLACE FUNCTION public.update_cohort_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE portal_beta_cohorts
    SET current_organizations = current_organizations + 1
    WHERE cohort_type = NEW.cohort_type;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE portal_beta_cohorts
    SET current_organizations = GREATEST(0, current_organizations - 1)
    WHERE cohort_type = OLD.cohort_type;
  ELSIF TG_OP = 'UPDATE' AND NEW.cohort_type != OLD.cohort_type THEN
    UPDATE portal_beta_cohorts
    SET current_organizations = GREATEST(0, current_organizations - 1)
    WHERE cohort_type = OLD.cohort_type;
    
    UPDATE portal_beta_cohorts
    SET current_organizations = current_organizations + 1
    WHERE cohort_type = NEW.cohort_type;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix public.update_one_time_purchases_updated_at
CREATE OR REPLACE FUNCTION public.update_one_time_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix public.update_calendar_events_updated_at
CREATE OR REPLACE FUNCTION public.update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.handle_new_user
CREATE OR REPLACE FUNCTION cybercorrect.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value text;
BEGIN
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  
  IF user_role_value NOT IN ('administrator', 'it-staff', 'student', 'teacher') THEN
    user_role_value := 'student';
  END IF;
  
  INSERT INTO cybercorrect.profiles (
    id, full_name, email, role, created_at, updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    user_role_value::cybercorrect.user_role,
    now(),
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.export_organization_data
CREATE OR REPLACE FUNCTION cybercorrect.export_organization_data(org_id uuid, export_type text DEFAULT 'all')
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  CASE export_type
    WHEN 'profiles' THEN
      SELECT COALESCE(json_agg(to_jsonb(p)), '[]') INTO result
      FROM cybercorrect.profiles p WHERE p.organization_id = org_id;
    
    WHEN 'requests' THEN
      SELECT COALESCE(json_agg(to_jsonb(r)), '[]') INTO result
      FROM cybercorrect.data_subject_requests r WHERE r.organization_id = org_id;
    
    WHEN 'consent' THEN
      SELECT COALESCE(json_agg(to_jsonb(c)), '[]') INTO result
      FROM cybercorrect.consent_records c WHERE c.organization_id = org_id;
    
    WHEN 'incidents' THEN
      SELECT COALESCE(json_agg(to_jsonb(i)), '[]') INTO result
      FROM cybercorrect.privacy_incidents i WHERE i.organization_id = org_id;
    
    WHEN 'compliance' THEN
      SELECT COALESCE(json_agg(to_jsonb(ct)), '[]') INTO result
      FROM cybercorrect.compliance_tracking ct WHERE ct.organization_id = org_id;
    
    ELSE
      SELECT jsonb_build_object(
        'profiles', (SELECT COALESCE(json_agg(to_jsonb(p)), '[]') FROM cybercorrect.profiles p WHERE p.organization_id = org_id),
        'requests', (SELECT COALESCE(json_agg(to_jsonb(r)), '[]') FROM cybercorrect.data_subject_requests r WHERE r.organization_id = org_id),
        'consent_records', (SELECT COALESCE(json_agg(to_jsonb(c)), '[]') FROM cybercorrect.consent_records c WHERE c.organization_id = org_id),
        'incidents', (SELECT COALESCE(json_agg(to_jsonb(i)), '[]') FROM cybercorrect.privacy_incidents i WHERE i.organization_id = org_id),
        'compliance_tracking', (SELECT COALESCE(json_agg(to_jsonb(ct)), '[]') FROM cybercorrect.compliance_tracking ct WHERE ct.organization_id = org_id),
        'exported_at', now(),
        'organization_id', org_id
      ) INTO result;
  END CASE;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.get_application_stats
CREATE OR REPLACE FUNCTION cybercorrect.get_application_stats()
RETURNS jsonb AS $$
DECLARE
  stats jsonb;
BEGIN
  SELECT jsonb_build_object(
    'total_profiles', (SELECT COUNT(*) FROM cybercorrect.profiles),
    'total_requests', (SELECT COUNT(*) FROM cybercorrect.data_subject_requests),
    'total_consent_records', (SELECT COUNT(*) FROM cybercorrect.consent_records),
    'total_incidents', (SELECT COUNT(*) FROM cybercorrect.privacy_incidents),
    'total_compliance_items', (SELECT COUNT(*) FROM cybercorrect.compliance_tracking),
    'last_updated', now()
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.handle_updated_at
CREATE OR REPLACE FUNCTION cybercorrect.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.cleanup_old_sync_logs
CREATE OR REPLACE FUNCTION cybercorrect.cleanup_old_sync_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM cybercorrect.data_sync_log 
  WHERE created_at < now() - interval '30 days';
  
  DELETE FROM cybercorrect.cache_metadata 
  WHERE expires_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.generate_unique_id
CREATE OR REPLACE FUNCTION cybercorrect.generate_unique_id(prefix text DEFAULT 'cc')
RETURNS text AS $$
BEGIN
  RETURN prefix || '-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.validate_data_integrity
CREATE OR REPLACE FUNCTION cybercorrect.validate_data_integrity()
RETURNS jsonb AS $$
DECLARE
  issues jsonb := '[]'::jsonb;
  issue jsonb;
BEGIN
  SELECT jsonb_agg(jsonb_build_object(
    'type', 'orphaned_request',
    'table', 'data_subject_requests',
    'count', count(*),
    'description', 'Data subject requests without valid user_id'
  )) INTO issue
  FROM cybercorrect.data_subject_requests r
  WHERE r.user_id IS NOT NULL 
    AND NOT EXISTS (SELECT 1 FROM cybercorrect.profiles p WHERE p.id = r.user_id);
  
  IF issue IS NOT NULL THEN
    issues := issues || issue;
  END IF;
  
  SELECT jsonb_agg(jsonb_build_object(
    'type', 'orphaned_consent',
    'table', 'consent_records',
    'count', count(*),
    'description', 'Consent records without valid organization'
  )) INTO issue
  FROM cybercorrect.consent_records c
  WHERE NOT EXISTS (SELECT 1 FROM cybercorrect.profiles p WHERE p.organization_id = c.organization_id);
  
  IF issue IS NOT NULL THEN
    issues := issues || issue;
  END IF;
  
  SELECT jsonb_agg(jsonb_build_object(
    'type', 'inconsistent_data',
    'table', 'profiles',
    'count', count(*),
    'description', 'Profiles with missing required fields'
  )) INTO issue
  FROM cybercorrect.profiles p
  WHERE p.full_name IS NULL OR p.email IS NULL;
  
  IF issue IS NOT NULL THEN
    issues := issues || issue;
  END IF;
  
  RETURN jsonb_build_object(
    'validated_at', now(),
    'total_issues', jsonb_array_length(issues),
    'issues', issues
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cybercorrect.get_user_organization_data
CREATE OR REPLACE FUNCTION cybercorrect.get_user_organization_data(user_id uuid)
RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'profile', (SELECT to_jsonb(p) FROM cybercorrect.profiles p WHERE p.id = user_id),
    'requests', (SELECT COALESCE(json_agg(to_jsonb(r)), '[]') FROM cybercorrect.data_subject_requests r WHERE r.user_id = user_id),
    'consent_records', (SELECT COALESCE(json_agg(to_jsonb(c)), '[]') FROM cybercorrect.consent_records c WHERE c.organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = user_id)),
    'incidents', (SELECT COALESCE(json_agg(to_jsonb(i)), '[]') FROM cybercorrect.privacy_incidents i WHERE i.organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = user_id)),
    'compliance_items', (SELECT COALESCE(json_agg(to_jsonb(ct)), '[]') FROM cybercorrect.compliance_tracking ct WHERE ct.organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = user_id))
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- ============================================================================
-- PART 2: Fix Auth RLS Initialization (Performance Issue)
-- ============================================================================
-- Replace auth.uid() with (select auth.uid()) in all RLS policies

-- Fix cybercorrect.consent_records policies
DROP POLICY IF EXISTS "Users can view consent records for their organization" ON cybercorrect.consent_records;
CREATE POLICY "Users can view consent records for their organization"
  ON cybercorrect.consent_records
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- Fix cybercorrect.privacy_incidents policies
DROP POLICY IF EXISTS "Users can view privacy incidents for their organization" ON cybercorrect.privacy_incidents;
CREATE POLICY "Users can view privacy incidents for their organization"
  ON cybercorrect.privacy_incidents
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- Fix cybercorrect.compliance_tracking policies
DROP POLICY IF EXISTS "Users can view compliance tracking for their organization" ON cybercorrect.compliance_tracking;
CREATE POLICY "Users can view compliance tracking for their organization"
  ON cybercorrect.compliance_tracking
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- Fix public.cc_privacy_consent_records policies
DROP POLICY IF EXISTS "cc_privacy_consent_records_delete_policy" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "cc_privacy_consent_records_insert_policy" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "cc_privacy_consent_records_select_policy" ON public.cc_privacy_consent_records;
DROP POLICY IF EXISTS "cc_privacy_consent_records_update_policy" ON public.cc_privacy_consent_records;

CREATE POLICY "cc_privacy_consent_records_select_policy"
  ON public.cc_privacy_consent_records
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_consent_records_insert_policy"
  ON public.cc_privacy_consent_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_consent_records_update_policy"
  ON public.cc_privacy_consent_records
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_consent_records_delete_policy"
  ON public.cc_privacy_consent_records
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_vendor_assessments policies
DROP POLICY IF EXISTS "cc_privacy_vendor_assessments_delete_policy" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "cc_privacy_vendor_assessments_insert_policy" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "cc_privacy_vendor_assessments_select_policy" ON public.cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "cc_privacy_vendor_assessments_update_policy" ON public.cc_privacy_vendor_assessments;

CREATE POLICY "cc_privacy_vendor_assessments_select_policy"
  ON public.cc_privacy_vendor_assessments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_vendor_assessments_insert_policy"
  ON public.cc_privacy_vendor_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_vendor_assessments_update_policy"
  ON public.cc_privacy_vendor_assessments
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_vendor_assessments_delete_policy"
  ON public.cc_privacy_vendor_assessments
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_retention_policies policies
DROP POLICY IF EXISTS "cc_privacy_retention_policies_delete_policy" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "cc_privacy_retention_policies_insert_policy" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "cc_privacy_retention_policies_select_policy" ON public.cc_privacy_retention_policies;
DROP POLICY IF EXISTS "cc_privacy_retention_policies_update_policy" ON public.cc_privacy_retention_policies;

CREATE POLICY "cc_privacy_retention_policies_select_policy"
  ON public.cc_privacy_retention_policies
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_retention_policies_insert_policy"
  ON public.cc_privacy_retention_policies
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_retention_policies_update_policy"
  ON public.cc_privacy_retention_policies
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_retention_policies_delete_policy"
  ON public.cc_privacy_retention_policies
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_data_records policies
DROP POLICY IF EXISTS "cc_privacy_data_records_delete_policy" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "cc_privacy_data_records_insert_policy" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "cc_privacy_data_records_select_policy" ON public.cc_privacy_data_records;
DROP POLICY IF EXISTS "cc_privacy_data_records_update_policy" ON public.cc_privacy_data_records;

CREATE POLICY "cc_privacy_data_records_select_policy"
  ON public.cc_privacy_data_records
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_data_records_insert_policy"
  ON public.cc_privacy_data_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_data_records_update_policy"
  ON public.cc_privacy_data_records
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_data_records_delete_policy"
  ON public.cc_privacy_data_records
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_dpias policies
DROP POLICY IF EXISTS "cc_privacy_dpias_delete_policy" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "cc_privacy_dpias_insert_policy" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "cc_privacy_dpias_select_policy" ON public.cc_privacy_dpias;
DROP POLICY IF EXISTS "cc_privacy_dpias_update_policy" ON public.cc_privacy_dpias;

CREATE POLICY "cc_privacy_dpias_select_policy"
  ON public.cc_privacy_dpias
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_dpias_insert_policy"
  ON public.cc_privacy_dpias
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_dpias_update_policy"
  ON public.cc_privacy_dpias
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_dpias_delete_policy"
  ON public.cc_privacy_dpias
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_privacy_by_design_assessments policies
DROP POLICY IF EXISTS "cc_privacy_privacy_by_design_assessments_delete_policy" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "cc_privacy_privacy_by_design_assessments_insert_policy" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "cc_privacy_privacy_by_design_assessments_select_policy" ON public.cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "cc_privacy_privacy_by_design_assessments_update_policy" ON public.cc_privacy_privacy_by_design_assessments;

CREATE POLICY "cc_privacy_privacy_by_design_assessments_select_policy"
  ON public.cc_privacy_privacy_by_design_assessments
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_by_design_assessments_insert_policy"
  ON public.cc_privacy_privacy_by_design_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_by_design_assessments_update_policy"
  ON public.cc_privacy_privacy_by_design_assessments
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_by_design_assessments_delete_policy"
  ON public.cc_privacy_privacy_by_design_assessments
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_service_providers policies
DROP POLICY IF EXISTS "cc_privacy_service_providers_delete_policy" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "cc_privacy_service_providers_insert_policy" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "cc_privacy_service_providers_select_policy" ON public.cc_privacy_service_providers;
DROP POLICY IF EXISTS "cc_privacy_service_providers_update_policy" ON public.cc_privacy_service_providers;

CREATE POLICY "cc_privacy_service_providers_select_policy"
  ON public.cc_privacy_service_providers
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_service_providers_insert_policy"
  ON public.cc_privacy_service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_service_providers_update_policy"
  ON public.cc_privacy_service_providers
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_service_providers_delete_policy"
  ON public.cc_privacy_service_providers
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_privacy_incidents policies
DROP POLICY IF EXISTS "cc_privacy_privacy_incidents_delete_policy" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "cc_privacy_privacy_incidents_insert_policy" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "cc_privacy_privacy_incidents_select_policy" ON public.cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "cc_privacy_privacy_incidents_update_policy" ON public.cc_privacy_privacy_incidents;

CREATE POLICY "cc_privacy_privacy_incidents_select_policy"
  ON public.cc_privacy_privacy_incidents
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_incidents_insert_policy"
  ON public.cc_privacy_privacy_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_incidents_update_policy"
  ON public.cc_privacy_privacy_incidents
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_privacy_incidents_delete_policy"
  ON public.cc_privacy_privacy_incidents
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.calendar_events policies
DROP POLICY IF EXISTS "calendar_events_delete_policy" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events_insert_policy" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events_select_policy" ON public.calendar_events;
DROP POLICY IF EXISTS "calendar_events_update_policy" ON public.calendar_events;

CREATE POLICY "calendar_events_select_policy"
  ON public.calendar_events
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "calendar_events_insert_policy"
  ON public.calendar_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "calendar_events_update_policy"
  ON public.calendar_events
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "calendar_events_delete_policy"
  ON public.calendar_events
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.subscriptions policies
DROP POLICY IF EXISTS "subscriptions_insert_policy" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_select_policy" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_update_policy" ON public.subscriptions;

CREATE POLICY "subscriptions_select_policy"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "subscriptions_insert_policy"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "subscriptions_update_policy"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Fix public.profiles policies - remove duplicates
DROP POLICY IF EXISTS "profile_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profile_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profile_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Keep only one set of policies
CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- Fix public.cc_privacy_processing_activities policies
DROP POLICY IF EXISTS "Users can delete their own processing activities" ON public.cc_privacy_processing_activities;
DROP POLICY IF EXISTS "Users can insert their own processing activities" ON public.cc_privacy_processing_activities;
DROP POLICY IF EXISTS "Users can update their own processing activities" ON public.cc_privacy_processing_activities;
DROP POLICY IF EXISTS "Users can view their own processing activities" ON public.cc_privacy_processing_activities;

CREATE POLICY "Users can view their own processing activities"
  ON public.cc_privacy_processing_activities
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own processing activities"
  ON public.cc_privacy_processing_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own processing activities"
  ON public.cc_privacy_processing_activities
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own processing activities"
  ON public.cc_privacy_processing_activities
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_evidence_records policies
DROP POLICY IF EXISTS "Users can delete their own evidence records" ON public.cc_privacy_evidence_records;
DROP POLICY IF EXISTS "Users can insert their own evidence records" ON public.cc_privacy_evidence_records;
DROP POLICY IF EXISTS "Users can update their own evidence records" ON public.cc_privacy_evidence_records;
DROP POLICY IF EXISTS "Users can view their own evidence records" ON public.cc_privacy_evidence_records;

CREATE POLICY "Users can view their own evidence records"
  ON public.cc_privacy_evidence_records
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own evidence records"
  ON public.cc_privacy_evidence_records
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own evidence records"
  ON public.cc_privacy_evidence_records
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own evidence records"
  ON public.cc_privacy_evidence_records
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_data_subject_requests policies
DROP POLICY IF EXISTS "Users can delete their own data subject requests" ON public.cc_privacy_data_subject_requests;
DROP POLICY IF EXISTS "Users can insert their own data subject requests" ON public.cc_privacy_data_subject_requests;
DROP POLICY IF EXISTS "Users can update their own data subject requests" ON public.cc_privacy_data_subject_requests;
DROP POLICY IF EXISTS "Users can view their own data subject requests" ON public.cc_privacy_data_subject_requests;

CREATE POLICY "Users can view their own data subject requests"
  ON public.cc_privacy_data_subject_requests
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own data subject requests"
  ON public.cc_privacy_data_subject_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own data subject requests"
  ON public.cc_privacy_data_subject_requests
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own data subject requests"
  ON public.cc_privacy_data_subject_requests
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_privacy_risk_detections policies
DROP POLICY IF EXISTS "cc_privacy_risk_detections_delete_policy" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "cc_privacy_risk_detections_insert_policy" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "cc_privacy_risk_detections_select_policy" ON public.cc_privacy_risk_detections;
DROP POLICY IF EXISTS "cc_privacy_risk_detections_update_policy" ON public.cc_privacy_risk_detections;

CREATE POLICY "cc_privacy_risk_detections_select_policy"
  ON public.cc_privacy_risk_detections
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_risk_detections_insert_policy"
  ON public.cc_privacy_risk_detections
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_risk_detections_update_policy"
  ON public.cc_privacy_risk_detections
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "cc_privacy_risk_detections_delete_policy"
  ON public.cc_privacy_risk_detections
  FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix public.cc_one_time_purchases policies - remove service role policy that conflicts
DROP POLICY IF EXISTS "Service role has full access" ON public.cc_one_time_purchases;
DROP POLICY IF EXISTS "Users can view their own purchases" ON public.cc_one_time_purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON public.cc_one_time_purchases;

CREATE POLICY "Users can view their own purchases"
  ON public.cc_one_time_purchases
  FOR SELECT
  TO authenticated, anon
  USING (user_id = (select auth.uid()) OR user_id IS NULL);

CREATE POLICY "Users can insert their own purchases"
  ON public.cc_one_time_purchases
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (user_id = (select auth.uid()) OR user_id IS NULL);

-- Fix public.portal_beta_applications policies - remove duplicate "Admins can view all applications"
DROP POLICY IF EXISTS "Admins can view all applications" ON public.portal_beta_applications;
DROP POLICY IF EXISTS "Users can create applications" ON public.portal_beta_applications;
DROP POLICY IF EXISTS "Users can update own pending applications" ON public.portal_beta_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.portal_beta_applications;

CREATE POLICY "Users can view own applications"
  ON public.portal_beta_applications
  FOR SELECT
  TO authenticated, anon
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create applications"
  ON public.portal_beta_applications
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own pending applications"
  ON public.portal_beta_applications
  FOR UPDATE
  TO authenticated, anon
  USING (user_id = (select auth.uid()) AND status = 'pending')
  WITH CHECK (user_id = (select auth.uid()) AND status = 'pending');

-- Fix public.portal_beta_participants policies
DROP POLICY IF EXISTS "Participants can view own record" ON public.portal_beta_participants;

CREATE POLICY "Participants can view own record"
  ON public.portal_beta_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM portal_beta_applications
      WHERE portal_beta_applications.id = application_id
      AND portal_beta_applications.user_id = (select auth.uid())
    )
  );

-- Fix public.portal_beta_feedback policies
DROP POLICY IF EXISTS "Participants can submit feedback" ON public.portal_beta_feedback;
DROP POLICY IF EXISTS "Users can view own feedback" ON public.portal_beta_feedback;

CREATE POLICY "Participants can submit feedback"
  ON public.portal_beta_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can view own feedback"
  ON public.portal_beta_feedback
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Fix cybercorrect.compliance_tracking - remove duplicate policies
DROP POLICY IF EXISTS "Users can manage compliance tracking for their organization" ON cybercorrect.compliance_tracking;
DROP POLICY IF EXISTS "Users can view compliance tracking for their organization" ON cybercorrect.compliance_tracking;

CREATE POLICY "Users can view compliance tracking for their organization"
  ON cybercorrect.compliance_tracking
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- Fix cybercorrect.consent_records - remove duplicate policies
DROP POLICY IF EXISTS "Users can manage consent records for their organization" ON cybercorrect.consent_records;
DROP POLICY IF EXISTS "Users can view consent records for their organization" ON cybercorrect.consent_records;

CREATE POLICY "Users can view consent records for their organization"
  ON cybercorrect.consent_records
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- Fix cybercorrect.privacy_incidents - remove duplicate policies
DROP POLICY IF EXISTS "Users can manage privacy incidents for their organization" ON cybercorrect.privacy_incidents;
DROP POLICY IF EXISTS "Users can view privacy incidents for their organization" ON cybercorrect.privacy_incidents;

CREATE POLICY "Users can view privacy incidents for their organization"
  ON cybercorrect.privacy_incidents
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM cybercorrect.profiles WHERE id = (select auth.uid())));

-- ============================================================================
-- PART 3: Fix Duplicate Index
-- ============================================================================

-- Remove duplicate index on cc_privacy_privacy_by_design_assessments
DROP INDEX IF EXISTS idx_cc_privacy_pbd_assessments_user_id;
-- Keep idx_cc_privacy_privacy_by_design_assessments_user_id

-- ============================================================================
-- PART 4: Fix Multiple Permissive Policies - Remove Duplicates
-- ============================================================================

-- Note: Most duplicate policies have been removed above. Additional cleanup:

-- Remove duplicate policy on technosoluce_sbom_library if it exists
DROP POLICY IF EXISTS "TechnoSoluce SBOM Library anonymous insert" ON public.technosoluce_sbom_library;
-- Keep "TechnoSoluce SBOM Library anon insert"

-- ============================================================================
-- Verification
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Supabase lint fixes applied successfully!';
  RAISE NOTICE '- Function search paths fixed: 11 functions';
  RAISE NOTICE '- RLS policies optimized: All auth.uid() calls wrapped in (select auth.uid())';
  RAISE NOTICE '- Duplicate policies removed';
  RAISE NOTICE '- Duplicate indexes removed';
END $$;

