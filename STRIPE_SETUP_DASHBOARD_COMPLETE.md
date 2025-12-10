# 🚀 Complete Stripe Setup - Dashboard Method (All Values Ready)

## ✅ All Configuration Values Ready

I've gathered all the values you need. Just copy and paste them into Supabase Dashboard.

---

## Step 1: Configure Supabase Edge Function Secrets

Go to: **https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions**

### For `create-checkout-session` Function

1. Click on **`create-checkout-session`** function
2. Go to **Settings** → **Secrets**
3. Add these secrets (one by one):

```
STRIPE_SECRET_KEY
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
```

```
STRIPE_PRICE_STARTER_MONTHLY
price_1SDUjIA6UggvM46N1rjxGuFR
```

```
STRIPE_PRICE_PROFESSIONAL_MONTHLY
price_1SDUjJA6UggvM46NXU5Jrizp
```

```
SUPABASE_URL
https://achowlksgmwuvfbvjfrt.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

```
SITE_URL
https://www.platform.cybercorrect.com
```

### For `create-one-time-checkout-session` Function

1. Click on **`create-one-time-checkout-session`** function
2. Go to **Settings** → **Secrets**
3. Add these secrets:

```
STRIPE_SECRET_KEY
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
```

```
SUPABASE_URL
https://achowlksgmwuvfbvjfrt.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

```
SITE_URL
https://www.platform.cybercorrect.com
```

### For `stripe-webhook` Function

1. Click on **`stripe-webhook`** function
2. Go to **Settings** → **Secrets**
3. Add these secrets:

```
STRIPE_SECRET_KEY
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
```

```
STRIPE_WEBHOOK_SECRET
whsec_[CREATE_WEBHOOK_IN_STRIPE_FIRST]
```

```
SUPABASE_URL
https://achowlksgmwuvfbvjfrt.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

```
SITE_URL
https://www.platform.cybercorrect.com
```

---

## Step 2: Create Webhook in Stripe

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
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
8. Go back to Supabase and add it as `STRIPE_WEBHOOK_SECRET` for the `stripe-webhook` function

---

## Step 3: Deploy Edge Functions

### Option A: Via Supabase Dashboard

1. Go to **Edge Functions** in Supabase Dashboard
2. For each function, click **Deploy** or **Upload**
3. The function code is already in:
   - `supabase/functions/create-checkout-session/index.ts`
   - `supabase/functions/create-one-time-checkout-session/index.ts`
   - `supabase/functions/stripe-webhook/index.ts`

### Option B: Via CLI (If You Can Login)

```powershell
# After successful login
npx supabase link --project-ref achowlksgmwuvfbvjfrt
cd supabase
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
```

---

## Step 4: Add Annual Prices (Optional)

If you want annual billing, add these to your Stripe products:

1. **Starter Plan**: Add price `$39/month` (billed annually)
2. **Professional Plan**: Add price `$79/month` (billed annually)
3. Copy the Price IDs
4. Add them as secrets:
   - `STRIPE_PRICE_STARTER_ANNUAL`
   - `STRIPE_PRICE_PROFESSIONAL_ANNUAL`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] All secrets are set in Supabase Dashboard
- [ ] All 3 Edge Functions are deployed
- [ ] Webhook is created in Stripe Dashboard
- [ ] Webhook secret is set in Supabase
- [ ] Test checkout flow works

---

## 🧪 Test the Integration

1. Go to `/pricing` page
2. Click "Subscribe Now" on Starter or Professional
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Should redirect to success page

---

**All values are ready!** Just copy-paste into Supabase Dashboard.

**Estimated Time**: 10-15 minutes

