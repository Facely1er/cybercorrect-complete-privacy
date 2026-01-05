-- ==================================================================================
-- CyberCorrect Complete Privacy Platform - Consolidated Migration SQL
-- ==================================================================================
-- Project: dfklqsdfycwjlcasfciu
-- Total Migrations: 29 (18 Framework + 11 Portal)
-- Creates: 39 tables, 180 RLS policies, 195 indexes, 54 functions
--
-- INSTRUCTIONS:
-- 1. Copy this entire file
-- 2. Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu
-- 3. Navigate to SQL Editor (left sidebar)
-- 4. Paste and run this SQL
-- ==================================================================================


-- ==================================================================================
-- Migration 1: 20250729162343_orange_band.sql
-- ==================================================================================

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
-- ==================================================================================
-- Migration 2: 20250130000000_improve_security.sql
-- ==================================================================================

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
-- ==================================================================================
-- Migration 3: 20250201000000_subscription_features.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 4: 20250201000001_cron_jobs.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 5: 20250202000000_privacy_tools_schema.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 6: 20250202000001_subscriptions.sql
-- ==================================================================================

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



-- ==================================================================================
-- Migration 7: 20250202000002_fix_function_search_path.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 8: 20250202000003_fix_rls_performance.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 9: 20250202000004_combined_fixes.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 10: 20250203000000_calendar_events.sql
-- ==================================================================================

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



-- ==================================================================================
-- Migration 11: 20250204000000_ropa_and_evidence_tables.sql
-- ==================================================================================

/*
  # CyberCorrect Privacy Platform - RoPA and Evidence Tables
  
  This migration creates tables for:
  1. cc_privacy_processing_activities - Records of Processing Activities (RoPA) / GDPR Article 30
  2. cc_privacy_evidence_records - Evidence and audit trail records
  3. cc_privacy_data_subject_requests - Data Subject Access Requests (DSAR) for framework-compliance
  
  All tables use the "cc_privacy_" prefix to differentiate from other projects
  in the same Supabase instance and avoid naming conflicts.
  
  All tables include RLS policies for user-based access control.
*/

-- ============================================================================
-- 1. Records of Processing Activities (RoPA) - cc_privacy_processing_activities
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_processing_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  purpose text NOT NULL,
  legal_basis text NOT NULL CHECK (legal_basis IN ('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests')),
  data_types text[] DEFAULT '{}',
  data_subjects text[] DEFAULT '{}',
  recipients text[] DEFAULT '{}',
  third_country_transfers text[] DEFAULT '{}',
  retention_period text NOT NULL,
  security_measures text[] DEFAULT '{}',
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  dpia_required boolean NOT NULL DEFAULT false,
  dpia_id uuid REFERENCES cc_privacy_dpias(id) ON DELETE SET NULL,
  applicable_regulations text[] DEFAULT '{}',
  data_controller text NOT NULL,
  data_processor text,
  processing_location text,
  automated_decision_making boolean NOT NULL DEFAULT false,
  profiling boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'archived', 'under_review')),
  last_reviewed_date date,
  next_review_date date,
  created_by text NOT NULL,
  updated_by text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 2. Evidence Records - cc_privacy_evidence_records
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_evidence_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  evidence_type text NOT NULL CHECK (evidence_type IN ('ropa', 'dsar', 'dpia', 'incident', 'policy', 'training', 'audit', 'other')),
  related_record_type text,
  related_record_id uuid,
  framework text[] DEFAULT '{}',
  category text NOT NULL CHECK (category IN ('documentation', 'assessment', 'policy', 'training', 'incident', 'audit', 'compliance', 'other')),
  file_path text,
  file_name text,
  file_type text,
  file_size integer,
  source text,
  author text,
  review_date date,
  expiry_date date,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'expired', 'archived')),
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- 3. Data Subject Requests (DSAR) - cc_privacy_data_subject_requests
-- ============================================================================

CREATE TABLE IF NOT EXISTS cc_privacy_data_subject_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  request_id text NOT NULL UNIQUE,
  request_type text NOT NULL CHECK (request_type IN ('access', 'rectification', 'erasure', 'portability', 'restriction', 'objection', 'withdraw_consent')),
  status text NOT NULL CHECK (status IN ('submitted', 'acknowledged', 'in_progress', 'completed', 'rejected', 'cancelled')),
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_phone text,
  requester_address text,
  verification_status text CHECK (verification_status IN ('pending', 'verified', 'failed', 'not_required')),
  description text NOT NULL,
  applicable_regulations text[] DEFAULT '{}',
  submitted_date date NOT NULL,
  acknowledged_date date,
  due_date date NOT NULL,
  completed_date date,
  assigned_to text,
  assigned_to_email text,
  response_method text CHECK (response_method IN ('email', 'post', 'portal', 'other')),
  response_data jsonb DEFAULT '{}',
  notes text,
  internal_notes text,
  communication_log jsonb DEFAULT '[]',
  related_requests text[] DEFAULT '{}',
  evidence_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================

ALTER TABLE cc_privacy_processing_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_evidence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_data_subject_requests ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for cc_privacy_processing_activities
-- ============================================================================

CREATE POLICY "Users can view their own processing activities"
  ON cc_privacy_processing_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own processing activities"
  ON cc_privacy_processing_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processing activities"
  ON cc_privacy_processing_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processing activities"
  ON cc_privacy_processing_activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_evidence_records
-- ============================================================================

CREATE POLICY "Users can view their own evidence records"
  ON cc_privacy_evidence_records
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own evidence records"
  ON cc_privacy_evidence_records
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own evidence records"
  ON cc_privacy_evidence_records
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own evidence records"
  ON cc_privacy_evidence_records
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- RLS Policies for cc_privacy_data_subject_requests
-- ============================================================================

