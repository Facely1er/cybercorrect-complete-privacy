# PowerShell script to apply migrations using Supabase CLI
# 
# Prerequisites:
# - npm install -g supabase
# - supabase login
# - supabase link --project-ref achowlksgmwuvfbvjfrt

Write-Host "🚀 Applying Database Migrations to Supabase" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

# Check if logged in
Write-Host "📋 Checking Supabase CLI status..." -ForegroundColor Cyan
supabase status

# Apply migrations
Write-Host ""
Write-Host "📄 Applying migrations..." -ForegroundColor Cyan
Write-Host ""

# Apply all migrations in order
supabase db push

Write-Host ""
Write-Host "✅ Migrations applied!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Yellow
Write-Host "1. Verify tables in Supabase Dashboard → Table Editor"
Write-Host "2. Run: npx tsx scripts/verify-supabase-setup.ts"
Write-Host "3. Deploy Edge Functions"
Write-Host ""

