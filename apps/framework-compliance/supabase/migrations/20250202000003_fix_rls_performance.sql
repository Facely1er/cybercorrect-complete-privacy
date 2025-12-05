-- Fix RLS Performance Warnings
-- This migration optimizes all RLS policies to use (select auth.uid()) instead of auth.uid()
-- This prevents re-evaluation for each row and improves query performance at scale

-- ============================================================================
-- Fix RLS Policies for notifications tablea
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
CREATE POLICY "Users can insert their own notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own notifications" ON notifications;
CREATE POLICY "Users can delete their own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for automated_reports table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own reports" ON automated_reports;
CREATE POLICY "Users can view their own reports"
  ON automated_reports
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own reports" ON automated_reports;
CREATE POLICY "Users can insert their own reports"
  ON automated_reports
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own reports" ON automated_reports;
CREATE POLICY "Users can update their own reports"
  ON automated_reports
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own reports" ON automated_reports;
CREATE POLICY "Users can delete their own reports"
  ON automated_reports
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for compliance_health_scores table
-- ============================================================================
-- Also fix multiple permissive policies issue by combining SELECT policies

DROP POLICY IF EXISTS "Users can view their own scores" ON compliance_health_scores;
DROP POLICY IF EXISTS "Users can view aggregated scores" ON compliance_health_scores;

-- Combined policy: Users can view their own scores OR aggregated scores
CREATE POLICY "Users can view scores"
  ON compliance_health_scores
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = user_id OR true
  );

DROP POLICY IF EXISTS "Users can insert their own scores" ON compliance_health_scores;
CREATE POLICY "Users can insert their own scores"
  ON compliance_health_scores
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for scheduled_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can view their own assessments"
  ON scheduled_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can insert their own assessments"
  ON scheduled_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can update their own assessments"
  ON scheduled_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own assessments" ON scheduled_assessments;
CREATE POLICY "Users can delete their own assessments"
  ON scheduled_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for alert_rules table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own alert rules" ON alert_rules;
CREATE POLICY "Users can view their own alert rules"
  ON alert_rules
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own alert rules" ON alert_rules;
CREATE POLICY "Users can insert their own alert rules"
  ON alert_rules
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own alert rules" ON alert_rules;
CREATE POLICY "Users can update their own alert rules"
  ON alert_rules
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own alert rules" ON alert_rules;
CREATE POLICY "Users can delete their own alert rules"
  ON alert_rules
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for notification_preferences table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own preferences" ON notification_preferences;
CREATE POLICY "Users can view their own preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own preferences" ON notification_preferences;
CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own preferences" ON notification_preferences;
CREATE POLICY "Users can update their own preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_consent_records table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can view their own consent records"
  ON cc_privacy_consent_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can insert their own consent records"
  ON cc_privacy_consent_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can update their own consent records"
  ON cc_privacy_consent_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own consent records" ON cc_privacy_consent_records;
CREATE POLICY "Users can delete their own consent records"
  ON cc_privacy_consent_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_vendor_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can view their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can insert their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can update their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own vendor assessments" ON cc_privacy_vendor_assessments;
CREATE POLICY "Users can delete their own vendor assessments"
  ON cc_privacy_vendor_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_retention_policies table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can view their own retention policies"
  ON cc_privacy_retention_policies
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can insert their own retention policies"
  ON cc_privacy_retention_policies
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can update their own retention policies"
  ON cc_privacy_retention_policies
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own retention policies" ON cc_privacy_retention_policies;
CREATE POLICY "Users can delete their own retention policies"
  ON cc_privacy_retention_policies
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_data_records table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can view their own data records"
  ON cc_privacy_data_records
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can insert their own data records"
  ON cc_privacy_data_records
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can update their own data records"
  ON cc_privacy_data_records
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own data records" ON cc_privacy_data_records;
CREATE POLICY "Users can delete their own data records"
  ON cc_privacy_data_records
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_dpias table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can view their own DPIAs"
  ON cc_privacy_dpias
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can insert their own DPIAs"
  ON cc_privacy_dpias
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can update their own DPIAs"
  ON cc_privacy_dpias
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own DPIAs" ON cc_privacy_dpias;
CREATE POLICY "Users can delete their own DPIAs"
  ON cc_privacy_dpias
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_by_design_assessments table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can view their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can insert their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can update their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
CREATE POLICY "Users can delete their own privacy by design assessments"
  ON cc_privacy_privacy_by_design_assessments
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_service_providers table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can view their own service providers"
  ON cc_privacy_service_providers
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can insert their own service providers"
  ON cc_privacy_service_providers
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can update their own service providers"
  ON cc_privacy_service_providers
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own service providers" ON cc_privacy_service_providers;
CREATE POLICY "Users can delete their own service providers"
  ON cc_privacy_service_providers
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_privacy_incidents table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can view their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can insert their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can update their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own privacy incidents" ON cc_privacy_privacy_incidents;
CREATE POLICY "Users can delete their own privacy incidents"
  ON cc_privacy_privacy_incidents
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscriptions table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can insert their own subscriptions"
  ON cc_privacy_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own subscriptions" ON cc_privacy_subscriptions;
CREATE POLICY "Users can update their own subscriptions"
  ON cc_privacy_subscriptions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscription_history table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscription history" ON cc_privacy_subscription_history;
CREATE POLICY "Users can view their own subscription history"
  ON cc_privacy_subscription_history
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_payment_methods table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can view their own payment methods"
  ON cc_privacy_payment_methods
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can insert their own payment methods"
  ON cc_privacy_payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can update their own payment methods"
  ON cc_privacy_payment_methods
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own payment methods" ON cc_privacy_payment_methods;
CREATE POLICY "Users can delete their own payment methods"
  ON cc_privacy_payment_methods
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_invoices table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own invoices" ON cc_privacy_invoices;
CREATE POLICY "Users can view their own invoices"
  ON cc_privacy_invoices
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Comments
COMMENT ON POLICY "Users can view scores" ON compliance_health_scores IS 'Optimized RLS policy: Users can view their own scores or aggregated scores for benchmarking';

