# Fix CyberCorrect Remote Repository Link

## Quick Fix

Run the fix script:

**PowerShell:**
```powershell
cd "C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy"
.\scripts\fix-remote.ps1
```

**Batch File:**
```cmd
cd "C:\Users\facel\Downloads\GitHub\cybercorrect-complete-privacy"
scripts\fix-remote.bat
```

## Manual Fix Methods

### Method 1: Using Git Command Line

```bash
# Check current remote
git remote -v

# Update to HTTPS
git remote set-url origin https://github.com/cybercorrect/cybercorrect-complete-privacy.git

# Or update to SSH
git remote set-url origin git@github.com:cybercorrect/cybercorrect-complete-privacy.git

# Or use custom URL
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Verify
git remote -v
```

### Method 2: Edit .git/config Directly

Edit `.git/config` and update the remote URL:

```ini
[remote "origin"]
    url = https://github.com/cybercorrect/cybercorrect-complete-privacy.git
    fetch = +refs/heads/*:refs/remotes/origin/*
```

### Method 3: Remove and Re-add Remote

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/cybercorrect/cybercorrect-complete-privacy.git

# Set upstream tracking
git branch --set-upstream-to=origin/main main
```

## Common Repository URLs

### Default (HTTPS)
```
https://github.com/cybercorrect/cybercorrect-complete-privacy.git
```

### SSH
```
git@github.com:cybercorrect/cybercorrect-complete-privacy.git
```

### Fork (replace YOUR_USERNAME)
```
https://github.com/YOUR_USERNAME/cybercorrect-complete-privacy.git
```

## Verify Remote is Working

```bash
# Test connection
git fetch origin --dry-run

# Check remote info
git remote show origin

# List all remotes
git remote -v
```

## Troubleshooting

### "Repository not found"

**Possible causes:**
- Repository doesn't exist at that URL
- Repository is private and you're not authenticated
- Wrong username/organization name

**Solution:**
- Verify the repository exists on GitHub
- Check your GitHub authentication
- Use the correct repository URL

### "Authentication failed"

**Solution:**
- Use Personal Access Token instead of password
- Set up SSH keys for SSH URLs
- Use GitHub CLI: `gh auth login`

### "Permission denied"

**Solution:**
- Check you have access to the repository
- Verify your GitHub account permissions
- Use correct authentication method

## Current Configuration

Your repository is currently configured with:

- **Remote name**: `origin`
- **Current URL**: `https://github.com/cybercorrect/cybercorrect-complete-privacy.git`
- **Branch**: `main` → tracking `origin/main`

## After Fixing

Once the remote is fixed:

1. **Test the connection:**
   ```bash
   git fetch origin
   ```

2. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

3. **Push your changes:**
   ```bash
   git push origin main
   ```