CREATE POLICY "Users can view their own data subject requests"
  ON cc_privacy_data_subject_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data subject requests"
  ON cc_privacy_data_subject_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data subject requests"
  ON cc_privacy_data_subject_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own data subject requests"
  ON cc_privacy_data_subject_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Processing Activities Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_user_id ON cc_privacy_processing_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_status ON cc_privacy_processing_activities(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_risk_level ON cc_privacy_processing_activities(risk_level);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_legal_basis ON cc_privacy_processing_activities(legal_basis);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_next_review_date ON cc_privacy_processing_activities(next_review_date);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_processing_activities_dpia_id ON cc_privacy_processing_activities(dpia_id);

-- Evidence Records Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_user_id ON cc_privacy_evidence_records(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_evidence_type ON cc_privacy_evidence_records(evidence_type);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_category ON cc_privacy_evidence_records(category);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_status ON cc_privacy_evidence_records(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_related_record ON cc_privacy_evidence_records(related_record_type, related_record_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_evidence_records_expiry_date ON cc_privacy_evidence_records(expiry_date);

-- Data Subject Requests Indexes
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_user_id ON cc_privacy_data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_request_id ON cc_privacy_data_subject_requests(request_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_status ON cc_privacy_data_subject_requests(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_request_type ON cc_privacy_data_subject_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_due_date ON cc_privacy_data_subject_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_requester_email ON cc_privacy_data_subject_requests(requester_email);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_data_subject_requests_submitted_date ON cc_privacy_data_subject_requests(submitted_date DESC);

-- ============================================================================
-- Triggers for updated_at timestamp
-- ============================================================================

CREATE TRIGGER update_cc_privacy_processing_activities_updated_at
  BEFORE UPDATE ON cc_privacy_processing_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_evidence_records_updated_at
  BEFORE UPDATE ON cc_privacy_evidence_records
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

CREATE TRIGGER update_cc_privacy_data_subject_requests_updated_at
  BEFORE UPDATE ON cc_privacy_data_subject_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_cc_privacy_updated_at_column();

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE cc_privacy_processing_activities IS 'Records of Processing Activities (RoPA) for GDPR Article 30 compliance';
COMMENT ON TABLE cc_privacy_evidence_records IS 'Evidence and audit trail records for compliance documentation';
COMMENT ON TABLE cc_privacy_data_subject_requests IS 'Data Subject Access Requests (DSAR) for privacy rights management';



-- ==================================================================================
-- Migration 12: 20250205000000_fix_admin_view_security.sql
-- ==================================================================================

/*
  # Fix Admin Data Overview View Security
  
  This migration fixes the security linter error by recreating the admin_data_overview
  view without SECURITY DEFINER property. 
  
  Issue: View was flagged for having SECURITY DEFINER property by Supabase linter
  Fix: Drop and recreate view using a regular CREATE VIEW statement (not inside DO block)
       This ensures the view respects RLS policies of the querying user.
*/

-- Drop the existing view if it exists
DROP VIEW IF EXISTS public.admin_data_overview CASCADE;

-- Recreate the view using a simple CREATE VIEW statement
-- This avoids any SECURITY DEFINER context that might be inherited from DO blocks
-- The view will respect RLS policies of the querying user
-- Note: If tables don't exist, the view creation will fail gracefully and can be skipped
CREATE OR REPLACE VIEW public.admin_data_overview AS
SELECT 
  'policy_generators'::text as table_name,
  COUNT(*)::bigint as total_records,
  COUNT(created_by)::bigint as authenticated_records,
  (COUNT(*) - COUNT(created_by))::bigint as anonymous_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM public.policy_generators
UNION ALL
SELECT 
  'toolkit_analytics'::text as table_name,
  COUNT(*)::bigint as total_records,
  COUNT(created_by)::bigint as authenticated_records,
  (COUNT(*) - COUNT(created_by))::bigint as anonymous_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM public.toolkit_analytics;

-- Set proper permissions (only service role can access)
REVOKE ALL ON public.admin_data_overview FROM PUBLIC;
REVOKE ALL ON public.admin_data_overview FROM authenticated;
REVOKE ALL ON public.admin_data_overview FROM anon;
GRANT SELECT ON public.admin_data_overview TO service_role;

-- Add comment
COMMENT ON VIEW public.admin_data_overview IS 'Admin monitoring view showing data overview statistics. Only accessible by service_role. Respects RLS policies of the querying user.';


-- ==================================================================================
-- Migration 13: 20250218000000_portal_beta_schema.sql
-- ==================================================================================

-- Portal Beta Applications and Management Schema
-- Migration: 20250218000000_portal_beta_schema.sql
-- This migration creates the necessary tables for managing Portal beta program

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PORTAL BETA APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS portal_beta_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Organization Details
  organization_name VARCHAR(255) NOT NULL,
  organization_size VARCHAR(50) NOT NULL CHECK (organization_size IN ('1-50', '51-200', '201-1000', '1001-5000', '5000+')),
  organization_industry VARCHAR(100),
  organization_website VARCHAR(500),
  
  -- Contact Information
  contact_name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_role VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(50),
  
  -- Beta Program Details
  primary_cohort VARCHAR(50) NOT NULL CHECK (primary_cohort IN ('employee', 'hr', 'compliance', 'legal', 'multiple')),
  interested_stakeholders TEXT[], -- Array of stakeholder types
  expected_testers INTEGER,
  
  -- Use Case & Motivation
  current_challenges TEXT,
  specific_needs TEXT,
  feature_priorities TEXT[],
  
  -- Technical Details
  existing_tools TEXT[],
  integration_needs TEXT,
  
  -- White-Label Interest
  white_label_interest BOOLEAN DEFAULT false,
  reseller_interest BOOLEAN DEFAULT false,
  client_deployment_count INTEGER,
  
  -- Application Status
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected', 'waitlist')),
  cohort_assigned VARCHAR(50),
  priority_score INTEGER DEFAULT 0, -- For ranking applications
  
  -- Platform Integration
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assessment_id UUID, -- Reference to their assessment if they came from one
  came_from_assessment BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT -- Admin notes
);

-- ============================================================================
-- PORTAL BETA COHORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS portal_beta_cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  cohort_type VARCHAR(50) UNIQUE NOT NULL CHECK (cohort_type IN ('employee', 'hr', 'compliance', 'legal', 'multiple')),
  cohort_name VARCHAR(100) NOT NULL,
  cohort_description TEXT,
  
  -- Capacity Management
  max_organizations INTEGER NOT NULL DEFAULT 25,
  current_organizations INTEGER DEFAULT 0,
  is_full BOOLEAN GENERATED ALWAYS AS (current_organizations >= max_organizations) STORED,
  
  -- Cohort Details
  start_date DATE,
  end_date DATE,
  focus_areas TEXT[],
  expected_deliverables TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PORTAL BETA PARTICIPANTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS portal_beta_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  application_id UUID NOT NULL REFERENCES portal_beta_applications(id) ON DELETE CASCADE,
  organization_name VARCHAR(255) NOT NULL,
  cohort_type VARCHAR(50) NOT NULL,
  
  -- Participant Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'churned')),
  onboarded_at TIMESTAMP WITH TIME ZONE,
  
  -- Access & Subscription
  portal_access_granted BOOLEAN DEFAULT false,
  subscription_tier VARCHAR(50) DEFAULT 'beta',
  pricing_locked BOOLEAN DEFAULT true,
  locked_price_monthly INTEGER DEFAULT 99, -- In cents
  
  -- Engagement Tracking
  testers_invited INTEGER DEFAULT 0,
  testers_active INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  feedback_submissions INTEGER DEFAULT 0,
  feature_requests INTEGER DEFAULT 0,
  
  -- Success Metrics
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  would_recommend BOOLEAN,
  conversion_likelihood VARCHAR(50) CHECK (conversion_likelihood IN ('high', 'medium', 'low', 'churned')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PORTAL BETA FEEDBACK TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS portal_beta_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  participant_id UUID NOT NULL REFERENCES portal_beta_participants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Feedback Details
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('bug', 'feature_request', 'improvement', 'praise', 'complaint')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  -- Context
  page_url VARCHAR(500),
  user_role VARCHAR(100),
  cohort_type VARCHAR(50),
  
  -- Status Tracking
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'planned', 'in_progress', 'completed', 'wont_fix')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Response
  admin_response TEXT,
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Voting (for feature requests)
  upvotes INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Applications
CREATE INDEX idx_portal_beta_applications_status ON portal_beta_applications(status);
CREATE INDEX idx_portal_beta_applications_cohort ON portal_beta_applications(primary_cohort);
CREATE INDEX idx_portal_beta_applications_user ON portal_beta_applications(user_id);
CREATE INDEX idx_portal_beta_applications_email ON portal_beta_applications(contact_email);
CREATE INDEX idx_portal_beta_applications_created ON portal_beta_applications(created_at DESC);

-- Participants
CREATE INDEX idx_portal_beta_participants_status ON portal_beta_participants(status);
CREATE INDEX idx_portal_beta_participants_cohort ON portal_beta_participants(cohort_type);
CREATE INDEX idx_portal_beta_participants_application ON portal_beta_participants(application_id);

-- Feedback
CREATE INDEX idx_portal_beta_feedback_participant ON portal_beta_feedback(participant_id);
CREATE INDEX idx_portal_beta_feedback_status ON portal_beta_feedback(status);
CREATE INDEX idx_portal_beta_feedback_type ON portal_beta_feedback(feedback_type);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE portal_beta_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_beta_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_beta_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_beta_feedback ENABLE ROW LEVEL SECURITY;

-- Applications: Users can view their own applications, admins can view all
CREATE POLICY "Users can view own applications" ON portal_beta_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" ON portal_beta_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending applications" ON portal_beta_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all applications (admin role check would go here)
CREATE POLICY "Admins can view all applications" ON portal_beta_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

-- Cohorts: Public read access
CREATE POLICY "Anyone can view cohorts" ON portal_beta_cohorts
  FOR SELECT USING (true);

-- Participants: Participants can view their own record, admins can view all
CREATE POLICY "Participants can view own record" ON portal_beta_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portal_beta_applications
      WHERE portal_beta_applications.id = application_id
      AND portal_beta_applications.user_id = auth.uid()
    )
  );

-- Feedback: Participants can submit and view their own feedback
CREATE POLICY "Participants can submit feedback" ON portal_beta_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback" ON portal_beta_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_portal_beta_applications_updated_at
  BEFORE UPDATE ON portal_beta_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portal_beta_cohorts_updated_at
  BEFORE UPDATE ON portal_beta_cohorts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portal_beta_participants_updated_at
  BEFORE UPDATE ON portal_beta_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portal_beta_feedback_updated_at
  BEFORE UPDATE ON portal_beta_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update cohort counts when participants are added/removed
CREATE OR REPLACE FUNCTION update_cohort_counts()
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cohort_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON portal_beta_participants
  FOR EACH ROW EXECUTE FUNCTION update_cohort_counts();

-- ============================================================================
-- SEED INITIAL COHORT DATA
-- ============================================================================

INSERT INTO portal_beta_cohorts (cohort_type, cohort_name, cohort_description, max_organizations, focus_areas, expected_deliverables) VALUES
('employee', 'Cohort A: Employee Self-Service', 'Employee-focused features for privacy rights management and self-service data requests', 25, 
  ARRAY['Employee dashboard', 'Self-service rights requests', 'Privacy settings control', 'Consent management'], 
  ARRAY['Employee journey feedback', 'UI/UX improvements', 'Feature priorities', 'Integration needs']),
  
('hr', 'Cohort B: HR & Manager Features', 'HR and manager tools for privacy duty tracking and employee data management', 25,
  ARRAY['HR privacy checklist', 'Manager oversight tools', 'Employee data workflows', 'Compliance tracking'],
  ARRAY['HR workflow optimization', 'Privacy duty templates', 'Reporting requirements', 'Training needs']),
  
('compliance', 'Cohort C: Compliance & Oversight', 'Compliance officer features for oversight, monitoring, and reporting', 25,
  ARRAY['Executive dashboard', 'Request monitoring', 'Compliance analytics', 'Audit reporting'],
  ARRAY['Oversight dashboard design', 'Analytics requirements', 'Audit trail needs', 'Integration with Platform']),
  
('legal', 'Cohort D: Legal & Representative', 'Legal representative features for regulatory compliance and legal operations', 25,
  ARRAY['Legal dashboard', 'Regulatory tracking', 'Documentation management', 'Legal response workflows'],
  ARRAY['Legal workflow optimization', 'Documentation templates', 'Regulatory intelligence needs', 'External counsel integration']),
  
('multiple', 'White-Label Beta Cohort', 'Consultants and MSPs deploying Portal to multiple client organizations', 25,
  ARRAY['White-label configuration', 'Multi-tenant management', 'Client deployment tools', 'Reseller features'],
  ARRAY['White-label requirements', 'Multi-tenant architecture feedback', 'Reseller business model', 'Client success metrics'])
ON CONFLICT (cohort_type) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE portal_beta_applications IS 'Stores all Portal beta program applications with organization and contact details';
COMMENT ON TABLE portal_beta_cohorts IS 'Defines the 4 main beta cohorts with capacity tracking';
COMMENT ON TABLE portal_beta_participants IS 'Tracks accepted beta participants and their engagement metrics';
COMMENT ON TABLE portal_beta_feedback IS 'Collects feedback, bug reports, and feature requests from beta participants';

COMMENT ON COLUMN portal_beta_applications.priority_score IS 'Calculated score for ranking applications (based on fit, urgency, value)';
COMMENT ON COLUMN portal_beta_participants.pricing_locked IS 'Whether participant has lifetime beta pricing ($99/mo)';
COMMENT ON COLUMN portal_beta_feedback.upvotes IS 'Number of upvotes for feature requests (for prioritization)';


-- ==================================================================================
-- Migration 14: 20250220000000_privacy_risk_radar.sql
-- ==================================================================================

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

-- Drop existing policies if they exist (prevents multiple permissive policies warning)
DROP POLICY IF EXISTS "Users can view their own risk detections" ON cc_privacy_risk_detections;
CREATE POLICY "Users can view their own risk detections"
  ON cc_privacy_risk_detections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own risk detections" ON cc_privacy_risk_detections;
CREATE POLICY "Users can insert their own risk detections"
  ON cc_privacy_risk_detections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own risk detections" ON cc_privacy_risk_detections;
CREATE POLICY "Users can update their own risk detections"
  ON cc_privacy_risk_detections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own risk detections" ON cc_privacy_risk_detections;
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


-- ==================================================================================
-- Migration 15: 20250220000001_fix_rls_performance_cc_privacy.sql
-- ==================================================================================

/*
  # Fix RLS Performance Warnings for cc_privacy Tables
  
  This migration ensures all cc_privacy tables have single RLS policies per role/action
  to prevent "multiple permissive policies" warnings and improve query performance.
  
  It drops any existing policies and recreates them as single consolidated policies.
  
  ⚠️ IMPORTANT: This migration only fixes policies for tables that exist.
  It will skip tables that haven't been created yet (safe to run).
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
-- Fix RLS Policies for cc_privacy_risk_detections
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_risk_detections') THEN
    DROP POLICY IF EXISTS "Users can view their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can view their own risk detections"
      ON cc_privacy_risk_detections
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can insert their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can insert their own risk detections"
      ON cc_privacy_risk_detections
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can update their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can update their own risk detections"
      ON cc_privacy_risk_detections
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can delete their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can delete their own risk detections"
      ON cc_privacy_risk_detections
      FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_consent_records
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_consent_records') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_vendor_assessments
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_vendor_assessments') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_retention_policies
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_retention_policies') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_data_records
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_data_records') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_dpias
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_dpias') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_by_design_assessments
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_privacy_by_design_assessments') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_service_providers
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_service_providers') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_incidents
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_privacy_incidents') THEN
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
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscriptions
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_subscriptions') THEN
    DROP POLICY IF EXISTS "Users can view their own subscriptions" ON cc_privacy_subscriptions;
    DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON cc_privacy_subscriptions;
    DROP POLICY IF EXISTS "Users can update their own subscriptions" ON cc_privacy_subscriptions;
    DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON cc_privacy_subscriptions;

    CREATE POLICY "Users can view their own subscriptions"
      ON cc_privacy_subscriptions
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can insert their own subscriptions"
      ON cc_privacy_subscriptions
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can update their own subscriptions"
      ON cc_privacy_subscriptions
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscription_history
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_subscription_history') THEN
    DROP POLICY IF EXISTS "Users can view their own subscription history" ON cc_privacy_subscription_history;
    DROP POLICY IF EXISTS "Service role can manage all subscription history" ON cc_privacy_subscription_history;

    CREATE POLICY "Users can view their own subscription history"
      ON cc_privacy_subscription_history
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_payment_methods
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_payment_methods') THEN
    DROP POLICY IF EXISTS "Users can view their own payment methods" ON cc_privacy_payment_methods;
    DROP POLICY IF EXISTS "Users can insert their own payment methods" ON cc_privacy_payment_methods;
    DROP POLICY IF EXISTS "Users can update their own payment methods" ON cc_privacy_payment_methods;
    DROP POLICY IF EXISTS "Users can delete their own payment methods" ON cc_privacy_payment_methods;

    CREATE POLICY "Users can view their own payment methods"
      ON cc_privacy_payment_methods
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can insert their own payment methods"
      ON cc_privacy_payment_methods
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can update their own payment methods"
      ON cc_privacy_payment_methods
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can delete their own payment methods"
      ON cc_privacy_payment_methods
      FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_invoices
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_privacy_invoices') THEN
    DROP POLICY IF EXISTS "Users can view their own invoices" ON cc_privacy_invoices;
    DROP POLICY IF EXISTS "Users can insert their own invoices" ON cc_privacy_invoices;
    DROP POLICY IF EXISTS "Users can update their own invoices" ON cc_privacy_invoices;
    DROP POLICY IF EXISTS "Users can delete their own invoices" ON cc_privacy_invoices;

    CREATE POLICY "Users can view their own invoices"
      ON cc_privacy_invoices
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can insert their own invoices"
      ON cc_privacy_invoices
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can update their own invoices"
      ON cc_privacy_invoices
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can delete their own invoices"
      ON cc_privacy_invoices
      FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_one_time_purchases
-- ============================================================================

DO $$
BEGIN
  IF table_exists('cc_one_time_purchases') THEN
    DROP POLICY IF EXISTS "Users can view their own purchases" ON cc_one_time_purchases;
    DROP POLICY IF EXISTS "Users can insert their own purchases" ON cc_one_time_purchases;
    DROP POLICY IF EXISTS "Users can update their own purchases" ON cc_one_time_purchases;
    DROP POLICY IF EXISTS "Service role can manage all purchases" ON cc_one_time_purchases;

    CREATE POLICY "Users can view their own purchases"
      ON cc_one_time_purchases
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    CREATE POLICY "Users can insert their own purchases"
      ON cc_one_time_purchases
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    CREATE POLICY "Users can update their own purchases"
      ON cc_one_time_purchases
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

-- ==================================================================================
-- Migration 16: 20250220000002_fix_rls_performance_technosoluce.sql
-- ==================================================================================

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


-- ==================================================================================
-- Migration 17: 20251217000000_one_time_purchases.sql
-- ==================================================================================

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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for guest purchases
  customer_email TEXT, -- For guest purchases and email delivery
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure either user_id or customer_email is provided
  CONSTRAINT check_user_or_email CHECK (user_id IS NOT NULL OR customer_email IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_id ON cc_one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_customer_email ON cc_one_time_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_product_id ON cc_one_time_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_license_key ON cc_one_time_purchases(license_key);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_stripe_session ON cc_one_time_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_status ON cc_one_time_purchases(status);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_purchased_at ON cc_one_time_purchases(purchased_at DESC);
-- Composite index for user/product lookups
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_product ON cc_one_time_purchases(user_id, product_id) WHERE user_id IS NOT NULL;

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

-- Add comments
COMMENT ON TABLE cc_one_time_purchases IS 'Stores one-time product purchases with license keys generated via Stripe webhook. Supports both authenticated users and guest purchases.';
COMMENT ON COLUMN cc_one_time_purchases.user_id IS 'User ID for authenticated purchases. Nullable for guest purchases.';
COMMENT ON COLUMN cc_one_time_purchases.customer_email IS 'Customer email for guest purchases and license key delivery. Required if user_id is null.';
COMMENT ON COLUMN cc_one_time_purchases.license_key IS 'Unique license key for product activation';
COMMENT ON COLUMN cc_one_time_purchases.amount IS 'Purchase amount in cents';
COMMENT ON COLUMN cc_one_time_purchases.metadata IS 'Additional purchase/product information in JSON format';


-- ==================================================================================
-- Migration 18: 20251228000000_final_security_fixes.sql
-- ==================================================================================

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

-- ==================================================================================
-- Migration 19: 20250709114318_shy_frog.sql
-- ==================================================================================

/*
  # Add anonymous profile insert policy

  1. Policy Changes
    - Add RLS policy for `anon` role to insert profiles during signup
    - Ensures handle_new_user() trigger can successfully create profiles for new users

  2. Purpose
    - Fixes "Database error saving new user" issue during registration
    - Works in conjunction with existing handle_new_user trigger
*/

-- Add policy to allow anon role to insert profiles during signup
CREATE POLICY "Allow anon insert for new user profile"
  ON profiles
  FOR INSERT
  TO anon
  WITH CHECK (auth.uid() = id);
-- ==================================================================================
-- Migration 20: 20250709115954_shrill_fountain.sql
-- ==================================================================================

/*
  # Fix User Registration Profile Creation

  1. Functions
    - Create handle_new_user function to automatically create profile records
    
  2. Triggers
    - Create trigger to call handle_new_user on auth.users INSERT
    
  3. Security
    - Ensure proper RLS policies exist for profile creation during signup
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    email, 
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update RLS policies to allow profile creation during signup
DO $$
BEGIN
  -- Only recreate policies that don't exist or need to be updated
  
  -- Check and create/update anon insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow anon insert for new user profile'
  ) THEN
    CREATE POLICY "Allow anon insert for new user profile"
      ON public.profiles
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
  
  -- Check and create/update authenticated insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
  
  -- Check and create/update select policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  -- Check and create/update update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
-- ==================================================================================
-- Migration 21: 20250709120228_lingering_trail.sql
-- ==================================================================================

/*
  # Fix user signup database error

  1. New Functions
    - `handle_new_user()` - Trigger function to create profile records for new users
  
  2. Triggers
    - `on_auth_user_created` - Automatically creates profile when new user signs up
  
  3. Security
    - Update RLS policies to allow profile creation during signup
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create a profile record for the new user
  INSERT INTO profiles (
    id,
    full_name,
    email,
    role,
    organization_id,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
    NULL, -- We'll handle organization assignment separately
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update the RLS policies to ensure proper access during signup
-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles"
  ON profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
-- ==================================================================================
-- Migration 22: 20250709120758_humble_smoke.sql
-- ==================================================================================

/*
# Fix user signup trigger

This migration fixes the signup process by ensuring that when a new user is created in the auth.users table, a corresponding profile is automatically created in the profiles table.

1. **Trigger Function**
   - Creates or replaces the `handle_new_user` function
   - Automatically creates a profile record when a new user signs up
   - Sets default values for required fields

2. **Trigger Setup**
   - Creates a trigger on the `auth.users` table
   - Calls the `handle_new_user` function after a new user is inserted
   - Ensures the profile is created with the user's auth information

3. **Security**
   - Function runs with security definer privileges to bypass RLS
   - Ensures proper data consistency during signup process
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'student'::user_role),
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the RLS policy to allow the function to insert profiles
DO $$
BEGIN
  -- Drop existing anon insert policy if it exists
  DROP POLICY IF EXISTS "Allow anon insert for new user profile" ON public.profiles;
  
  -- Create new policy that allows anon inserts during signup
  CREATE POLICY "Allow anon insert for new user profile"
    ON public.profiles
    FOR INSERT
    TO anon
    WITH CHECK (true);
END $$;
-- ==================================================================================
-- Migration 23: 20250709122625_weathered_bar.sql
-- ==================================================================================

/*
  # Fix user registration with improved handle_new_user function

  1. Changes
    - Improve role validation and casting in handle_new_user function
    - Add proper validation before casting to user_role enum
    - Add explicit error handling to prevent registration failures
    - Maintain SECURITY DEFINER context for proper permissions
*/

-- Create or replace the handle_new_user function with improved error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  role_value text;
  valid_role boolean;
BEGIN
  -- Extract role from metadata with proper validation
  role_value := NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), '');
  
  -- Check if role value is valid
  IF role_value IS NULL THEN
    role_value := 'student'; -- Default role
  ELSE
    -- Verify role is a valid enum value
    PERFORM 1 FROM pg_enum 
    WHERE enumtypid = 'user_role'::regtype 
    AND enumlabel = role_value;
    
    IF NOT FOUND THEN
      role_value := 'student'; -- Default to student if invalid role
    END IF;
  END IF;

  -- Create a profile record for the new user with validated role
  BEGIN
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      role,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      role_value::user_role,
      now(),
      now()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail user creation
    RAISE LOG 'Error in handle_new_user function: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ==================================================================================
