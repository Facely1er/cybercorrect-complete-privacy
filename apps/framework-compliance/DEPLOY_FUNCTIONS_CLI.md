# 🚀 Deploy Edge Functions via CLI - Step by Step

**Quick Guide to Deploy All Functions**

---

## 📋 Prerequisites

1. **Login to Supabase CLI:**
   ```bash
   npx supabase login
   ```
   This will open your browser to authenticate.

2. **Link Your Project:**
   ```bash
   cd apps/framework-compliance
   npx supabase link --project-ref achowlksgmwuvfbvjfrt
   ```

---

## 🚀 Deploy All Functions

### Option 1: Use the Deployment Script

```bash
cd apps/framework-compliance
npm run deploy:functions
```

### Option 2: Deploy Manually (One by One)

```bash
cd apps/framework-compliance

# Deploy each function
npx supabase functions deploy create-checkout-session
npx supabase functions deploy create-one-time-checkout-session
npx supabase functions deploy stripe-webhook
npx supabase functions deploy send-email-notification
npx supabase functions deploy generate-automated-reports
npx supabase functions deploy run-scheduled-assessments
npx supabase functions deploy track-compliance-health
npx supabase functions deploy check-regulatory-updates
```

---

## ✅ Verify Deployment

1. **Check in Supabase Dashboard:**
   - Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions
   - All functions should show "Active" status

2. **Or use CLI:**
   ```bash
   npx supabase functions list
   ```

---

## 🔑 After Deployment

1. **Set Edge Function Secrets:**
   - See: `SUPABASE_SECRETS_TO_SET.md`
   - Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

2. **Create Stripe Webhook:**
   - See: `STRIPE_DASHBOARD_SETUP.md`

---

## 🆘 Troubleshooting

### Error: "Access token not provided"

**Solution:**
```bash
npx supabase login
```

### Error: "Project not linked"

**Solution:**
```bash
npx supabase link --project-ref achowlksgmwuvfbvjfrt
```

### Error: "Function not found"

**Solution:**
- Check function exists in: `supabase/functions/[function-name]/index.ts`
- Or create function in Supabase Dashboard first

---

## 📚 Quick Commands

```bash
# Login
npx supabase login

# Link project
npx supabase link --project-ref achowlksgmwuvfbvjfrt

# Deploy all
npm run deploy:functions

# Or deploy individually
npx supabase functions deploy [function-name]
```

---

**Ready to deploy!** Start with `npx supabase login` 🚀

