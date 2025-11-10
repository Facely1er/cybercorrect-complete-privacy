# CLI Limitations - Edge Function Secrets

**Date**: 2025-02-02  
**Status**: Important Information

---

## ⚠️ Important Limitation

**Supabase CLI cannot set secrets with names starting with "SUPABASE_"**

This is a security restriction in the Supabase CLI. Secrets like:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

**Cannot be set via CLI commands.**

---

## ✅ Solution: Use Supabase Dashboard

Edge Function secrets **must be configured via Supabase Dashboard**:

1. Go to: https://app.supabase.com
2. Select your project: **achowlksgmwuvfbvjfrt**
3. Navigate to: **Edge Functions**
4. For each function:
   - Click on the function name
   - Go to **Settings** tab
   - Scroll to **Secrets** section
   - Click **Add new secret**
   - Add the required secrets

---

## 📋 Required Secrets

For all Edge Functions, add these secrets:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://achowlksgmwuvfbvjfrt.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |

---

## 🎯 Functions to Configure

Configure secrets for these 6 functions:

1. `send-email-notification`
2. `stripe-webhook`
3. `generate-automated-reports`
4. `run-scheduled-assessments`
5. `track-compliance-health`
6. `check-regulatory-updates`

---

## 📚 Detailed Instructions

See `CONFIGURE_EDGE_FUNCTION_SECRETS.md` for step-by-step Dashboard instructions.

---

## ✅ What CLI Can Do

The Supabase CLI is still useful for:

- ✅ Deploying Edge Functions
- ✅ Running migrations
- ✅ Managing database
- ✅ Other operations (not setting SUPABASE_* secrets)

---

## 🎉 Summary

- ❌ **Cannot**: Set `SUPABASE_*` secrets via CLI
- ✅ **Can**: Set secrets via Supabase Dashboard
- ✅ **Can**: Use CLI for other operations

**Use the Dashboard method for Edge Function secrets!**

---

**Last Updated**: 2025-02-02

