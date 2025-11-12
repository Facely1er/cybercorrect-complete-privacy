/*
  # Supabase Cron Jobs for Subscription Features
  
  This migration creates cron jobs for:
  1. Automated report generation
  2. Scheduled assessments
  3. Compliance health tracking
  4. Regulatory update checks
*/

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Cron job for automated report generation (runs daily at 2 AM)
SELECT cron.schedule(
  'generate-automated-reports',
  '0 2 * * *', -- Daily at 2 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/generate-automated-reports',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for scheduled assessments (runs daily at 3 AM)
SELECT cron.schedule(
  'run-scheduled-assessments',
  '0 3 * * *', -- Daily at 3 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/run-scheduled-assessments',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for compliance health tracking (runs daily at 4 AM)
SELECT cron.schedule(
  'track-compliance-health',
  '0 4 * * *', -- Daily at 4 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/track-compliance-health',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for regulatory update checks (runs daily at 5 AM)
SELECT cron.schedule(
  'check-regulatory-updates',
  '0 5 * * *', -- Daily at 5 AM
  $$
  SELECT
    net.http_post(
      url := current_setting('app.supabase_url') || '/functions/v1/check-regulatory-updates',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
      ),
      body := jsonb_build_object()
    ) AS request_id;
  $$
);

-- Cron job for cleaning up expired notifications (runs daily at 1 AM)
SELECT cron.schedule(
  'cleanup-expired-notifications',
  '0 1 * * *', -- Daily at 1 AM
  $$
  SELECT cleanup_expired_notifications();
  $$
);

-- Note: In production, you'll need to:
-- 1. Set app.supabase_url and app.supabase_service_role_key as database settings
-- 2. Enable pg_net extension for HTTP requests: CREATE EXTENSION IF NOT EXISTS pg_net;
-- 3. Configure cron jobs with proper authentication

