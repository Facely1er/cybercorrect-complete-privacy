# PowerShell script to pull and push cybercorrect repository

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
    Write-Host "ERROR: Git not found. Please install Git or add it to PATH." -ForegroundColor Red
    exit 1
}

Write-Host "Using Git: $gitPath" -ForegroundColor Green
Write-Host ""

# Navigate to repository
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Check for uncommitted changes
Write-Host "Checking for uncommitted changes..." -ForegroundColor Cyan
$status = & $gitPath status --short 2>&1
if ($status -and ($status -notmatch "nothing to commit")) {
    Write-Host "Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $status
    Write-Host ""
    $action = Read-Host "Choose: (c)ommit, (s)tash, or (d)iscard? (c/s/d)"
    
    if ($action -eq "c" -or $action -eq "C") {
        $commitMsg = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        & $gitPath add . 2>&1 | Out-Null
        & $gitPath commit -m $commitMsg 2>&1 | Out-Null
        Write-Host "Changes committed" -ForegroundColor Green
    } elseif ($action -eq "s" -or $action -eq "S") {
        & $gitPath stash push -m "Stashed before sync $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 2>&1 | Out-Null
        Write-Host "Changes stashed" -ForegroundColor Green
    } elseif ($action -eq "d" -or $action -eq "D") {
        & $gitPath reset --hard HEAD 2>&1 | Out-Null
        Write-Host "Changes discarded" -ForegroundColor Yellow
    }
    Write-Host ""
}

# Pull with allow-unrelated-histories
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "PULLING LATEST CHANGES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Pulling from origin/main (allowing unrelated histories)..." -ForegroundColor Cyan
$pullOutput = & $gitPath pull origin main --allow-unrelated-histories --no-edit 2>&1

# Check if there are merge conflicts
if ($pullOutput -match "CONFLICT|conflict|Automatic merge failed") {
    Write-Host ""
    Write-Host "MERGE CONFLICTS DETECTED!" -ForegroundColor Red
    Write-Host $pullOutput
    Write-Host ""
    Write-Host "You need to resolve conflicts manually:" -ForegroundColor Yellow
    Write-Host "1. Check conflicted files: git status" -ForegroundColor Gray
    Write-Host "2. Resolve conflicts in the files" -ForegroundColor Gray
    Write-Host "3. Stage resolved files: git add ." -ForegroundColor Gray
    Write-Host "4. Complete merge: git commit" -ForegroundColor Gray
    Write-Host "5. Then push: git push origin main" -ForegroundColor Gray
    exit 1
} elseif ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Pull failed:" -ForegroundColor Red
    Write-Host $pullOutput
    exit 1
} else {
    Write-Host $pullOutput
    Write-Host ""
    Write-Host "Pull completed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Push
Write-Host "============================================================" -ForegroundColor Gray
Write-Host "PUSHING LOCAL CHANGES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Gray
Write-Host ""

Write-Host "Pushing to origin/main..." -ForegroundColor Cyan
$pushOutput = & $gitPath push origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host $pushOutput
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Gray
    Write-Host "SYNC COMPLETE!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Repository is now in sync with remote!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed:" -ForegroundColor Red
    Write-Host $pushOutput
    Write-Host ""
    Write-Host "If push was rejected, you may need to:" -ForegroundColor Yellow
    Write-Host "  - Resolve any merge conflicts first" -ForegroundColor Gray
    Write-Host "  - Or use: git push origin main --force (DANGEROUS - only if you're sure)" -ForegroundColor Gray
}

