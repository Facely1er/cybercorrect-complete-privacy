# CLI Setup Guide - Configure Edge Function Secrets

**Date**: 2025-02-02  
**Status**: Ready to use

---

## 🎯 Objective

Configure Edge Function secrets using Supabase CLI (via npx - no installation required).

---

## 🚀 Quick Start

### Step 1: Login to Supabase CLI

```bash
npx supabase login
```

This will open your browser to authenticate. Follow the prompts.

### Step 2: Link Your Project

```bash
npx supabase link --project-ref your-project-ref
```

### Step 3: Configure Secrets

Run the automated script:

```bash
npm run configure:secrets
```

Or configure manually using CLI commands (see below).

---

## 📋 Manual CLI Configuration

If you prefer to configure secrets manually, use these commands:

### Set SUPABASE_URL Secret

```bash
npx supabase secrets set SUPABASE_URL="https://your-project.supabase.co" --project-ref your-project-ref
```

**Note:** CLI cannot set secrets starting with "SUPABASE_" - see CLI_LIMITATIONS.md for details.

### Set SUPABASE_SERVICE_ROLE_KEY Secret

**Note:** CLI cannot set secrets starting with "SUPABASE_" - you must use the Supabase Dashboard. See `CLI_LIMITATIONS.md` for details.

**Alternative:** Use Supabase Dashboard → Edge Functions → Settings → Secrets

---

## 🔧 Automated Script

Use the provided script to configure all secrets automatically:

```bash
npm run configure:secrets
```

This script will:
1. Check if Supabase CLI is available (via npx)
2. Check if you're logged in
3. Set all required secrets for all Edge Functions

---

## ✅ Verification

After configuring secrets, verify they're set:

### List All Secrets

```bash
npx supabase secrets list --project-ref your-project-ref
```

### Test Edge Function

1. Go to Supabase Dashboard → Edge Functions
2. Select a function (e.g., `send-email-notification`)
3. Click **Invoke** tab
4. Test with a sample payload

---

## 📚 Available CLI Commands

### Login

```bash
npx supabase login
```

### Link Project

```bash
npx supabase link --project-ref your-project-ref
```

### Set Secret

```bash
npx supabase secrets set SECRET_NAME="secret_value" --project-ref your-project-ref
```

### List Secrets

```bash
npx supabase secrets list --project-ref your-project-ref
```

### Deploy Function

```bash
npx supabase functions deploy FUNCTION_NAME --project-ref your-project-ref
```

### Deploy All Functions

```bash
npx supabase functions deploy --project-ref your-project-ref
```

---

## 🎯 Complete Setup Commands (Copy-Paste)

Copy and paste this entire block to set up everything:

```bash
# Step 1: Login
npx supabase login

# Step 2: Link project
npx supabase link --project-ref your-project-ref

# Step 3: Set secrets (Note: CLI cannot set secrets starting with "SUPABASE_")
# You must use Supabase Dashboard → Edge Functions → Settings → Secrets
# See CLI_LIMITATIONS.md for details

# Step 4: Verify secrets
npx supabase secrets list --project-ref your-project-ref
```

---

## 🐛 Troubleshooting

### "Command not found" Error

Make sure you're using `npx`:

```bash
npx supabase --version
```

### "Not logged in" Error

Login first:

```bash
npx supabase login
```

### "Project not linked" Error

Link your project:

```bash
npx supabase link --project-ref your-project-ref
```

### Secrets Not Appearing

1. Verify you're using the correct project-ref
2. Check Supabase Dashboard → Edge Functions → Settings
3. Secrets may need to be set per function in the Dashboard

---

## 📝 Notes

- **npx** doesn't require installation - it downloads and runs Supabase CLI on demand
- Secrets set via CLI are **global** and apply to all Edge Functions
- You can also set secrets per function in Supabase Dashboard
- See `CONFIGURE_EDGE_FUNCTION_SECRETS.md` for Dashboard method

---

## 🎉 Success!

Once secrets are configured, your Edge Functions are ready to use!

**Next Steps**:
1. Test Edge Functions in Supabase Dashboard
2. Deploy application to production
3. Monitor Edge Function logs

---

**Status**: Ready to use  
**Last Updated**: 2025-02-02

