# 🚀 Deploy Edge Functions - Complete Guide

**This guide will help you deploy all 8 Edge Functions to Supabase.**

---

## 📋 Prerequisites

1. **Supabase CLI** (via npx - no installation needed)
2. **Access to Supabase Dashboard**
3. **Browser** (for authentication)

---

## 🔐 Step 1: Authenticate with Supabase

### Login to Supabase CLI

```bash
npx supabase login
```

**What happens:**
- Opens your browser
- Prompts you to log in to Supabase
- Authorizes the CLI
- Returns to terminal when complete

**If browser doesn't open:**
- Copy the URL from terminal
- Paste in browser manually
- Complete authentication

---

## 🔗 Step 2: Link Your Project

After login, link your project:

```bash
cd apps/framework-compliance
npx supabase link --project-ref achowlksgmwuvfbvjfrt
```

**You may be prompted for:**
- Database password (if required)
- Or it may use your authenticated session

**Alternative if link fails:**
- You can deploy directly with `--project-ref` flag (see Step 3)

---

## 🚀 Step 3: Deploy Functions

### Option A: Deploy All at Once (Recommended)

```bash
npm run deploy:functions
```

### Option B: Deploy Individually

```bash
# Stripe Functions
npx supabase functions deploy create-checkout-session --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy create-one-time-checkout-session --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy stripe-webhook --project-ref achowlksgmwuvfbvjfrt

# Other Functions
npx supabase functions deploy send-email-notification --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy generate-automated-reports --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy run-scheduled-assessments --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy track-compliance-health --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy check-regulatory-updates --project-ref achowlksgmwuvfbvjfrt
```

**Note:** If you've linked the project, you can omit `--project-ref`:
```bash
npx supabase functions deploy create-checkout-session
```

---

## ✅ Step 4: Verify Deployment

### Check in Dashboard

1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions
2. All 8 functions should show:
   - ✅ Status: "Active"
   - ✅ Last deployed: Recent timestamp

### Check via CLI

```bash
npx supabase functions list --project-ref achowlksgmwuvfbvjfrt
```

---

## 🔑 Step 5: Set Secrets (After Deployment)

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

**Reference:** See `SUPABASE_SECRETS_TO_SET.md` for all secrets

For each function, add the required secrets.

---

## 🆘 Troubleshooting

### Error: "Access token not provided"

**Solution:**
```bash
npx supabase login
```

### Error: "Project not found"

**Possible causes:**
1. Wrong project ref
2. Not logged in
3. No access to project

**Solutions:**
1. Verify project ref: `achowlksgmwuvfbvjfrt`
2. Run: `npx supabase login`
3. Check you have access in Supabase Dashboard

### Error: "Docker is not running"

**Solution:**
- This is a warning, not an error
- Functions can still deploy
- Docker is only needed for local development

### Alternative: Deploy via Dashboard

If CLI continues to have issues:

1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions
2. For each function:
   - Click function name
   - Click "Deploy" or "Edit"
   - Upload code from: `supabase/functions/[function-name]/index.ts`
   - Save/Deploy

---

## 📚 Quick Reference

**All Commands:**
```bash
# 1. Login
npx supabase login

# 2. Link (optional)
npx supabase link --project-ref achowlksgmwuvfbvjfrt

# 3. Deploy all
npm run deploy:functions

# 4. Or deploy individually
npx supabase functions deploy [function-name] --project-ref achowlksgmwuvfbvjfrt
```

**Functions to Deploy:**
1. create-checkout-session
2. create-one-time-checkout-session
3. stripe-webhook
4. send-email-notification
5. generate-automated-reports
6. run-scheduled-assessments
7. track-compliance-health
8. check-regulatory-updates

---

## ✅ Completion Checklist

- [ ] Logged in to Supabase CLI
- [ ] Project linked (or using --project-ref)
- [ ] All 8 functions deployed
- [ ] Functions show "Active" in Dashboard
- [ ] Secrets configured (next step)

---

**Ready to deploy!** Start with `npx supabase login` 🚀