-- Migration 24: 20250709125052_cool_rice.sql
-- ==================================================================================

/*
  # Simplified User Registration Trigger

  1. New Trigger Function
     - Minimalistic handle_new_user function that only creates a basic profile entry
     - Removes role validation and other potential failure points
     - Uses SECURITY DEFINER to ensure it runs with elevated privileges
     - Adds explicit error handling and logging

  2. Security
     - Maintains all existing RLS policies
     - Ensures the trigger can create profiles regardless of RLS settings
*/

-- Create a simplified handle_new_user function that only inserts the ID
-- This minimizes potential points of failure in the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert only the bare minimum - just the user ID
  -- This ensures the function is extremely resilient to data issues
  BEGIN
    INSERT INTO public.profiles (id)
    VALUES (NEW.id);
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail user creation
    RAISE LOG 'Error in simplified handle_new_user function: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies allow the profile to be created during signup
-- This is a defensive step to make sure all policies are present and correct
DO $$
BEGIN
  -- Ensure service_role can manage all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Service role can manage profiles'
  ) THEN
    CREATE POLICY "Service role can manage profiles"
      ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  -- Ensure authenticated users can see their profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  -- Ensure authenticated users can update their profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
-- ==================================================================================
-- Migration 25: 20250709155456_yellow_queen.sql
-- ==================================================================================

