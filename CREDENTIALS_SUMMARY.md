# Credentials Summary - CyberCorrect Privacy Platform

**Date**: 2025-02-02  
**Status**: ✅ **ALL CREDENTIALS CONFIGURED**

⚠️ **SECURITY WARNING**: This file contains sensitive credentials. Never commit this file to version control.

---

## Supabase Credentials

### Public/Client-Side Credentials (Safe for Frontend)

These credentials are safe to use in client-side code (React components, browser JavaScript):

- **VITE_SUPABASE_URL**: `https://achowlksgmwuvfbvjfrt.supabase.co`
- **VITE_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`

**Usage**: Use these in your frontend application for Supabase client initialization.

---

### Server-Side Credentials (NEVER Use in Client-Side Code)

⚠️ **CRITICAL**: These credentials have elevated permissions and should NEVER be used in client-side code.

#### Service Role Key (For Edge Functions)

- **SUPABASE_SERVICE_ROLE_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`

**Usage**: 
- ✅ Edge Functions (configure as secret in Supabase Dashboard)
- ✅ Server-side API routes
- ✅ Database migrations
- ❌ **NEVER** in client-side code

**Security**: This key bypasses Row Level Security (RLS) and has full database access.

---

#### PostgreSQL Connection String (For Direct Database Access)

- **DATABASE_URL**: `postgresql://postgres:[K1551d0ug0u@db.achowlksgmwuvfbvjfrt.supabase.co:5432/postgres`

**Usage**:
- ✅ Supabase CLI commands
- ✅ Direct database migrations
- ✅ Database administration tasks
- ✅ Local development with direct DB access
- ❌ **NEVER** in client-side code

**Security**: This contains your database password. Keep it secure.

---

## Environment Variables Setup

### Local Development (`.env` file)

Create a `.env` file in your project root:

```env
# Public/Client-Side Credentials (Safe for Frontend)
VITE_SUPABASE_URL=https://achowlksgmwuvfbvjfrt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo

# Server-Side Credentials (For Edge Functions and Migrations)
# ⚠️ NEVER use these in client-side code
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I
DATABASE_URL=postgresql://postgres:[K1551d0ug0u@db.achowlksgmwuvfbvjfrt.supabase.co:5432/postgres
```

**Note**: The `.env` file is already in `.gitignore` and will not be committed to version control.

---

## Production Deployment

### Vercel/Netlify Environment Variables

For production deployment, configure these environment variables in your hosting platform:

#### Required (Client-Side)

- `VITE_SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo`

#### Edge Functions (Configure in Supabase Dashboard)

For Edge Functions, configure these as secrets in Supabase Dashboard (not in Vercel/Netlify):

- `SUPABASE_URL` = `https://achowlksgmwuvfbvjfrt.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I`

See `CONFIGURE_EDGE_FUNCTION_SECRETS.md` for detailed instructions.

---

## Security Best Practices

### ✅ DO

- ✅ Use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in client-side code
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only in Edge Functions (server-side)
- ✅ Keep `.env` file in `.gitignore`
- ✅ Use environment variables in hosting platforms
- ✅ Rotate keys if compromised
- ✅ Review access to credentials regularly

### ❌ DON'T

- ❌ Never use `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- ❌ Never commit credentials to version control
- ❌ Never share credentials publicly
- ❌ Never expose `DATABASE_URL` in client-side code
- ❌ Never hardcode credentials in source code

---

## Verification

### Test Connection

After setting up your `.env` file, test the connection:

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

---

## Next Steps

1. ✅ **Credentials** - All credentials configured
2. ⚠️ **Database Migrations** - Apply migrations in Supabase (see `APPLY_MIGRATIONS.md`)
3. ⚠️ **Edge Function Secrets** - Configure secrets in Supabase Dashboard (see `CONFIGURE_EDGE_FUNCTION_SECRETS.md`)
4. ⚠️ **Production Deployment** - Deploy with environment variables configured

---

**Status**: ✅ **All credentials configured and ready**

**Last Updated**: 2025-02-02

