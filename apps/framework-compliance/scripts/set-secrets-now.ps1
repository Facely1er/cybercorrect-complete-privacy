# PowerShell script to set all Supabase secrets
# Run this after: npx supabase login and npx supabase link --project-ref achowlksgmwuvfbvjfrt
#
# SECURITY: This script reads secrets from environment variables to prevent committing secrets to git.
# Set these environment variables before running:
#   $env:STRIPE_SECRET_KEY
#   $env:SUPABASE_URL
#   $env:SUPABASE_SERVICE_ROLE_KEY
#   $env:SITE_URL
#   $env:STRIPE_PRICE_STARTER_MONTHLY
#   $env:STRIPE_PRICE_PROFESSIONAL_MONTHLY

Write-Host "🔐 Setting Supabase Edge Function Secrets`n" -ForegroundColor Cyan

# Validate required environment variables
$requiredVars = @(
    "STRIPE_SECRET_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SITE_URL",
    "STRIPE_PRICE_STARTER_MONTHLY",
    "STRIPE_PRICE_PROFESSIONAL_MONTHLY"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not (Get-Variable -Name "env:$var" -ErrorAction SilentlyContinue) -or -not $env:$var) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ ERROR: Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Red
    }
    Write-Host "`nPlease set these environment variables before running this script." -ForegroundColor Yellow
    Write-Host "Example:" -ForegroundColor Yellow
    Write-Host "  `$env:STRIPE_SECRET_KEY = 'sk_live_...'" -ForegroundColor Gray
    Write-Host "  `$env:SUPABASE_URL = 'https://...'" -ForegroundColor Gray
    Write-Host "  `$env:SUPABASE_SERVICE_ROLE_KEY = 'eyJ...'" -ForegroundColor Gray
    Write-Host "  `$env:SITE_URL = 'https://...'" -ForegroundColor Gray
    Write-Host "  `$env:STRIPE_PRICE_STARTER_MONTHLY = 'price_...'" -ForegroundColor Gray
    Write-Host "  `$env:STRIPE_PRICE_PROFESSIONAL_MONTHLY = 'price_...'" -ForegroundColor Gray
    exit 1
}

# Common secrets for all functions
Write-Host "Setting common secrets..." -ForegroundColor Yellow
npx supabase secrets set STRIPE_SECRET_KEY=$env:STRIPE_SECRET_KEY
npx supabase secrets set SUPABASE_URL=$env:SUPABASE_URL
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=$env:SUPABASE_SERVICE_ROLE_KEY
npx supabase secrets set SITE_URL=$env:SITE_URL

# Price IDs for create-checkout-session
Write-Host "`nSetting price IDs..." -ForegroundColor Yellow
npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=$env:STRIPE_PRICE_STARTER_MONTHLY
npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=$env:STRIPE_PRICE_PROFESSIONAL_MONTHLY

Write-Host "`n✅ Secrets configured!" -ForegroundColor Green
Write-Host "`n⚠️  Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Set STRIPE_WEBHOOK_SECRET after creating webhook in Stripe"
Write-Host "   2. Add annual price IDs if you create annual prices"
Write-Host "   3. Deploy Edge Functions: cd supabase && npx supabase functions deploy"