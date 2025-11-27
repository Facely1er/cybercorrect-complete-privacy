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