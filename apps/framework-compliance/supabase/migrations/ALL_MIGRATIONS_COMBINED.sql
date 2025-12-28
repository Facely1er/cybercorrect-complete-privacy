/*
  CyberCorrect Database Migrations - Combined File
  ================================================
  
  This file contains all migrations in order for easy execution.
  Execute this entire file in Supabase SQL Editor.
  
  Database: Shared ERMITS database (CyberCorrect, CyberCaution, CyberSoluce)
  Project: achowlksgmwuvfbvjfrt
  
  Instructions:
  1. Go to https://app.supabase.com
  2. Select project: achowlksgmwuvfbvjfrt
  3. Go to SQL Editor → New query
  4. Copy and paste this entire file
  5. Click Run (or press Ctrl+Enter)
  
  Note: All tables use the 'cc_privacy_' prefix to avoid conflicts.
  
*/

-- ============================================================================
-- Migration: 20250130000000_improve_security.sql
-- ============================================================================

/*
  # Improve Security and RLS Policies
  
  This migration improves the security of the existing tables by:
  1. Adding proper RLS policies with authentication
  2. Adding audit fields
  3. Improving data validation
  4. Adding proper indexes
*/

-- Drop existing overly permissive policies (only if tables exist)
DO $$
BEGIN
  -- Only drop policies if policy_generators table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    DROP POLICY IF EXISTS "Allow public read access to policy_generators" ON policy_generators;
    DROP POLICY IF EXISTS "Allow public insert access to policy_generators" ON policy_generators;
    DROP POLICY IF EXISTS "Allow public update access to policy_generators" ON policy_generators;
  END IF;
  
  -- Only drop policies if toolkit_analytics table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    DROP POLICY IF EXISTS "Allow public insert access to toolkit_analytics" ON toolkit_analytics;
  END IF;
END $$;

-- Add audit fields to existing tables (only if tables exist)
DO $$
BEGIN
  -- Only alter policy_generators if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    ALTER TABLE policy_generators 
    ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS ip_address inet,
    ADD COLUMN IF NOT EXISTS user_agent text;
  END IF;
  
  -- Only alter toolkit_analytics if it exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    ALTER TABLE toolkit_analytics 
    ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS ip_address inet,
    ADD COLUMN IF NOT EXISTS user_agent text;
  END IF;
END $$;

-- Create secure RLS policies for policy_generators (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    -- Allow authenticated users to manage their own data
    DROP POLICY IF EXISTS "Users can view their own policy generators" ON policy_generators;
    CREATE POLICY "Users can view their own policy generators"
      ON policy_generators
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = created_by OR created_by IS NULL);

    DROP POLICY IF EXISTS "Users can insert their own policy generators" ON policy_generators;
    CREATE POLICY "Users can insert their own policy generators"
      ON policy_generators
      FOR INSERT
      TO authenticated
      WITH CHECK (
        (select auth.uid()) = created_by OR 
        (created_by IS NULL AND session_id IS NOT NULL)
      );

    DROP POLICY IF EXISTS "Users can update their own policy generators" ON policy_generators;
    CREATE POLICY "Users can update their own policy generators"
      ON policy_generators
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = created_by OR created_by IS NULL)
      WITH CHECK ((select auth.uid()) = created_by OR created_by IS NULL);

    DROP POLICY IF EXISTS "Users can delete their own policy generators" ON policy_generators;
    CREATE POLICY "Users can delete their own policy generators"
      ON policy_generators
      FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = created_by OR created_by IS NULL);
  END IF;
END $$;

-- Create secure RLS policies for toolkit_analytics (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    DROP POLICY IF EXISTS "Users can insert their own analytics" ON toolkit_analytics;
    CREATE POLICY "Users can insert their own analytics"
      ON toolkit_analytics
      FOR INSERT
      TO authenticated
      WITH CHECK (
        (select auth.uid()) = created_by OR 
        (created_by IS NULL AND session_id IS NOT NULL)
      );

    DROP POLICY IF EXISTS "Users can view their own analytics" ON toolkit_analytics;
    CREATE POLICY "Users can view their own analytics"
      ON toolkit_analytics
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = created_by OR created_by IS NULL);
  END IF;
END $$;

-- Create function to automatically set audit fields
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

-- Create triggers for audit fields (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    DROP TRIGGER IF EXISTS set_policy_generators_audit_fields ON policy_generators;
    CREATE TRIGGER set_policy_generators_audit_fields
      BEFORE INSERT OR UPDATE ON policy_generators
      FOR EACH ROW
      EXECUTE FUNCTION set_audit_fields();
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    DROP TRIGGER IF EXISTS set_toolkit_analytics_audit_fields ON toolkit_analytics;
    CREATE TRIGGER set_toolkit_analytics_audit_fields
      BEFORE INSERT OR UPDATE ON toolkit_analytics
      FOR EACH ROW
      EXECUTE FUNCTION set_audit_fields();
  END IF;
END $$;

-- Add data validation constraints (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    -- Drop existing constraints if they exist
    ALTER TABLE policy_generators 
    DROP CONSTRAINT IF EXISTS check_session_id_length,
    DROP CONSTRAINT IF EXISTS check_organization_info_json;
    
    -- Add constraints only if columns exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'policy_generators' AND column_name = 'session_id') THEN
      ALTER TABLE policy_generators 
      ADD CONSTRAINT check_session_id_length CHECK (char_length(session_id) >= 8);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'policy_generators' AND column_name = 'organization_info') THEN
      ALTER TABLE policy_generators 
      ADD CONSTRAINT check_organization_info_json CHECK (jsonb_typeof(organization_info) = 'object');
    END IF;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    -- Drop existing constraints if they exist
    ALTER TABLE toolkit_analytics 
    DROP CONSTRAINT IF EXISTS check_tool_name_not_empty,
    DROP CONSTRAINT IF EXISTS check_action_not_empty,
    DROP CONSTRAINT IF EXISTS check_data_json;
    
    -- Add constraints only if columns exist
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'toolkit_analytics' AND column_name = 'tool_name') THEN
      ALTER TABLE toolkit_analytics 
      ADD CONSTRAINT check_tool_name_not_empty CHECK (char_length(tool_name) > 0);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'toolkit_analytics' AND column_name = 'action') THEN
      ALTER TABLE toolkit_analytics 
      ADD CONSTRAINT check_action_not_empty CHECK (char_length(action) > 0);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'toolkit_analytics' AND column_name = 'data') THEN
      ALTER TABLE toolkit_analytics 
      ADD CONSTRAINT check_data_json CHECK (jsonb_typeof(data) = 'object');
    END IF;
  END IF;
