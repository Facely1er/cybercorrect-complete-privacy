# Quick Reference Guide - CyberCorrect Privacy Platform

## 🚀 Quick Commands

### Setup & Verification

```bash
# Complete setup check
npm run setup:complete

# Verify Supabase setup
npm run supabase:verify

# Test Supabase connection
npm run supabase:test

# Apply migrations (via Supabase CLI)
npm run migrate:apply

# Verify migrations
npm run migrate:verify
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates

# Or use deployment scripts
.\scripts\deploy-edge-functions.ps1  # Windows
./scripts/deploy-edge-functions.sh   # Mac/Linux
```

## 📋 Environment Variables

### Required (.env file)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get your credentials from:** Supabase Dashboard → Settings → API

### Optional

```bash
# Stripe (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid (for emails)
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@cybercorrect.com

# Sentry (for error monitoring)
VITE_SENTRY_DSN=https://...
```

## 🔐 Supabase Credentials

**Get your credentials from:** Supabase Dashboard → Settings → API

- **Project URL**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- **Anon Key**: Your anon/public key (safe for client-side use)
- **Service Role Key**: Your service role key (for Edge Functions only - NEVER expose to client)

**⚠️ Security Note:** Never commit credentials to Git. Use environment variables or Supabase Dashboard secrets.

## 📊 Database Tables

### Privacy Tools (8 tables)
- `cc_privacy_consent_records`
- `cc_privacy_vendor_assessments`
- `cc_privacy_retention_policies`
- `cc_privacy_data_records`
- `cc_privacy_dpias`
- `cc_privacy_privacy_by_design_assessments`
- `cc_privacy_service_providers`
- `cc_privacy_privacy_incidents`

### Subscriptions (4 tables)
- `cc_privacy_subscriptions`
- `cc_privacy_subscription_history`
- `cc_privacy_payment_methods`
- `cc_privacy_invoices`

## 🔧 Edge Functions

### Functions to Deploy
1. `send-email-notification`
2. `stripe-webhook`
3. `generate-automated-reports`
4. `run-scheduled-assessments`
5. `track-compliance-health`
6. `check-regulatory-updates`

### Required Secrets (for each function)
- `SUPABASE_URL` = Your Supabase project URL (from Dashboard → Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key (from Dashboard → Settings → API)

### Optional Secrets
- `SENDGRID_API_KEY` (for `send-email-notification`)
- `SENDGRID_FROM_EMAIL` (for `send-email-notification`)
- `STRIPE_SECRET_KEY` (for `stripe-webhook`)
- `STRIPE_WEBHOOK_SECRET` (for `stripe-webhook`)

## 🔗 Important Links

### Supabase Dashboard
- **Project**: https://app.supabase.com (select your project)
- **Table Editor**: Available in your project dashboard
- **Edge Functions**: Available in your project dashboard
- **SQL Editor**: Available in your project dashboard

### Documentation
- **Quick Start**: `QUICK_START.md`
- **Migration Guide**: `APPLY_MIGRATIONS.md`
- **Deploy Functions**: `DEPLOY_EDGE_FUNCTIONS.md`
- **Next Steps**: `NEXT_STEPS.md`

## 📝 Common Tasks

### Verify Setup
```bash
npm run setup:complete
```

### Deploy All Functions
```bash
.\scripts\deploy-edge-functions.ps1  # Windows
```

### Test Connection
```bash
npm run supabase:test
```

### Start Development Server
```bash
npm run dev
```

## 🐛 Troubleshooting

### Migration Errors
- Check error message in SQL Editor
- Verify table existence before operations
- Check migration order

### Connection Issues
- Verify `.env` file exists
- Check Supabase URL and key
- Restart dev server after `.env` changes

### Function Deployment Issues
- Check Supabase CLI version: `supabase --version`
- Verify project link: `supabase status`
- Check function files exist: `ls supabase/functions/`

## ✅ Status Checklist

- [ ] `.env` file created
- [ ] Database migrations applied
- [ ] All 12 tables verified
- [ ] Edge Functions deployed
- [ ] Function secrets configured
- [ ] Application tested locally

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase CLI**: https://supabase.com/docs/guides/cli
- **Edge Functions**: https://supabase.com/docs/guides/functions

---

**Quick Reference**: Keep this file handy for common commands and links! 🚀

