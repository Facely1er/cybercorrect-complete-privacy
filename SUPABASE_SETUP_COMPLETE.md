# Supabase Setup - Quick Start Guide

## ✅ Your Supabase Credentials

**Project URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`

**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`

**Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`

---

## 🚀 Quick Setup Steps

### Step 1: Set Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**⚠️ IMPORTANT**: 
- Never commit `.env` file to Git (already in `.gitignore`)
- The `.env` file is for local development only
- For production, set these in your deployment platform (Netlify, Vercel, etc.)

### Step 2: Apply Database Migrations

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to: https://app.supabase.com
2. Login and select project: **achowlksgmwuvfbvjfrt**
3. Click **SQL Editor** → **New query**
4. Apply migrations in order (see `APPLY_MIGRATIONS.md` for detailed instructions):

   - `20250130000000_improve_security.sql`
   - `20250201000000_subscription_features.sql`
   - `20250201000001_cron_jobs.sql` (optional - can skip if fails)
   - `20250202000000_privacy_tools_schema.sql` ⭐ **CRITICAL**
   - `20250202000001_subscriptions.sql`

5. For each migration:
   - Open the SQL file from `supabase/migrations/`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**

**Option B: Using Supabase CLI**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref achowlksgmwuvfbvjfrt

# Apply migrations
supabase db push
```

### Step 3: Verify Setup

Run the verification script:

```bash
npx tsx scripts/verify-supabase-setup.ts
```

This will check:
- ✅ Connection to Supabase
- ✅ All required tables exist
- ✅ Tables are accessible

### Step 4: Deploy Edge Functions

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login and link (if not already done)
supabase login
supabase link --project-ref achowlksgmwuvfbvjfrt

# Deploy functions
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

### Step 5: Configure Edge Function Secrets

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, set these secrets:

   **For `send-email-notification`:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - `SENDGRID_API_KEY` = (if using SendGrid)
   - `SENDGRID_FROM_EMAIL` = (if using SendGrid)

   **For `stripe-webhook`:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
   - `STRIPE_SECRET_KEY` = (when Stripe is configured)
   - `STRIPE_WEBHOOK_SECRET` = (when Stripe is configured)

   **For other functions:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)

### Step 6: Test the Application

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open app in browser
3. Create a test account
4. Test a privacy tool (e.g., Consent Management)
5. Verify data appears in Supabase Table Editor

---

## 📋 Required Tables Checklist

After applying migrations, verify these tables exist:

- [ ] `cc_privacy_consent_records`
- [ ] `cc_privacy_vendor_assessments`
- [ ] `cc_privacy_retention_policies`
- [ ] `cc_privacy_data_records`
- [ ] `cc_privacy_dpias`
- [ ] `cc_privacy_privacy_by_design_assessments`
- [ ] `cc_privacy_service_providers`
- [ ] `cc_privacy_privacy_incidents`
- [ ] `cc_privacy_subscriptions`
- [ ] `cc_privacy_subscription_history`
- [ ] `cc_privacy_payment_methods`
- [ ] `cc_privacy_invoices`

---

## 🔧 Next Steps (Optional)

### Configure Stripe (for Payments)

1. Create Stripe account: https://stripe.com
2. Get API keys from Stripe Dashboard
3. Add to `.env`:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Set up products in Stripe Dashboard
5. Configure webhook endpoint in Stripe

### Configure SendGrid (for Emails)

1. Create SendGrid account: https://sendgrid.com
2. Verify sender domain
3. Create API key
4. Add to Edge Function secrets:
   - `SENDGRID_API_KEY`
   - `SENDGRID_FROM_EMAIL`

### Configure Sentry (for Error Monitoring)

1. Create Sentry account: https://sentry.io
2. Create project
3. Get DSN
4. Add to `.env`:
   ```bash
   VITE_SENTRY_DSN=https://...
   ```

---

## 🐛 Troubleshooting

### Connection Issues

- **Check URL**: Verify `VITE_SUPABASE_URL` is correct
- **Check Key**: Verify `VITE_SUPABASE_ANON_KEY` is correct
- **Network**: Check if your IP is blocked (Supabase Dashboard → Settings → Network)

### Migration Errors

- **Read Error**: Check error message in SQL Editor
- **Run in Parts**: Large migrations may need to be run in sections
- **Extensions**: Some features need extensions enabled (Database → Extensions)

### Tables Not Showing

- **Refresh**: Refresh Table Editor
- **Schema**: Check you're looking at `public` schema
- **Verify**: Check SQL Editor history to confirm migration ran

### Edge Function Issues

- **Login**: Make sure you're logged in: `supabase login`
- **Link**: Verify project is linked: `supabase link --project-ref achowlksgmwuvfbvjfrt`
- **Secrets**: Check function secrets are set correctly
- **Logs**: Review function logs in Supabase Dashboard

---

## 📚 Additional Resources

- **Detailed Migration Guide**: See `APPLY_MIGRATIONS.md`
- **Full Setup Guide**: See `scripts/setup-supabase.md`
- **Supabase Docs**: https://supabase.com/docs
- **Project Documentation**: See `README.md`

---

## ✅ Completion Checklist

- [ ] Environment variables set in `.env` file
- [ ] All database migrations applied
- [ ] All required tables verified
- [ ] Edge Functions deployed
- [ ] Edge Function secrets configured
- [ ] Application tested locally
- [ ] Connection verified with verification script

---

**Status**: Ready to apply migrations and deploy! 🚀

