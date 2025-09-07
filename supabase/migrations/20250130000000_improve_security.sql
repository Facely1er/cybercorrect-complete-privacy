/*
  # Improve Security and RLS Policies
  
  This migration improves the security of the existing tables by:
  1. Adding proper RLS policies with authentication
  2. Adding audit fields
  3. Improving data validation
  4. Adding proper indexes
*/

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public insert access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public update access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public insert access to toolkit_analytics" ON toolkit_analytics;

-- Add audit fields to existing tables
ALTER TABLE policy_generators 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS ip_address inet,
ADD COLUMN IF NOT EXISTS user_agent text;

ALTER TABLE toolkit_analytics 
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS ip_address inet,
ADD COLUMN IF NOT EXISTS user_agent text;

-- Create secure RLS policies for policy_generators
-- Allow authenticated users to manage their own data
CREATE POLICY "Users can view their own policy generators"
  ON policy_generators
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Users can insert their own policy generators"
  ON policy_generators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by OR 
    (created_by IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can update their own policy generators"
  ON policy_generators
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by OR created_by IS NULL)
  WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Users can delete their own policy generators"
  ON policy_generators
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by OR created_by IS NULL);

-- Create secure RLS policies for toolkit_analytics
CREATE POLICY "Users can insert their own analytics"
  ON toolkit_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by OR 
    (created_by IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Users can view their own analytics"
  ON toolkit_analytics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by OR created_by IS NULL);

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for audit fields
CREATE TRIGGER set_policy_generators_audit_fields
  BEFORE INSERT OR UPDATE ON policy_generators
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

CREATE TRIGGER set_toolkit_analytics_audit_fields
  BEFORE INSERT OR UPDATE ON toolkit_analytics
  FOR EACH ROW
  EXECUTE FUNCTION set_audit_fields();

-- Add data validation constraints
ALTER TABLE policy_generators 
ADD CONSTRAINT check_session_id_length CHECK (char_length(session_id) >= 8),
ADD CONSTRAINT check_organization_info_json CHECK (jsonb_typeof(organization_info) = 'object');

ALTER TABLE toolkit_analytics 
ADD CONSTRAINT check_tool_name_not_empty CHECK (char_length(tool_name) > 0),
ADD CONSTRAINT check_action_not_empty CHECK (char_length(action) > 0),
ADD CONSTRAINT check_data_json CHECK (jsonb_typeof(data) = 'object');

-- Create additional indexes for performance and security
CREATE INDEX IF NOT EXISTS idx_policy_generators_created_by ON policy_generators(created_by);
CREATE INDEX IF NOT EXISTS idx_policy_generators_ip_address ON policy_generators(ip_address);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_created_by ON toolkit_analytics(created_by);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_ip_address ON toolkit_analytics(ip_address);

-- Create function to clean up old anonymous data (for GDPR compliance)
CREATE OR REPLACE FUNCTION cleanup_anonymous_data()
RETURNS void AS $$
BEGIN
  -- Delete policy generators older than 30 days with no user association
  DELETE FROM policy_generators 
  WHERE created_by IS NULL 
    AND created_at < NOW() - INTERVAL '30 days';
  
  -- Delete analytics older than 90 days with no user association
  DELETE FROM toolkit_analytics 
  WHERE created_by IS NULL 
    AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to anonymize user data (for GDPR right to be forgotten)
CREATE OR REPLACE FUNCTION anonymize_user_data(user_id uuid)
RETURNS void AS $$
BEGIN
  -- Anonymize policy generators
  UPDATE policy_generators 
  SET 
    organization_info = '{}'::jsonb,
    created_by = NULL,
    updated_by = NULL,
    ip_address = NULL,
    user_agent = NULL
  WHERE created_by = user_id OR updated_by = user_id;
  
  -- Anonymize analytics
  UPDATE toolkit_analytics 
  SET 
    data = '{}'::jsonb,
    created_by = NULL,
    ip_address = NULL,
    user_agent = NULL
  WHERE created_by = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_anonymous_data() TO authenticated;
GRANT EXECUTE ON FUNCTION anonymize_user_data(uuid) TO authenticated;

-- Create a view for admin monitoring (only accessible by service role)
CREATE VIEW admin_data_overview AS
SELECT 
  'policy_generators' as table_name,
  COUNT(*) as total_records,
  COUNT(created_by) as authenticated_records,
  COUNT(*) - COUNT(created_by) as anonymous_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM policy_generators
UNION ALL
SELECT 
  'toolkit_analytics' as table_name,
  COUNT(*) as total_records,
  COUNT(created_by) as authenticated_records,
  COUNT(*) - COUNT(created_by) as anonymous_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM toolkit_analytics;

-- Only allow service role to access admin view
REVOKE ALL ON admin_data_overview FROM PUBLIC;
GRANT SELECT ON admin_data_overview TO service_role;