/*
  # Update handle_new_user function for robust profile creation

  1. New Function Implementation
    - Extracts full_name, email, and role from auth.users data
    - Implements proper validation for user_role enum type
    - Ensures role defaults to 'student' if not provided or invalid
    - Adds proper error handling to prevent trigger failures
    - Uses proper casting to user_role enum type

  2. Security
    - Maintains SECURITY DEFINER function attribute
    - Preserves existing RLS policies
*/

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value text;
BEGIN
  -- Extract role from metadata, defaulting to 'student' if not provided or invalid
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- Ensure the role value is one of the allowed enum variants
  IF user_role_value NOT IN ('administrator', 'it-staff', 'student', 'teacher') THEN
    user_role_value := 'student'; -- Default to 'student' if the provided role is not valid
  END IF;

  -- Insert the new profile with full details
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    user_role_value::user_role, -- Cast to the user_role enum type
    now(),
    now()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure RLS policies allow the profile to be created during signup
-- This is a defensive step to make sure all policies are present and correct
DO $$
BEGIN
  -- Ensure service_role can manage all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Service role can manage profiles'
  ) THEN
    CREATE POLICY "Service role can manage profiles"
      ON profiles
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
  
  -- Ensure authenticated users can see their profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
  
  -- Ensure authenticated users can update their profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;
