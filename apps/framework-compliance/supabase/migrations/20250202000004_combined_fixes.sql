-- Combined Migration: Fix Function Search Path + RLS Performance
-- This migration combines both fixes for convenience
-- Run this if you prefer to apply both fixes in one go

-- ============================================================================
-- PART 1: Fix Function Search Path Security Warnings
-- ============================================================================

-- Fix set_audit_fields function
CREATE OR REPLACE FUNCTION set_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Set created_by and updated_by based on auth context
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
    NEW.ip_address = inet_client_addr();
    NEW.user_agent = current_setting('request.headers', true)::json->>'user-agent';
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    NEW.ip_address = inet_client_addr();
    NEW.user_agent = current_setting('request.headers', true)::json->>'user-agent';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix cleanup_anonymous_data function
CREATE OR REPLACE FUNCTION cleanup_anonymous_data()
RETURNS void AS $$
BEGIN
  -- Delete policy generators older than 30 days with no user association (only if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    DELETE FROM public.policy_generators 
    WHERE created_by IS NULL 
      AND created_at < NOW() - INTERVAL '30 days';
  END IF;
  
  -- Delete analytics older than 90 days with no user association (only if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    DELETE FROM public.toolkit_analytics 
    WHERE created_by IS NULL 
      AND created_at < NOW() - INTERVAL '90 days';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix anonymize_user_data function
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Anonymize policy generators (only if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    UPDATE public.policy_generators 
    SET 
      organization_info = '{}'::jsonb,
      created_by = NULL,
      updated_by = NULL,
      ip_address = NULL,
      user_agent = NULL
    WHERE created_by = user_id OR updated_by = user_id;
  END IF;
  
  -- Anonymize analytics (only if table exists)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    UPDATE public.toolkit_analytics 
    SET 
      data = '{}'::jsonb,
      created_by = NULL,
      ip_address = NULL,
      user_agent = NULL
    WHERE created_by = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix update_updated_at_column function (subscription features)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Fix cleanup_expired_notifications function
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE expires_at IS NOT NULL
    AND expires_at < now()
    AND read = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix update_cc_privacy_updated_at_column function
CREATE OR REPLACE FUNCTION update_cc_privacy_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Fix create_subscription_history function
CREATE OR REPLACE FUNCTION create_subscription_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.cc_privacy_subscription_history (
      subscription_id,
      user_id,
      action,
      new_tier,
      new_status
    ) VALUES (
      NEW.id,
      NEW.user_id,
      'created',
      NEW.tier,
      NEW.status
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.cc_privacy_subscription_history (
      subscription_id,
      user_id,
      action,
      old_tier,
      new_tier,
      old_status,
      new_status
    ) VALUES (
      NEW.id,
      NEW.user_id,
      CASE
        WHEN NEW.status != OLD.status THEN 'updated'
        WHEN NEW.tier != OLD.tier THEN 'updated'
        WHEN NEW.cancel_at_period_end != OLD.cancel_at_period_end AND NEW.cancel_at_period_end = TRUE THEN 'cancelled'
        ELSE 'updated'
      END,
      OLD.tier,
      NEW.tier,
      OLD.status,
      NEW.status
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- ============================================================================
-- PART 2: Fix RLS Performance Warnings
-- ============================================================================

-- Note: This is a simplified version. For full RLS fixes, use the dedicated migration file.
-- The combined migration focuses on the most critical policies.

-- Fix compliance_health_scores (also fixes multiple permissive policies)
DROP POLICY IF EXISTS "Users can view their own scores" ON compliance_health_scores;
DROP POLICY IF EXISTS "Users can view aggregated scores" ON compliance_health_scores;

-- Combined policy: Users can view their own scores OR aggregated scores
CREATE POLICY "Users can view scores"
  ON compliance_health_scores
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR true
  );

-- Note: For complete RLS fixes on all tables, run the dedicated migration:
-- 20250202000003_fix_rls_performance.sql

-- Comments
COMMENT ON FUNCTION set_audit_fields() IS 'Sets audit fields with secure search_path';
COMMENT ON FUNCTION cleanup_anonymous_data() IS 'Cleans up anonymous data with secure search_path';
COMMENT ON FUNCTION anonymize_user_data(uuid) IS 'Anonymizes user data with secure search_path';
COMMENT ON FUNCTION update_updated_at_column() IS 'Updates updated_at timestamp with secure search_path';
COMMENT ON FUNCTION cleanup_expired_notifications() IS 'Cleans up expired notifications with secure search_path';
COMMENT ON FUNCTION update_cc_privacy_updated_at_column() IS 'Updates cc_privacy table updated_at with secure search_path';
COMMENT ON FUNCTION create_subscription_history() IS 'Creates subscription history with secure search_path';
COMMENT ON POLICY "Users can view scores" ON compliance_health_scores IS 'Optimized RLS policy: Users can view their own scores or aggregated scores for benchmarking';

