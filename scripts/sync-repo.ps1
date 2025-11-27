# PowerShell script to pull and push cybercorrect-complete-privacy repository

Write-Host "🔄 Syncing CyberCorrect Repository" -ForegroundColor Cyan
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
    
    # Check if git is in PATH
    $gitInPath = Get-Command git -ErrorAction SilentlyContinue
    if ($gitInPath) {
        return $gitInPath.Path
    }
    
    # Check common installation paths
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
    Write-Host "❌ Git is not found in PATH or common installation locations" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Or add Git to your PATH environment variable" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual commands to run (after Git is installed):" -ForegroundColor Cyan
    Write-Host "  cd `"$PSScriptRoot\..`"" -ForegroundColor Gray
    Write-Host "  git pull origin main" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Git found: $gitPath" -ForegroundColor Green
Write-Host ""

# Navigate to repository root
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "📁 Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
$isGitRepo = Test-Path (Join-Path $repoPath ".git")
if (-not $isGitRepo) {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
    exit 1
}

# Function to run git command
function Invoke-GitCommand {
    param([string]$Command, [string]$Description)
    
    Write-Host "🔄 $Description..." -ForegroundColor Cyan
    Write-Host ""
    
    $output = & $gitPath $Command.Split(' ') 2>&1
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host $output
        Write-Host ""
        Write-Host "✅ $Description completed successfully" -ForegroundColor Green
        Write-Host ""
        return $true
    } else {
        Write-Host $output
        Write-Host ""
        Write-Host "❌ $Description failed (exit code: $exitCode)" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Check current status
Write-Host "📊 Checking repository status..." -ForegroundColor Cyan
Write-Host ""
$statusOutput = & $gitPath status --short 2>&1
$hasChanges = $statusOutput -and ($statusOutput -notmatch "nothing to commit")

if ($hasChanges) {
    Write-Host "📝 Uncommitted changes detected:" -ForegroundColor Yellow
    Write-Host $statusOutput
    Write-Host ""
    $commit = Read-Host "Do you want to commit these changes before pushing? (y/n)"
    
    if ($commit -eq "y" -or $commit -eq "Y") {
        Write-Host ""
        $commitMessage = Read-Host "Enter commit message (or press Enter for default)"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        }
        
        Write-Host ""
        Invoke-GitCommand "add ." "Staging changes" | Out-Null
        
        $commitOutput = & $gitPath commit -m $commitMessage 2>&1
        Write-Host $commitOutput
        Write-Host ""
    }
}

# Pull latest changes
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "PULLING LATEST CHANGES" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$pullSuccess = Invoke-GitCommand "pull origin main" "Pulling from remote"

if (-not $pullSuccess) {
    Write-Host "⚠️  Pull failed. You may need to resolve conflicts manually." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue with push anyway? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "❌ Aborted. Please resolve conflicts and try again." -ForegroundColor Red
        exit 1
    }
}

# Push changes
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host "PUSHING CHANGES" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$pushSuccess = Invoke-GitCommand "push origin main" "Pushing to remote"

if ($pushSuccess) {
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host "✅ SYNC COMPLETE" -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host ""
    Write-Host "Repository is now in sync with remote!" -ForegroundColor Green
} else {
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host "❌ SYNC INCOMPLETE" -ForegroundColor Red
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host ""
    Write-Host "Please check the errors above and try again." -ForegroundColor Yellow
}