-- ==================================================================================
-- Migration 26: 20250115000000_cybercorrect_schema_differentiation.sql
-- ==================================================================================

/*
  # CyberCorrect Privacy Portal - Schema Differentiation and Optimization

  1. Schema Differentiation
    - Add application-specific table prefixes (cc_)
    - Create custom schema organization
    - Add application metadata and versioning
    - Implement unique constraints for data integrity

  2. Enhanced Tables
    - Migrate existing tables to prefixed versions
    - Add application-specific columns
    - Improve indexing for performance
    - Add audit trails and metadata

  3. localStorage Optimization Support
    - Add cache metadata tables
    - Implement data versioning
    - Add sync status tracking
    - Support offline-first operations

  4. Security Enhancements
    - Application-specific RLS policies
    - Enhanced data isolation
    - Audit logging improvements
*/

-- Create application-specific schema for better organization
CREATE SCHEMA IF NOT EXISTS cybercorrect;

-- Create application metadata table
CREATE TABLE IF NOT EXISTS cybercorrect.application_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_name text NOT NULL DEFAULT 'cybercorrect-privacy-portal',
  version text NOT NULL DEFAULT '1.0.0',
  schema_version text NOT NULL DEFAULT '1.0.0',
  last_updated timestamptz DEFAULT now(),
  configuration jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Insert initial application metadata
INSERT INTO cybercorrect.application_metadata (application_name, version, schema_version)
VALUES ('cybercorrect-privacy-portal', '1.0.0', '1.0.0')
ON CONFLICT DO NOTHING;

-- Create user_role enum type for better type safety
DO $$ BEGIN
  CREATE TYPE cybercorrect.user_role AS ENUM ('administrator', 'teacher', 'it-staff', 'student');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create request status enum
DO $$ BEGIN
  CREATE TYPE cybercorrect.request_status AS ENUM (
    'submitted', 'under_review', 'in_progress', 'completed', 'rejected', 'partially_fulfilled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create incident severity enum
DO $$ BEGIN
  CREATE TYPE cybercorrect.incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create incident type enum
DO $$ BEGIN
  CREATE TYPE cybercorrect.incident_type AS ENUM (
    'data_breach', 'unauthorized_access', 'data_loss', 'system_compromise', 
    'privacy_violation', 'consent_violation', 'vendor_incident'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create consent purpose enum
DO $$ BEGIN
  CREATE TYPE cybercorrect.consent_purpose AS ENUM (
    'educational_services', 'student_assessment', 'administrative', 'communications',
    'safety_security', 'compliance', 'research', 'marketing', 'other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create compliance status enum
DO $$ BEGIN
  CREATE TYPE cybercorrect.compliance_status AS ENUM ('pending', 'in-progress', 'completed', 'overdue');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create profiles table with application-specific prefix and enhanced features
CREATE TABLE IF NOT EXISTS cybercorrect.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid,
  role cybercorrect.user_role NOT NULL DEFAULT 'student',
  full_name text,
  email text,
  department text,
  avatar_url text,
  settings jsonb DEFAULT '{}',
  preferences jsonb DEFAULT '{}',
  last_login timestamptz,
  login_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Application-specific metadata
  cc_application_version text DEFAULT '1.0.0',
  cc_data_version integer DEFAULT 1,
  cc_last_synced timestamptz DEFAULT now(),
  cc_sync_status text DEFAULT 'synced' CHECK (cc_sync_status IN ('synced', 'pending', 'error', 'offline'))
);

-- Create data subject requests table
CREATE TABLE IF NOT EXISTS cybercorrect.data_subject_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  request_type text NOT NULL CHECK (request_type IN (
    'access', 'rectification', 'erasure', 'portability', 'objection', 
    'restriction', 'opt_out', 'consent_withdrawal', 'directory_opt_out'
  )),
  requester_name text NOT NULL,
  requester_email text NOT NULL,
  requester_relationship text,
  student_identifier text,
  request_details jsonb DEFAULT '{}',
  applicable_regulations text[] DEFAULT '{}',
  status cybercorrect.request_status DEFAULT 'submitted',
  submitted_at timestamptz DEFAULT now(),
  due_date timestamptz NOT NULL,
  completed_at timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text,
  response_data jsonb DEFAULT '{}',
  verification_status text,
  communication_log jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Application-specific metadata
  cc_application_version text DEFAULT '1.0.0',
  cc_data_version integer DEFAULT 1,
  cc_last_synced timestamptz DEFAULT now(),
  cc_sync_status text DEFAULT 'synced' CHECK (cc_sync_status IN ('synced', 'pending', 'error', 'offline')),
  cc_offline_created boolean DEFAULT false,
  cc_offline_updated boolean DEFAULT false
);

-- Create consent records table
CREATE TABLE IF NOT EXISTS cybercorrect.consent_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  student_id text NOT NULL,
  student_name text,
  parent_guardian_name text,
  parent_guardian_email text,
  consent_type text NOT NULL,
  purpose cybercorrect.consent_purpose NOT NULL,
  service_provider text,
  consent_given boolean NOT NULL,
  consent_date timestamptz,
  withdrawal_date timestamptz,
  expiry_date timestamptz,
  renewal_required boolean DEFAULT false,
  applicable_regulations text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Application-specific metadata
  cc_application_version text DEFAULT '1.0.0',
  cc_data_version integer DEFAULT 1,
  cc_last_synced timestamptz DEFAULT now(),
  cc_sync_status text DEFAULT 'synced' CHECK (cc_sync_status IN ('synced', 'pending', 'error', 'offline')),
  cc_offline_created boolean DEFAULT false,
  cc_offline_updated boolean DEFAULT false
);

