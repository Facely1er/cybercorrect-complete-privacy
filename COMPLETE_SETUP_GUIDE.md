# 🚀 CyberCorrect Complete Setup Guide

## Quick Status Check

**Current Status**: 98% Complete ✅
- ✅ Code & Features: 100% Complete
- ✅ Deployment: 100% Complete  
- ⏳ Configuration: 95% Complete (needs environment variables)
- ⏳ Testing: 0% Complete (ready to start)

**Estimated Time to 100%**: ~1.5-2 hours

---

## 📋 Setup Checklist

### Phase 1: Local Development Setup (30 minutes)

#### Step 1: Create `.env` File (5 minutes)

1. Navigate to the project root:
   ```bash
   cd C:\Users\facel\Downloads\GitHub\ERMITS_PRODUCTION\03-CyberCorrect\apps\framework-compliance
   ```

2. Create a `.env` file in the root directory:
   ```bash
   # .env file
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Get your Supabase credentials**:
   - Go to: https://app.supabase.com
   - Select your **shared ERMITS project** (used by CyberCorrect, CyberCaution, CyberSoluce)
   - Navigate to: **Settings** → **API**
   - Copy:
     - **Project URL** → Use for `VITE_SUPABASE_URL`
     - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

4. **Important**: 
   - The `.env` file is already in `.gitignore` - it won't be committed
   - Never commit this file to Git
   - For production, set these in Vercel dashboard

#### Step 2: Apply Database Migrations (20 minutes)

**Using Supabase Dashboard** (Easiest Method):

1. Go to: https://app.supabase.com
2. Select your project
3. Click **SQL Editor** → **New query**
4. Apply migrations in this order:

   **Migration 1**: `supabase/migrations/20250130000000_improve_security.sql`
   - Open the file: `apps/framework-compliance/supabase/migrations/20250130000000_improve_security.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**

   **Migration 2**: `supabase/migrations/20250201000000_subscription_features.sql`
   - Open the file: `apps/framework-compliance/supabase/migrations/20250201000000_subscription_features.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**

   **Migration 3**: `supabase/migrations/20250201000001_cron_jobs.sql` (Optional - can skip if fails)
   - Open the file: `apps/framework-compliance/supabase/migrations/20250201000001_cron_jobs.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**
   - **Note**: This may fail if `pg_cron` extension is not available - that's OK, you can skip it

   **Migration 4**: `supabase/migrations/20250202000000_privacy_tools_schema.sql` ⭐ **CRITICAL**
   - Open the file: `apps/framework-compliance/supabase/migrations/20250202000000_privacy_tools_schema.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**
   - This creates tables for all 7 privacy tools

   **Migration 5**: `supabase/migrations/20250202000001_subscriptions.sql`
   - Open the file: `apps/framework-compliance/supabase/migrations/20250202000001_subscriptions.sql`
   - Copy ALL content
   - Paste into SQL Editor
   - Click **Run**

   **Migration 6-11** (Optional - Additional Features):
   - `20250202000002_fix_function_search_path.sql`
   - `20250202000003_fix_rls_performance.sql`
   - `20250202000004_combined_fixes.sql`
   - `20250203000000_calendar_events.sql`
   - `20250204000000_ropa_and_evidence_tables.sql`
   - `20250729162343_orange_band.sql`

   **Alternative**: Use `ALL_MIGRATIONS_COMBINED.sql` for a single combined migration (recommended if available)

5. **Verify tables created**:
   - Go to **Table Editor** in Supabase Dashboard
   - You should see 12 tables with `cc_privacy_` prefix:
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

#### Step 3: Verify Setup (5 minutes)

Run the verification script:

```bash
cd apps/framework-compliance
npx tsx scripts/verify-supabase-setup.ts
```

This will check:
- ✅ Connection to Supabase
- ✅ All required tables exist
- ✅ Tables are accessible

**Expected Output**:
```
🔍 Verifying Supabase Setup...
📡 Supabase URL: https://your-project.supabase.co

1️⃣  Testing connection...
   ✅ Connection successful

2️⃣  Checking required tables...
   ✅ cc_privacy_consent_records
   ✅ cc_privacy_vendor_assessments
   ... (all 12 tables)
   
