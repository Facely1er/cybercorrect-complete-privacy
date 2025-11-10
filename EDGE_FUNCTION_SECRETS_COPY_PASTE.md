# Edge Function Secrets - Copy-Paste Guide

**Date**: 2025-02-02  
**Status**: Ready to use

---

## 🎯 Quick Setup

Go to: **Supabase Dashboard** → **Edge Functions** → Select Function → **Settings** → **Secrets**

For each of the 6 functions, add these 2 secrets:

---

## 📋 Secret 1: SUPABASE_URL

**Secret Name** (copy exactly):
```
SUPABASE_URL
```

**Secret Value** (copy exactly):
```
https://achowlksgmwuvfbvjfrt.supabase.co
```

---

## 📋 Secret 2: SUPABASE_SERVICE_ROLE_KEY

**Secret Name** (copy exactly):
```
SUPABASE_SERVICE_ROLE_KEY
```

**Secret Value** (copy exactly):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

---

## 🚀 Global Secrets Configuration

**Important**: Secrets are set **globally** for all Edge Functions, not per function.

You only need to add these secrets **once** and they will be available to all functions.

---

## 📝 Step-by-Step Instructions

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select project: **achowlksgmwuvfbvjfrt**
   - Navigate to: **Edge Functions** (left sidebar)

2. **Open Secrets Menu**
   - Look for **Secrets** option in the menu (usually in the top menu or sidebar)
   - Click on **Secrets** or **Manage Secrets**

3. **Add Secret 1: SUPABASE_URL**
   - Click **Add new secret** or **Create secret**
   - **Secret Name**: `SUPABASE_URL`
   - **Secret Value**: `https://achowlksgmwuvfbvjfrt.supabase.co`
   - Click **Save** or **Create**

4. **Add Secret 2: SUPABASE_SERVICE_ROLE_KEY**
   - Click **Add new secret** or **Create secret** again
   - **Secret Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Secret Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`
   - Click **Save** or **Create**

5. **Done!**
   - These secrets are now available to **all Edge Functions**
   - No need to configure per function

---

## ✅ Verification Checklist

After configuring secrets, verify:

- [ ] `SUPABASE_URL` secret is configured (global)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` secret is configured (global)
- [ ] Both secrets are visible in the Secrets menu

**All Edge Functions will have access to**:
- ✅ `SUPABASE_URL` secret
- ✅ `SUPABASE_SERVICE_ROLE_KEY` secret

**Note**: Since secrets are global, you only need to add them once. All 6 functions will automatically have access to them.

---

## 📋 Quick Reference

**Secrets are global** - Add these once and all functions will have access:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://achowlksgmwuvfbvjfrt.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |

**Available to all functions**:
- `send-email-notification`
- `stripe-webhook`
- `generate-automated-reports`
- `run-scheduled-assessments`
- `track-compliance-health`
- `check-regulatory-updates`

---

## 🎯 Copy-Paste Ready Values

### Secret Name 1:
```
SUPABASE_URL
```

### Secret Value 1:
```
https://achowlksgmwuvfbvjfrt.supabase.co
```

### Secret Name 2:
```
SUPABASE_SERVICE_ROLE_KEY
```

### Secret Value 2:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

---

## ⚠️ Important Notes

- **Secret names are case-sensitive** - Use exact names shown above
- **Secrets are global** - Add them once in the Secrets menu, and all functions will have access
- **Secrets are encrypted** in Supabase Dashboard
- **Never share these secrets publicly**
- **No need to configure per function** - Global secrets apply to all Edge Functions

---

## 🧪 Test After Configuration

After configuring secrets, test a function:

1. Go to **Edge Functions** → Select a function
2. Click **Invoke** tab
3. Use a test payload (if applicable)
4. Click **Invoke function**
5. Check response - should show success

---

## 📚 Reference

- **Detailed Instructions**: `CONFIGURE_EDGE_FUNCTION_SECRETS.md`
- **CLI Limitations**: `CLI_LIMITATIONS.md`

---

**Status**: Ready to use  
**Last Updated**: 2025-02-02

