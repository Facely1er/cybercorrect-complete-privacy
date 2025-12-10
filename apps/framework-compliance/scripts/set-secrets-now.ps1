# PowerShell script to set all Supabase secrets
# Run this after: npx supabase login and npx supabase link --project-ref achowlksgmwuvfbvjfrt

Write-Host "🔐 Setting Supabase Edge Function Secrets`n" -ForegroundColor Cyan

# Common secrets for all functions
Write-Host "Setting common secrets..." -ForegroundColor Yellow
npx supabase secrets set STRIPE_SECRET_KEY=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
npx supabase secrets set SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
npx supabase secrets set SITE_URL=https://www.platform.cybercorrect.com

# Price IDs for create-checkout-session
Write-Host "`nSetting price IDs..." -ForegroundColor Yellow
npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_1SDUjIA6UggvM46N1rjxGuFR
npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_1SDUjJA6UggvM46NXU5Jrizp

Write-Host "`n✅ Secrets configured!" -ForegroundColor Green
Write-Host "`n⚠️  Don't forget to:" -ForegroundColor Yellow
Write-Host "   1. Set STRIPE_WEBHOOK_SECRET after creating webhook in Stripe"
Write-Host "   2. Add annual price IDs if you create annual prices"
Write-Host "   3. Deploy Edge Functions: cd supabase && npx supabase functions deploy"