🎉 All tables exist! Setup is complete.
```

---

### Phase 2: Edge Functions Setup (45 minutes)

#### Step 4: Deploy Edge Functions (30 minutes)

**Option A: Using Supabase CLI** (Recommended)

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (get project-ref from Supabase Dashboard URL)
supabase link --project-ref your-project-ref

# Navigate to functions directory
cd apps/framework-compliance/supabase/functions

# Deploy each function
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

**Option B: Using Supabase Dashboard**

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function:
   - Click **Create Function** or **Deploy**
   - Upload the function code from: `apps/framework-compliance/supabase/functions/[function-name]/index.ts`
   - See `scripts/setup-supabase.md` for detailed instructions

#### Step 5: Configure Edge Function Secrets (15 minutes)

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, click on it → **Settings** tab → **Secrets** section

**For `send-email-notification`**:
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- `SENDGRID_API_KEY` = (Optional - when SendGrid is configured)
- `SENDGRID_FROM_EMAIL` = (Optional - when SendGrid is configured)

**For `stripe-webhook`**:
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- `STRIPE_SECRET_KEY` = (Optional - when Stripe is configured)
- `STRIPE_WEBHOOK_SECRET` = (Optional - when Stripe is configured)

**For other functions** (`generate-automated-reports`, `run-scheduled-assessments`, `track-compliance-health`, `check-regulatory-updates`):
- `SUPABASE_URL` = Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

**Where to find Service Role Key**:
- Go to Supabase Dashboard → **Settings** → **API**
- Copy the **service_role** key (⚠️ Keep this secret!)

**See**: `docs/setup/CONFIGURE_EDGE_FUNCTION_SECRETS.md` for detailed instructions

---

### Phase 3: Production Configuration (20 minutes)

#### Step 6: Configure Production Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Select your CyberCorrect project
3. Navigate to: **Settings** → **Environment Variables**
4. Add these variables for **Production**, **Preview**, and **Development**:

   **Required**:
   - `VITE_SUPABASE_URL` = Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

   **Optional** (Recommended):
   - `VITE_SENTRY_DSN` = Your Sentry DSN (for error monitoring)
   - `VITE_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key (for payments)
   - `VITE_ENABLE_ANALYTICS` = `true` (for analytics)

5. **Important**: After adding variables, **redeploy** your application

**See**: `docs/deployment/PRODUCTION_ENV_SETUP.md` for detailed instructions

---

### Phase 4: Testing (30-60 minutes)

#### Step 7: Run Post-Deployment Testing

1. **Test Local Development**:
   ```bash
   cd apps/framework-compliance
   npm run dev
   ```
   - Open: http://localhost:5173
   - Create a test account
   - Test a privacy tool (e.g., Consent Management)
   - Create a record
   - Check Supabase Table Editor to verify data was saved

2. **Test Production**:
   - Visit: https://www.cybercorrect.com
   - Verify all pages load correctly
   - Test authentication
   - Test a privacy tool
   - Verify data persistence

3. **Follow Comprehensive Testing Checklist**:
   - See: `POST_DEPLOYMENT_TESTING.md`
   - 15 major testing categories with 100+ specific test cases

---

## ✅ Completion Checklist

### Local Development
- [ ] `.env` file created with Supabase credentials
- [ ] All 5 database migrations applied
- [ ] All 12 tables verified in Supabase
- [ ] Verification script passes all checks
- [ ] Local development server runs successfully

### Edge Functions
- [ ] All 6 Edge Functions deployed
- [ ] All Edge Function secrets configured
- [ ] Edge Functions can be invoked (tested)

### Production
- [ ] Environment variables configured in Vercel
- [ ] Production site accessible at https://www.cybercorrect.com
- [ ] All features working in production
- [ ] Post-deployment testing completed

---

## 🆘 Troubleshooting

### Issue: Verification script fails

**Problem**: Tables don't exist
**Solution**: 
- Check that all migrations were applied successfully
- Verify migration files were copied completely
- Check Supabase Dashboard → Table Editor for errors

### Issue: Edge Functions fail to deploy

**Problem**: CLI errors or deployment fails
**Solution**:
- Ensure Supabase CLI is installed: `npm install -g supabase`
- Verify you're logged in: `supabase login`
- Check project-ref is correct: `supabase link --project-ref [ref]`
- Try deploying via Supabase Dashboard instead

### Issue: Blank pages in production

**Problem**: Environment variables not set
**Solution**:
- Verify environment variables are set in Vercel dashboard
- Ensure variables are set for **Production** environment
- Redeploy after adding variables
- Check browser console for errors

### Issue: Functions can't access database

**Problem**: Secrets not configured
**Solution**:
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check secrets are saved in Supabase Dashboard
- Verify service role key has correct permissions

---

## 📚 Reference Documentation

- **Environment Setup**: `docs/setup/ENV_SETUP_GUIDE.md`
- **Migration Guide**: `APPLY_MIGRATIONS.md` (if exists)
- **Edge Functions**: `docs/setup/CONFIGURE_EDGE_FUNCTION_SECRETS.md`
- **Production Setup**: `docs/deployment/PRODUCTION_ENV_SETUP.md`
- **Testing**: `POST_DEPLOYMENT_TESTING.md`
- **Next Steps**: `NEXT_STEPS.md`

---

## 🎉 Success Criteria

You'll know setup is complete when:

1. ✅ Verification script shows all tables exist
2. ✅ Local development server runs without errors
3. ✅ You can create records in privacy tools
4. ✅ Data appears in Supabase tables
5. ✅ Production site loads correctly
6. ✅ All features work in production

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Create `.env` file | 5 minutes |
| Apply migrations | 20 minutes |
| Verify setup | 5 minutes |
| Deploy Edge Functions | 30 minutes |
| Configure secrets | 15 minutes |
| Configure Vercel env vars | 10 minutes |
| Testing | 30-60 minutes |
| **Total** | **~2 hours** |

---

## 🚀 Next Steps After Setup

1. **Optional**: Configure Stripe for payments
2. **Optional**: Configure SendGrid for emails
3. **Optional**: Set up Sentry for error monitoring
4. **Optional**: Configure cron jobs for automated tasks
5. **Recommended**: Review `FUTURE_ENHANCEMENTS.md` for planned improvements

---

**Status**: Ready to start setup
**Last Updated**: 2024-12-05
**Completion**: 98% → 100% (after completing this guide)

