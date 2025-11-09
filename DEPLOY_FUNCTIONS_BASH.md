# Deploy Edge Functions - Bash/Git Bash Guide

## 🚀 Quick Start for Bash/Git Bash

You're using Git Bash (MINGW64), so use the bash script or run commands manually.

## Option 1: Use Bash Script (Recommended)

```bash
# Make script executable (if not already)
chmod +x scripts/deploy-edge-functions.sh

# Run the script
./scripts/deploy-edge-functions.sh
```

## Option 2: Run Commands Manually

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser for authentication.

### Step 3: Link Your Project

```bash
supabase link --project-ref achowlksgmwuvfbvjfrt
```

You may need to provide your database password if prompted.

### Step 4: Deploy Each Function

```bash
# Deploy all functions one by one
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

## Option 3: Deploy All at Once

```bash
# Deploy all functions in one command
supabase functions deploy send-email-notification && \
supabase functions deploy stripe-webhook && \
supabase functions deploy generate-automated-reports && \
supabase functions deploy run-scheduled-assessments && \
supabase functions deploy track-compliance-health && \
supabase functions deploy check-regulatory-updates
```

## Verify Deployment

1. Go to: https://app.supabase.com
2. Select project: **achowlksgmwuvfbvjfrt**
3. Navigate to **Edge Functions**
4. Verify all 6 functions are listed:
   - ✅ `send-email-notification`
   - ✅ `stripe-webhook`
   - ✅ `generate-automated-reports`
   - ✅ `run-scheduled-assessments`
   - ✅ `track-compliance-health`
   - ✅ `check-regulatory-updates`

## Troubleshooting

### Script Not Executable?

```bash
chmod +x scripts/deploy-edge-functions.sh
```

### Supabase CLI Not Found?

```bash
# Install globally
npm install -g supabase

# Verify installation
supabase --version
```

### Project Link Issues?

```bash
# Check status
supabase status

# Re-link if needed
supabase link --project-ref achowlksgmwuvfbvjfrt
```

### Function Deployment Fails?

1. Check function files exist:
   ```bash
   ls supabase/functions/
   ```

2. Check function code:
   ```bash
   cat supabase/functions/send-email-notification/index.ts
   ```

3. Check Supabase CLI version:
   ```bash
   supabase --version
   ```

## Next Steps

After deploying functions:

1. ✅ Functions deployed
2. ⏭️ Configure secrets in Supabase Dashboard
3. ⏭️ Test functions
4. ⏭️ Test application locally

See `DEPLOY_EDGE_FUNCTIONS.md` for detailed secret configuration.

---

**For Git Bash users**: Use the bash script or run commands manually! 🚀

