# ⚡ Quick Start: Production Deployment

**Time to Live**: 2-3 hours
**Current Status**: ✅ Everything ready, just follow these steps

---

## 🚀 Step-by-Step Guide

### Step 1: Create Supabase Project (15 min)

```bash
# 1. Go to https://app.supabase.com
# 2. Click "New Project"
# 3. Fill in:
#    - Name: cybercorrect-production
#    - Database Password: (generate and save securely)
#    - Region: (closest to your users)
# 4. Wait ~2 minutes for provisioning
```

**Get your credentials:**
- Go to Settings → API
- Copy **Project URL** (e.g., `https://abcdefgh.supabase.co`)
- Copy **anon public key** (long JWT token starting with `eyJ...`)
- Save both securely

---

### Step 2: Apply Database Migrations (15 min)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (you'll need the project ref from your URL)
# If URL is https://abcdefgh.supabase.co, ref is "abcdefgh"
supabase link --project-ref abcdefgh

# Apply Framework Compliance migrations
cd apps/framework-compliance
supabase db push

# Apply Privacy Portal migrations
cd ../privacy-portal
supabase db push
```

**Verify:**
- Go to Supabase Dashboard → Database → Tables
- You should see 30+ tables
- All should have RLS enabled (green shield icon)

---

### Step 3: Configure Environment (10 min)

**Framework Compliance:**
```bash
cd apps/framework-compliance

# Copy template
cp .env.production.example .env.production

# Edit and fill in:
nano .env.production
```

**Required changes:**
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx_YOUR_ANON_KEY
VITE_APP_URL=https://platform.cybercorrect.com  # or your domain
```

**Privacy Portal:**
```bash
cd ../privacy-portal

# Copy template
cp .env.production.example .env.production

# Edit and fill in:
nano .env.production
```

**Required changes:**
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx_YOUR_ANON_KEY
VITE_APP_URL=https://portal.cybercorrect.com  # or your domain
```

---

### Step 4: Deploy to Vercel (30 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy Framework Compliance
cd apps/framework-compliance
vercel --prod
# Follow prompts, say yes to deploy

# Deploy Privacy Portal
cd ../privacy-portal
vercel --prod
# Follow prompts, say yes to deploy
```

**Add environment variables in Vercel:**

For each project:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables (copy from your .env.production):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL`
   - `VITE_ENVIRONMENT` = `production`
   - All other variables from .env.production

3. Redeploy to apply:
   ```bash
   vercel --prod
   ```

**Configure domains:**
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `platform.cybercorrect.com`)
3. Configure DNS at your registrar:
   ```
   platform.cybercorrect.com  CNAME  cname.vercel-dns.com
   portal.cybercorrect.com    CNAME  cname.vercel-dns.com
   ```
4. Wait for SSL (~5 min)

---

### Step 5: Verify Deployment (30 min)

**Quick Tests:**

1. **Open your platform** (e.g., `https://platform.cybercorrect.com`)
   - [ ] Homepage loads
   - [ ] No console errors (press F12 → Console)
   - [ ] Green padlock (HTTPS)

2. **Create test account**
   - [ ] Sign up works
   - [ ] Email confirmation received
   - [ ] Can login

3. **Test core feature**
   - [ ] Go to Privacy Gap Analyzer
   - [ ] Create new assessment
   - [ ] Save data
   - [ ] Logout and login
   - [ ] Data still there ✅

4. **Check other app** (Privacy Portal)
   - [ ] Repeat tests at `https://portal.cybercorrect.com`

**Performance Test:**
1. Open Chrome DevTools (F12)
2. Lighthouse tab → Generate report
3. Check scores:
   - Performance: Should be > 90
   - Accessibility: Should be > 95
   - Best Practices: Should be > 95
   - SEO: Should be > 90

---

## ✅ You're Live!

If all tests pass, congratulations! 🎉

**Your platform is now:**
- ✅ Live on the internet
- ✅ Secure (HTTPS + RLS)
- ✅ Backed by cloud database
- ✅ Ready for users

---

## 📊 Next Steps

### Set Up Monitoring (Optional, 30 min)

**Sentry (Error Monitoring):**
1. Go to https://sentry.io
2. Create account → New project → React
3. Copy DSN
4. Add to Vercel environment variables:
   - `VITE_SENTRY_DSN` = your DSN
   - `VITE_ENABLE_ERROR_REPORTING` = `true`
5. Redeploy

**Google Analytics:**
1. Go to https://analytics.google.com
2. Create GA4 property
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to Vercel environment variables:
   - `VITE_ANALYTICS_ID` = your ID
   - `VITE_ENABLE_ANALYTICS` = `true`
5. Redeploy

---

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Verify in Vercel environment variables
- Redeploy after changing

### "Page not found" or 404
- Check domain DNS is configured correctly
- Wait up to 48 hours for DNS propagation
- Test with Vercel preview URL first

### "Database error" or RLS issues
- Verify migrations were applied: `supabase migration list`
- Check RLS is enabled in Supabase Dashboard
- Re-run migrations if needed

### Build fails
- Check all environment variables are set
- Review Vercel build logs
- Try building locally first: `npm run build`

---

## 📞 Need Help?

1. **Check detailed guide**: `/PRODUCTION_DEPLOYMENT_GUIDE.md`
2. **Check checklist**: `/DEPLOYMENT_CHECKLIST.md`
3. **Review logs**:
   - Vercel: `vercel logs [deployment-url]`
   - Browser: F12 → Console
   - Supabase: Dashboard → Logs

---

## 🎯 Time Estimate

| Step | Time |
|------|------|
| Supabase setup | 15 min |
| Apply migrations | 15 min |
| Configure env vars | 10 min |
| Deploy to Vercel | 30 min |
| Verify deployment | 30 min |
| **Total** | **~2 hours** |

**Add 30 min** if setting up optional monitoring

---

**Current Status**: ✅ Ready to start
**Next Action**: Go to https://app.supabase.com and create your project

**Good luck! 🚀**
