# PowerShell script to link cybercorrect-complete-privacy branch to remote repository

Write-Host "🔗 Linking CyberCorrect Branch to Remote Repository" -ForegroundColor Cyan
Write-Host ""

# Check if git is available
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Navigate to repository directory
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "📁 Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Check current remote status
Write-Host "🔍 Checking current remote configuration..." -ForegroundColor Cyan
$remotes = git remote -v 2>&1

if ($remotes -match "fatal: not a git repository") {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
    exit 1
}

if ([string]::IsNullOrWhiteSpace($remotes)) {
    Write-Host "⚠️  No remote repository configured" -ForegroundColor Yellow
    Write-Host ""
    
    # Prompt for repository URL
    Write-Host "Enter your GitHub repository URL:" -ForegroundColor Cyan
    Write-Host "Example: https://github.com/cybercorrect/cybercorrect-complete-privacy.git" -ForegroundColor Gray
    $repoUrl = Read-Host "Repository URL"
    
    if ([string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
        exit 1
    }
    
    # Add remote
    Write-Host ""
    Write-Host "➕ Adding remote repository..." -ForegroundColor Cyan
    git remote add origin $repoUrl
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Remote added successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to add remote" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📡 Current remotes:" -ForegroundColor Cyan
    Write-Host $remotes
    Write-Host ""
    
    $updateRemote = Read-Host "Update remote URL? (y/n)"
    if ($updateRemote -eq "y" -or $updateRemote -eq "Y") {
        Write-Host "Enter new GitHub repository URL:" -ForegroundColor Cyan
        $repoUrl = Read-Host "Repository URL"
        
        if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
            git remote set-url origin $repoUrl
            Write-Host "✅ Remote URL updated" -ForegroundColor Green
        }
    }
}

# Check current branch
Write-Host ""
Write-Host "🌿 Checking current branch..." -ForegroundColor Cyan
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

# Check if branch is tracking remote
Write-Host ""
Write-Host "🔗 Checking branch tracking..." -ForegroundColor Cyan
$branchInfo = git branch -vv | Select-String $currentBranch

if ($branchInfo -match "\[origin/") {
    Write-Host "✅ Branch is already tracking remote" -ForegroundColor Green
    Write-Host $branchInfo
} else {
    Write-Host "⚠️  Branch is not tracking remote" -ForegroundColor Yellow
    Write-Host ""
    
    $setUpstream = Read-Host "Set upstream tracking? (y/n)"
    if ($setUpstream -eq "y" -or $setUpstream -eq "Y") {
        Write-Host "🔗 Setting upstream tracking..." -ForegroundColor Cyan
        
        # Try to set upstream
        git branch --set-upstream-to=origin/$currentBranch $currentBranch 2>&1 | Out-Null
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Upstream branch may not exist on remote yet" -ForegroundColor Yellow
            Write-Host "💡 Push your branch to create it: git push -u origin $currentBranch" -ForegroundColor Cyan
        } else {
            Write-Host "✅ Upstream tracking set" -ForegroundColor Green
        }
    }
}

# Final verification
Write-Host ""
Write-Host "📊 Final Status:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Gray
Write-Host ""
Write-Host "Remotes:" -ForegroundColor Cyan
git remote -v
Write-Host ""
Write-Host "Branch tracking:" -ForegroundColor Cyan
git branch -vv
Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  - Push your branch: git push -u origin $currentBranch" -ForegroundColor Gray
Write-Host "  - Pull latest changes: git pull origin $currentBranch" -ForegroundColor Gray

