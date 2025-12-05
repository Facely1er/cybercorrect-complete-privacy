# PowerShell script to deploy all Edge Functions to Supabase
# 
# Prerequisites:
# - npm install -g supabase
# - supabase login
# - supabase link --project-ref achowlksgmwuvfbvjfrt

Write-Host "🚀 Deploying Edge Functions to Supabase" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Installing..." -ForegroundColor Red
    npm install -g supabase
}

# Functions to deploy
$functions = @(
    "send-email-notification",
    "stripe-webhook",
    "generate-automated-reports",
    "run-scheduled-assessments",
    "track-compliance-health",
    "check-regulatory-updates"
)

# Deploy each function
foreach ($func in $functions) {
    Write-Host "📦 Deploying $func..." -ForegroundColor Cyan
    supabase functions deploy $func
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $func deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy $func" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "✅ All Edge Functions deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure function secrets in Supabase Dashboard"
Write-Host "2. Test functions"
Write-Host ""

