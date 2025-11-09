# Supabase Setup Instructions

## Quick Setup Guide

You've been provided with Supabase credentials. Follow these steps to complete the setup:

### 1. Set Environment Variables

Create a `.env` file in the project root (or set them in your deployment platform):

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo

# Service Role Key (for Edge Functions only - never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

### 2. Apply Database Migrations

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `achowlksgmwuvfbvjfrt`
3. Navigate to **SQL Editor**
4. Apply migrations in this order:

   **Migration 1: Security Improvements**
   - Open: `supabase/migrations/20250130000000_improve_security.sql`
   - Copy all SQL content
   - Paste into SQL Editor
   - Click "Run"

   **Migration 2: Subscription Features**
   - Open: `supabase/migrations/20250201000000_subscription_features.sql`
   - Copy all SQL content
   - Paste into SQL Editor
   - Click "Run"

   **Migration 3: Cron Jobs**
   - Open: `supabase/migrations/20250201000001_cron_jobs.sql`
   - Copy all SQL content
   - Paste into SQL Editor
   - Click "Run"
   - **Note**: This requires `pg_cron` extension. If it fails, you can skip this for now.

   **Migration 4: Privacy Tools Schema** ⭐ **CRITICAL**
   - Open: `supabase/migrations/20250202000000_privacy_tools_schema.sql`
   - Copy all SQL content
   - Paste into SQL Editor
   - Click "Run"
   - This creates tables for all 7 privacy tools

   **Migration 5: Subscriptions**
   - Open: `supabase/migrations/20250202000001_subscriptions.sql`
   - Copy all SQL content
   - Paste into SQL Editor
   - Click "Run"

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref achowlksgmwuvfbvjfrt

# Apply all migrations
supabase db push
```

### 3. Verify Tables Created

After applying migrations, verify tables exist:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `cc_privacy_consent_records`
   - `cc_privacy_vendor_assessments`
   - `cc_privacy_retention_policies`
   - `cc_privacy_data_records`
   - `cc_privacy_dpias`
   - `cc_privacy_privacy_by_design_assessments`
   - `cc_privacy_service_providers`
   - `cc_privacy_privacy_incidents`
   - `cc_privacy_subscriptions`
   - `cc_privacy_subscription_history`
   - `cc_privacy_payment_methods`
   - `cc_privacy_invoices`

### 4. Configure Edge Functions

#### Set Function Secrets

1. Go to **Edge Functions** in Supabase Dashboard
2. For each function, set these secrets:

   **For `send-email-notification`:**
   - `SENDGRID_API_KEY` (if using SendGrid)
   - `SENDGRID_FROM_EMAIL` (if using SendGrid)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

   **For `stripe-webhook`:**
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

   **For other functions:**
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

#### Deploy Edge Functions

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login and link (if not already done)
supabase login
supabase link --project-ref achowlksgmwuvfbvjfrt

# Deploy each function
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

### 5. Enable pg_cron Extension (Optional)

If you want to use cron jobs:

1. Go to **Database** → **Extensions** in Supabase Dashboard
2. Search for `pg_cron`
3. Click **Enable**
4. **Note**: This may require Supabase Pro plan

Alternatively, use external cron service (Cron-job.org, EasyCron) to call Edge Functions via HTTP.

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Try creating a user account
4. Test one of the privacy tools (e.g., Consent Management)
5. Verify data is saved to Supabase

### 7. Deploy to Production

When deploying to production (Netlify, Vercel, etc.):

1. Set environment variables in your deployment platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (Optional) `VITE_STRIPE_PUBLISHABLE_KEY`
   - (Optional) `VITE_SENTRY_DSN`

2. **Never** expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
3. Only use service role key in Edge Functions

## Troubleshooting

### Migration Errors

If a migration fails:
1. Check the error message in SQL Editor
2. Some migrations may need to be run in parts
3. Check if required extensions are enabled
4. Verify you have the correct permissions

### Connection Issues

If you can't connect:
1. Verify the Supabase URL is correct
2. Check that the anon key is correct
3. Ensure your IP is not blocked (check Supabase Dashboard → Settings → Network)

### Edge Function Deployment Issues

If Edge Functions fail to deploy:
1. Check that you're logged in: `supabase login`
2. Verify project is linked: `supabase link --project-ref achowlksgmwuvfbvjfrt`
3. Check function secrets are set correctly
4. Review function logs in Supabase Dashboard

## Next Steps

After completing this setup:

1. ✅ Database migrations applied
2. ✅ Edge Functions deployed
3. ⏭️ Configure Stripe (for payments)
4. ⏭️ Configure SendGrid (for emails)
5. ⏭️ Configure Sentry (for error monitoring)
6. ⏭️ Set up cron jobs (optional)

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit `.env` files to Git
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Use service role key only in Edge Functions
- Keep your keys secure and rotate them regularly

