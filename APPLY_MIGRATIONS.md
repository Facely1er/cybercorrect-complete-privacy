# Apply Database Migrations - Quick Guide

## Your Supabase Credentials

**Project URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`

**Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`

**Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`

## Step-by-Step: Apply Migrations

### 1. Go to Supabase Dashboard

1. Visit: https://app.supabase.com
2. Login to your account
3. Select project: **achowlksgmwuvfbvjfrt**

### 2. Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click **New query**

### 3. Apply Migrations in Order

#### Migration 1: Security Improvements
1. Open file: `supabase/migrations/20250130000000_improve_security.sql`
2. Copy **ALL** SQL content
3. Paste into SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for "Success" message

#### Migration 2: Subscription Features
1. Open file: `supabase/migrations/20250201000000_subscription_features.sql`
2. Copy **ALL** SQL content
3. Paste into SQL Editor
4. Click **Run**
5. Wait for "Success" message

#### Migration 3: Cron Jobs (Optional - Can Skip)
1. Open file: `supabase/migrations/20250201000001_cron_jobs.sql`
2. Copy **ALL** SQL content
3. Paste into SQL Editor
4. Click **Run**
5. **Note**: If this fails, it's OK - you can skip it for now. It requires `pg_cron` extension which may need Pro plan.

#### Migration 4: Privacy Tools Schema ⭐ **CRITICAL**
1. Open file: `supabase/migrations/20250202000000_privacy_tools_schema.sql`
2. Copy **ALL** SQL content
3. Paste into SQL Editor
4. Click **Run**
5. This creates tables for all 7 privacy tools
6. Wait for "Success" message

#### Migration 5: Subscriptions
1. Open file: `supabase/migrations/20250202000001_subscriptions.sql`
2. Copy **ALL** SQL content
3. Paste into SQL Editor
4. Click **Run**
5. Wait for "Success" message

### 4. Verify Tables Created

1. Click **Table Editor** in left sidebar
2. You should see these tables (with `cc_privacy_` prefix):
   - ✅ `cc_privacy_consent_records`
   - ✅ `cc_privacy_vendor_assessments`
   - ✅ `cc_privacy_retention_policies`
   - ✅ `cc_privacy_data_records`
   - ✅ `cc_privacy_dpias`
   - ✅ `cc_privacy_privacy_by_design_assessments`
   - ✅ `cc_privacy_service_providers`
   - ✅ `cc_privacy_privacy_incidents`
   - ✅ `cc_privacy_subscriptions`
   - ✅ `cc_privacy_subscription_history`
   - ✅ `cc_privacy_payment_methods`
   - ✅ `cc_privacy_invoices`

### 5. Set Environment Variables

Create a `.env` file in your project root:

```bash
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**⚠️ IMPORTANT**: 
- Never commit `.env` file to Git
- Add `.env` to `.gitignore` if not already there

### 6. Test the Setup

1. Start dev server: `npm run dev`
2. Open app in browser
3. Try creating an account
4. Test a privacy tool (e.g., Consent Management)
5. Check Supabase Table Editor to see if data was saved

## Troubleshooting

### Migration Fails?

1. **Check Error Message**: Read the error in SQL Editor
2. **Run in Parts**: Some migrations are large - try running sections separately
3. **Check Extensions**: Some features need extensions enabled (Database → Extensions)
4. **Permissions**: Make sure you have admin access to the project

### Tables Not Showing?

1. **Refresh**: Click refresh in Table Editor
2. **Check Schema**: Make sure you're looking at `public` schema
3. **Verify Migration**: Check SQL Editor history to see if migration ran successfully

### Connection Issues?

1. **Verify URL**: Check that Supabase URL is correct
2. **Check Key**: Verify anon key is correct
3. **Network**: Check if your IP is blocked (Settings → Network)

## Next Steps After Migrations

1. ✅ Migrations applied
2. ⏭️ Deploy Edge Functions (see `scripts/setup-supabase.md`)
3. ⏭️ Configure Stripe (for payments)
4. ⏭️ Configure SendGrid (for emails)
5. ⏭️ Test all features

## Need Help?

- Check Supabase Dashboard for error logs
- Review migration files for syntax errors
- Consult Supabase documentation: https://supabase.com/docs

