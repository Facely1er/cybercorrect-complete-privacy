/*
  # Fix Security Policies - CRITICAL SECURITY UPDATE
  
  This migration fixes the critical security vulnerability where sensitive data
  was accessible to public users. This replaces public access policies with
  proper authenticated user policies.
  
  SECURITY IMPACT: HIGH - This fixes a data exposure vulnerability
*/

-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public read access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public insert access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public update access to policy_generators" ON policy_generators;
DROP POLICY IF EXISTS "Allow public insert access to toolkit_analytics" ON toolkit_analytics;

-- Create secure policies for policy_generators
-- Users can only access their own data based on session_id
CREATE POLICY "Users can read their own policy generators"
  ON policy_generators
  FOR SELECT
  TO authenticated
  USING (
    session_id IS NOT NULL AND 
    (
      -- Allow if user is authenticated and session matches
      auth.uid()::text = session_id OR
      -- Allow if session_id contains user's UUID (for backward compatibility)
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  );

CREATE POLICY "Users can insert their own policy generators"
  ON policy_generators
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IS NOT NULL AND
    (
      auth.uid()::text = session_id OR
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  );

CREATE POLICY "Users can update their own policy generators"
  ON policy_generators
  FOR UPDATE
  TO authenticated
  USING (
    session_id IS NOT NULL AND
    (
      auth.uid()::text = session_id OR
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  )
  WITH CHECK (
    session_id IS NOT NULL AND
    (
      auth.uid()::text = session_id OR
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  );

-- Create secure policies for toolkit_analytics
CREATE POLICY "Users can insert their own analytics"
  ON toolkit_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IS NOT NULL AND
    (
      auth.uid()::text = session_id OR
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  );

-- Allow read access for analytics (needed for dashboard)
CREATE POLICY "Users can read their own analytics"
  ON toolkit_analytics
  FOR SELECT
  TO authenticated
  USING (
    session_id IS NOT NULL AND
    (
      auth.uid()::text = session_id OR
      session_id LIKE '%' || auth.uid()::text || '%'
    )
  );

-- Add indexes for better performance with new policies
CREATE INDEX IF NOT EXISTS idx_policy_generators_auth_check ON policy_generators(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_auth_check ON toolkit_analytics(session_id) WHERE session_id IS NOT NULL;

-- Add comment explaining the security model
COMMENT ON TABLE policy_generators IS 'Policy generator data - secured by user authentication and session_id matching';
COMMENT ON TABLE toolkit_analytics IS 'Analytics data - secured by user authentication and session_id matching';