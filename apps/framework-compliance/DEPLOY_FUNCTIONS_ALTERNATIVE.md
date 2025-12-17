# 🚀 Deploy Functions - Alternative Methods

Since the project ref might not be accessible via CLI, here are alternative deployment methods:

---

## ✅ Method 1: Supabase Dashboard (Recommended)

**This is the easiest and most reliable method.**

### Steps:

1. **Go to Supabase Dashboard:**
   - URL: https://app.supabase.com
   - Find your project (search for "achowlksgmwuvfbvjfrt" or check your projects)

2. **Navigate to Edge Functions:**
   - Click on your project
   - Go to **Edge Functions** in the left sidebar
   - URL: https://app.supabase.com/project/[YOUR_PROJECT_REF]/functions

3. **Deploy Each Function:**

   For each function, you have two options:

   **Option A: If function already exists:**
   - Click on the function name
   - Click "Deploy" or "Redeploy"
   - Verify it shows "Active" status

   **Option B: If function doesn't exist:**
   - Click "Create Function"
   - Name: `create-checkout-session` (or function name)
   - Copy code from: `supabase/functions/[function-name]/index.ts`
   - Paste into the editor
   - Click "Deploy"

4. **Functions to Deploy:**
   - create-checkout-session
   - create-one-time-checkout-session
   - stripe-webhook
   - send-email-notification
   - generate-automated-reports
   - run-scheduled-assessments
   - track-compliance-health
   - check-regulatory-updates

---

## ✅ Method 2: Use Correct Project Ref

If your project is in a different organization or has a different ref:

1. **Find your project ref:**
   ```bash
   npx supabase projects list
   ```
   Look for your project and note the REFERENCE ID

2. **Link the project:**
   ```bash
   npx supabase link --project-ref [YOUR_ACTUAL_REF]
   ```

3. **Deploy:**
   ```bash
   npm run deploy:functions
   ```

---

## ✅ Method 3: Direct Deployment with Project Ref

If you know the correct project ref:

```bash
# Replace [PROJECT_REF] with your actual project ref
npx supabase functions deploy create-checkout-session --project-ref [PROJECT_REF]
npx supabase functions deploy create-one-time-checkout-session --project-ref [PROJECT_REF]
npx supabase functions deploy stripe-webhook --project-ref [PROJECT_REF]
npx supabase functions deploy send-email-notification --project-ref [PROJECT_REF]
npx supabase functions deploy generate-automated-reports --project-ref [PROJECT_REF]
npx supabase functions deploy run-scheduled-assessments --project-ref [PROJECT_REF]
npx supabase functions deploy track-compliance-health --project-ref [PROJECT_REF]
npx supabase functions deploy check-regulatory-updates --project-ref [PROJECT_REF]
```

---

## 🔍 Finding Your Project

1. **Check Supabase Dashboard:**
   - Go to: https://app.supabase.com
   - Look at your projects list
   - Find the project URL: `https://[PROJECT_REF].supabase.co`
   - The PROJECT_REF is the part before `.supabase.co`

2. **Check Environment Variables:**
   - Look in `.env.local` or `.env`
   - Find `VITE_SUPABASE_URL`
   - Extract the project ref from the URL

3. **Check Supabase CLI:**
   ```bash
   npx supabase projects list
   ```
   Look for your project in the list

---

## 📋 After Deployment

1. **Set Secrets:**
   - Go to: Settings → Edge Functions → Secrets
   - See: `SUPABASE_SECRETS_TO_SET.md` for all secrets

2. **Verify:**
   - All functions show "Active" status
   - Functions are accessible

---

## 🎯 Recommended Approach

**Use Supabase Dashboard** - It's the most reliable and doesn't require CLI authentication issues.

1. Go to Dashboard
2. Navigate to Edge Functions
3. Deploy each function
4. Set secrets
5. Done!

---

**Ready to deploy!** Choose the method that works best for you. 🚀

