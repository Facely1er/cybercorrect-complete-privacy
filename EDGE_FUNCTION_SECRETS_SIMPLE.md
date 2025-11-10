# Edge Function Secrets - Simple Copy-Paste Guide

**Date**: 2025-02-02  
**Status**: Ready to use

---

## 🎯 Quick Setup (Global Secrets)

**Important**: Secrets are set **globally** for all Edge Functions. Add them once in the **Secrets** menu.

---

## 📝 Step-by-Step

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Select project: **achowlksgmwuvfbvjfrt**
   - Navigate to: **Edge Functions** (left sidebar)

2. **Open Secrets Menu**
   - Look for **Secrets** in the menu (top menu or sidebar)
   - Click **Secrets** or **Manage Secrets**

3. **Add Secret 1**

   **Secret Name**:
   ```
   SUPABASE_URL
   ```

   **Secret Value**:
   ```
   https://achowlksgmwuvfbvjfrt.supabase.co
   ```

   Click **Save** or **Create**

4. **Add Secret 2**

   **Secret Name**:
   ```
   SUPABASE_SERVICE_ROLE_KEY
   ```

   **Secret Value**:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
   ```

   Click **Save** or **Create**

5. **Done!**
   - Both secrets are now available to **all Edge Functions**
   - No need to configure per function

---

## ✅ Verification

After adding secrets, verify:

- [ ] `SUPABASE_URL` appears in the Secrets list
- [ ] `SUPABASE_SERVICE_ROLE_KEY` appears in the Secrets list
- [ ] Both secrets are visible

**All 6 Edge Functions will automatically have access to these secrets**:
- `send-email-notification`
- `stripe-webhook`
- `generate-automated-reports`
- `run-scheduled-assessments`
- `track-compliance-health`
- `check-regulatory-updates`

---

## 📋 Copy-Paste Values

### Secret 1

**Name**:
```
SUPABASE_URL
```

**Value**:
```
https://achowlksgmwuvfbvjfrt.supabase.co
```

---

### Secret 2

**Name**:
```
SUPABASE_SERVICE_ROLE_KEY
```

**Value**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

---

## ⚠️ Important

- **Secrets are global** - Add once, available to all functions
- **Secret names are case-sensitive** - Use exact names shown
- **Never share these secrets publicly**

---

**Status**: Ready to use  
**Last Updated**: 2025-02-02

