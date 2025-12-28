# CyberCorrect Production Deployment Script
# This script automates the deployment process for Option 1: Full Cloud Production

Write-Host "🚀 CyberCorrect Production Deployment" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Prerequisites
Write-Host "📋 Step 1: Verifying Prerequisites..." -ForegroundColor Yellow

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    Write-Host "   Run: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version 2>&1
    Write-Host "✅ Supabase CLI installed: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Supabase CLI not found (optional for deployment)" -ForegroundColor Yellow
}

# Check if logged into Vercel
Write-Host ""
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    vercel whoami 2>&1 | Out-Null
    Write-Host "✅ Logged into Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged into Vercel. Please run: vercel login" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Prerequisites verified!" -ForegroundColor Green
Write-Host ""

# Step 2: Environment Variables Check
Write-Host "📝 Step 2: Environment Variables Configuration" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Before deploying, ensure you have:" -ForegroundColor Cyan
Write-Host "  1. Supabase Project URL (VITE_SUPABASE_URL)" -ForegroundColor White
Write-Host "  2. Supabase Anon Key (VITE_SUPABASE_ANON_KEY)" -ForegroundColor White
Write-Host "  3. Application URLs configured" -ForegroundColor White
Write-Host "  4. Optional: Sentry DSN, Google Analytics ID" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Have you configured your Supabase credentials? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Please configure your environment variables first." -ForegroundColor Yellow
    Write-Host "See PRODUCTION_DEPLOYMENT_GUIDE.md for details." -ForegroundColor Yellow
    exit 0
}

# Step 3: Build Applications
Write-Host ""
Write-Host "🔨 Step 3: Building Applications..." -ForegroundColor Yellow

# Build Framework Compliance
Write-Host "Building Framework Compliance..." -ForegroundColor Cyan
Set-Location apps/framework-compliance
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Framework Compliance build failed!" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ Framework Compliance built successfully" -ForegroundColor Green
Set-Location ../..

# Build Privacy Portal
Write-Host "Building Privacy Portal..." -ForegroundColor Cyan
Set-Location apps/privacy-portal
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Privacy Portal build failed!" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ Privacy Portal built successfully" -ForegroundColor Green
Set-Location ../..

Write-Host ""
Write-Host "✅ All builds successful!" -ForegroundColor Green
Write-Host ""

# Step 4: Deploy to Vercel
Write-Host "🚀 Step 4: Deploying to Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "You will be prompted to:" -ForegroundColor Cyan
Write-Host "  1. Link to existing project or create new" -ForegroundColor White
Write-Host "  2. Set project name" -ForegroundColor White
Write-Host "  3. Configure environment variables" -ForegroundColor White
Write-Host ""

# Deploy Framework Compliance
Write-Host "Deploying Framework Compliance..." -ForegroundColor Cyan
Set-Location apps/framework-compliance
Write-Host "Project Name: cybercorrect-framework-compliance" -ForegroundColor Yellow
vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Framework Compliance deployment failed!" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ Framework Compliance deployed successfully" -ForegroundColor Green
Set-Location ../..

# Deploy Privacy Portal
Write-Host ""
Write-Host "Deploying Privacy Portal..." -ForegroundColor Cyan
Set-Location apps/privacy-portal
Write-Host "Project Name: cybercorrect-privacy-portal" -ForegroundColor Yellow
vercel --prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Privacy Portal deployment failed!" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Write-Host "✅ Privacy Portal deployed successfully" -ForegroundColor Green
Set-Location ../..

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure custom domains in Vercel dashboard" -ForegroundColor White
Write-Host "  2. Add environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "  3. Run post-deployment verification" -ForegroundColor White
Write-Host "  4. Set up monitoring (Sentry, Analytics)" -ForegroundColor White
Write-Host ""
Write-Host "See PRODUCTION_DEPLOYMENT_GUIDE.md for detailed next steps." -ForegroundColor Cyan

