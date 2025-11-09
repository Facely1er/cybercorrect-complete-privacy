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

## How to Get Your Values

### Supabase Credentials
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

### Sentry DSN (Optional)
1. Go to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. Navigate to **Settings** → **Client Keys (DSN)**
4. Copy the DSN value

### Stripe Keys (Optional)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy the **Publishable key** for `VITE_STRIPE_PUBLISHABLE_KEY`

## How to Configure

### Vercel
1. Go to: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → **Settings** → **Environment Variables**
2. Click **Add New** for each variable
3. Enter the variable name (e.g., `VITE_SUPABASE_URL`)
4. Enter the variable value
5. Select environment: **Production** (and **Preview** if needed)
6. Click **Save**
7. **Important**: Redeploy your application after adding variables
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

### Netlify
1. Go to: [Netlify Dashboard](https://app.netlify.com) → Your Site → **Site settings** → **Environment variables**
2. Click **Add variable** for each variable
3. Enter the variable name (e.g., `VITE_SUPABASE_URL`)
4. Enter the variable value
5. Click **Save**
6. **Important**: Redeploy your site after adding variables
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

### Other Platforms
For other hosting platforms (AWS Amplify, Cloudflare Pages, etc.):
1. Consult your platform's documentation for setting environment variables
2. Ensure variables are available at **build time** (Vite requires `VITE_` prefix)
3. Redeploy after adding variables

## Verification

After setting environment variables and redeploying:

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

## Security Best Practices

⚠️ **IMPORTANT**: 
- **Never commit** actual environment variable values to version control
- **Never share** your API keys publicly
- **Use different keys** for development and production
- **Rotate keys** if compromised
- **Review access** to your environment variables regularly

---

**Status**: Template ready for use. Replace placeholders with your actual values before deployment.

