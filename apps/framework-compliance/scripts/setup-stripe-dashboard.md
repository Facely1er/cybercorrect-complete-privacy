# Stripe Setup via Supabase Dashboard

Since Supabase CLI is not installed, use the Supabase Dashboard to complete the setup.

## Step-by-Step Instructions

### 1. Get Required Information

**From Stripe Dashboard:**
- Secret Key: `sk_live_...` (from Developers → API keys)
- Price IDs: `price_...` (from Products → [Product] → Pricing)
- Webhook Secret: `whsec_...` (from Developers → Webhooks)

**From Supabase Dashboard:**
- Project ID: Found in Settings → General → Reference ID
- Project URL: `https://[PROJECT-ID].supabase.co`
- Service Role Key: Found in Settings → API → service_role key

### 2. Configure Edge Function Secrets

Go to Supabase Dashboard → Edge Functions → [Function Name] → Settings → Secrets

**For each function, add the appropriate secrets:**

#### create-checkout-session
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_ANNUAL=price_...
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SITE_URL=https://www.cybercorrect.com
```

#### create-one-time-checkout-session
```
STRIPE_SECRET_KEY=sk_live_...
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SITE_URL=https://www.cybercorrect.com
```

#### stripe-webhook
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SITE_URL=https://www.cybercorrect.com
```

### 3. Deploy Functions

If functions are not already deployed:
1. Go to Supabase Dashboard → Edge Functions
2. Click "Create Function" or "Deploy"
3. Upload the function code from `supabase/functions/[function-name]/index.ts`

### 4. Verify Setup

1. Check function logs in Supabase Dashboard
2. Test checkout flow in browser
3. Verify webhook receives events in Stripe Dashboard