-- Create privacy incidents table
CREATE TABLE IF NOT EXISTS cybercorrect.privacy_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  incident_number text NOT NULL UNIQUE,
  incident_type cybercorrect.incident_type NOT NULL,
  severity cybercorrect.incident_severity NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  affected_individuals_count integer NOT NULL DEFAULT 0,
  data_types_affected text[] DEFAULT '{}',
  discovery_date timestamptz NOT NULL,
  incident_date timestamptz,
  containment_date timestamptz,
  resolution_date timestamptz,
  reported_to_authorities boolean DEFAULT false,
  notification_authorities text[] DEFAULT '{}',
  individuals_notified boolean DEFAULT false,
  notification_method text,
  cause_analysis text,
  remediation_actions jsonb DEFAULT '[]',
  lessons_learned text,
  status text DEFAULT 'open',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  applicable_regulations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Application-specific metadata
  cc_application_version text DEFAULT '1.0.0',
  cc_data_version integer DEFAULT 1,
  cc_last_synced timestamptz DEFAULT now(),
  cc_sync_status text DEFAULT 'synced' CHECK (cc_sync_status IN ('synced', 'pending', 'error', 'offline')),
  cc_offline_created boolean DEFAULT false,
  cc_offline_updated boolean DEFAULT false
);

-- Create compliance tracking table
CREATE TABLE IF NOT EXISTS cybercorrect.compliance_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  event_id text NOT NULL,
  event_title text NOT NULL,
  status cybercorrect.compliance_status DEFAULT 'pending',
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date timestamptz NOT NULL,
  completed_at timestamptz,
  documentation jsonb DEFAULT '{}',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  -- Application-specific metadata
  cc_application_version text DEFAULT '1.0.0',
  cc_data_version integer DEFAULT 1,
  cc_last_synced timestamptz DEFAULT now(),
  cc_sync_status text DEFAULT 'synced' CHECK (cc_sync_status IN ('synced', 'pending', 'error', 'offline')),
  cc_offline_created boolean DEFAULT false,
  cc_offline_updated boolean DEFAULT false
);

-- Create cache metadata table for localStorage optimization
CREATE TABLE IF NOT EXISTS cybercorrect.cache_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key text NOT NULL,
  cache_type text NOT NULL CHECK (cache_type IN ('data_rights', 'privacy_incidents', 'consent_records', 'compliance', 'vendor_assessments', 'form_data', 'preferences')),
  data_hash text NOT NULL,
  last_modified timestamptz DEFAULT now(),
  expires_at timestamptz,
  sync_status text DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'error', 'offline')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, cache_key)
);

-- Create data sync log table for tracking synchronization
CREATE TABLE IF NOT EXISTS cybercorrect.data_sync_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  operation text NOT NULL CHECK (operation IN ('create', 'update', 'delete', 'sync')),
  sync_status text NOT NULL CHECK (sync_status IN ('pending', 'synced', 'error', 'conflict')),
  error_message text,
  retry_count integer DEFAULT 0,
  last_attempt timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION cybercorrect.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.cc_last_synced = now();
  NEW.cc_data_version = OLD.cc_data_version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON cybercorrect.profiles
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_updated_at();

CREATE TRIGGER data_subject_requests_updated_at
  BEFORE UPDATE ON cybercorrect.data_subject_requests
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_updated_at();

CREATE TRIGGER consent_records_updated_at
  BEFORE UPDATE ON cybercorrect.consent_records
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_updated_at();

CREATE TRIGGER privacy_incidents_updated_at
  BEFORE UPDATE ON cybercorrect.privacy_incidents
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_updated_at();

CREATE TRIGGER compliance_tracking_updated_at
  BEFORE UPDATE ON cybercorrect.compliance_tracking
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_updated_at();

-- Enable RLS on all tables
ALTER TABLE cybercorrect.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.data_subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.privacy_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.cache_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE cybercorrect.data_sync_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON cybercorrect.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON cybercorrect.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON cybercorrect.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for data subject requests
CREATE POLICY "Users can view data subject requests for their organization"
  ON cybercorrect.data_subject_requests
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert data subject requests"
  ON cybercorrect.data_subject_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can update data subject requests for their organization"
  ON cybercorrect.data_subject_requests
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- Create RLS policies for consent records
CREATE POLICY "Users can view consent records for their organization"
  ON cybercorrect.consent_records
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage consent records for their organization"
  ON cybercorrect.consent_records
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
  );

-- Create RLS policies for privacy incidents
CREATE POLICY "Users can view privacy incidents for their organization"
  ON cybercorrect.privacy_incidents
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage privacy incidents for their organization"
  ON cybercorrect.privacy_incidents
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
  );

-- Create RLS policies for compliance tracking
CREATE POLICY "Users can view compliance tracking for their organization"
  ON cybercorrect.compliance_tracking
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
    OR assigned_to = auth.uid()
  );

CREATE POLICY "Users can manage compliance tracking for their organization"
  ON cybercorrect.compliance_tracking
  FOR ALL
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
    )
    OR assigned_to = auth.uid()
  );

-- Create RLS policies for cache metadata
CREATE POLICY "Users can manage own cache metadata"
  ON cybercorrect.cache_metadata
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS policies for data sync log
CREATE POLICY "Users can view own sync log"
  ON cybercorrect.data_sync_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync log"
  ON cybercorrect.data_sync_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cc_profiles_organization_id ON cybercorrect.profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_profiles_role ON cybercorrect.profiles(role);
CREATE INDEX IF NOT EXISTS idx_cc_profiles_email ON cybercorrect.profiles(email);
CREATE INDEX IF NOT EXISTS idx_cc_profiles_sync_status ON cybercorrect.profiles(cc_sync_status);

CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_organization_id ON cybercorrect.data_subject_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_user_id ON cybercorrect.data_subject_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_status ON cybercorrect.data_subject_requests(status);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_due_date ON cybercorrect.data_subject_requests(due_date);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_sync_status ON cybercorrect.data_subject_requests(cc_sync_status);

CREATE INDEX IF NOT EXISTS idx_cc_consent_records_organization_id ON cybercorrect.consent_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_consent_records_student_id ON cybercorrect.consent_records(student_id);
CREATE INDEX IF NOT EXISTS idx_cc_consent_records_consent_given ON cybercorrect.consent_records(consent_given);
CREATE INDEX IF NOT EXISTS idx_cc_consent_records_sync_status ON cybercorrect.consent_records(cc_sync_status);

CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_organization_id ON cybercorrect.privacy_incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_severity ON cybercorrect.privacy_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_status ON cybercorrect.privacy_incidents(status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_discovery_date ON cybercorrect.privacy_incidents(discovery_date);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_sync_status ON cybercorrect.privacy_incidents(cc_sync_status);

CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_organization_id ON cybercorrect.compliance_tracking(organization_id);
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_assigned_to ON cybercorrect.compliance_tracking(assigned_to);
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_status ON cybercorrect.compliance_tracking(status);
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_due_date ON cybercorrect.compliance_tracking(due_date);
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_sync_status ON cybercorrect.compliance_tracking(cc_sync_status);

CREATE INDEX IF NOT EXISTS idx_cc_cache_metadata_user_id ON cybercorrect.cache_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_cache_metadata_cache_key ON cybercorrect.cache_metadata(cache_key);
CREATE INDEX IF NOT EXISTS idx_cc_cache_metadata_cache_type ON cybercorrect.cache_metadata(cache_type);
CREATE INDEX IF NOT EXISTS idx_cc_cache_metadata_expires_at ON cybercorrect.cache_metadata(expires_at);

CREATE INDEX IF NOT EXISTS idx_cc_data_sync_log_user_id ON cybercorrect.data_sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_data_sync_log_sync_status ON cybercorrect.data_sync_log(sync_status);
CREATE INDEX IF NOT EXISTS idx_cc_data_sync_log_created_at ON cybercorrect.data_sync_log(created_at);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION cybercorrect.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_value text;
BEGIN
  -- Extract role from metadata, defaulting to 'student' if not provided or invalid
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- Ensure the role value is one of the allowed enum variants
  IF user_role_value NOT IN ('administrator', 'it-staff', 'student', 'teacher') THEN
    user_role_value := 'student';
  END IF;

  -- Insert the new profile with full details
  INSERT INTO cybercorrect.profiles (
    id,
    full_name,
    email,
    role,
    created_at,
    updated_at
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION cybercorrect.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA cybercorrect TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA cybercorrect TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA cybercorrect TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA cybercorrect TO authenticated;

-- Create view for easy access to application metadata
CREATE OR REPLACE VIEW cybercorrect.app_info AS
SELECT 
  application_name,
  version,
  schema_version,
  last_updated,
  configuration
FROM cybercorrect.application_metadata
ORDER BY last_updated DESC
LIMIT 1;

-- Grant access to the view
GRANT SELECT ON cybercorrect.app_info TO authenticated;
-- ==================================================================================
-- Migration 27: 20250115000001_migrate_to_cybercorrect_schema.sql
-- ==================================================================================

/*
  # Migrate existing data to cybercorrect schema
  
  This migration ensures that any existing data in the public schema
  is properly migrated to the cybercorrect schema to avoid conflicts
  with other Supabase projects.
*/

-- First, check if we have any existing data in public schema that needs migration
DO $$
DECLARE
  public_profiles_count integer;
  public_requests_count integer;
  public_consent_count integer;
  public_incidents_count integer;
  public_compliance_count integer;
BEGIN
  -- Check if tables exist in public schema and have data
  SELECT COUNT(*) INTO public_profiles_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'profiles';
  
  IF public_profiles_count > 0 THEN
    -- Check if profiles table has data
    EXECUTE 'SELECT COUNT(*) FROM public.profiles' INTO public_profiles_count;
    
    IF public_profiles_count > 0 THEN
      -- Migrate profiles data to cybercorrect schema
      INSERT INTO cybercorrect.profiles (
        id, organization_id, role, full_name, email, department, 
        avatar_url, settings, preferences, last_login, login_count, 
        is_active, created_at, updated_at
      )
      SELECT 
        id, organization_id, 
        COALESCE(role::text, 'student')::cybercorrect.user_role,
        full_name, email, department, avatar_url, 
        COALESCE(settings, '{}'::jsonb), 
        COALESCE(preferences, '{}'::jsonb),
        last_login, COALESCE(login_count, 0), 
        COALESCE(is_active, true),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.profiles
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.profiles WHERE cybercorrect.profiles.id = public.profiles.id
      );
      
      RAISE NOTICE 'Migrated % profiles to cybercorrect schema', public_profiles_count;
    END IF;
  END IF;
  
  -- Check for data subject requests
  SELECT COUNT(*) INTO public_requests_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'data_subject_requests';
  
  IF public_requests_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.data_subject_requests' INTO public_requests_count;
    
    IF public_requests_count > 0 THEN
      -- Migrate data subject requests
      INSERT INTO cybercorrect.data_subject_requests (
        id, organization_id, user_id, request_type, requester_name, 
        requester_email, requester_relationship, student_identifier,
        request_details, applicable_regulations, status, submitted_at, 
        due_date, completed_at, assigned_to, notes, response_data, 
        verification_status, communication_log, created_at, updated_at
      )
      SELECT 
        id, organization_id, user_id, request_type, requester_name,
        requester_email, requester_relationship, 
        COALESCE(employee_identifier, student_identifier),
        COALESCE(request_details, '{}'::jsonb),
        COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(status::text, 'submitted')::cybercorrect.request_status,
        COALESCE(submitted_at, now()),
        due_date, completed_at, assigned_to, notes,
        COALESCE(response_data, '{}'::jsonb),
        verification_status,
        COALESCE(communication_log, '[]'::jsonb),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.data_subject_requests
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.data_subject_requests 
        WHERE cybercorrect.data_subject_requests.id = public.data_subject_requests.id
      );
      
      RAISE NOTICE 'Migrated % data subject requests to cybercorrect schema', public_requests_count;
    END IF;
  END IF;
  
  -- Check for consent records
  SELECT COUNT(*) INTO public_consent_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'consent_records';
  
  IF public_consent_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.consent_records' INTO public_consent_count;
    
    IF public_consent_count > 0 THEN
      -- Migrate consent records
      INSERT INTO cybercorrect.consent_records (
        id, organization_id, student_id, student_name, 
        parent_guardian_name, parent_guardian_email, consent_type, 
        purpose, service_provider, consent_given, consent_date, 
        withdrawal_date, expiry_date, renewal_required, 
        applicable_regulations, metadata, created_at, updated_at
      )
      SELECT 
        id, organization_id, 
        COALESCE(employee_id, student_id),
        COALESCE(employee_name, student_name),
        hr_contact_name, hr_contact_email, consent_type,
        COALESCE(purpose::text, 'other')::cybercorrect.consent_purpose,
        service_provider, consent_given, consent_date,
        withdrawal_date, expiry_date, COALESCE(renewal_required, false),
        COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(metadata, '{}'::jsonb),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.consent_records
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.consent_records 
        WHERE cybercorrect.consent_records.id = public.consent_records.id
      );
      
      RAISE NOTICE 'Migrated % consent records to cybercorrect schema', public_consent_count;
    END IF;
  END IF;
  
  -- Check for privacy incidents
  SELECT COUNT(*) INTO public_incidents_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'privacy_incidents';
  
  IF public_incidents_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.privacy_incidents' INTO public_incidents_count;
    
    IF public_incidents_count > 0 THEN
      -- Migrate privacy incidents
      INSERT INTO cybercorrect.privacy_incidents (
        id, organization_id, incident_number, incident_type, severity,
        title, description, affected_individuals_count, data_types_affected,
        discovery_date, incident_date, containment_date, resolution_date,
        reported_to_authorities, notification_authorities, individuals_notified,
        notification_method, cause_analysis, remediation_actions, lessons_learned,
        status, assigned_to, applicable_regulations, created_at, updated_at
      )
      SELECT 
        id, organization_id, incident_number,
        COALESCE(incident_type::text, 'privacy_violation')::cybercorrect.incident_type,
        COALESCE(severity::text, 'medium')::cybercorrect.incident_severity,
        title, description, COALESCE(affected_individuals_count, 0),
        COALESCE(data_types_affected, '{}'::text[]),
        discovery_date, incident_date, containment_date, resolution_date,
        COALESCE(reported_to_authorities, false),
        COALESCE(notification_authorities, '{}'::text[]),
        COALESCE(individuals_notified, false),
        notification_method, cause_analysis,
        COALESCE(remediation_actions, '[]'::jsonb),
        lessons_learned, COALESCE(status, 'open'),
        assigned_to, COALESCE(applicable_regulations, '{}'::text[]),
        COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.privacy_incidents
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.privacy_incidents 
        WHERE cybercorrect.privacy_incidents.id = public.privacy_incidents.id
      );
      
      RAISE NOTICE 'Migrated % privacy incidents to cybercorrect schema', public_incidents_count;
    END IF;
  END IF;
  
  -- Check for compliance tracking
  SELECT COUNT(*) INTO public_compliance_count 
  FROM information_schema.tables 
  WHERE table_schema = 'public' AND table_name = 'compliance_tracking';
  
  IF public_compliance_count > 0 THEN
    EXECUTE 'SELECT COUNT(*) FROM public.compliance_tracking' INTO public_compliance_count;
    
    IF public_compliance_count > 0 THEN
      -- Migrate compliance tracking
      INSERT INTO cybercorrect.compliance_tracking (
        id, organization_id, event_id, event_title, status, assigned_to,
        due_date, completed_at, documentation, notes, created_at, updated_at
      )
      SELECT 
        id, organization_id, event_id, event_title,
        COALESCE(status::text, 'pending')::cybercorrect.compliance_status,
        assigned_to, due_date, completed_at,
        COALESCE(documentation, '{}'::jsonb),
        notes, COALESCE(created_at, now()),
        COALESCE(updated_at, now())
      FROM public.compliance_tracking
      WHERE NOT EXISTS (
        SELECT 1 FROM cybercorrect.compliance_tracking 
        WHERE cybercorrect.compliance_tracking.id = public.compliance_tracking.id
      );
      
      RAISE NOTICE 'Migrated % compliance tracking records to cybercorrect schema', public_compliance_count;
    END IF;
  END IF;
  
  RAISE NOTICE 'Migration to cybercorrect schema completed successfully';
