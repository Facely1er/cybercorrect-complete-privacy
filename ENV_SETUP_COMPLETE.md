# Environment Variables Setup - Complete ✅

**Date**: 2025-02-02  
**Status**: ✅ **CONFIGURED AND VERIFIED**

---

## Supabase Connection Verified ✅

Your Supabase credentials have been configured and tested successfully.

### Test Results

```
✅ Connection: Working
✅ Tables accessible: 2/2
   - cc_privacy_consent_records - Accessible
   - cc_privacy_subscriptions - Accessible
✅ Authentication: Working
```

### Configured Credentials

- **VITE_SUPABASE_URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: Configured and verified
- **SUPABASE_SERVICE_ROLE_KEY**: Configured (for Edge Functions and server-side operations)
- **PostgreSQL Connection String**: Configured (for database migrations and direct access)

---

## Local Development Setup

### Create `.env` File

Create a `.env` file in the project root with the following content:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo

# Error Monitoring (OPTIONAL)
# VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Payment Processing (OPTIONAL)
# VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Analytics (OPTIONAL)
# VITE_ENABLE_ANALYTICS=false
# VITE_ANALYTICS_ID=your-analytics-id

# Error Monitoring Endpoint (OPTIONAL)
# VITE_ERROR_MONITORING_ENDPOINT=https://your-error-monitoring-endpoint.com/api/errors

# App Version (OPTIONAL)
# VITE_APP_VERSION=1.0.0

# PostgreSQL Connection String (for migrations and direct DB access)
# DATABASE_URL=postgresql://postgres:[K1551d0ug0u@db.achowlksgmwuvfbvjfrt.supabase.co:5432/postgres

# Supabase Service Role Key (for Edge Functions and server-side operations)
# ⚠️ NEVER use this in client-side code - it bypasses RLS and has full database access
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

**Note**: The `.env` file is already in `.gitignore` and will not be committed to version control.

### Supabase Service Role Key (For Edge Functions)

⚠️ **CRITICAL SECURITY WARNING**: The Service Role Key has **full database access** and **bypasses Row Level Security (RLS)**. 

**NEVER**:
- ❌ Use this in client-side code (React components, browser JavaScript)
- ❌ Commit this to version control
- ❌ Expose this in public repositories
- ❌ Share this publicly

**ONLY** use this for:
- ✅ Edge Functions (server-side)
- ✅ Server-side API routes
- ✅ Database migrations
- ✅ Administrative scripts

If you need to use the Service Role Key for Edge Functions, add it to your `.env` file:

```env
# Supabase Service Role Key (for Edge Functions only)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
```

**For Edge Functions**: Configure this as a secret in Supabase Dashboard (see `CONFIGURE_EDGE_FUNCTION_SECRETS.md`).

### PostgreSQL Connection String (Optional - for Advanced Use)

If you need direct database access (for migrations, CLI tools, or database administration), add this to your `.env` file:

```env
# PostgreSQL Connection String (for Supabase CLI and direct DB access)
DATABASE_URL=postgresql://postgres:[K1551d0ug0u@db.achowlksgmwuvfbvjfrt.supabase.co:5432/postgres
```

**⚠️ SECURITY WARNING**: 
- This connection string contains your database password
- **NEVER commit this to version control**
- Only use this for local development or CI/CD pipelines
- The `.env` file is already in `.gitignore` and will not be committed

**When to Use**:
- Running Supabase CLI commands locally
- Direct database migrations
- Database administration tasks
- Local development with direct DB access

**When NOT to Use**:
- Frontend application code (use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` instead)
- Client-side code (never expose database credentials)
- Production deployments (use environment variables in hosting platform)

---

## Production Deployment Setup

### Vercel

1. Go to: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Settings** → **Environment Variables**
2. Add the following variables:
   - **Name**: `VITE_SUPABASE_URL`
     - **Value**: `https://achowlksgmwuvfbvjfrt.supabase.co`
     - **Environment**: Production, Preview, Development
   - **Name**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`
     - **Environment**: Production, Preview, Development
3. Click **Save**
4. **Important**: Redeploy your application
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

### Netlify

1. Go to: [Netlify Dashboard](https://app.netlify.com) → Your Site → **Site settings** → **Environment variables**
2. Add the following variables:
   - **Key**: `VITE_SUPABASE_URL`
     - **Value**: `https://achowlksgmwuvfbvjfrt.supabase.co`
     - **Scopes**: All scopes
   - **Key**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`
     - **Scopes**: All scopes
3. Click **Save**
4. **Important**: Redeploy your site
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Other Platforms

For other hosting platforms (AWS Amplify, Cloudflare Pages, etc.):
1. Consult your platform's documentation for setting environment variables
2. Ensure variables are available at **build time** (Vite requires `VITE_` prefix)
3. Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
4. Redeploy after adding variables

---

## Verification

### Test Connection Locally

After creating your `.env` file, test the connection:

```bash
npm run supabase:test
```

You should see:
```
✅ Connection: Working
✅ Tables accessible: 2/2
✅ Authentication: Working
🎉 Supabase connection is working!
```

### Test in Production

After deploying with environment variables:

1. **Check browser console** (F12 → Console tab)
   - Should see no errors about missing environment variables
   - If you see warnings, verify variable names and values

2. **Test application functionality**
   - Verify Supabase connection works
   - Test authentication (if enabled)
   - Verify data operations work correctly

3. **Check deployment logs**
   - Review build logs for any environment variable warnings
   - Ensure all variables are being read correctly

---

## Security Best Practices

⚠️ **IMPORTANT**: 
- ✅ `.env` file is in `.gitignore` - will not be committed
- ✅ Never commit actual environment variable values to version control
- ✅ Never share your API keys publicly
- ✅ Use different keys for development and production (if needed)
- ✅ Rotate keys if compromised
- ✅ Review access to your environment variables regularly

---

## Next Steps

1. ✅ **Environment Variables** - Configured and verified
   - ✅ `VITE_SUPABASE_URL` - Configured
   - ✅ `VITE_SUPABASE_ANON_KEY` - Configured
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` - Available for Edge Functions
   - ✅ `DATABASE_URL` - Available for migrations
2. ⚠️ **Database Migrations** - Apply migrations in Supabase (if not already applied)
3. ⚠️ **Edge Function Secrets** - Configure secrets for edge functions (use `SUPABASE_SERVICE_ROLE_KEY` above)
4. ⚠️ **Deploy to Production** - Deploy with environment variables configured

---

**Status**: ✅ **Environment variables configured and Supabase connection verified**

**Last Updated**: 2025-02-02

