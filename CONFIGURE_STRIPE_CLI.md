# Configure Stripe Secrets Using CLI

## Quick Setup

Run this command to configure Stripe secret key for all Edge Functions:

```bash
npm run stripe:configure
```

Or directly:

```bash
tsx scripts/configure-stripe-secrets.ts
```

## Prerequisites

1. **Install Supabase CLI** (if not installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project** (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```
   
   Get your project-ref from: Supabase Dashboard → Settings → General → Reference ID

## Usage

### Option 1: Use Default Key (Already Set)

The script has your Stripe secret key built-in, so just run:

```bash
npm run stripe:configure
```

### Option 2: Use Environment Variable

```bash
export STRIPE_SECRET_KEY=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
npm run stripe:configure
```

### Option 3: Pass as Argument

```bash
tsx scripts/configure-stripe-secrets.ts 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
```

## What It Does

The script will:
1. ✅ Validate your Stripe secret key
2. ✅ Check if Supabase CLI is installed
3. ✅ Check if you're logged in
4. ✅ Detect your Supabase project
5. ✅ Set `STRIPE_SECRET_KEY` for all 3 Edge Functions:
   - `create-checkout-session`
   - `create-one-time-checkout-session`
   - `stripe-webhook`

## Manual Alternative

If you prefer to set secrets manually:

```bash
# For each function, run:
supabase secrets set STRIPE_SECRET_KEY=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

# Or with project-ref:
supabase secrets set STRIPE_SECRET_KEY=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 --project-ref your-project-ref
```

## Verify Secrets Are Set

Check in Supabase Dashboard:
1. Go to Edge Functions → [function name] → Settings → Secrets
2. You should see `STRIPE_SECRET_KEY` listed

Or use CLI:
```bash
supabase secrets list
```

## Next Steps

After configuring Stripe secret key:

1. ⚠️ Add Price IDs (run `tsx scripts/get-stripe-price-ids.ts` to get them)
2. ⚠️ Add webhook secret (from Stripe Dashboard)
3. ⚠️ Add other required secrets (SUPABASE_URL, etc.)
4. ⚠️ Deploy Edge Functions: `npm run supabase:deploy`
5. ⚠️ Test checkout flows

## Troubleshooting

### Error: "Supabase CLI not found"
**Fix:** Install CLI: `npm install -g supabase`

### Error: "Not logged in"
**Fix:** Login: `supabase login`

### Error: "Project not linked"
**Fix:** Link project: `supabase link --project-ref <ref>`

### Error: "Permission denied"
**Fix:** Make sure you have access to the Supabase project

---

**Run `npm run stripe:configure` to set up Stripe secrets now!** 🚀

