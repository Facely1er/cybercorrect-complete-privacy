# Get Stripe Price IDs - Quick Guide

## Option 1: Use the Script (Easiest)

```bash
# Set your secret key as environment variable
export STRIPE_SECRET_KEY=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

# Run the script
tsx scripts/get-stripe-price-ids.ts
```

Or pass it directly:
```bash
tsx scripts/get-stripe-price-ids.ts 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
```

The script will:
- List all your Stripe products
- Show Price IDs for monthly and annual subscriptions
- Display them in a format ready to copy to Supabase secrets

## Option 2: Get from Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Click on each product
3. Under **Pricing**, you'll see the Price IDs (start with `price_...`)
4. Copy each Price ID

## What You Need

For subscription checkout, you need these Price IDs:

- `STRIPE_PRICE_STARTER_MONTHLY` = `price_...`
- `STRIPE_PRICE_STARTER_ANNUAL` = `price_...`
- `STRIPE_PRICE_PROFESSIONAL_MONTHLY` = `price_...`
- `STRIPE_PRICE_PROFESSIONAL_ANNUAL` = `price_...`

## After Getting Price IDs

Add them to Supabase Edge Function secrets:
1. Supabase Dashboard → Edge Functions → `create-checkout-session` → Settings → Secrets
2. Add each Price ID as a separate secret

