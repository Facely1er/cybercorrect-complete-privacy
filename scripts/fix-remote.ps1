# PowerShell script to fix cybercorrect remote repository link

Write-Host "🔧 Fix CyberCorrect Remote Repository Link" -ForegroundColor Cyan
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
    Write-Host "❌ Git is not found" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual fix: Edit .git\config and update the remote URL" -ForegroundColor Cyan
    exit 1
}

# Navigate to repository
$repoPath = Join-Path $PSScriptRoot ".."
Set-Location $repoPath

Write-Host "📁 Repository: $repoPath" -ForegroundColor Cyan
Write-Host ""

# Check current remote
Write-Host "🔍 Current remote configuration:" -ForegroundColor Cyan
$currentRemote = & $gitPath remote -v 2>&1
Write-Host $currentRemote
Write-Host ""

# Read current config
$configPath = Join-Path $repoPath ".git\config"
if (Test-Path $configPath) {
    $configContent = Get-Content $configPath -Raw
    if ($configContent -match '\[remote "origin"\][\s\S]*?url = ([^\r\n]+)') {
        $currentUrl = $matches[1].Trim()
        Write-Host "Current URL: $currentUrl" -ForegroundColor Yellow
        Write-Host ""
    }
}

# Options menu
Write-Host "Select an option:" -ForegroundColor Cyan
Write-Host "1. Use default: https://github.com/cybercorrect/cybercorrect-complete-privacy.git" -ForegroundColor Gray
Write-Host "2. Use SSH: git@github.com:cybercorrect/cybercorrect-complete-privacy.git" -ForegroundColor Gray
Write-Host "3. Enter custom repository URL" -ForegroundColor Gray
Write-Host "4. Test current remote connection" -ForegroundColor Gray
Write-Host "5. Remove remote and re-add" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        $newUrl = "https://github.com/cybercorrect/cybercorrect-complete-privacy.git"
        Write-Host ""
        Write-Host "🔄 Setting remote to HTTPS..." -ForegroundColor Cyan
        & $gitPath remote set-url origin $newUrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote URL updated successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to update remote URL" -ForegroundColor Red
            exit 1
        }
    }
    "2" {
        $newUrl = "git@github.com:cybercorrect/cybercorrect-complete-privacy.git"
        Write-Host ""
        Write-Host "🔄 Setting remote to SSH..." -ForegroundColor Cyan
        & $gitPath remote set-url origin $newUrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote URL updated successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to update remote URL" -ForegroundColor Red
            exit 1
        }
    }
    "3" {
        Write-Host ""
        Write-Host "Enter the repository URL:" -ForegroundColor Cyan
        Write-Host "Examples:" -ForegroundColor Gray
        Write-Host "  HTTPS: https://github.com/username/repo.git" -ForegroundColor Gray
        Write-Host "  SSH:   git@github.com:username/repo.git" -ForegroundColor Gray
        Write-Host ""
        $newUrl = Read-Host "Repository URL"
        
        if ([string]::IsNullOrWhiteSpace($newUrl)) {
            Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "🔄 Setting remote to custom URL..." -ForegroundColor Cyan
        & $gitPath remote set-url origin $newUrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote URL updated successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to update remote URL" -ForegroundColor Red
            exit 1
        }
    }
    "4" {
        Write-Host ""
        Write-Host "🧪 Testing remote connection..." -ForegroundColor Cyan
        
        # Test fetch
        $fetchOutput = & $gitPath fetch origin --dry-run 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote connection successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Remote connection failed" -ForegroundColor Red
            Write-Host $fetchOutput
            Write-Host ""
            Write-Host "Possible issues:" -ForegroundColor Yellow
            Write-Host "  - Repository doesn't exist at this URL" -ForegroundColor Gray
            Write-Host "  - Authentication required" -ForegroundColor Gray
            Write-Host "  - Network connectivity issues" -ForegroundColor Gray
        }
        exit 0
    }
    "5" {
        Write-Host ""
        Write-Host "🗑️  Removing existing remote..." -ForegroundColor Cyan
        & $gitPath remote remove origin 2>&1 | Out-Null
        
        Write-Host "Enter the repository URL:" -ForegroundColor Cyan
        $newUrl = Read-Host "Repository URL"
        
        if ([string]::IsNullOrWhiteSpace($newUrl)) {
            Write-Host "❌ No URL provided. Exiting." -ForegroundColor Red
            exit 1
        }
        
        Write-Host ""
        Write-Host "➕ Adding new remote..." -ForegroundColor Cyan
        & $gitPath remote add origin $newUrl
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Remote added successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to add remote" -ForegroundColor Red
            exit 1
        }
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Verify the change
Write-Host ""
Write-Host "📊 Updated remote configuration:" -ForegroundColor Cyan
$updatedRemote = & $gitPath remote -v 2>&1
Write-Host $updatedRemote
Write-Host ""

# Update branch tracking
Write-Host "🔗 Updating branch tracking..." -ForegroundColor Cyan
$currentBranch = & $gitPath branch --show-current 2>&1
if ($currentBranch) {
    & $gitPath branch --set-upstream-to=origin/$currentBranch $currentBranch 2>&1 | Out-Null
    Write-Host "✅ Branch tracking updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Remote repository link fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  - Test connection: git fetch origin" -ForegroundColor Gray
Write-Host "  - Pull changes: git pull origin main" -ForegroundColor Gray
Write-Host "  - Push changes: git push origin main" -ForegroundColor Gray

