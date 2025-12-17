# Apply One-Time Purchases Migration

**Quick Guide to Create `cc_one_time_purchases` Table**

---

## 🚀 Quick Method (Recommended)

### Step 1: Open Supabase Dashboard
1. Go to: https://app.supabase.com
2. Login to your account
3. Select your project: **achowlksgmwuvfbvjfrt** (or your project ID)

### Step 2: Open SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New query** button

### Step 3: Copy and Paste Migration SQL

Copy the entire SQL below and paste it into the SQL Editor:

```sql
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_user_id ON cc_one_time_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_product_id ON cc_one_time_purchases(product_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_license_key ON cc_one_time_purchases(license_key);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_stripe_session ON cc_one_time_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_status ON cc_one_time_purchases(status);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_purchased_at ON cc_one_time_purchases(purchased_at DESC);

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

-- Add comment
COMMENT ON TABLE cc_one_time_purchases IS 'Stores one-time product purchases with license keys generated via Stripe webhook';
COMMENT ON COLUMN cc_one_time_purchases.license_key IS 'Unique license key for product activation';
COMMENT ON COLUMN cc_one_time_purchases.amount IS 'Purchase amount in cents';
COMMENT ON COLUMN cc_one_time_purchases.metadata IS 'Additional purchase/product information in JSON format';
```

### Step 4: Run the Migration
1. Click **Run** button (or press `Ctrl+Enter`)
2. Wait for "Success" message
3. You should see: "Success. No rows returned"

### Step 5: Verify Migration
1. Click **Table Editor** in the left sidebar
2. Look for table: **cc_one_time_purchases**
3. Or run verification: `npm run verify:one-time`

---

## ✅ Alternative: Use Combined Migrations File

If you prefer to apply all migrations at once:

1. Open SQL Editor in Supabase Dashboard
2. Open file: `apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
3. Copy the section starting with `-- Migration: 20250205000000_one_time_purchases.sql`
4. Paste and run in SQL Editor

---

## 🔍 Verification

After applying the migration, verify it worked:

### Option 1: Check in Supabase Dashboard
1. Go to **Table Editor**
2. Look for `cc_one_time_purchases` table
3. Click on it to see the structure

### Option 2: Run Verification Script
```bash
cd apps/framework-compliance
npm run verify:one-time
```

### Option 3: Manual SQL Check
Run this in SQL Editor:
```sql
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'cc_one_time_purchases'
ORDER BY ordinal_position;
```

You should see 15 columns including:
- `id` (uuid)
- `user_id` (uuid)
- `product_id` (text)
- `license_key` (text)
- `amount` (integer)
- `status` (text)
- etc.

---

## 🐛 Troubleshooting

### Error: "relation already exists"
**Solution:** The table already exists. Migration was already applied. ✅

### Error: "permission denied"
**Solution:** Make sure you're using the SQL Editor (which has admin privileges), not a regular query.

### Error: "function already exists"
**Solution:** Some parts may have been created before. The `IF NOT EXISTS` clauses should handle this, but if errors persist, you can skip the function/trigger creation lines.

### Error: "policy already exists"
**Solution:** Policies may have been created before. You can drop and recreate:
```sql
DROP POLICY IF EXISTS "Users can view their own purchases" ON cc_one_time_purchases;
DROP POLICY IF EXISTS "Users can insert their own purchases" ON cc_one_time_purchases;
DROP POLICY IF EXISTS "Service role has full access" ON cc_one_time_purchases;
```
Then re-run the CREATE POLICY statements.

---

## 📋 What This Migration Creates

- ✅ **Table:** `cc_one_time_purchases`
  - Stores purchase records
  - Tracks license keys
  - Links to Stripe sessions
  
- ✅ **Indexes:** 6 indexes for fast queries
  - User ID lookups
  - Product ID lookups
  - License key lookups
  - Stripe session lookups
  - Status filtering
  - Date sorting

- ✅ **RLS Policies:** 3 policies
  - Users can view their own purchases
  - Users can insert their own purchases
  - Service role has full access (for webhooks)

- ✅ **Triggers:** Auto-update `updated_at` timestamp

---

## ✅ Success Checklist

After applying, you should have:
- [ ] Table `cc_one_time_purchases` exists
- [ ] 6 indexes created
- [ ] 3 RLS policies active
- [ ] Trigger function created
- [ ] Verification script passes

---

**Time Required:** ~2 minutes  
**Difficulty:** Easy (copy-paste SQL)

Once complete, one-time purchases will be ready to store purchase records! 🎉

