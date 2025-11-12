# Environment Variables Setup Guide

## Critical: Fixing Blank Page Issues

If your deployment shows blank pages, it's likely due to missing environment variables. This guide will help you fix that.

## Required Environment Variables

Your application **requires** these environment variables to function:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### How to Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

## Production Environment Variables

For production deployment, configure these additional optional variables:

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

### How to Get Optional Values

**Sentry DSN:**
1. Go to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. Navigate to **Settings** → **Client Keys (DSN)**
4. Copy the DSN value

**Stripe Keys:**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy the **Publishable key** for `VITE_STRIPE_PUBLISHABLE_KEY`

## Optional Environment Variables

```bash
# Analytics (optional)
VITE_ENABLE_ANALYTICS=false
VITE_ANALYTICS_ID=

# Error Monitoring (optional)
VITE_ERROR_MONITORING_ENDPOINT=

# Chat Support (optional)
VITE_ENABLE_CHAT_SUPPORT=false

# Environment
NODE_ENV=production
```

## Deployment Platform Configuration

### Netlify

1. Go to your site's dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the required variables:
   - Key: `VITE_SUPABASE_URL`, Value: `your-supabase-url`
   - Key: `VITE_SUPABASE_ANON_KEY`, Value: `your-anon-key`
4. **Important**: Redeploy your site after adding variables

### Vercel

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the required variables for Production, Preview, and Development
4. Redeploy your application

### Other Platforms

For other platforms, consult their documentation on setting environment variables. Make sure to:
- Add all required variables
- Redeploy after adding variables
- Ensure variables are available at build time (prefix with `VITE_`)

## Local Development

Create a `.env` file in your project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CHAT_SUPPORT=false
```

**Note**: Never commit your `.env` file to Git! It should be in `.gitignore`.

## Verification

After setting environment variables and redeploying:

1. Open your browser's Developer Console (F12)
2. Check the Console tab for any warnings about missing variables
3. If you see warnings, double-check your environment variable names and redeploy

## Recent Fixes Applied

The following improvements were made to prevent blank pages:

1. **Graceful Environment Variable Handling**: The app now shows warnings instead of crashing when environment variables are missing
2. **Lazy Supabase Initialization**: Supabase client is now initialized on first use, not at module load time
3. **Better Error Messages**: More helpful error messages in the console to guide configuration

## Troubleshooting

### Still seeing blank pages?

1. **Clear browser cache and hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser console** for any JavaScript errors
3. **Verify environment variables** are correctly set in your deployment platform
4. **Ensure you redeployed** after adding environment variables
5. **Check build logs** for any errors during the build process

### Common Issues

- **Typo in variable names**: Must be exactly `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Variables not available at build time**: Vite requires the `VITE_` prefix
- **Didn't redeploy**: Changes to environment variables require a new deployment
- **Cached old build**: Clear browser cache and hard refresh

## Support

If you continue to experience issues after following this guide:

1. Check browser console for specific error messages
2. Review deployment platform logs
3. Verify Supabase credentials are correct and project is active

