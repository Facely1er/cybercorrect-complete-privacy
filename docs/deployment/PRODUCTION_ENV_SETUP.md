# Production Environment Variables Setup

## Critical: Configure Supabase Database Credentials

This project uses **Supabase** (not Bolt Database) as its backend database. You must configure the following environment variables for production deployment.

## Required Environment Variables

### 1. Supabase Configuration (MANDATORY)

```bash
# Replace with your actual Supabase project credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### 2. Application Configuration

```bash
VITE_APP_NAME=CyberCorrect
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=production
NODE_ENV=production
```

## Optional Environment Variables

### Error Monitoring (Recommended for Production)

```bash
# Configure Sentry, LogRocket, or similar service
VITE_ERROR_MONITORING_ENDPOINT=https://your-sentry-dsn-here
```

**Popular Error Monitoring Services:**
- **Sentry**: `https://your-dsn@sentry.io/project-id`
- **LogRocket**: `https://api.logrocket.com/api/v1/logs`
- **Bugsnag**: `https://notify.bugsnag.com/js`

### Analytics (Optional)

```bash
VITE_ANALYTICS_ID=your_analytics_id_here
VITE_ENABLE_ANALYTICS=true
```

### Feature Flags

```bash
VITE_ENABLE_CHAT_SUPPORT=true
```

## Deployment Platform Configuration

### Netlify
1. Go to Site Settings → Environment Variables
2. Add all required variables
3. **Important**: Redeploy after adding variables

### Vercel
1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Redeploy application

### Other Platforms
- Ensure variables are available at build time
- Prefix with `VITE_` for Vite to include them in the build
- Redeploy after adding variables

## Security Checklist

- [ ] Supabase URL and key configured
- [ ] Error monitoring endpoint configured (recommended)
- [ ] Environment variables are secure (not committed to git)
- [ ] Database RLS policies are active
- [ ] Security migration applied

## Next Steps

1. Configure environment variables
2. Apply database migration (`supabase/migrations/20250130000000_improve_security.sql`)
3. Set up error monitoring service
4. Deploy to staging for testing
5. Deploy to production

## Troubleshooting

**Blank pages after deployment?**
- Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured
- Verify Supabase project is active and accessible
- Check browser console for error messages
- Ensure environment variables are set for the correct environment (Production/Preview/Development)
