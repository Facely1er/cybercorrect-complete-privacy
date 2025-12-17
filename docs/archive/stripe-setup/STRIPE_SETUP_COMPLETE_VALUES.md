# ✅ Stripe Setup - Complete Configuration Values

## 🎯 All Values Ready for Configuration

### Stripe Keys
- **Publishable Key**: `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O` ✅ (Already in .env)
- **Secret Key**: `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` ✅

### Stripe Price IDs (Found)
- **Starter Monthly**: `price_1SDUjIA6UggvM46N1rjxGuFR` ✅
- **Professional Monthly**: `price_1SDUjJA6UggvM46NXU5Jrizp` ✅
- **Enterprise Monthly**: `price_1SDUjKA6UggvM46N0cxKM0Dq` ✅
- **Starter Annual**: ⚠️ Not found (need to create in Stripe Dashboard)
- **Professional Annual**: ⚠️ Not found (need to create in Stripe Dashboard)

### Supabase Configuration
- **Project ID**: `achowlksgmwuvfbvjfrt` ✅
- **URL**: `https://achowlksgmwuvfbvjfrt.supabase.co` ✅
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` ✅

### Site Configuration
- **Site URL**: `https://www.platform.cybercorrect.com` ✅

## 📋 Next Steps

### Step 1: Create Annual Prices in Stripe (If Needed)

If you want annual billing, add these prices to your existing products:

1. Go to Stripe Dashboard → Products
2. Edit **Starter Plan** → Add price: `$39/month` (billed annually = $468/year)
3. Edit **Professional Plan** → Add price: `$79/month` (billed annually = $948/year)
4. Copy the Price IDs

### Step 2: Create Webhook in Stripe

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. **Events**: Select all subscription and invoice events
5. Copy the **Signing secret** (starts with `whsec_...`)

### Step 3: Configure Supabase Edge Function Secrets

Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions

**For `create-checkout-session` function:**
Add these secrets in Supabase Dashboard:
```
STRIPE_SECRET_KEY=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
STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

**For `create-one-time-checkout-session` function:**
```
STRIPE_SECRET_KEY=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
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

**For `stripe-webhook` function:**
```
STRIPE_SECRET_KEY=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
STRIPE_WEBHOOK_SECRET=whsec_[YOUR_WEBHOOK_SECRET_FROM_STRIPE]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

### Step 4: Deploy Edge Functions

**Option A: Via Supabase Dashboard**
1. Go to Edge Functions
2. Deploy each function from the code in `supabase/functions/`

**Option B: Via CLI (after login)**
```powershell
npx supabase link --project-ref achowlksgmwuvfbvjfrt
cd supabase
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
```

## ✅ Current Status

- ✅ Frontend: Stripe publishable key configured
- ✅ Stripe Secret Key: Fresh key provided
- ✅ Price IDs: Monthly prices found
- ⚠️ Annual Prices: Need to be created
- ⚠️ Webhook: Need to be created and configured
- ⏭️ Secrets: Need to be set in Supabase Dashboard
- ⏭️ Functions: Need to be deployed

## 🚀 Quick Setup Commands (After Login)

If you can login to Supabase CLI, run these:

```powershell
# Set common secrets
npx supabase secrets set STRIPE_SECRET_KEY=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
npx supabase secrets set SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
npx supabase secrets set SITE_URL=https://www.platform.cybercorrect.com

# Set price IDs
npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp

# Deploy functions
cd supabase
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
```

---

**All values are ready!** Just need to set secrets and deploy functions via Dashboard or CLI.