END $$;

-- Create additional indexes for performance and security (only if tables exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
    CREATE INDEX IF NOT EXISTS idx_policy_generators_created_by ON policy_generators(created_by);
    CREATE INDEX IF NOT EXISTS idx_policy_generators_ip_address ON policy_generators(ip_address);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_created_by ON toolkit_analytics(created_by);
    CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_ip_address ON toolkit_analytics(ip_address);
  END IF;
END $$;

-- Create function to clean up old anonymous data (for GDPR compliance)
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

-- Create function to anonymize user data (for GDPR right to be forgotten)
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_anonymous_data() TO authenticated;
GRANT EXECUTE ON FUNCTION anonymize_user_data(uuid) TO authenticated;

-- Create a view for admin monitoring (only accessible by service role)
-- Drop view if it exists
DROP VIEW IF EXISTS admin_data_overview;

-- Create view only if at least one table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') 
     OR EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
    
    EXECUTE format('
      CREATE VIEW admin_data_overview AS
      %s
      %s
    ',
      CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN
          'SELECT 
            ''policy_generators'' as table_name,
            COUNT(*) as total_records,
            COUNT(created_by) as authenticated_records,
            COUNT(*) - COUNT(created_by) as anonymous_records,
            MIN(created_at) as oldest_record,
            MAX(created_at) as newest_record
          FROM policy_generators'
        ELSE ''
      END,
      CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'toolkit_analytics') THEN
          CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_generators') THEN ' UNION ALL ' ELSE ''
          END ||
          'SELECT 
            ''toolkit_analytics'' as table_name,
            COUNT(*) as total_records,
            COUNT(created_by) as authenticated_records,
            COUNT(*) - COUNT(created_by) as anonymous_records,
            MIN(created_at) as oldest_record,
            MAX(created_at) as newest_record
          FROM toolkit_analytics'
        ELSE ''
      END
    );
    
    -- Only allow service role to access admin view (only if view was created)
    IF EXISTS (SELECT 1 FROM information_schema.views WHERE table_name = 'admin_data_overview') THEN
      REVOKE ALL ON admin_data_overview FROM PUBLIC;
      GRANT SELECT ON admin_data_overview TO service_role;
    END IF;
  END IF;
END $$;

-- ============================================================================
-- Migration: 20250201000000_subscription_features.sql
-- ============================================================================

