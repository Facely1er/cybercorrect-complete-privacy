# 🚀 Final Stripe Setup - Dashboard Method

## ✅ What We Have

- ✅ **Stripe Publishable Key**: `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O` (configured in .env)
- ✅ **Supabase Project**: `achowlksgmwuvfbvjfrt`
- ✅ **Supabase URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`
- ✅ **Supabase Service Role Key**: Found in migration scripts

## ⚠️ What You Need

1. **Fresh Stripe Secret Key** (the one in scripts is expired)
   - Get from: https://dashboard.stripe.com/apikeys
   - Should match your publishable key (both live mode)

2. **Stripe Price IDs** (after creating products)
   - Create products in Stripe Dashboard
   - Get Price IDs (start with `price_`)

3. **Stripe Webhook Secret** (after creating webhook)
   - Create webhook in Stripe Dashboard
   - Get signing secret (starts with `whsec_`)

## 📋 Step-by-Step Setup

### Step 1: Get Fresh Stripe Secret Key

1. Go to https://dashboard.stripe.com/apikeys
2. Click "Reveal live key token" for your Secret key
3. Copy the key (starts with `sk_live_...`)

### Step 2: Create Products in Stripe

1. Go to Stripe Dashboard → **Products**
2. Click **+ Add product**

**Starter Plan:**
- Name: `Starter Plan`
- Description: `Perfect for small teams starting their privacy compliance journey`
- Pricing:
  - Add Recurring: `$49/month` → Save → **Copy Price ID**
  - Add Recurring: `$39/month` (billed annually) → Save → **Copy Price ID**

**Professional Plan:**
- Name: `Professional Plan`
- Description: `Complete privacy compliance suite for growing organizations`
- Pricing:
  - Add Recurring: `$99/month` → Save → **Copy Price ID**
  - Add Recurring: `$79/month` (billed annually) → Save → **Copy Price ID**

### Step 3: Configure Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook`
4. **Description**: `Supabase Edge Function Webhook`
5. **Events to send**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
6. Click **Add endpoint**
7. **Copy the Signing secret** (starts with `whsec_...`)

### Step 4: Configure Supabase Edge Function Secrets

1. Go to https://app.supabase.com/project/achowlksgmwuvfbvjfrt
2. Navigate to **Edge Functions** → **Secrets**

**For `create-checkout-session` function:**
Add these secrets:
```
STRIPE_SECRET_KEY=sk_live_[YOUR_FRESH_KEY]
STRIPE_PRICE_STARTER_MONTHLY=price_[FROM_STEP_2]
STRIPE_PRICE_STARTER_ANNUAL=price_[FROM_STEP_2]
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_[FROM_STEP_2]
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_[FROM_STEP_2]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

**For `create-one-time-checkout-session` function:**
Add these secrets:
```
STRIPE_SECRET_KEY=sk_live_[YOUR_FRESH_KEY]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

**For `stripe-webhook` function:**
Add these secrets:
```
STRIPE_SECRET_KEY=sk_live_[YOUR_FRESH_KEY]
STRIPE_WEBHOOK_SECRET=whsec_[FROM_STEP_3]
SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
SITE_URL=https://www.platform.cybercorrect.com
```

### Step 5: Deploy Edge Functions

**Option A: Via Supabase Dashboard**
1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, click **Deploy** or upload the code from:
   - `supabase/functions/create-checkout-session/index.ts`
   - `supabase/functions/create-one-time-checkout-session/index.ts`
   - `supabase/functions/stripe-webhook/index.ts`

**Option B: Via CLI (if you login)**
```powershell
npx supabase login
npx supabase link --project-ref achowlksgmwuvfbvjfrt
cd supabase
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
```

## ✅ Quick Checklist

- [ ] Get fresh Stripe Secret Key from Stripe Dashboard
- [ ] Create Starter Plan product ($49/month, $39/month annual)
- [ ] Create Professional Plan product ($99/month, $79/month annual)
- [ ] Copy all 4 Price IDs
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Copy webhook signing secret
- [ ] Set secrets for `create-checkout-session` function
- [ ] Set secrets for `create-one-time-checkout-session` function
- [ ] Set secrets for `stripe-webhook` function
- [ ] Deploy all 3 Edge Functions
- [ ] Test checkout flow

## 🧪 Testing

After setup:
1. Go to `/pricing` page
2. Click "Subscribe Now"
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout

---

**Estimated Time**: 15-20 minutes
**Status**: Frontend ready, backend configuration pending

