# Configure Edge Function Secrets - Step-by-Step Guide

## 🎯 Objective

Configure secrets for all deployed Edge Functions in Supabase Dashboard.

## ⏱️ Estimated Time: 15 minutes

---

## 📋 Prerequisites

- Access to Supabase Dashboard
- Project: **achowlksgmwuvfbvjfrt**
- Edge Functions already deployed (✅ Done)

---

## 🔑 Required Secrets

### Common Secrets (All Functions)

These secrets are needed for all functions:

- `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`

### Optional Secrets (Function-Specific)

- `SENDGRID_API_KEY` - For `send-email-notification` (when SendGrid is configured)
- `SENDGRID_FROM_EMAIL` - For `send-email-notification` (when SendGrid is configured)
- `STRIPE_SECRET_KEY` - For `stripe-webhook` (when Stripe is configured)
- `STRIPE_WEBHOOK_SECRET` - For `stripe-webhook` (when Stripe is configured)

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

1. Go to: https://app.supabase.com
2. Select your project: **achowlksgmwuvfbvjfrt**
3. Navigate to: **Edge Functions** (left sidebar)

---

### Step 2: Configure `send-email-notification` Function

1. Click on: **send-email-notification** function
2. Navigate to: **Settings** tab
3. Scroll to: **Secrets** section
4. Click: **Add new secret**

**Add these secrets**:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://achowlksgmwuvfbvjfrt.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |
| `SENDGRID_API_KEY` | (Optional - when SendGrid is configured) |
| `SENDGRID_FROM_EMAIL` | (Optional - when SendGrid is configured) |

5. Click: **Save** for each secret
6. Wait for: ✅ **Secret saved** confirmation

---

### Step 3: Configure `stripe-webhook` Function

1. Click on: **stripe-webhook** function
2. Navigate to: **Settings** tab
3. Scroll to: **Secrets** section
4. Click: **Add new secret**

**Add these secrets**:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://achowlksgmwuvfbvjfrt.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |
| `STRIPE_SECRET_KEY` | (Optional - when Stripe is configured) |
| `STRIPE_WEBHOOK_SECRET` | (Optional - when Stripe is configured) |

5. Click: **Save** for each secret
6. Wait for: ✅ **Secret saved** confirmation

---

### Step 4: Configure Other Functions

Repeat for each of these functions:

- `generate-automated-reports`
- `run-scheduled-assessments`
- `track-compliance-health`
- `check-regulatory-updates`

**For each function**:

1. Click on the function name
2. Navigate to: **Settings** tab
3. Scroll to: **Secrets** section
4. Click: **Add new secret**

**Add these secrets**:

| Secret Name | Secret Value |
|------------|--------------|
| `SUPABASE_URL` | `https://achowlksgmwuvfbvjfrt.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I` |

5. Click: **Save** for each secret
6. Wait for: ✅ **Secret saved** confirmation

---

## ✅ Verification Checklist

After configuring secrets, verify:

- [ ] `send-email-notification` has 2+ secrets configured
- [ ] `stripe-webhook` has 2+ secrets configured
- [ ] `generate-automated-reports` has 2 secrets configured
- [ ] `run-scheduled-assessments` has 2 secrets configured
- [ ] `track-compliance-health` has 2 secrets configured
- [ ] `check-regulatory-updates` has 2 secrets configured

**All functions should have**:
- ✅ `SUPABASE_URL` secret
- ✅ `SUPABASE_SERVICE_ROLE_KEY` secret

---

## 🧪 Optional: Test Functions

### Test `send-email-notification`

1. Go to: **Edge Functions** → **send-email-notification**
2. Click: **Invoke** tab
3. Use this test payload:
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "body": "This is a test email from CyberCorrect Privacy Platform"
}
```
4. Click: **Invoke function**
5. Check: Response should show success (even if email doesn't send without SendGrid)

---

## 📊 Quick Reference

### Secret Values (Copy-Paste Ready)

**SUPABASE_URL**:
```
https://achowlksgmwuvfbvjfrt.supabase.co
```

**SUPABASE_SERVICE_ROLE_KEY**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

---

## ⚠️ Security Notes

- **Never commit secrets to Git**
- **Service Role Key has full database access** - keep it secure
- **Secrets are encrypted** in Supabase Dashboard
- **Only add optional secrets** when external services are configured

---

## 🎉 Success!

Once all secrets are configured, your Edge Functions are ready to use!

**Next Steps**:
1. Test Supabase connection (15 minutes)
2. Test application locally (15 minutes)

See: `TEST_SUPABASE_CONNECTION.md` for next steps.

---

**Status**: Ready to configure
**Estimated Time**: 15 minutes
**Last Updated**: 2025-02-02

