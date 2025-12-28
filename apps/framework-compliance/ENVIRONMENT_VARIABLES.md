# Environment Variables Reference - One-Time Payment System

## Required Environment Variables

### Frontend (Client-Side)

These variables are exposed to the browser and must be prefixed with `VITE_`:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGc...` | ✅ Yes |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_live_...` or `pk_test_...` | ✅ Yes |
| `VITE_SITE_URL` | Production site URL | `https://www.cybercorrect.com` | ✅ Yes |
| `VITE_RSS_AGGREGATOR_URL` | RSS Aggregator API endpoint | `https://api.cybercorrect.com/rss-aggregator/regulatory-updates` | ⚠️ Optional (defaults to production URL) |

### Backend (Edge Functions)

These are set as secrets in Supabase Edge Functions:

| Secret Name | Description | Example | Required |
|------------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_live_...` or `sk_test_...` | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` | ✅ Yes (for webhook) |
| `SITE_URL` | Production site URL | `https://www.cybercorrect.com` | ✅ Yes |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | ⚠️ Optional |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | `eyJhbGc...` | ⚠️ Optional |
| `RSS_AGGREGATOR_URL` | RSS Aggregator API endpoint for Edge Functions | `https://api.cybercorrect.com/rss-aggregator/regulatory-updates` | ⚠️ Optional (defaults to production URL) |

---

## Environment Setup

### Development (.env.local)

Create `apps/framework-compliance/.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# Site
VITE_SITE_URL=http://localhost:5173

# RSS Aggregator (Optional - defaults to production URL)
VITE_RSS_AGGREGATOR_URL=https://api.cybercorrect.com/rss-aggregator/regulatory-updates
```

### Production

Set these in your deployment platform (Vercel, Netlify, etc.):

```bash
# Supabase (Production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Stripe (Production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key

# Site (Production)
VITE_SITE_URL=https://www.cybercorrect.com

# RSS Aggregator (Production)
VITE_RSS_AGGREGATOR_URL=https://api.cybercorrect.com/rss-aggregator/regulatory-updates
```

---

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` or `.env.production` to version control
- Add to `.gitignore`:
  ```
  .env.local
  .env.production
  .env*.local
  ```
- Use production keys only in production environment
- Rotate keys if accidentally exposed

---

## Verification

### Check Environment Variables

```bash
# In browser console (after app loads)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
console.log('Site URL:', import.meta.env.VITE_SITE_URL);
```

### Verify Edge Function Secrets

1. Go to Supabase Dashboard → Edge Functions
2. Select function → Settings → Secrets
3. Verify all required secrets are set

---

## Troubleshooting

### "Stripe not configured"
- Check `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Verify key starts with `pk_live_` or `pk_test_`
- Check key is not expired or revoked

### "Supabase not configured"
- Check `VITE_SUPABASE_URL` is set
- Verify `VITE_SUPABASE_ANON_KEY` is set
- Test Supabase connection

### "Edge Function error"
- Check Edge Function secrets are set
- Verify `STRIPE_SECRET_KEY` is correct
- Check Edge Function logs for details

---

**Last Updated:** 2025-01-27

