# PowerShell script to verify remote repository configuration

Write-Host "🔍 Verifying CyberCorrect Remote Repository Configuration" -ForegroundColor Cyan
Write-Host ""

# Function to find Git executable
function Find-Git {
    $commonPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe",
        "$env:ProgramFiles(x86)\Git\cmd\git.exe"
    )
    
    $gitInPath = Get-Command git -ErrorAction SilentlyContinue
    if ($gitInPath) {
        return $gitInPath.Path
    }
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            return $path
        }
    }
    
    return $null
}

# Find Git
$gitPath = Find-Git

if (-not $gitPath) {
    Write-Host "⚠️  Git not found in PATH - checking config file directly" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "✅ Git found: $gitPath" -ForegroundColor Green
    Write-Host ""
}

# Navigate to repository
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "📁 Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Read config file directly
$configPath = Join-Path $repoPath ".git\config"
if (Test-Path $configPath) {
    Write-Host "📄 Reading .git\config..." -ForegroundColor Cyan
    $configContent = Get-Content $configPath -Raw
    
    # Extract remote URL
    if ($configContent -match '\[remote "origin"\][\s\S]*?url = ([^\r\n]+)') {
        $remoteUrl = $matches[1].Trim()
        Write-Host "✅ Remote URL found: $remoteUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ No remote 'origin' found in config" -ForegroundColor Red
    }
    
    # Extract branch tracking
    if ($configContent -match '\[branch "([^"]+)"\][\s\S]*?remote = ([^\r\n]+)[\s\S]*?merge = ([^\r\n]+)') {
        $branchName = $matches[1]
        $remoteName = $matches[2].Trim()
        $mergeRef = $matches[3].Trim()
        Write-Host "✅ Branch tracking: $branchName → $remoteName/$mergeRef" -ForegroundColor Green
    }
    
    Write-Host ""
}

# If Git is available, run git commands
if ($gitPath) {
    Write-Host "🔍 Running Git verification commands..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check remotes
    Write-Host "Remote configuration:" -ForegroundColor Cyan
    $remotes = & $gitPath remote -v 2>&1
    Write-Host $remotes
    Write-Host ""
    
    # Check branch tracking
    Write-Host "Branch tracking:" -ForegroundColor Cyan
    $branches = & $gitPath branch -vv 2>&1
    Write-Host $branches
    Write-Host ""
    
    # Test connection
    Write-Host "🧪 Testing remote connection..." -ForegroundColor Cyan
    $fetchTest = & $gitPath fetch origin --dry-run 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote connection successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Remote connection test failed or requires authentication" -ForegroundColor Yellow
        Write-Host $fetchTest
    }
    Write-Host ""
}

# Summary
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "Configuration Summary" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host ""

if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    
    if ($configContent -match '\[remote "origin"\]') {
        Write-Host "✅ Remote 'origin' is configured" -ForegroundColor Green
    } else {
        Write-Host "❌ Remote 'origin' is NOT configured" -ForegroundColor Red
    }
    
    if ($configContent -match '\[branch "main"\]') {
        Write-Host "✅ Branch 'main' tracking is configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Branch 'main' tracking may not be configured" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "If you need to fix the remote, run:" -ForegroundColor Cyan
Write-Host '  .\scripts\fix-remote.ps1' -ForegroundColor Gray

