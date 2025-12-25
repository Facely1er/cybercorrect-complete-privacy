# Production Deployment Script (PowerShell)
# This script helps deploy the CyberCorrect Privacy Platform to production

Write-Host "🚀 CyberCorrect Privacy Platform - Production Deployment" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "⚠️  Warning: .env.production not found" -ForegroundColor Yellow
    Write-Host "Creating from .env.production.example..."
    Copy-Item ".env.production.example" ".env.production"
    Write-Host "❌ Please fill in .env.production with your production values" -ForegroundColor Red
    Write-Host "Then run this script again."
    exit 1
}

# Load environment variables
Write-Host "📋 Checking environment variables..." -ForegroundColor Cyan
Get-Content ".env.production" | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

$requiredVars = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_STRIPE_PUBLISHABLE_KEY",
    "VITE_SITE_URL"
)

$missingVars = @()

foreach ($var in $requiredVars) {
    $value = [Environment]::GetEnvironmentVariable($var, "Process")
    if ([string]::IsNullOrEmpty($value)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "❌ Missing required environment variables:" -ForegroundColor Red
    foreach ($var in $missingVars) {
        Write-Host "  - $var" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please update .env.production and try again."
    exit 1
}

Write-Host "✅ All required environment variables set" -ForegroundColor Green
Write-Host ""

# Build the application
Write-Host "🔨 Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
} catch {
    Write-Host "⚠️  Supabase CLI not found" -ForegroundColor Yellow
    Write-Host "Installing Supabase CLI..."
    npm install -g supabase
}

# Check if logged in to Supabase
Write-Host "🔐 Checking Supabase authentication..." -ForegroundColor Cyan
try {
    $null = supabase projects list 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not authenticated"
    }
} catch {
    Write-Host "⚠️  Not logged in to Supabase" -ForegroundColor Yellow
    Write-Host "Please run: supabase login"
    exit 1
}

Write-Host "✅ Authenticated with Supabase" -ForegroundColor Green
Write-Host ""

# Deploy Edge Functions
Write-Host "📦 Deploying Edge Functions..." -ForegroundColor Cyan
Write-Host ""

Write-Host "Deploying create-one-time-checkout-session..." -ForegroundColor Cyan
supabase functions deploy create-one-time-checkout-session

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy create-one-time-checkout-session" -ForegroundColor Red
    exit 1
}

Write-Host "Deploying stripe-webhook..." -ForegroundColor Cyan
supabase functions deploy stripe-webhook

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to deploy stripe-webhook" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Edge Functions deployed successfully" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "✅ Deployment Preparation Complete!" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Deploy to your hosting platform (Vercel/Netlify/etc.)"
Write-Host "2. Set environment variables in your hosting platform"
Write-Host "3. Test the production deployment"
Write-Host "4. Monitor logs and errors"
Write-Host ""
Write-Host "For detailed instructions, see:"
Write-Host "- STRIPE_PRODUCTION_SETUP.md"
Write-Host "- DEPLOY_EDGE_FUNCTIONS.md"
Write-Host "- PRODUCTION_DEPLOYMENT_CHECKLIST.md"
Write-Host ""

