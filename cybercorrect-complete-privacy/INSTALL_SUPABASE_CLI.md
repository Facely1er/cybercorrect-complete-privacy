# Install Supabase CLI - Windows/Git Bash Guide

## ⚠️ Important

Supabase CLI **does not support** global npm installation anymore. Use one of these methods instead.

## 🚀 Installation Methods

### Method 1: Using Scoop (Recommended for Windows)

**Scoop** is a Windows package manager. Install it first, then install Supabase CLI.

#### Step 1: Install Scoop

Open PowerShell (as Administrator) and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

#### Step 2: Install Supabase CLI

```powershell
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Step 3: Verify Installation

```bash
supabase --version
```

### Method 2: Using npx (No Installation Required)

You can use Supabase CLI without installing it globally using `npx`:

```bash
# Login
npx supabase login

# Link project
npx supabase link --project-ref your-project-ref

# Deploy functions
npx supabase functions deploy send-email-notification
npx supabase functions deploy stripe-webhook
npx supabase functions deploy generate-automated-reports
npx supabase functions deploy run-scheduled-assessments
npx supabase functions deploy track-compliance-health
npx supabase functions deploy check-regulatory-updates
```

### Method 3: Download Binary Directly

1. Go to: https://github.com/supabase/cli/releases
2. Download the Windows binary (`.exe` file)
3. Add it to your PATH or use it directly

### Method 4: Using Chocolatey (If you have it)

```bash
choco install supabase
```

## 🎯 Quick Start with npx (Easiest)

Since you're having installation issues, use `npx` - it doesn't require installation:

```bash
# Step 1: Login
npx supabase login

# Step 2: Link project
npx supabase link --project-ref achowlksgmwuvfbvjfrt

# Step 3: Deploy all functions
npx supabase functions deploy send-email-notification
npx supabase functions deploy stripe-webhook
npx supabase functions deploy generate-automated-reports
npx supabase functions deploy run-scheduled-assessments
npx supabase functions deploy track-compliance-health
npx supabase functions deploy check-regulatory-updates
```

## 📝 All Commands with npx (Copy-Paste)

Copy and paste this entire block:

```bash
npx supabase login && \
npx supabase link --project-ref achowlksgmwuvfbvjfrt && \
npx supabase functions deploy send-email-notification && \
npx supabase functions deploy stripe-webhook && \
npx supabase functions deploy generate-automated-reports && \
npx supabase functions deploy run-scheduled-assessments && \
npx supabase functions deploy track-compliance-health && \
npx supabase functions deploy check-regulatory-updates
```

## 🔍 Verify Installation

After installation (or using npx), verify it works:

```bash
# Check version
npx supabase --version

# Or if installed via Scoop
supabase --version
```

## 🐛 Troubleshooting

### npx Command Not Found?

Make sure Node.js is installed:

```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

### Scoop Installation Issues?

1. Make sure PowerShell is run as Administrator
2. Check execution policy:
   ```powershell
   Get-ExecutionPolicy
   ```
3. If needed, set it:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Still Having Issues?

Use **npx** - it's the easiest method and doesn't require any installation!

## ✅ Recommended Approach

**For Windows/Git Bash users**: Use `npx` - it's the simplest and doesn't require installation.

Just prefix all commands with `npx`:

```bash
npx supabase login
npx supabase link --project-ref achowlksgmwuvfbvjfrt
npx supabase functions deploy [function-name]
```

## 📚 Official Documentation

- **Supabase CLI Installation**: https://github.com/supabase/cli#install-the-cli
- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli

---

**Use `npx` to avoid installation issues!** 🚀

