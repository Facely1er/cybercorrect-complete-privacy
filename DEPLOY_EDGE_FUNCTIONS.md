# Deploy Edge Functions - Step-by-Step Guide

## 🚀 Quick Start

You've completed the database migrations! Now let's deploy the Edge Functions.

## Prerequisites

1. ✅ Database migrations completed
2. ✅ Supabase project configured
3. ⏭️ Supabase CLI installed

## Step 1: Install Supabase CLI

**Windows (PowerShell)**:
```powershell
npm install -g supabase
```

**Mac/Linux (Bash)**:
```bash
npm install -g supabase
```

**Verify installation**:
```bash
supabase --version
```

## Step 2: Login to Supabase

```bash
supabase login
```

This will:
- Open your browser
- Ask you to authenticate
- Save your credentials locally

## Step 3: Link Your Project

```bash
supabase link --project-ref your-project-ref
```

**To find your project ref:**
- Go to Supabase Dashboard → Settings → General
- Copy the **Reference ID** (the part after `https://` in your project URL)

This will:
- Connect to your Supabase project
- Save project configuration locally

**Note**: You may need to provide your database password if prompted.

## Step 4: Deploy Edge Functions

### Option A: Deploy All Functions (Recommended)

**Windows (PowerShell)**:
```powershell
.\scripts\deploy-edge-functions.ps1
```

**Mac/Linux (Bash)**:
```bash
chmod +x scripts/deploy-edge-functions.sh
./scripts/deploy-edge-functions.sh
```

### Option B: Deploy Functions Individually

```bash
# Deploy each function
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

## Step 5: Verify Functions Deployed

1. Go to: https://app.supabase.com
2. Select your project
3. Navigate to **Edge Functions**
4. Verify all 6 functions are listed:
   - ✅ `send-email-notification`
   - ✅ `stripe-webhook`
   - ✅ `generate-automated-reports`
   - ✅ `run-scheduled-assessments`
   - ✅ `track-compliance-health`
   - ✅ `check-regulatory-updates`

## Step 6: Configure Function Secrets

For each function, set these secrets in Supabase Dashboard:

### For `send-email-notification`:

1. Go to **Edge Functions** → `send-email-notification` → **Settings** → **Secrets**
2. Add these secrets:
   - `SUPABASE_URL` = Your Supabase project URL (from Dashboard → Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key (from Dashboard → Settings → API)
   - `SENDGRID_API_KEY` = (when SendGrid is configured - optional)
   - `SENDGRID_FROM_EMAIL` = (when SendGrid is configured - optional)

### For `stripe-webhook`:

1. Go to **Edge Functions** → `stripe-webhook` → **Settings** → **Secrets**
2. Add these secrets:
   - `SUPABASE_URL` = Your Supabase project URL (from Dashboard → Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` = (same as above)
   - `STRIPE_SECRET_KEY` = (when Stripe is configured - optional)
   - `STRIPE_WEBHOOK_SECRET` = (when Stripe is configured - optional)

### For Other Functions:

1. Go to **Edge Functions** → `[function-name]` → **Settings** → **Secrets**
2. Add these secrets:
   - `SUPABASE_URL` = Your Supabase project URL (from Dashboard → Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` = (same as above)

**Functions that need secrets**:
- `generate-automated-reports`
- `run-scheduled-assessments`
- `track-compliance-health`
- `check-regulatory-updates`

## Step 7: Test Functions

### Test `send-email-notification`:

1. Go to **Edge Functions** → `send-email-notification`
2. Click **Invoke**
3. Use this test payload:
```json
{
  "to": "test@example.com",
  "subject": "Test Email",
  "body": "This is a test email from CyberCorrect Privacy Platform"
}
```

### Test Other Functions:

Each function can be tested from the Supabase Dashboard:
1. Go to **Edge Functions** → `[function-name]`
2. Click **Invoke**
3. Use appropriate test payload

## Troubleshooting

### Function Deployment Fails?

1. **Check Supabase CLI version**:
   ```bash
   supabase --version
   ```
   Update if needed: `npm install -g supabase@latest`

2. **Check project link**:
   ```bash
   supabase status
   ```
   Should show your project details

3. **Check function files exist**:
   ```bash
   ls supabase/functions/
   ```
   Should list all 6 function directories

4. **Check function code**:
   Each function should have an `index.ts` file

### Function Invocation Fails?

1. **Check function logs**:
   - Go to **Edge Functions** → `[function-name]` → **Logs**
   - Review error messages

2. **Check secrets are set**:
   - Go to **Edge Functions** → `[function-name]` → **Settings** → **Secrets**
   - Verify all required secrets are present

3. **Check function code**:
   - Review function code for errors
   - Check function imports and dependencies

### Connection Issues?

1. **Verify project link**:
   ```bash
   supabase status
   ```

2. **Re-link project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Check authentication**:
   ```bash
   supabase login
   ```

## Next Steps

After deploying Edge Functions:

1. ✅ Functions deployed
2. ⏭️ Configure secrets
3. ⏭️ Test functions
4. ⏭️ Test application locally
5. ⏭️ Deploy to production

## Additional Resources

- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Edge Functions Docs**: https://supabase.com/docs/guides/functions
- **Function Secrets**: https://supabase.com/docs/guides/functions/secrets

---

**Status**: Ready to deploy Edge Functions! 🚀