/*
  # Subscription Features Database Schema
  
  This migration creates tables for subscription enhancement features:
  1. notifications - In-app and email notifications
  2. automated_reports - Scheduled report generation
  3. compliance_health_scores - Historical compliance scores
  4. scheduled_assessments - Assessment scheduling
  5. alert_rules - Custom alert configurations
  6. regulatory_updates - Regulatory change tracking
  7. notification_preferences - User notification settings
  
  All tables include RLS policies for user-based access control.
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'deadline', 'report', 'assessment', 'regulatory', 'alert')),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  action_url text,
  action_label text
);

-- Create automated_reports table
CREATE TABLE IF NOT EXISTS automated_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type text NOT NULL CHECK (report_type IN ('compliance', 'executive', 'risk', 'health', 'quarterly', 'monthly', 'weekly', 'custom')),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'custom')),
  last_generated timestamptz,
  next_generation timestamptz NOT NULL,
  config jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create compliance_health_scores table
CREATE TABLE IF NOT EXISTS compliance_health_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  score numeric(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  framework text,
  trend text CHECK (trend IN ('improving', 'stable', 'declining', 'unknown')),
  metadata jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now()
);

-- Create scheduled_assessments table
CREATE TABLE IF NOT EXISTS scheduled_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type text NOT NULL CHECK (assessment_type IN ('privacy', 'gap', 'risk', 'compliance', 'custom')),
  schedule text NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly', 'quarterly', 'custom')),
  last_run timestamptz,
  next_run timestamptz NOT NULL,
  config jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create alert_rules table
CREATE TABLE IF NOT EXISTS alert_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_type text NOT NULL CHECK (rule_type IN ('deadline', 'score', 'risk', 'compliance', 'custom')),
  name text NOT NULL,
  conditions jsonb NOT NULL DEFAULT '{}',
  actions jsonb NOT NULL DEFAULT '{}',
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create regulatory_updates table
CREATE TABLE IF NOT EXISTS regulatory_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework text NOT NULL,
  region text,
  update_type text NOT NULL CHECK (update_type IN ('new_regulation', 'amendment', 'guidance', 'enforcement', 'other')),
  title text NOT NULL,
  description text NOT NULL,
  impact_level text NOT NULL CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  published_at timestamptz NOT NULL,
  affected_users jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_enabled boolean DEFAULT true,
  in_app_enabled boolean DEFAULT true,
  channels jsonb DEFAULT '{"email": true, "in_app": true, "sms": false, "slack": false, "teams": false}',
  frequency text DEFAULT 'real_time' CHECK (frequency IN ('real_time', 'hourly', 'daily', 'weekly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- RLS Policies for automated_reports
CREATE POLICY "Users can view their own reports"
  ON automated_reports
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own reports"
  ON automated_reports
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own reports"
  ON automated_reports
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own reports"
  ON automated_reports
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- RLS Policies for compliance_health_scores
-- Combined policy to avoid multiple permissive policies (performance optimization)
CREATE POLICY "Users can view scores"
  ON compliance_health_scores
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR true
  );

CREATE POLICY "Users can insert their own scores"
  ON compliance_health_scores
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- RLS Policies for scheduled_assessments
CREATE POLICY "Users can view their own assessments"
  ON scheduled_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own assessments"
  ON scheduled_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own assessments"
  ON scheduled_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own assessments"
  ON scheduled_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- RLS Policies for alert_rules
CREATE POLICY "Users can view their own alert rules"
  ON alert_rules
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own alert rules"
  ON alert_rules
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own alert rules"
  ON alert_rules
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own alert rules"
  ON alert_rules
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- RLS Policies for regulatory_updates
CREATE POLICY "All authenticated users can view regulatory updates"
  ON regulatory_updates
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_automated_reports_user_id ON automated_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_automated_reports_next_generation ON automated_reports(next_generation);
CREATE INDEX IF NOT EXISTS idx_automated_reports_status ON automated_reports(status);

CREATE INDEX IF NOT EXISTS idx_compliance_health_scores_user_id ON compliance_health_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_compliance_health_scores_recorded_at ON compliance_health_scores(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_health_scores_framework ON compliance_health_scores(framework);

CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_user_id ON scheduled_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_next_run ON scheduled_assessments(next_run);
CREATE INDEX IF NOT EXISTS idx_scheduled_assessments_status ON scheduled_assessments(status);

CREATE INDEX IF NOT EXISTS idx_alert_rules_user_id ON alert_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_alert_rules_enabled ON alert_rules(enabled);

CREATE INDEX IF NOT EXISTS idx_regulatory_updates_framework ON regulatory_updates(framework);
CREATE INDEX IF NOT EXISTS idx_regulatory_updates_published_at ON regulatory_updates(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_regulatory_updates_impact_level ON regulatory_updates(impact_level);

CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Create triggers for updated_at
CREATE TRIGGER update_automated_reports_updated_at
  BEFORE UPDATE ON automated_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_assessments_updated_at
  BEFORE UPDATE ON scheduled_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at
  BEFORE UPDATE ON alert_rules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM public.notifications
  WHERE expires_at IS NOT NULL
    AND expires_at < now()
    AND read = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';



-- ============================================================================
-- Migration: 20250201000001_cron_jobs.sql
-- ============================================================================

/*
  # Supabase Cron Jobs for Subscription Features
  
  This migration creates cron jobs for:
  1. Automated report generation
  2. Scheduled assessments
  3. Compliance health tracking
  4. Regulatory update checks
*/

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Cron job for automated report generation (runs daily at 2 AM)
SELECT cron.schedule(
  'generate-automated-reports',
  '0 2 * * *', -- Daily at 2 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/generate-automated-reports',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for scheduled assessments (runs daily at 3 AM)
SELECT cron.schedule(
  'run-scheduled-assessments',
  '0 3 * * *', -- Daily at 3 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/run-scheduled-assessments',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for compliance health tracking (runs daily at 4 AM)
SELECT cron.schedule(
  'track-compliance-health',
  '0 4 * * *', -- Daily at 4 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/track-compliance-health',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for regulatory update checks (runs daily at 5 AM)
SELECT cron.schedule(
  'check-regulatory-updates',
  '0 5 * * *', -- Daily at 5 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/check-regulatory-updates',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for cleaning up expired notifications (runs daily at 1 AM)
SELECT cron.schedule(
  'cleanup-expired-notifications',
  '0 1 * * *', -- Daily at 1 AM
  $$
  SELECT cleanup_expired_notifications();
  $$
);

-- Note: In production, you'll need to:
-- 1. Set app.supabase_url and app.supabase_service_role_key as database settings
-- 2. Enable pg_net extension for HTTP requests: CREATE EXTENSION IF NOT EXISTS pg_net;
-- 3. Configure cron jobs with proper authentication



-- ============================================================================
-- Migration: 20250202000000_privacy_tools_schema.sql
-- ============================================================================

/*
  # CyberCorrect Privacy Platform - Privacy Tools Database Schema
  
  This migration creates tables for the 7 privacy compliance tools:
  1. cc_privacy_consent_records - Consent Management data
  2. cc_privacy_vendor_assessments - Vendor Risk Assessment data
  3. cc_privacy_retention_policies - Retention Policy Generator data
  4. cc_privacy_data_records - Data records for retention policies
  5. cc_privacy_dpias - DPIA Manager data
  6. cc_privacy_privacy_by_design_assessments - Privacy by Design Assessment data
  7. cc_privacy_service_providers - Service Provider Manager data
  8. cc_privacy_privacy_incidents - Incident Response Manager data
  
  All tables use the "cc_privacy_" prefix to differentiate from other projects
  in the same Supabase instance and avoid naming conflicts.
  
  All tables include RLS policies for user-based access control.
*/

-- ============================================================================
-- 1. Consent Management - cc_privacy_consent_records
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  employee_name text NOT NULL,
  employee_id text NOT NULL,
  consent_type text NOT NULL,
  service_provider text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'withdrawn', 'expired', 'pending')),
  consent_given boolean NOT NULL DEFAULT false,
  consent_date timestamptz,
  withdrawal_date timestamptz,
  expiry_date timestamptz,
  renewal_required boolean NOT NULL DEFAULT false,
  applicable_regulations text[] DEFAULT '{}',
  parent_guardian_name text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. Vendor Risk Assessment - cc_privacy_vendor_assessments
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_vendor_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_name text NOT NULL,
  service_description text NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  compliance_status text NOT NULL CHECK (compliance_status IN ('compliant', 'review_needed', 'non_compliant')),
  assessment_score numeric(5,2) NOT NULL CHECK (assessment_score >= 0 AND assessment_score <= 100),
  contract_start_date date,
  contract_end_date date,
  last_assessment_date date,
  next_assessment_due date,
  data_types_processed text[] DEFAULT '{}',
  applicable_regulations text[] DEFAULT '{}',
  security_certifications text[] DEFAULT '{}',
  privacy_policy_reviewed boolean NOT NULL DEFAULT false,
  dpa_signed boolean NOT NULL DEFAULT false,
  employee_data_access boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 3. Retention Policy Generator - cc_privacy_retention_policies
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  data_category text NOT NULL,
  data_types text[] DEFAULT '{}',
  purposes text[] DEFAULT '{}',
  retention_period text NOT NULL,
  legal_basis text NOT NULL,
  regulations text[] DEFAULT '{}',
  retention_start text NOT NULL CHECK (retention_start IN ('creation', 'last_access', 'last_update', 'completion', 'custom')),
  custom_start_date date,
  retention_end text NOT NULL CHECK (retention_end IN ('automatic', 'manual', 'event_based')),
  end_event text,
  disposal_method text NOT NULL CHECK (disposal_method IN ('delete', 'anonymize', 'archive', 'transfer')),
  review_cycle text NOT NULL,
  last_review date,
  next_review date,
  status text NOT NULL CHECK (status IN ('active', 'draft', 'under_review', 'expired')),
  compliance_status text NOT NULL CHECK (compliance_status IN ('compliant', 'needs_review', 'non_compliant')),
  created_date date NOT NULL,
  created_by text NOT NULL,
  approved_by text,
  approval_date date,
  exceptions text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 4. Data Records for Retention Policies - cc_privacy_data_records
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_data_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  data_type text NOT NULL,
  data_category text NOT NULL,
  subject text NOT NULL,
  created_date date NOT NULL,
  last_accessed date,
  last_updated date,
  retention_policy_id uuid REFERENCES cc_privacy_retention_policies(id) ON DELETE SET NULL,
  retention_end_date date,
  status text NOT NULL CHECK (status IN ('active', 'expired', 'scheduled_deletion', 'deleted', 'anonymized')),
  disposal_date date,
  disposal_method text,
  location text,
  size text,
  sensitivity text NOT NULL CHECK (sensitivity IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 5. DPIA Manager - cc_privacy_dpias
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_dpias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  processing_activity text NOT NULL,
  data_controller text NOT NULL,
  data_processor text,
  status text NOT NULL CHECK (status IN ('draft', 'in_progress', 'review', 'approved', 'rejected')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_date date NOT NULL,
  due_date date NOT NULL,
  last_updated date,
  assessor text NOT NULL,
  reviewer text,
  data_subjects text[] DEFAULT '{}',
  data_types text[] DEFAULT '{}',
  purposes text[] DEFAULT '{}',
  legal_basis text[] DEFAULT '{}',
  retention_period text,
  data_sources text[] DEFAULT '{}',
  recipients text[] DEFAULT '{}',
  transfers jsonb DEFAULT '[]',
  risks jsonb DEFAULT '[]',
  measures jsonb DEFAULT '{}',
  consultation jsonb DEFAULT '{}',
  approval jsonb DEFAULT '{}',
  next_review date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 6. Privacy by Design Assessment - cc_privacy_privacy_by_design_assessments
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_privacy_by_design_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  system_type text NOT NULL CHECK (system_type IN ('new_system', 'existing_system', 'process', 'service')),
  status text NOT NULL CHECK (status IN ('draft', 'in_progress', 'completed', 'needs_review')),
  assessment_date date NOT NULL,
  assessor text NOT NULL,
  overall_score numeric(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  principles jsonb NOT NULL DEFAULT '{}',
  recommendations text[] DEFAULT '{}',
  next_review_date date,
  compliance_status text NOT NULL CHECK (compliance_status IN ('compliant', 'needs_improvement', 'non_compliant')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 7. Service Provider Manager - cc_privacy_service_providers
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('cloud', 'analytics', 'marketing', 'payment', 'communication', 'security', 'other')),
  status text NOT NULL CHECK (status IN ('active', 'pending', 'expired', 'terminated', 'under_review')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  data_types text[] DEFAULT '{}',
  data_volume text NOT NULL CHECK (data_volume IN ('low', 'medium', 'high')),
  data_sensitivity text NOT NULL CHECK (data_sensitivity IN ('low', 'medium', 'high', 'critical')),
  contact_info jsonb NOT NULL DEFAULT '{}',
  agreement jsonb NOT NULL DEFAULT '{}',
  compliance jsonb NOT NULL DEFAULT '{}',
  security jsonb NOT NULL DEFAULT '{}',
  data_processing jsonb NOT NULL DEFAULT '{}',
  risk_assessment jsonb NOT NULL DEFAULT '{}',
  monitoring jsonb NOT NULL DEFAULT '{}',
  incidents jsonb NOT NULL DEFAULT '{}',
  costs jsonb NOT NULL DEFAULT '{}',
  notes text,
  created_date date NOT NULL,
  created_by text NOT NULL,
  last_updated date,
  updated_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 8. Incident Response Manager - cc_privacy_privacy_incidents
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_privacy_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('data_breach', 'unauthorized_access', 'data_loss', 'privacy_violation', 'consent_violation', 'vendor_incident')),
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL CHECK (status IN ('reported', 'investigating', 'contained', 'resolved', 'closed')),
  reported_date date NOT NULL,
  detected_date date NOT NULL,
  contained_date date,
  resolved_date date,
  reported_by text NOT NULL,
  assigned_to text NOT NULL,
  affected_data_subjects integer NOT NULL DEFAULT 0,
  affected_data_types text[] DEFAULT '{}',
  affected_systems text[] DEFAULT '{}',
  root_cause text,
  impact text,
  mitigation text[] DEFAULT '{}',
  regulatory_notifications jsonb NOT NULL DEFAULT '{}',
  data_subject_notifications jsonb NOT NULL DEFAULT '{}',
  lessons_learned text[] DEFAULT '{}',
  preventive_measures text[] DEFAULT '{}',
  related_incidents text[] DEFAULT '{}',
  documents text[] DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE cc_privacy_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_vendor_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_data_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_dpias ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_privacy_by_design_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_privacy_incidents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for cc_privacy_consent_records
-- ============================================================================

CREATE POLICY "Users can view their own consent records"
  ON cc_privacy_consent_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own consent records"
  ON cc_privacy_consent_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own consent records"
  ON cc_privacy_consent_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own consent records"
  ON cc_privacy_consent_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_vendor_assessments
-- ============================================================================

CREATE POLICY "Users can view their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_retention_policies
-- ============================================================================

CREATE POLICY "Users can view their own retention policies"
  ON cc_privacy_retention_policies
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own retention policies"
  ON cc_privacy_retention_policies
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own retention policies"
  ON cc_privacy_retention_policies
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own retention policies"
  ON cc_privacy_retention_policies
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_data_records
-- ============================================================================

CREATE POLICY "Users can view their own data records"
  ON cc_privacy_data_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own data records"
  ON cc_privacy_data_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own data records"
  ON cc_privacy_data_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own data records"
  ON cc_privacy_data_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_dpias
-- ============================================================================

CREATE POLICY "Users can view their own DPIAs"
  ON cc_privacy_dpias
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own DPIAs"
  ON cc_privacy_dpias
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own DPIAs"
  ON cc_privacy_dpias
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own DPIAs"
  ON cc_privacy_dpias
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_privacy_by_design_assessments
-- ============================================================================

CREATE POLICY "Users can view their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_service_providers
-- ============================================================================

CREATE POLICY "Users can view their own service providers"
  ON cc_privacy_service_providers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own service providers"
  ON cc_privacy_service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own service providers"
  ON cc_privacy_service_providers
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own service providers"
  ON cc_privacy_service_providers
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_privacy_incidents
-- ============================================================================

CREATE POLICY "Users can view their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Consent Records Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_consent_records_user_id ON cc_privacy_consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_consent_records_status ON cc_privacy_consent_records(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_consent_records_consent_type ON cc_privacy_consent_records(consent_type);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_consent_records_created_at ON cc_privacy_consent_records(created_at DESC);

-- Vendor Assessments Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_vendor_assessments_user_id ON cc_privacy_vendor_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_vendor_assessments_risk_level ON cc_privacy_vendor_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_vendor_assessments_compliance_status ON cc_privacy_vendor_assessments(compliance_status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_vendor_assessments_next_assessment_due ON cc_privacy_vendor_assessments(next_assessment_due);

-- Retention Policies Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_retention_policies_user_id ON cc_privacy_retention_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_retention_policies_status ON cc_privacy_retention_policies(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_retention_policies_next_review ON cc_privacy_retention_policies(next_review);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_retention_policies_data_category ON cc_privacy_retention_policies(data_category);

-- Data Records Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_records_user_id ON cc_privacy_data_records(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_records_status ON cc_privacy_data_records(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_records_retention_policy_id ON cc_privacy_data_records(retention_policy_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_records_retention_end_date ON cc_privacy_data_records(retention_end_date);

-- DPIAs Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_user_id ON cc_privacy_dpias(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_status ON cc_privacy_dpias(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_priority ON cc_privacy_dpias(priority);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_risk_level ON cc_privacy_dpias(risk_level);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_dpias_due_date ON cc_privacy_dpias(due_date);

-- Privacy by Design Assessments Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_pbd_assessments_user_id ON cc_privacy_privacy_by_design_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_pbd_assessments_status ON cc_privacy_privacy_by_design_assessments(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_pbd_assessments_compliance_status ON cc_privacy_privacy_by_design_assessments(compliance_status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_pbd_assessments_next_review_date ON cc_privacy_privacy_by_design_assessments(next_review_date);

-- Service Providers Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_service_providers_user_id ON cc_privacy_service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_service_providers_status ON cc_privacy_service_providers(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_service_providers_category ON cc_privacy_service_providers(category);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_service_providers_priority ON cc_privacy_service_providers(priority);

-- Privacy Incidents Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_privacy_incidents_user_id ON cc_privacy_privacy_incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_privacy_incidents_status ON cc_privacy_privacy_incidents(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_privacy_incidents_type ON cc_privacy_privacy_incidents(type);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_privacy_incidents_severity ON cc_privacy_privacy_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_privacy_incidents_reported_date ON cc_privacy_privacy_incidents(reported_date DESC);

-- ============================================================================
-- Triggers for updated_at timestamp
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_cc_privacy_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Create triggers for all tables
CREATE TRIGGER update_cc_privacy_consent_records_updated_at
  BEFORE UPDATE ON cc_privacy_consent_records
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_vendor_assessments_updated_at
  BEFORE UPDATE ON cc_privacy_vendor_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_retention_policies_updated_at
  BEFORE UPDATE ON cc_privacy_retention_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_data_records_updated_at
  BEFORE UPDATE ON cc_privacy_data_records
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_dpias_updated_at
  BEFORE UPDATE ON cc_privacy_dpias
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_pbd_assessments_updated_at
  BEFORE UPDATE ON cc_privacy_privacy_by_design_assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_service_providers_updated_at
  BEFORE UPDATE ON cc_privacy_service_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_privacy_incidents_updated_at
  BEFORE UPDATE ON cc_privacy_privacy_incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE cc_privacy_consent_records IS 'Consent Management records for tracking employee consent and privacy preferences';
COMMENT ON TABLE cc_privacy_vendor_assessments IS 'Vendor Risk Assessment records for evaluating third-party vendor compliance';
COMMENT ON TABLE cc_privacy_retention_policies IS 'Data Retention Policy records for managing data retention policies';
COMMENT ON TABLE cc_privacy_data_records IS 'Data records linked to retention policies for tracking data lifecycle';
COMMENT ON TABLE cc_privacy_dpias IS 'Data Protection Impact Assessment (DPIA) records with lifecycle tracking';
COMMENT ON TABLE cc_privacy_privacy_by_design_assessments IS 'Privacy by Design Assessment records for evaluating 7 principles';
COMMENT ON TABLE cc_privacy_service_providers IS 'Service Provider Management records for comprehensive processor management';
COMMENT ON TABLE cc_privacy_privacy_incidents IS 'Privacy Incident Response records for tracking privacy incidents and breaches';



-- ============================================================================
-- Migration: 20250202000001_subscriptions.sql
-- ============================================================================

-- Subscription Management Tables
-- This migration creates tables for managing user subscriptions, payments, and billing

-- Subscriptions table
CREATE TABLE IF NOT EXISTS cc_privacy_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled', 'past_due', 'trialing')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription history table (audit trail)
CREATE TABLE IF NOT EXISTS cc_privacy_subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES cc_privacy_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'cancelled', 'renewed', 'expired', 'reactivated')),
  old_tier TEXT,
  new_tier TEXT,
  old_status TEXT,
  new_status TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS cc_privacy_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account')),
  is_default BOOLEAN DEFAULT FALSE,
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS cc_privacy_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES cc_privacy_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  invoice_pdf TEXT,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON cc_privacy_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON cc_privacy_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON cc_privacy_subscriptions(stripe_subscription_id);

-- Unique index to ensure only one active subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_unique_active 
  ON cc_privacy_subscriptions(user_id, status) 
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription_id ON cc_privacy_subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON cc_privacy_subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON cc_privacy_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_payment_method_id ON cc_privacy_payment_methods(stripe_payment_method_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON cc_privacy_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON cc_privacy_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON cc_privacy_invoices(stripe_invoice_id);

-- Row Level Security (RLS) Policies
ALTER TABLE cc_privacy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON cc_privacy_subscriptions FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON cc_privacy_subscriptions FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- RLS Policies for subscription history
CREATE POLICY "Users can view their own subscription history"
  ON cc_privacy_subscription_history FOR SELECT
  USING ((select auth.uid()) = user_id);

-- RLS Policies for payment methods
CREATE POLICY "Users can view their own payment methods"
  ON cc_privacy_payment_methods FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON cc_privacy_payment_methods FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON cc_privacy_payment_methods FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON cc_privacy_payment_methods FOR DELETE
  USING ((select auth.uid()) = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON cc_privacy_invoices FOR SELECT
  USING ((select auth.uid()) = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON cc_privacy_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON cc_privacy_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON cc_privacy_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create subscription history entry
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

CREATE TRIGGER subscription_history_trigger
  AFTER INSERT OR UPDATE ON cc_privacy_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION create_subscription_history();

-- Comments for documentation
COMMENT ON TABLE cc_privacy_subscriptions IS 'User subscription records with Stripe integration';
COMMENT ON TABLE cc_privacy_subscription_history IS 'Audit trail for subscription changes';
COMMENT ON TABLE cc_privacy_payment_methods IS 'Stored payment methods for users';
COMMENT ON TABLE cc_privacy_invoices IS 'Invoice records from Stripe';




-- ============================================================================
-- Migration: 20250202000002_fix_function_search_path.sql
-- ============================================================================

-- Fix Function Search Path Security Warnings
-- This migration fixes all functions to have SET search_path = '' to prevent search path manipulation attacks
-- Run this migration after all other migrations to fix security warnings

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

-- Comments
COMMENT ON FUNCTION set_audit_fields() IS 'Sets audit fields with secure search_path';
COMMENT ON FUNCTION cleanup_anonymous_data() IS 'Cleans up anonymous data with secure search_path';
COMMENT ON FUNCTION anonymize_user_data(uuid) IS 'Anonymizes user data with secure search_path';
COMMENT ON FUNCTION update_updated_at_column() IS 'Updates updated_at timestamp with secure search_path';
COMMENT ON FUNCTION cleanup_expired_notifications() IS 'Cleans up expired notifications with secure search_path';
COMMENT ON FUNCTION update_cc_privacy_updated_at_column() IS 'Updates cc_privacy table updated_at with secure search_path';
COMMENT ON FUNCTION create_subscription_history() IS 'Creates subscription history with secure search_path';



-- ============================================================================
-- Migration: 20250202000003_fix_rls_performance.sql
-- ============================================================================

-- Fix RLS Performance Warnings
-- This migration optimizes all RLS policies to use (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation for each row and improves query performance at scale

-- ============================================================================
-- Fix RLS Policies for notifications tablea
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for automated_reports table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own reports" ON automated_reports;
CREATE POLICY "Users can view their own reports"
  ON automated_reports
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own reports" ON automated_reports;
CREATE POLICY "Users can insert their own reports"
  ON automated_reports
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own reports" ON automated_reports;
CREATE POLICY "Users can update their own reports"
  ON automated_reports
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own reports" ON automated_reports;
CREATE POLICY "Users can delete their own reports"
  ON automated_reports
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for compliance_health_scores table
-- ============================================================================
-- Also fix multiple permissive policies issue by combining SELECT policies

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

DROP POLICY IF EXISTS "Users can insert their own scores" ON compliance_health_scores;
CREATE POLICY "Users can insert their own scores"
  ON compliance_health_scores
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for scheduled_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can view their own assessments"
  ON scheduled_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can insert their own assessments"
  ON scheduled_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can update their own assessments"
  ON scheduled_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can delete their own assessments"
  ON scheduled_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for alert_rules table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own alert rules" ON alert_rules;
CREATE POLICY "Users can view their own alert rules"
  ON alert_rules
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own alert rules" ON alert_rules;
CREATE POLICY "Users can insert their own alert rules"
  ON alert_rules
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own alert rules" ON alert_rules;
CREATE POLICY "Users can update their own alert rules"
  ON alert_rules
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own alert rules" ON alert_rules;
CREATE POLICY "Users can delete their own alert rules"
  ON alert_rules
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for notification_preferences table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own preferences" ON notification_preferences;
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON notification_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON notification_preferences;
CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_consent_records table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can view their own consent records"
  ON cc_privacy_consent_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can insert their own consent records"
  ON cc_privacy_consent_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can update their own consent records"
  ON cc_privacy_consent_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can delete their own consent records"
  ON cc_privacy_consent_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_vendor_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can view their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can insert their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can update their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can delete their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_retention_policies table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can view their own retention policies"
  ON cc_privacy_retention_policies
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can insert their own retention policies"
  ON cc_privacy_retention_policies
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can update their own retention policies"
  ON cc_privacy_retention_policies
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can delete their own retention policies"
  ON cc_privacy_retention_policies
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_data_records table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can view their own data records"
  ON cc_privacy_data_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can insert their own data records"
  ON cc_privacy_data_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can update their own data records"
  ON cc_privacy_data_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can delete their own data records"
  ON cc_privacy_data_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_dpias table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can view their own DPIAs"
  ON cc_privacy_dpias
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can insert their own DPIAs"
  ON cc_privacy_dpias
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can update their own DPIAs"
  ON cc_privacy_dpias
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can delete their own DPIAs"
  ON cc_privacy_dpias
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_by_design_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can view their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can insert their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can update their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can delete their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_service_providers table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can view their own service providers"
  ON cc_privacy_service_providers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can insert their own service providers"
  ON cc_privacy_service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can update their own service providers"
  ON cc_privacy_service_providers
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can delete their own service providers"
  ON cc_privacy_service_providers
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_incidents table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can view their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can insert their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can update their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can delete their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscriptions table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can insert their own subscriptions"
  ON cc_privacy_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON cc_privacy_subscriptions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscription_history table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscription history" ON cc_privacy_subscription_history;
CREATE POLICY "Users can view their own subscription history"
  ON cc_privacy_subscription_history
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_payment_methods table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can view their own payment methods"
  ON cc_privacy_payment_methods
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can insert their own payment methods"
  ON cc_privacy_payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can update their own payment methods"
  ON cc_privacy_payment_methods
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can delete their own payment methods"
  ON cc_privacy_payment_methods
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_invoices table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own invoices" ON cc_privacy_invoices;
CREATE POLICY "Users can view their own invoices"
  ON cc_privacy_invoices
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Comments
COMMENT ON POLICY "Users can view scores" ON compliance_health_scores IS 'Optimized RLS policy: Users can view their own scores or aggregated scores for benchmarking';



-- ============================================================================
-- Migration: 20250202000004_combined_fixes.sql
-- ============================================================================

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



-- ============================================================================
-- Migration: 20250203000000_calendar_events.sql
-- ============================================================================

/*
  # Calendar Events Database Schema
  
  This migration creates the calendar_events table for compliance activity scheduling:
  - Supports multiple event types (assessment, audit, review, etc.)
  - Tracks attendees, notifications, and related items
  - Includes recurrence patterns for recurring events
  - Full RLS policies for user-based access control
*/

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN (
    'assessment',
    'control-review',
    'evidence-collection',
    'policy-review',
    'training',
    'audit',
    'risk-assessment',
    'incident-review',
    'milestone',
    'deadline'
  )),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  all_day boolean NOT NULL DEFAULT false,
  recurrence jsonb,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN (
    'scheduled',
    'in-progress',
    'completed',
    'cancelled',
    'overdue'
  )),
  attendees jsonb DEFAULT '[]',
  location text,
  related_items jsonb DEFAULT '[]',
  notifications jsonb DEFAULT '[]',
  category text DEFAULT 'compliance',
  tags jsonb DEFAULT '[]',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);

-- Create index on start_date for date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_priority ON calendar_events(priority);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, start_date);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own events
CREATE POLICY "Users can view their own calendar events"
  ON calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own events
CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own events
CREATE POLICY "Users can update their own calendar events"
  ON calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own events
CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();




-- ============================================================================
-- Migration: 20250729162343_orange_band.sql
-- ============================================================================

/*
  # Create policy_generators table

  1. New Tables
    - `policy_generators`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `organization_info` (jsonb)
      - `selected_industry` (text)
      - `selected_policies` (text[])
      - `selected_compliance` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `toolkit_analytics`
      - `id` (uuid, primary key)
      - `tool_name` (text)
      - `action` (text)
      - `session_id` (text)
      - `organization_name` (text)
      - `data` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create policy_generators table
CREATE TABLE IF NOT EXISTS policy_generators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  organization_info jsonb NOT NULL DEFAULT '{}',
  selected_industry text DEFAULT '',
  selected_policies text[] DEFAULT '{}',
  selected_compliance text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create toolkit_analytics table
CREATE TABLE IF NOT EXISTS toolkit_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  action text NOT NULL,
  session_id text,
  organization_name text,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE policy_generators ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolkit_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for policy_generators
CREATE POLICY "Allow public read access to policy_generators"
  ON policy_generators
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to policy_generators"
  ON policy_generators
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to policy_generators"
  ON policy_generators
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for toolkit_analytics
CREATE POLICY "Allow public insert access to toolkit_analytics"
  ON toolkit_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policy_generators_session_id ON policy_generators(session_id);
CREATE INDEX IF NOT EXISTS idx_policy_generators_created_at ON policy_generators(created_at);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_tool_name ON toolkit_analytics(tool_name);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_session_id ON toolkit_analytics(session_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql' SET search_path = '';

CREATE TRIGGER update_policy_generators_updated_at
    BEFORE UPDATE ON policy_generators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Migration: 20251217000000_one_time_purchases.sql
-- ============================================================================

/*
  # One-Time Purchases Table
  
  This migration creates the table for storing one-time product purchases.
  Used by the Stripe webhook to record purchases and generate license keys.
  
  Table: cc_one_time_purchases
  Purpose: Track one-time product purchases, license keys, and purchase history
*/

-- Create one-time purchases table
CREATE TABLE IF NOT EXISTS cc_one_time_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  license_key TEXT NOT NULL UNIQUE,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'expired', 'revoked')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- For annual licenses (if applicable)
  metadata JSONB DEFAULT '{}'::jsonb, -- Store additional product/purchase info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_id ON cc_one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_product_id ON cc_one_time_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_license_key ON cc_one_time_purchases(license_key);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_stripe_session ON cc_one_time_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_status ON cc_one_time_purchases(status);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_purchased_at ON cc_one_time_purchases(purchased_at DESC);

-- Enable RLS
ALTER TABLE cc_one_time_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON cc_one_time_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchases (for manual license activation)
CREATE POLICY "Users can insert their own purchases"
  ON cc_one_time_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for webhook processing)
CREATE POLICY "Service role has full access"
  ON cc_one_time_purchases
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_one_time_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_one_time_purchases_updated_at
  BEFORE UPDATE ON cc_one_time_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_one_time_purchases_updated_at();

-- Add comment
COMMENT ON TABLE cc_one_time_purchases IS 'Stores one-time product purchases with license keys generated via Stripe webhook';
COMMENT ON COLUMN cc_one_time_purchases.license_key IS 'Unique license key for product activation';
COMMENT ON COLUMN cc_one_time_purchases.amount IS 'Purchase amount in cents';
COMMENT ON COLUMN cc_one_time_purchases.metadata IS 'Additional purchase/product information in JSON format';

-- ============================================================================
-- Migration: 20250220000000_privacy_risk_radar.sql
-- ============================================================================

/*
  # CyberCorrect Privacy Platform - Privacy Risk Radar Schema
  
  This migration creates the table for Privacy Risk Radar risk detections.
  The Privacy Risk Radar continuously monitors privacy compliance and detects
  risks from real data across all privacy tools.
  
  All tables use the "cc_privacy_" prefix to differentiate from other projects
  in the same Supabase instance and avoid naming conflicts.
  
  All tables include RLS policies for user-based access control.
*/

-- ============================================================================
-- Privacy Risk Detections - cc_privacy_risk_detections
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_risk_detections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  risk_id text NOT NULL,
  category text NOT NULL CHECK (category IN ('data_collection', 'data_storage', 'data_sharing', 'consent', 'access_rights', 'breach_risk', 'retention')),
  severity text NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  title text NOT NULL,
  description text NOT NULL,
  regulation text[] DEFAULT '{}',
  detected_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'accepted', 'monitoring', 'false_positive')),
  affected_systems text[] DEFAULT '{}',
  data_subjects_count integer DEFAULT 0,
  remediation_steps text[] DEFAULT '{}',
  trend text CHECK (trend IN ('increasing', 'stable', 'decreasing')),
  source_type text NOT NULL CHECK (source_type IN ('consent', 'vendor', 'dpia', 'dsar', 'retention', 'incident', 'assessment')),
  source_id uuid,
  assigned_to text,
  due_date date,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, risk_id)
);

-- ============================================================================
-- Enable RLS
-- ============================================================================

ALTER TABLE cc_privacy_risk_detections ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for cc_privacy_risk_detections
-- ============================================================================

CREATE POLICY "Users can view their own risk detections"
  ON cc_privacy_risk_detections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own risk detections"
  ON cc_privacy_risk_detections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own risk detections"
  ON cc_privacy_risk_detections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own risk detections"
  ON cc_privacy_risk_detections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_user_id ON cc_privacy_risk_detections(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_status ON cc_privacy_risk_detections(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_severity ON cc_privacy_risk_detections(severity);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_category ON cc_privacy_risk_detections(category);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_detected_at ON cc_privacy_risk_detections(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_source_type ON cc_privacy_risk_detections(source_type);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_risk_detections_user_risk_id ON cc_privacy_risk_detections(user_id, risk_id);

-- ============================================================================
-- Trigger for updated_at timestamp
-- ============================================================================

CREATE TRIGGER update_cc_privacy_risk_detections_updated_at
  BEFORE UPDATE ON cc_privacy_risk_detections
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE cc_privacy_risk_detections IS 'Privacy Risk Radar - Detected privacy compliance risks from continuous monitoring';
COMMENT ON COLUMN cc_privacy_risk_detections.risk_id IS 'Unique identifier for the risk (e.g., CONSENT-EXPIRED-1234567890)';
COMMENT ON COLUMN cc_privacy_risk_detections.source_type IS 'Type of source that triggered the risk detection';
COMMENT ON COLUMN cc_privacy_risk_detections.source_id IS 'ID of the source record (e.g., consent record ID, vendor assessment ID)';

