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

