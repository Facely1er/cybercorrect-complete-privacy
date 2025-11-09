# Deploy Edge Functions - Manual Commands

## 🚀 Quick Deploy Commands

If the script doesn't work, use these manual commands:

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

### Step 4: Deploy All Functions

Run these commands one by one:

```bash
supabase functions deploy send-email-notification
```

```bash
supabase functions deploy stripe-webhook
```

```bash
supabase functions deploy generate-automated-reports
```

```bash
supabase functions deploy run-scheduled-assessments
```

```bash
supabase functions deploy track-compliance-health
```

```bash
supabase functions deploy check-regulatory-updates
```

## 🔍 Verify Deployment

1. Go to: https://app.supabase.com
2. Select project: **achowlksgmwuvfbvjfrt**
3. Navigate to **Edge Functions**
4. Verify all 6 functions are listed

## 📝 All Commands in One Block

Copy and paste this entire block:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref achowlksgmwuvfbvjfrt

# Deploy all functions
supabase functions deploy send-email-notification
supabase functions deploy stripe-webhook
supabase functions deploy generate-automated-reports
supabase functions deploy run-scheduled-assessments
supabase functions deploy track-compliance-health
supabase functions deploy check-regulatory-updates
```

## 🐛 Troubleshooting

### Script Not Found?

Make sure you're in the project root directory:

```bash
# Check current directory
pwd

# Should be: /c/Users/facel/Downloads/GitHub/cybercorrect-complete-privacy/cybercorrect-complete-privacy

# If not, navigate there
cd ~/Downloads/GitHub/cybercorrect-complete-privacy/cybercorrect-complete-privacy
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

2. Check you're in the right directory:
   ```bash
   pwd
   ls package.json
   ```

3. Check Supabase CLI version:
   ```bash
   supabase --version
   ```

## ✅ Next Steps

After deploying functions:

1. ✅ Functions deployed
2. ⏭️ Configure secrets in Supabase Dashboard
3. ⏭️ Test functions
4. ⏭️ Test application locally

See `DEPLOY_EDGE_FUNCTIONS.md` for detailed secret configuration.

---

**Use these manual commands if scripts don't work!** 🚀

