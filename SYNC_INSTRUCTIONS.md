# Sync CyberCorrect Repository - Pull and Push Instructions

## Quick Sync Commands

Since Git is not currently in your PATH, here are the commands to run manually:

### Option 1: If Git is installed but not in PATH

1. **Open Git Bash** (if installed via Git for Windows)
   - Navigate to: `C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy`
   - Run the commands below

2. **Or add Git to PATH** and restart PowerShell:
   - Git is usually installed at: `C:\Program Files\Git\bin\`
   - Add this to your PATH environment variable

### Option 2: Use PowerShell Script

Run the provided sync script:

```powershell
cd "C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy"
.\scripts\sync-repo.ps1
```

## Manual Git Commands

Once Git is accessible, run these commands:

```bash
# Navigate to repository
cd "C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy"

# Check status
git status

# Pull latest changes from remote
git pull origin main

# If you have local changes to commit first:
git add .
git commit -m "Your commit message"
git push origin main

# Or push directly if already committed:
git push origin main
```

## Step-by-Step Process

### 1. Pull Latest Changes

```bash
git pull origin main
```

This will:
- Fetch changes from `https://github.com/cybercorrect/cybercorrect-complete-privacy.git`
- Merge them into your local `main` branch

**If there are conflicts:**
- Git will show which files have conflicts
- Resolve conflicts manually
- Then run: `git add .` and `git commit`

### 2. Push Your Changes

```bash
git push origin main
```

This will:
- Upload your local commits to the remote repository
- Update the remote `main` branch

**If push is rejected:**
- Someone else may have pushed changes
- Pull again: `git pull origin main`
- Resolve any conflicts
- Push again: `git push origin main`

## Verify Sync Status

Check if your branch is in sync:

```bash
# Check remote status
git remote -v

# Check branch tracking
git branch -vv

# Check for unpushed commits
git log origin/main..main

# Check for unpulled commits
git log main..origin/main
```

## Troubleshooting

### "Git is not recognized"

**Solution:** Install Git or add it to PATH
- Download: https://git-scm.com/download/win
- Or use GitHub Desktop: https://desktop.github.com/

### "Authentication failed"

**Solution:** Set up authentication
- Use Personal Access Token (not password)
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

### "Branch is behind"

**Solution:** Pull first, then push
```bash
git pull origin main
git push origin main
```

### "Merge conflicts"

**Solution:** Resolve conflicts manually
1. Open conflicted files
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Resolve conflicts
4. Stage resolved files: `git add .`
5. Commit: `git commit -m "Resolved conflicts"`
6. Push: `git push origin main`

## Current Repository Configuration

- **Remote**: `origin`
- **URL**: `https://github.com/cybercorrect/cybercorrect-complete-privacy.git`
- **Branch**: `main` → tracking `origin/main`

## Using GitHub Desktop (Alternative)

If you prefer a GUI:

1. Install GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. File → Add Local Repository
4. Select: `C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy`
5. Click "Pull origin" to pull changes
6. Click "Push origin" to push changes

