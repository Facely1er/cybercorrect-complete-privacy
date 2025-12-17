-- Portal Beta Applications and Management Schema
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

