# 🔍 Identify Project and Deploy

**The project ref "achowlksgmwuvfbvjfrt" is not in your accessible projects.**

---

## 📋 Your Available Projects

From your Supabase account, these projects are available:

1. **INTERNAL** - `ykmstbhemqutkdkcunik`
2. **CyberCertitude** - `rjyyicattwrqtjiqwwvv`
3. **SOLUTIONS** - `nuwfdvwqiynzhbbsqagw`
4. **CORE_REVENUE** - `dfklqsdfycwjlcasfciu`
5. **PANDAGARDE-BC** - `nkgekxipzzvceesdjsrh`
6. **ERMITS-SOLUCE** - `xsjkufcheftfprmkaelj`

---

## 🎯 Find the Correct Project

### Method 1: Check Supabase Dashboard

1. Go to: https://app.supabase.com
2. Look for a project with URL: `https://achowlksgmwuvfbvjfrt.supabase.co`
3. Or check project settings for the reference ID

### Method 2: Check Environment Variables

The project URL in your `.env.local` or environment should match one of your projects.

### Method 3: Check Project Name

The project might be named differently. Look for:
- CyberCorrect
- Framework Compliance
- Privacy Platform
- Or similar names

---

## 🚀 Deploy to Correct Project

Once you identify the correct project ref, use one of these:

### Option A: Link and Deploy

```bash
# Replace [PROJECT_REF] with the correct ref
npx supabase link --project-ref [PROJECT_REF]
npm run deploy:functions
```

### Option B: Deploy Directly

```bash
# Replace [PROJECT_REF] with the correct ref
npx supabase functions deploy create-checkout-session --project-ref [PROJECT_REF]
npx supabase functions deploy create-one-time-checkout-session --project-ref [PROJECT_REF]
npx supabase functions deploy stripe-webhook --project-ref [PROJECT_REF]
npx supabase functions deploy send-email-notification --project-ref [PROJECT_REF]
npx supabase functions deploy generate-automated-reports --project-ref [PROJECT_REF]
npx supabase functions deploy run-scheduled-assessments --project-ref [PROJECT_REF]
npx supabase functions deploy track-compliance-health --project-ref [PROJECT_REF]
npx supabase functions deploy check-regulatory-updates --project-ref [PROJECT_REF]
```

### Option C: Use Dashboard (Easiest)

1. Go to: https://app.supabase.com
2. Find your project
3. Go to Edge Functions
4. Deploy each function

---

## 💡 Most Likely Candidates

Based on project names, these might be relevant:
- **CORE_REVENUE** (`dfklqsdfycwjlcasfciu`) - Could be the revenue-generating platform
- **ERMITS-SOLUCE** (`xsjkufcheftfprmkaelj`) - Part of ERMITS system

---

## ✅ Next Steps

1. **Identify the correct project** from Supabase Dashboard
2. **Note the project ref** (the part before `.supabase.co` in the URL)
3. **Deploy using one of the methods above**

---

**Need help?** Check Supabase Dashboard to find the project with URL matching your environment variables.

