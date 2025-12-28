# 🚀 Manual Migration Deployment Guide

**Your Supabase Project**: `dfklqsdfycwjlcasfciu`
**Status**: Ready to deploy migrations
**Network Issue**: Cannot apply from this environment - use your local machine

---

## ⚡ Quick Deploy (Recommended)

Run this one command on your local machine:

```bash
cd /home/user/cybercorrect-complete-privacy
./deploy-migrations.sh
```

This will:
- ✅ Link both apps to your Supabase project
- ✅ Apply all 27 migrations (17 Framework + 10 Portal)
- ✅ Verify deployment
- ✅ Show summary

---

## 📋 Manual Step-by-Step (Alternative)

If you prefer to run commands manually:

### Step 1: Set Environment Variables

```bash
export SUPABASE_ACCESS_TOKEN="sbp_77cbea30a32dc9f36fc2d65cd3e8054155639907"
export PGPASSWORD="K1551d0ug0u"
```

### Step 2: Link Framework Compliance

```bash
cd apps/framework-compliance
supabase link --project-ref dfklqsdfycwjlcasfciu --password K1551d0ug0u
```

### Step 3: Apply Framework Compliance Migrations

```bash
supabase db push
```

Expected output:
```
✓ Applying migration 20250130000000_improve_security.sql...
✓ Applying migration 20250201000000_subscription_features.sql...
✓ Applying migration 20250201000001_cron_jobs.sql...
... (14 more migrations)
✓ All migrations applied successfully
```

### Step 4: Link Privacy Portal

```bash
cd ../privacy-portal
supabase link --project-ref dfklqsdfycwjlcasfciu --password K1551d0ug0u
```

### Step 5: Apply Privacy Portal Migrations

```bash
supabase db push
```

Expected output:
```
✓ Applying migration 20250115000000_cybercorrect_schema_differentiation.sql...
✓ Applying migration 20250115000001_migrate_to_cybercorrect_schema.sql...
... (8 more migrations)
✓ All migrations applied successfully
```

---

## 🔍 Verify Deployment

After migrations complete, verify in Supabase Dashboard:

### 1. Check Tables

Go to: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/editor

You should see **30+ tables** including:
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_dpias`
- `cc_privacy_risk_detections`
- `cc_portal_data_subject_requests`
- `subscriptions`
- `profiles`
- And 23+ more...

### 2. Verify RLS Policies

Run in SQL Editor:

```sql
SELECT COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public';
-- Expected: 200+ policies
```

### 3. Check Indexes

```sql
SELECT COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public';
-- Expected: 150+ indexes
```

### 4. Test Data Insertion

```sql
-- Test inserting a record (replace user_id with actual auth.uid())
INSERT INTO cc_privacy_consent_records (
  user_id,
  employee_name,
  consent_type,
  status
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Test User',
  'data_processing',
  'active'
);

-- Verify it was inserted
SELECT * FROM cc_privacy_consent_records LIMIT 1;
```

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to Supabase"

**Solution**: Check your internet connection and Supabase project status

### Error: "Migration already applied"

**Solution**: Safe to ignore - migration is already in database

### Error: "Permission denied"

**Solution**: Verify access token is correct:
```bash
echo $SUPABASE_ACCESS_TOKEN
# Should show: sbp_77cbea30a32dc9f36fc2d65cd3e8054155639907
```

### Error: "Database password authentication failed"

**Solution**: Verify password:
```bash
echo $PGPASSWORD
# Should show: K1551d0ug0u
```

---

## 📊 What Gets Created

### Framework Compliance (17 migrations)
- **31 Tables** - Privacy compliance, subscriptions, ROPA, evidence vault
- **226 RLS Policies** - User data isolation
- **130 Indexes** - Performance optimization
- **34 Functions** - Business logic

### Privacy Portal (10 migrations)
- **8 Tables** - Data rights requests, consent, incidents
- **33 RLS Policies** - Public access + user isolation
- **46 Indexes** - Fast queries
- **20 Functions** - Portal logic

### Total Deployment
- **39 Tables**
- **259 RLS Policies**
- **176 Indexes**
- **54 Functions**

---

## ✅ Post-Deployment Checklist

After migrations complete:

- [ ] Verify 30+ tables in Supabase Dashboard
- [ ] Verify RLS is enabled on all tables (green shield icon)
- [ ] Update `.env` files with Supabase credentials
- [ ] Test local development: `npm run dev`
- [ ] Deploy to Vercel
- [ ] Test production deployment

---

## 🔐 Update Environment Variables

After migrations are deployed, update your `.env` files:

### Framework Compliance (.env)

```bash
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_from_supabase_dashboard>
```

### Privacy Portal (.env)

```bash
VITE_SUPABASE_URL=https://dfklqsdfycwjlcasfciu.supabase.co
VITE_SUPABASE_ANON_KEY=<your_anon_key_from_supabase_dashboard>
```

**Get your anon key from**:
https://app.supabase.com/project/dfklqsdfycwjlcasfciu/settings/api

---

## 🚀 Ready for Production

Once migrations are deployed:

1. **Local Testing**:
   ```bash
   npm run dev:framework  # Framework Compliance
   npm run dev:portal     # Privacy Portal
   ```

2. **Production Deployment**:
   - Follow `QUICK_START_PRODUCTION.md`
   - Deploy to Vercel
   - Configure custom domains

---

## 📞 Need Help?

**Migration Issues**:
- Check migration files in `apps/*/supabase/migrations/`
- Review `CLI_MIGRATION_VALIDATION_REPORT.md`
- Check Supabase logs: https://app.supabase.com/project/dfklqsdfycwjlcasfciu/logs

**Documentation**:
- Quick Start: `QUICK_START_PRODUCTION.md`
- Full Guide: `PRODUCTION_DEPLOYMENT_GUIDE.md`
- Validation: `CLI_MIGRATION_VALIDATION_REPORT.md`

---

**Project**: CyberCorrect Privacy Platform
**Database**: dfklqsdfycwjlcasfciu.supabase.co
**Status**: ✅ Ready to deploy migrations
**Estimated Time**: 5-10 minutes

Run `./deploy-migrations.sh` on your local machine to get started! 🚀
