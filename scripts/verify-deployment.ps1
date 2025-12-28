# CyberCorrect Post-Deployment Verification Script

Write-Host "🔍 CyberCorrect Deployment Verification" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Get deployment URLs
Write-Host "📋 Enter your deployment URLs:" -ForegroundColor Yellow
$frameworkUrl = Read-Host "Framework Compliance URL (e.g., https://cybercorrect-framework-compliance.vercel.app)"
$portalUrl = Read-Host "Privacy Portal URL (e.g., https://cybercorrect-privacy-portal.vercel.app)"

Write-Host ""
Write-Host "🧪 Running Smoke Tests..." -ForegroundColor Yellow
Write-Host ""

# Test Framework Compliance
Write-Host "Testing Framework Compliance..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$frameworkUrl" -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Framework Compliance homepage loads (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Framework Compliance returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Framework Compliance not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Privacy Portal
Write-Host "Testing Privacy Portal..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$portalUrl" -Method Get -TimeoutSec 10 -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Privacy Portal homepage loads (Status: $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Privacy Portal returned status: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Privacy Portal not accessible: $($_.Exception.Message)" -ForegroundColor Red
}

# Check HTTPS
Write-Host ""
Write-Host "🔒 Checking HTTPS..." -ForegroundColor Yellow
if ($frameworkUrl -like "https://*") {
    Write-Host "✅ Framework Compliance uses HTTPS" -ForegroundColor Green
} else {
    Write-Host "⚠️  Framework Compliance not using HTTPS" -ForegroundColor Yellow
}

if ($portalUrl -like "https://*") {
    Write-Host "✅ Privacy Portal uses HTTPS" -ForegroundColor Green
} else {
    Write-Host "⚠️  Privacy Portal not using HTTPS" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📊 Manual Verification Checklist:" -ForegroundColor Yellow
Write-Host "  [ ] Framework Compliance homepage loads without errors" -ForegroundColor White
Write-Host "  [ ] Privacy Portal homepage loads without errors" -ForegroundColor White
Write-Host "  [ ] Can create account on Framework Compliance" -ForegroundColor White
Write-Host "  [ ] Can login" -ForegroundColor White
Write-Host "  [ ] Can access Privacy Gap Analyzer" -ForegroundColor White
Write-Host "  [ ] Can submit data rights request on Privacy Portal" -ForegroundColor White
Write-Host "  [ ] No console errors in browser DevTools" -ForegroundColor White
Write-Host "  [ ] HTTPS padlock visible" -ForegroundColor White
Write-Host ""
Write-Host "✅ Verification script complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run Lighthouse audits and check Vercel Analytics" -ForegroundColor Cyan

