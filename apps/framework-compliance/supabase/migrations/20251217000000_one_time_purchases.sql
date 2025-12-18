/*
  # One-Time Purchases Table
  
  This migration creates the table for storing one-time product purchases.
  Used by the Stripe webhook to record purchases and generate license keys.
  
  Table: cc_one_time_purchases
  Purpose: Track one-time product purchases, license keys, and purchase history
*/

-- Create one-time purchases table
CREATE TABLE IF NOT EXISTS cc_one_time_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Nullable for guest purchases
  customer_email TEXT, -- For guest purchases and email delivery
  product_id TEXT NOT NULL,
  license_key TEXT NOT NULL UNIQUE,
  stripe_session_id TEXT,
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'refunded', 'expired', 'revoked')),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- For annual licenses (if applicable)
  metadata JSONB DEFAULT '{}'::jsonb, -- Store additional product/purchase info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure either user_id or customer_email is provided
  CONSTRAINT check_user_or_email CHECK (user_id IS NOT NULL OR customer_email IS NOT NULL)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_id ON cc_one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_customer_email ON cc_one_time_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_product_id ON cc_one_time_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_license_key ON cc_one_time_purchases(license_key);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_stripe_session ON cc_one_time_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_status ON cc_one_time_purchases(status);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_purchased_at ON cc_one_time_purchases(purchased_at DESC);
-- Composite index for user/product lookups
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_product ON cc_one_time_purchases(user_id, product_id) WHERE user_id IS NOT NULL;

-- Enable RLS
ALTER TABLE cc_one_time_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON cc_one_time_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own purchases (for manual license activation)
CREATE POLICY "Users can insert their own purchases"
  ON cc_one_time_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do everything (for webhook processing)
CREATE POLICY "Service role has full access"
  ON cc_one_time_purchases
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role')
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_one_time_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_one_time_purchases_updated_at
  BEFORE UPDATE ON cc_one_time_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_one_time_purchases_updated_at();

-- Add comments
COMMENT ON TABLE cc_one_time_purchases IS 'Stores one-time product purchases with license keys generated via Stripe webhook. Supports both authenticated users and guest purchases.';
COMMENT ON COLUMN cc_one_time_purchases.user_id IS 'User ID for authenticated purchases. Nullable for guest purchases.';
COMMENT ON COLUMN cc_one_time_purchases.customer_email IS 'Customer email for guest purchases and license key delivery. Required if user_id is null.';
COMMENT ON COLUMN cc_one_time_purchases.license_key IS 'Unique license key for product activation';
COMMENT ON COLUMN cc_one_time_purchases.amount IS 'Purchase amount in cents';
COMMENT ON COLUMN cc_one_time_purchases.metadata IS 'Additional purchase/product information in JSON format';

