# CyberCorrect Remote Connection Setup Guide

## Problem: Application Not Connected to Remote Database

If CyberCorrect is not connecting to the remote Supabase database, follow these steps to fix it.

## Quick Fix Steps

### 1. Create Environment File

Create a `.env` file in the project root (`cybercorrect-complete-privacy/.env`) with the following content:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### 3. Verify Connection

Run the connection verification script:

```bash
cd apps/privacy-portal
npm run verify:connection
```

Or from the root:

```bash
npm run verify:connection --workspace=@cybercorrect/privacy-portal
```

## Detailed Troubleshooting

### Check Current Status

The verification script will:
- ✅ Test network connectivity
- ✅ Verify credentials are valid
- ✅ Test database connection
- ✅ Check schema access
- ✅ Identify specific issues

### Common Issues and Solutions

#### Issue: "Missing required environment variables"

**Solution:**
1. Create `.env` file in project root
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Restart your development server

#### Issue: "Connection failed" or "Network connectivity failed"

**Solution:**
1. Check your internet connection
2. Verify firewall/proxy settings aren't blocking Supabase
3. Test accessing `https://app.supabase.com` in your browser
4. Try accessing your Supabase project URL directly

#### Issue: "Invalid credentials"

**Solution:**
1. Double-check you copied the correct values from Supabase Dashboard
2. Ensure there are no extra spaces or quotes in your `.env` file
3. Verify your Supabase project is active (not paused)
4. Regenerate API keys if needed from Supabase Dashboard

#### Issue: "Schema access failed" or "Tables do not exist"

**Solution:**
1. Run database migrations:
   ```bash
   cd apps/privacy-portal
   npm run setup:backend
   ```
2. Or apply migrations manually via Supabase Dashboard SQL Editor

#### Issue: "RLS policies may be blocking access"

**Solution:**
1. Check Row Level Security policies in Supabase Dashboard
2. Ensure your anon key has appropriate permissions
3. Review RLS policies for the `cybercorrect` schema

## Environment File Location

The `.env` file should be located at:
```
cybercorrect-complete-privacy/
  └── .env
```

**Important:** Never commit your `.env` file to Git! It's already in `.gitignore`.

## For Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your deployment platform's dashboard
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy your application

### Platform-Specific Instructions

**Vercel:**
- Settings → Environment Variables
- Add variables for Production, Preview, and Development
- Redeploy

**Netlify:**
- Site settings → Environment variables
- Add variables
- Trigger a new deploy

## Verification Checklist

After setup, verify:

- [ ] `.env` file exists in project root
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] Connection verification script passes
- [ ] Application shows "Connected" status (not "Demo Mode")
- [ ] Database operations work (create, read, update)

## Still Having Issues?

1. Run the verification script and check the detailed output
2. Check browser console for specific error messages
3. Review Supabase Dashboard → Logs for connection attempts
4. Verify your Supabase project is not paused or deleted

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Environment Setup Guide](./ENV_SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

