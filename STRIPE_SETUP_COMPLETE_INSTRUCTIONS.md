# 🚀 Complete Stripe Setup - Final Instructions

## Current Status

✅ **Stripe Publishable Key**: Already configured in `.env` file
- Key: `pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O`

## What You Need to Complete

### Option 1: Using Supabase Dashboard (Recommended - No CLI Required)

#### Step 1: Get Your Stripe Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (should match your publishable key - both live mode)
   - Should start with `sk_live_...`

#### Step 2: Create Products and Prices in Stripe

1. Go to Stripe Dashboard → **Products**
2. Create products:

**Starter Plan:**
- Name: `Starter Plan`
- Add Recurring price: `$49/month` → Save → Copy Price ID
- Add Recurring price: `$39/month` (billed annually) → Save → Copy Price ID

**Professional Plan:**
- Name: `Professional Plan`
- Add Recurring price: `$99/month` → Save → Copy Price ID
- Add Recurring price: `$79/month` (billed annually) → Save → Copy Price ID

#### Step 3: Configure Webhook in Stripe

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/functions/v1/stripe-webhook`
   - Replace `[YOUR-SUPABASE-PROJECT-ID]` with your actual Supabase project ID
   - You can find this in your Supabase Dashboard → Settings → API
4. **Events to send**:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.paid`
   - ✅ `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)

#### Step 4: Configure Supabase Edge Function Secrets

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Edge Functions** → **Secrets**

**For `create-checkout-session` function:**
Add these secrets:
- `STRIPE_SECRET_KEY` = `sk_live_...` (your Stripe secret key)
- `STRIPE_PRICE_STARTER_MONTHLY` = `price_...` (from Step 2)
- `STRIPE_PRICE_STARTER_ANNUAL` = `price_...` (from Step 2)
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...` (from Step 2)
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...` (from Step 2)
- `SUPABASE_URL` = `https://[YOUR-PROJECT-ID].supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Supabase Dashboard → Settings → API → service_role key)
- `SITE_URL` = `https://www.platform.cybercorrect.com`

**For `create-one-time-checkout-session` function:**
Add these secrets:
- `STRIPE_SECRET_KEY` = `sk_live_...` (same as above)
- `SUPABASE_URL` = `https://[YOUR-PROJECT-ID].supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (same as above)
- `SITE_URL` = `https://www.platform.cybercorrect.com`

**For `stripe-webhook` function:**
Add these secrets:
- `STRIPE_SECRET_KEY` = `sk_live_...` (same as above)
- `STRIPE_WEBHOOK_SECRET` = `whsec_...` (from Step 3)
- `SUPABASE_URL` = `https://[YOUR-PROJECT-ID].supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (same as above)
- `SITE_URL` = `https://www.platform.cybercorrect.com`

#### Step 5: Deploy Edge Functions

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function (`create-checkout-session`, `create-one-time-checkout-session`, `stripe-webhook`):
   - Click on the function
   - Click **Deploy** (or use the Supabase Dashboard deployment interface)
   - Or use the Supabase Dashboard to upload the function code

**Alternative: Install Supabase CLI and Deploy**

If you prefer using CLI:
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref [YOUR-PROJECT-REF]

# Deploy functions
cd supabase
supabase functions deploy create-checkout-session
supabase functions deploy create-one-time-checkout-session
supabase functions deploy stripe-webhook
```

### Option 2: Using Script (If You Have All Values)

If you have all the required values, you can use the automated script:

```powershell
cd apps/framework-compliance

# Set environment variables
$env:STRIPE_SECRET_KEY="sk_live_..."
$env:STRIPE_PUBLISHABLE_KEY="pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O"
$env:STRIPE_WEBHOOK_SECRET="whsec_..."
$env:SUPABASE_URL="https://[YOUR-PROJECT-ID].supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="..."
$env:STRIPE_PRICE_STARTER_MONTHLY="price_..."
$env:STRIPE_PRICE_STARTER_ANNUAL="price_..."
$env:STRIPE_PRICE_PROFESSIONAL_MONTHLY="price_..."
$env:STRIPE_PRICE_PROFESSIONAL_ANNUAL="price_..."

# Run setup (requires Supabase CLI)
npm run stripe:setup
```

## Quick Checklist

- [ ] Get Stripe Secret Key from Stripe Dashboard
- [ ] Create Starter Plan product with monthly ($49) and annual ($39/month) prices
- [ ] Create Professional Plan product with monthly ($99) and annual ($79/month) prices
- [ ] Copy all 4 Price IDs (they start with `price_`)
- [ ] Create webhook endpoint in Stripe Dashboard
- [ ] Copy webhook signing secret (starts with `whsec_`)
- [ ] Get Supabase Project ID and Service Role Key
- [ ] Configure Edge Function secrets in Supabase Dashboard
- [ ] Deploy Edge Functions
- [ ] Test checkout flow

## Testing

After setup, test the integration:

1. **Test Subscription Checkout:**
   - Go to `/pricing` page
   - Click "Subscribe Now" on Starter or Professional
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout

2. **Test One-Time Checkout:**
   - Go to `/store` page
   - Add product to cart
   - Complete checkout
   - Use test card: `4242 4242 4242 4242`

## Need Help?

If you encounter issues:
1. Check Edge Function logs in Supabase Dashboard
2. Check browser console for errors
3. Verify all secrets are set correctly
4. Review `STRIPE_DEBUG_GUIDE.md` for troubleshooting

---

**Estimated Time**: 15-30 minutes
**Difficulty**: Easy (using Dashboard) or Medium (using CLI)

