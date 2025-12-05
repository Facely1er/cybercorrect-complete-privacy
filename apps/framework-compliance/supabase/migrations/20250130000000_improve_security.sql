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