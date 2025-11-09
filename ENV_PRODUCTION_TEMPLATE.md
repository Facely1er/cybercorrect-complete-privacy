# Production Environment Variables Template

## Required Environment Variables

Copy these to your hosting platform (Vercel/Netlify) environment variables:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Optional Environment Variables

```env
# Error Monitoring (OPTIONAL)
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Payment Processing (OPTIONAL)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here

# Analytics (OPTIONAL)
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=your-analytics-id

# Error Monitoring Endpoint (OPTIONAL)
VITE_ERROR_MONITORING_ENDPOINT=https://your-error-monitoring-endpoint.com/api/errors

# App Version (OPTIONAL)
VITE_APP_VERSION=1.0.0
```

## How to Configure

### Vercel
1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable
3. Select environment: Production (and Preview if needed)
4. Redeploy after adding variables

### Netlify
1. Go to: Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add each variable
3. Redeploy after adding variables

---

**Note**: Never commit actual environment variable values to version control.

