# PowerShell script to sync repository - pull and push

Write-Host "Syncing CyberCorrect Repository" -ForegroundColor Cyan
Write-Host ""

# Find Git
$gitPath = $null
$commonPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
    "$env:ProgramFiles\Git\cmd\git.exe"
)

$gitInPath = Get-Command git -ErrorAction SilentlyContinue
if ($gitInPath) {
    $gitPath = $gitInPath.Path
} else {
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $gitPath = $path
            break
        }
    }
}

if (-not $gitPath) {
    Write-Host "ERROR: Git not found" -ForegroundColor Red
    exit 1
}

# Navigate to repository
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Check status
Write-Host "Checking status..." -ForegroundColor Cyan
$status = & $gitPath status --short 2>&1
if ($status) {
    Write-Host "Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $status
    Write-Host ""
    $commit = Read-Host "Commit these changes before syncing? (y/n)"
    if ($commit -eq "y" -or $commit -eq "Y") {
        $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        & $gitPath add . 2>&1 | Out-Null
        & $gitPath commit -m $commitMsg 2>&1 | Out-Null
        Write-Host "Changes committed" -ForegroundColor Green
        Write-Host ""
    }
}

# Pull first
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "PULLING LATEST CHANGES (375 commits behind)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Pulling from origin/main..." -ForegroundColor Cyan
$pullOutput = & $gitPath pull origin main 2>&1
Write-Host $pullOutput

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "WARNING: Pull had issues. You may need to resolve conflicts." -ForegroundColor Yellow
    Write-Host "Continue with push? (y/n)" -ForegroundColor Yellow
    $continue = Read-Host
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Aborted. Please resolve conflicts first." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Pull completed" -ForegroundColor Green
Write-Host ""

# Push
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "PUSHING LOCAL CHANGES (6 commits ahead)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
$pushOutput = & $gitPath push origin main 2>&1
Write-Host $pushOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Gray
    Write-Host "SYNC COMPLETE!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Push failed. Check errors above." -ForegroundColor Red
}

