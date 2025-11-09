# Quick Start Guide - Complete Setup in 5 Steps

## 🚀 Get Started in 5 Steps

### Step 1: Create `.env` File (2 minutes)

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**⚠️ IMPORTANT**: Never commit this file to Git (already in `.gitignore`)

### Step 2: Apply Database Migrations (30 minutes)

**Easiest Method - Using Supabase Dashboard**:

1. Go to: https://app.supabase.com
2. Login and select project: **achowlksgmwuvfbvjfrt**
3. Click **SQL Editor** → **New query**
4. Apply migrations in order:

   **Migration 1**: Open `supabase/migrations/20250130000000_improve_security.sql`
   - Copy ALL content → Paste in SQL Editor → Click **Run**

   **Migration 2**: Open `supabase/migrations/20250201000000_subscription_features.sql`
   - Copy ALL content → Paste in SQL Editor → Click **Run**

   **Migration 3**: Open `supabase/migrations/20250201000001_cron_jobs.sql` (Optional)
   - Copy ALL content → Paste in SQL Editor → Click **Run**
   - **Note**: Can skip if fails (requires pg_cron extension)

   **Migration 4**: Open `supabase/migrations/20250202000000_privacy_tools_schema.sql` ⭐ **CRITICAL**
   - Copy ALL content → Paste in SQL Editor → Click **Run**
   - This creates 8 tables for privacy tools

   **Migration 5**: Open `supabase/migrations/20250202000001_subscriptions.sql`
   - Copy ALL content → Paste in SQL Editor → Click **Run**
   - This creates 4 tables for subscriptions

**Alternative Method - Using Supabase CLI**:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref achowlksgmwuvfbvjfrt

# Apply all migrations
supabase db push
```

### Step 3: Verify Setup (2 minutes)

Run the verification script:

```bash
npm run supabase:verify
```

Or manually:

```bash
npx tsx scripts/verify-supabase-setup.ts
```

This will check:
- ✅ Connection to Supabase
- ✅ All required tables exist (12 tables)
- ✅ Tables are accessible

### Step 4: Deploy Edge Functions (30 minutes)

**Using Supabase CLI**:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login and link (if not already done)
supabase login
supabase link --project-ref achowlksgmwuvfbvjfrt

# Deploy all functions
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

**Or use the deployment script**:

**Windows (PowerShell)**:
```powershell
.\scripts\deploy-edge-functions.ps1
```

**Mac/Linux (Bash)**:
```bash
chmod +x scripts/deploy-edge-functions.sh
./scripts/deploy-edge-functions.sh
```

### Step 5: Configure Edge Function Secrets (15 minutes)

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, click **Settings** → **Secrets**
3. Add these secrets:

   **For `send-email-notification`:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`
   - `SENDGRID_API_KEY` = (when SendGrid is configured)
   - `SENDGRID_FROM_EMAIL` = (when SendGrid is configured)

   **For `stripe-webhook`:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (same as above)
   - `STRIPE_SECRET_KEY` = (when Stripe is configured)
   - `STRIPE_WEBHOOK_SECRET` = (when Stripe is configured)

   **For other functions:**
   - `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (same as above)

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] `.env` file created with Supabase credentials
- [ ] All 5 migrations applied successfully
- [ ] All 12 tables exist in Supabase Table Editor
- [ ] Verification script passes: `npm run supabase:verify`
- [ ] All 6 Edge Functions deployed
- [ ] Edge Function secrets configured
- [ ] Application runs: `npm run dev`
- [ ] Can create account and test privacy tools

---

## 🧪 Test the Setup

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open app in browser**: `http://localhost:5173`

3. **Test features**:
   - Create a test account
   - Test Consent Management tool
   - Create a record
   - Check Supabase Table Editor to verify data saved

4. **Test connection**:
   ```bash
   npm run supabase:test
   ```

---

## 📊 Expected Tables

After migrations, you should see these 12 tables in Supabase:

**Privacy Tools (8 tables)**:
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_data_records`
- `cc_privacy_dpias`
- `cc_privacy_privacy_by_design_assessments`
- `cc_privacy_service_providers`
- `cc_privacy_privacy_incidents`

**Subscriptions (4 tables)**:
- `cc_privacy_subscriptions`
- `cc_privacy_subscription_history`
- `cc_privacy_payment_methods`
- `cc_privacy_invoices`

---

## 🐛 Troubleshooting

### Migration Errors?

1. **Read the error message** in SQL Editor
2. **Run in parts**: Large migrations may need to be split
3. **Check extensions**: Some features need extensions enabled
4. **Verify permissions**: Ensure you have admin access

### Connection Issues?

1. **Verify URL**: Check `VITE_SUPABASE_URL` is correct
2. **Verify Key**: Check `VITE_SUPABASE_ANON_KEY` is correct
3. **Check Network**: Verify your IP isn't blocked (Settings → Network)

### Edge Function Issues?

1. **Check login**: `supabase login`
2. **Check link**: `supabase link --project-ref achowlksgmwuvfbvjfrt`
3. **Check secrets**: Verify all secrets are set correctly
4. **Check logs**: Review function logs in Supabase Dashboard

---

## 📚 Additional Resources

- **Detailed Migration Guide**: `APPLY_MIGRATIONS.md`
- **Full Setup Guide**: `SUPABASE_SETUP_COMPLETE.md`
- **Credentials Reference**: `SUPABASE_CREDENTIALS.md`
- **Next Steps**: `NEXT_STEPS.md`

---

## ⏱️ Time Estimate

- **Step 1** (Create .env): 2 minutes
- **Step 2** (Apply migrations): 30 minutes
- **Step 3** (Verify): 2 minutes
- **Step 4** (Deploy functions): 30 minutes
- **Step 5** (Configure secrets): 15 minutes

**Total**: ~1.5 hours to complete all critical tasks

---

## 🎯 Current Status

**Code**: ✅ 100% Complete
**Documentation**: ✅ 100% Complete
**Infrastructure**: ⏳ Ready to Start

**You're ready to apply migrations and deploy!** 🚀

---

**Next Action**: Create `.env` file and apply migrations! 🚀

