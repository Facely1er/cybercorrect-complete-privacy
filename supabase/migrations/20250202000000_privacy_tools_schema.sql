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

