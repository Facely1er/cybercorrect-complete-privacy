# PowerShell script to generate Supabase secrets commands
# Run this after you have all the values

$STRIPE_SECRET_KEY = "sk_live_[YOUR_FRESH_KEY_HERE]"
$STRIPE_WEBHOOK_SECRET = "whsec_[YOUR_WEBHOOK_SECRET_HERE]"
$PRICE_STARTER_MONTHLY = "price_[YOUR_PRICE_ID_HERE]"
$PRICE_STARTER_ANNUAL = "price_[YOUR_PRICE_ID_HERE]"
$PRICE_PROFESSIONAL_MONTHLY = "price_[YOUR_PRICE_ID_HERE]"
$PRICE_PROFESSIONAL_ANNUAL = "price_[YOUR_PRICE_ID_HERE]"

# SECURITY: Never hardcode secrets. Use environment variables or placeholders.
# Set these variables from environment or replace with your actual values before running
$SUPABASE_URL = $env:SUPABASE_URL
if (-not $SUPABASE_URL) {
    $SUPABASE_URL = "https://[YOUR_PROJECT_REF].supabase.co"
}

$SUPABASE_SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY
if (-not $SUPABASE_SERVICE_ROLE_KEY) {
    $SUPABASE_SERVICE_ROLE_KEY = "[YOUR_SERVICE_ROLE_KEY_HERE]"
}

$SITE_URL = $env:SITE_URL
if (-not $SITE_URL) {
    $SITE_URL = "https://[YOUR_SITE_URL_HERE]"
}

Write-Host "`n🔐 Supabase Secrets Commands`n" -ForegroundColor Cyan
Write-Host "=" * 70
Write-Host "`nCopy and run these commands after logging in to Supabase CLI:`n" -ForegroundColor Yellow

Write-Host "# Common secrets (for all functions)" -ForegroundColor Green
Write-Host "npx supabase secrets set STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY"
Write-Host "npx supabase secrets set SUPABASE_URL=$SUPABASE_URL"
Write-Host "npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY"
Write-Host "npx supabase secrets set SITE_URL=$SITE_URL"

Write-Host "`n# Webhook secret (for stripe-webhook function)" -ForegroundColor Green
Write-Host "npx supabase secrets set STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET"

Write-Host "`n# Price IDs (for create-checkout-session function)" -ForegroundColor Green
Write-Host "npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=$PRICE_STARTER_MONTHLY"
Write-Host "npx supabase secrets set STRIPE_PRICE_STARTER_ANNUAL=$PRICE_STARTER_ANNUAL"
Write-Host "npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=$PRICE_PROFESSIONAL_MONTHLY"
Write-Host "npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_ANNUAL=$PRICE_PROFESSIONAL_ANNUAL"

Write-Host "`n# Deploy functions" -ForegroundColor Green
Write-Host "cd supabase"
Write-Host "npx supabase functions deploy create-checkout-session"
Write-Host "npx supabase functions deploy create-one-time-checkout-session"
Write-Host "npx supabase functions deploy stripe-webhook"

Write-Host "`n" + ("=" * 70)
Write-Host "`n⚠️  Remember to:" -ForegroundColor Yellow
Write-Host "   1. Replace [YOUR_FRESH_KEY_HERE] with your actual Stripe secret key"
Write-Host "   2. Replace [YOUR_WEBHOOK_SECRET_HERE] with your webhook secret"
Write-Host "   3. Replace [YOUR_PRICE_ID_HERE] with actual Price IDs from Stripe"
Write-Host "   4. Login first: npx supabase login"
Write-Host "   5. Link project: npx supabase link --project-ref achowlksgmwuvfbvjfrt"

