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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for automated_reports
CREATE POLICY "Users can view their own reports"
  ON automated_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
  ON automated_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON automated_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON automated_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for compliance_health_scores
CREATE POLICY "Users can view their own scores"
  ON compliance_health_scores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores"
  ON compliance_health_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view aggregated scores"
  ON compliance_health_scores
  FOR SELECT
  TO authenticated
  USING (true); -- Allow viewing aggregated data for benchmarking

-- RLS Policies for scheduled_assessments
CREATE POLICY "Users can view their own assessments"
  ON scheduled_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessments"
  ON scheduled_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
  ON scheduled_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assessments"
  ON scheduled_assessments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for alert_rules
CREATE POLICY "Users can view their own alert rules"
  ON alert_rules
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alert rules"
  ON alert_rules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alert rules"
  ON alert_rules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alert rules"
  ON alert_rules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

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
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

