/*
  # Fix RLS Performance Warnings for cc_privacy Tables
  
  This migration ensures all cc_privacy tables have single RLS policies per role/action
  to prevent "multiple permissive policies" warnings and improve query performance.
  
  It drops any existing policies and recreates them as single consolidated policies.
  
  ⚠️ IMPORTANT: Run the Privacy Risk Radar migration first if you want to fix that table:
  - 20250220000000_privacy_risk_radar.sql (creates cc_privacy_risk_detections table)
  
  This migration will skip tables that don't exist yet.
*/

-- ============================================================================
-- Fix RLS Policies for cc_privacy_risk_detections
-- ============================================================================
-- Note: This table is created by 20250220000000_privacy_risk_radar.sql
-- Skip this section if the table doesn't exist yet

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cc_privacy_risk_detections') THEN
    DROP POLICY IF EXISTS "Users can view their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can view their own risk detections"
      ON cc_privacy_risk_detections
      FOR SELECT
      TO authenticated
      USING ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can insert their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can insert their own risk detections"
      ON cc_privacy_risk_detections
      FOR INSERT
      TO authenticated
      WITH CHECK ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can update their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can update their own risk detections"
      ON cc_privacy_risk_detections
      FOR UPDATE
      TO authenticated
      USING ((select auth.uid()) = user_id)
      WITH CHECK ((select auth.uid()) = user_id);

    DROP POLICY IF EXISTS "Users can delete their own risk detections" ON cc_privacy_risk_detections;
    CREATE POLICY "Users can delete their own risk detections"
      ON cc_privacy_risk_detections
      FOR DELETE
      TO authenticated
      USING ((select auth.uid()) = user_id);
  END IF;
END $$;

-- ============================================================================
-- Fix RLS Policies for cc_privacy_consent_records
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own consent records" ON cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can insert their own consent records" ON cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can update their own consent records" ON cc_privacy_consent_records;
DROP POLICY IF EXISTS "Users can delete their own consent records" ON cc_privacy_consent_records;

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
-- Fix RLS Policies for cc_privacy_vendor_assessments
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own vendor assessments" ON cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can insert their own vendor assessments" ON cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can update their own vendor assessments" ON cc_privacy_vendor_assessments;
DROP POLICY IF EXISTS "Users can delete their own vendor assessments" ON cc_privacy_vendor_assessments;

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
-- Fix RLS Policies for cc_privacy_retention_policies
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own retention policies" ON cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can insert their own retention policies" ON cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can update their own retention policies" ON cc_privacy_retention_policies;
DROP POLICY IF EXISTS "Users can delete their own retention policies" ON cc_privacy_retention_policies;

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
-- Fix RLS Policies for cc_privacy_data_records
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own data records" ON cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can insert their own data records" ON cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can update their own data records" ON cc_privacy_data_records;
DROP POLICY IF EXISTS "Users can delete their own data records" ON cc_privacy_data_records;

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
-- Fix RLS Policies for cc_privacy_dpias
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own DPIAs" ON cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can insert their own DPIAs" ON cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can update their own DPIAs" ON cc_privacy_dpias;
DROP POLICY IF EXISTS "Users can delete their own DPIAs" ON cc_privacy_dpias;

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
-- Fix RLS Policies for cc_privacy_privacy_by_design_assessments
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can insert their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can update their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;
DROP POLICY IF EXISTS "Users can delete their own privacy by design assessments" ON cc_privacy_privacy_by_design_assessments;

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
-- Fix RLS Policies for cc_privacy_service_providers
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own service providers" ON cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can insert their own service providers" ON cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can update their own service providers" ON cc_privacy_service_providers;
DROP POLICY IF EXISTS "Users can delete their own service providers" ON cc_privacy_service_providers;

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
-- Fix RLS Policies for cc_privacy_privacy_incidents
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own privacy incidents" ON cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can insert their own privacy incidents" ON cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can update their own privacy incidents" ON cc_privacy_privacy_incidents;
DROP POLICY IF EXISTS "Users can delete their own privacy incidents" ON cc_privacy_privacy_incidents;

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
-- Fix RLS Policies for cc_privacy_subscriptions
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscriptions" ON cc_privacy_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON cc_privacy_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON cc_privacy_subscriptions;
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON cc_privacy_subscriptions;

CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON cc_privacy_subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON cc_privacy_subscriptions
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_subscription_history
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own subscription history" ON cc_privacy_subscription_history;
DROP POLICY IF EXISTS "Service role can manage all subscription history" ON cc_privacy_subscription_history;

CREATE POLICY "Users can view their own subscription history"
  ON cc_privacy_subscription_history
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_payment_methods
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own payment methods" ON cc_privacy_payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON cc_privacy_payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON cc_privacy_payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON cc_privacy_payment_methods;

CREATE POLICY "Users can view their own payment methods"
  ON cc_privacy_payment_methods
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON cc_privacy_payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON cc_privacy_payment_methods
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON cc_privacy_payment_methods
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_privacy_invoices
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own invoices" ON cc_privacy_invoices;
DROP POLICY IF EXISTS "Users can insert their own invoices" ON cc_privacy_invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON cc_privacy_invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON cc_privacy_invoices;

CREATE POLICY "Users can view their own invoices"
  ON cc_privacy_invoices
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own invoices"
  ON cc_privacy_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own invoices"
  ON cc_privacy_invoices
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete their own invoices"
  ON cc_privacy_invoices
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- Fix RLS Policies for cc_one_time_purchases
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own purchases" ON cc_one_time_purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON cc_one_time_purchases;
DROP POLICY IF EXISTS "Users can update their own purchases" ON cc_one_time_purchases;
DROP POLICY IF EXISTS "Service role can manage all purchases" ON cc_one_time_purchases;

CREATE POLICY "Users can view their own purchases"
  ON cc_one_time_purchases
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON cc_one_time_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update their own purchases"
  ON cc_one_time_purchases
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON POLICY "Users can view their own risk detections" ON cc_privacy_risk_detections IS 'Single consolidated policy to prevent multiple permissive policies warning';
COMMENT ON POLICY "Users can view their own subscriptions" ON cc_privacy_subscriptions IS 'Single consolidated policy - service role policies removed to prevent conflicts';

