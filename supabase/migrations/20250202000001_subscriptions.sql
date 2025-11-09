-- Subscription Management Tables
-- This migration creates tables for managing user subscriptions, payments, and billing

-- Subscriptions table
CREATE TABLE IF NOT EXISTS cc_privacy_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'cancelled', 'past_due', 'trialing')),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription history table (audit trail)
CREATE TABLE IF NOT EXISTS cc_privacy_subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES cc_privacy_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'cancelled', 'renewed', 'expired', 'reactivated')),
  old_tier TEXT,
  new_tier TEXT,
  old_status TEXT,
  new_status TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS cc_privacy_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'bank_account')),
  is_default BOOLEAN DEFAULT FALSE,
  last4 TEXT,
  brand TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS cc_privacy_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES cc_privacy_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'uncollectible', 'void')),
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  invoice_pdf TEXT,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON cc_privacy_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON cc_privacy_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON cc_privacy_subscriptions(stripe_subscription_id);

-- Unique index to ensure only one active subscription per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_unique_active 
  ON cc_privacy_subscriptions(user_id, status) 
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription_id ON cc_privacy_subscription_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON cc_privacy_subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON cc_privacy_payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_payment_method_id ON cc_privacy_payment_methods(stripe_payment_method_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription_id ON cc_privacy_invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON cc_privacy_invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON cc_privacy_invoices(stripe_invoice_id);

-- Row Level Security (RLS) Policies
ALTER TABLE cc_privacy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON cc_privacy_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON cc_privacy_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON cc_privacy_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for subscription history
CREATE POLICY "Users can view their own subscription history"
  ON cc_privacy_subscription_history FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for payment methods
CREATE POLICY "Users can view their own payment methods"
  ON cc_privacy_payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON cc_privacy_payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON cc_privacy_payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods"
  ON cc_privacy_payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON cc_privacy_invoices FOR SELECT
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON cc_privacy_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON cc_privacy_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON cc_privacy_invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to create subscription history entry
CREATE OR REPLACE FUNCTION create_subscription_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.cc_privacy_subscription_history (
      subscription_id,
      user_id,
      action,
      new_tier,
      new_status
    ) VALUES (
      NEW.id,
      NEW.user_id,
      'created',
      NEW.tier,
      NEW.status
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.cc_privacy_subscription_history (
      subscription_id,
      user_id,
      action,
      old_tier,
      new_tier,
      old_status,
      new_status
    ) VALUES (
      NEW.id,
      NEW.user_id,
      CASE
        WHEN NEW.status != OLD.status THEN 'updated'
        WHEN NEW.tier != OLD.tier THEN 'updated'
        WHEN NEW.cancel_at_period_end != OLD.cancel_at_period_end AND NEW.cancel_at_period_end = TRUE THEN 'cancelled'
        ELSE 'updated'
      END,
      OLD.tier,
      NEW.tier,
      OLD.status,
      NEW.status
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = '';

CREATE TRIGGER subscription_history_trigger
  AFTER INSERT OR UPDATE ON cc_privacy_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION create_subscription_history();

-- Comments for documentation
COMMENT ON TABLE cc_privacy_subscriptions IS 'User subscription records with Stripe integration';
COMMENT ON TABLE cc_privacy_subscription_history IS 'Audit trail for subscription changes';
COMMENT ON TABLE cc_privacy_payment_methods IS 'Stored payment methods for users';
COMMENT ON TABLE cc_privacy_invoices IS 'Invoice records from Stripe';


