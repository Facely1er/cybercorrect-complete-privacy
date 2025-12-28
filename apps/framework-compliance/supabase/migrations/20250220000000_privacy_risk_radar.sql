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