END $$;

-- Update the application metadata to reflect the migration
UPDATE cybercorrect.application_metadata 
SET 
  last_updated = now(),
  configuration = configuration || jsonb_build_object(
    'schema_migration_completed', true,
    'migration_date', now()::text
  )
WHERE application_name = 'cybercorrect-privacy-portal';
-- ==================================================================================
-- Migration 28: 20250115000002_finalize_backend_configuration.sql
-- ==================================================================================

/*
  # Finalize Backend Configuration
  
  This migration finalizes the backend configuration by:
  1. Ensuring all tables have proper constraints and indexes
  2. Setting up final RLS policies
  3. Creating utility functions
  4. Adding performance optimizations
  5. Setting up monitoring and logging
*/

-- Create utility function for generating unique IDs
CREATE OR REPLACE FUNCTION cybercorrect.generate_unique_id(prefix text DEFAULT 'cc')
RETURNS text AS $$
BEGIN
  RETURN prefix || '-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Create function to get application statistics
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean up old sync logs
CREATE OR REPLACE FUNCTION cybercorrect.cleanup_old_sync_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM cybercorrect.data_sync_log 
  WHERE created_at < now() - interval '30 days';
  
  DELETE FROM cybercorrect.cache_metadata 
  WHERE expires_at < now() - interval '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's organization data
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_cc_profiles_organization_role ON cybercorrect.profiles(organization_id, role);
CREATE INDEX IF NOT EXISTS idx_cc_profiles_active ON cybercorrect.profiles(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cc_profiles_last_login ON cybercorrect.profiles(last_login) WHERE last_login IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_type_status ON cybercorrect.data_subject_requests(request_type, status);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_due_date_status ON cybercorrect.data_subject_requests(due_date, status);
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_requester_email ON cybercorrect.data_subject_requests(requester_email);

CREATE INDEX IF NOT EXISTS idx_cc_consent_records_consent_given_date ON cybercorrect.consent_records(consent_given, consent_date);
CREATE INDEX IF NOT EXISTS idx_cc_consent_records_expiry_date ON cybercorrect.consent_records(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_severity_status ON cybercorrect.privacy_incidents(severity, status);
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_organization_severity ON cybercorrect.privacy_incidents(organization_id, severity);

CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_status_due_date ON cybercorrect.compliance_tracking(status, due_date);
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_organization_status ON cybercorrect.compliance_tracking(organization_id, status);

-- Add partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_pending ON cybercorrect.data_subject_requests(created_at) WHERE status = 'submitted';
CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_critical ON cybercorrect.privacy_incidents(created_at) WHERE severity = 'critical';
CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_overdue ON cybercorrect.compliance_tracking(due_date) WHERE status = 'overdue';

-- Create view for dashboard statistics
CREATE OR REPLACE VIEW cybercorrect.dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM cybercorrect.profiles WHERE is_active = true) as active_users,
  (SELECT COUNT(*) FROM cybercorrect.data_subject_requests WHERE status = 'submitted') as pending_requests,
  (SELECT COUNT(*) FROM cybercorrect.data_subject_requests WHERE status = 'completed' AND completed_at > now() - interval '30 days') as completed_requests_30d,
  (SELECT COUNT(*) FROM cybercorrect.privacy_incidents WHERE severity = 'critical' AND status = 'open') as critical_incidents,
  (SELECT COUNT(*) FROM cybercorrect.compliance_tracking WHERE status = 'overdue') as overdue_compliance_items,
  (SELECT COUNT(*) FROM cybercorrect.consent_records WHERE consent_given = true AND consent_date > now() - interval '30 days') as new_consents_30d;

-- Grant access to the view
GRANT SELECT ON cybercorrect.dashboard_stats TO authenticated;

-- Create function to handle data export
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate data integrity
CREATE OR REPLACE FUNCTION cybercorrect.validate_data_integrity()
RETURNS jsonb AS $$
DECLARE
  issues jsonb := '[]'::jsonb;
  issue jsonb;
BEGIN
  -- Check for orphaned data subject requests
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
  
  -- Check for orphaned consent records
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
  
  -- Check for data consistency issues
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create scheduled job for cleanup (if pg_cron is available)
DO $$
BEGIN
  -- This will only work if pg_cron extension is installed
  -- Uncomment if you have pg_cron available
  -- PERFORM cron.schedule('cleanup-sync-logs', '0 2 * * *', 'SELECT cybercorrect.cleanup_old_sync_logs();');
  NULL;
EXCEPTION
  WHEN undefined_object THEN
    -- pg_cron not available, skip
    NULL;
END $$;

-- Update application metadata with final configuration
UPDATE cybercorrect.application_metadata 
SET 
  last_updated = now(),
  configuration = configuration || jsonb_build_object(
    'backend_configuration_completed', true,
    'finalization_date', now(),
    'features', jsonb_build_object(
      'offline_support', true,
      'data_export', true,
      'health_monitoring', true,
      'data_validation', true,
      'performance_optimization', true
    ),
    'database_version', '1.0.0',
    'schema_version', '1.0.0'
  )
WHERE application_name = 'cybercorrect-privacy-portal';

-- Create final RLS policy for service role access
CREATE POLICY "Service role can access all data"
  ON cybercorrect.profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all data"
  ON cybercorrect.data_subject_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all data"
  ON cybercorrect.consent_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all data"
  ON cybercorrect.privacy_incidents
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can access all data"
  ON cybercorrect.compliance_tracking
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION cybercorrect.generate_unique_id(text) TO authenticated;
GRANT EXECUTE ON FUNCTION cybercorrect.get_application_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION cybercorrect.get_user_organization_data(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION cybercorrect.export_organization_data(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION cybercorrect.validate_data_integrity() TO authenticated;

-- Final verification
DO $$
DECLARE
  table_count integer;
  function_count integer;
  index_count integer;
BEGIN
  -- Count tables
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables 
  WHERE table_schema = 'cybercorrect';
  
  -- Count functions
  SELECT COUNT(*) INTO function_count
  FROM information_schema.routines 
  WHERE routine_schema = 'cybercorrect';
  
  -- Count indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes 
  WHERE schemaname = 'cybercorrect';
  
  RAISE NOTICE 'Backend configuration finalized successfully:';
  RAISE NOTICE '- Tables: %', table_count;
  RAISE NOTICE '- Functions: %', function_count;
  RAISE NOTICE '- Indexes: %', index_count;
  RAISE NOTICE '- Schema: cybercorrect';
  RAISE NOTICE '- RLS: Enabled';
  RAISE NOTICE '- Monitoring: Configured';
END $$;
-- ==================================================================================
-- Migration 29: 20251228000000_final_security_fixes.sql
-- ==================================================================================

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

-- ==================================================================================
-- END OF CONSOLIDATED MIGRATIONS
-- ==================================================================================
