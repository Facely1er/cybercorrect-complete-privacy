# 🚀 Deploy Edge Functions - Quick Commands

**Copy and run these commands in order:**

---

## Step 1: Login

```bash
npx supabase login
```

This opens your browser. Complete the login, then continue.

---

## Step 2: Link Project

**Option A: With anon key (recommended)**
```bash
cd apps/framework-compliance
npx supabase link --project-ref achowlksgmwuvfbvjfrt --anon-key eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo
```

**Option B: With database password**
```bash
npx supabase link --project-ref achowlksgmwuvfbvjfrt --password [YOUR_DB_PASSWORD]
```

---

## Step 3: Deploy All Functions

**Option A: Use deployment script**
```bash
npm run deploy:functions
```

**Option B: Deploy individually**
```bash
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

## ✅ Verify

```bash
npx supabase functions list
```

Or check in Dashboard:
https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

---

## 🔑 Next Steps

After deployment:
1. Set secrets (see SUPABASE_SECRETS_TO_SET.md)
2. Create Stripe webhook
3. Test functions

---

**Ready to deploy!** 🚀

