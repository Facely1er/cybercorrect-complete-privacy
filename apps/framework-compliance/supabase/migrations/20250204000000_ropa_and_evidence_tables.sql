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


