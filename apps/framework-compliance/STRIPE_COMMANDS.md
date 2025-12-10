# 🛠️ Stripe Setup Commands Reference

Quick reference for all Stripe-related commands.

## 📋 Setup Commands

### Generate Configuration Files
```powershell
npm run stripe:auto
```
Generates all configuration files with ready-to-use values.

### Verify Setup Status
```powershell
npm run stripe:verify
```
Checks what's configured and what's missing.

### Interactive Checklist
```powershell
npm run stripe:checklist
```
Guides you through completing the setup step-by-step.

### Test Integration
```powershell
npm run stripe:test
```
Tests that Edge Functions are deployed and accessible.

## 🔧 Advanced Commands

### Get Stripe Price IDs
```powershell
npm run stripe:prices
```
Fetches current Price IDs from Stripe.

### Direct Setup (Requires Login)
```powershell
npm run stripe:direct
```
Attempts direct setup via Management API (requires authentication).

### Quick Setup (Interactive)
```powershell
npm run stripe:quick
```
Interactive script that prompts for API keys.

## 📖 Documentation Files

- `STRIPE_SETUP_COMPLETE.md` - **START HERE** - Complete guide
- `STRIPE_QUICK_START.md` - Quick reference
- `STRIPE_READY.md` - Status summary
- `stripe-secrets-config.json` - All secrets in JSON

## 🎯 Typical Workflow

1. **Generate configs:**
   ```powershell
   npm run stripe:auto
   ```

2. **Follow setup guide:**
   - Open `STRIPE_SETUP_COMPLETE.md`
   - Complete steps in Supabase Dashboard

3. **Verify progress:**
   ```powershell
   npm run stripe:verify
   ```

4. **Test after setup:**
   ```powershell
   npm run stripe:test
   ```

## 🆘 Troubleshooting

If something doesn't work:
1. Run `npm run stripe:verify` to check status
2. Check Supabase function logs
3. Check Stripe Dashboard → Webhooks → Recent events
4. Review `STRIPE_SETUP_COMPLETE.md` troubleshooting section

