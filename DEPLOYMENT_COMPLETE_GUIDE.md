# 🚀 CyberCorrect Production Deployment - Complete Guide

**Status**: Migrations Complete ✅  
**Next Step**: Deploy to Vercel  
**Estimated Time**: 30-45 minutes

---

## ✅ What's Already Done

- ✅ Database migrations applied (29 migrations)
- ✅ Supabase project configured
- ✅ Vercel configuration files ready
- ✅ Security headers configured
- ✅ Build scripts verified

---

## 🎯 Step-by-Step Deployment

### Step 1: Install Vercel CLI (if not installed)

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

Follow the prompts to authenticate.

### Step 3: Configure Environment Variables

Before deploying, you need to set environment variables in Vercel. You can do this:

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Create new project or select existing
3. Go to Settings → Environment Variables
4. Add the following variables:

**Framework Compliance Required Variables:**
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx_YOUR_ANON_KEY
VITE_APP_URL=https://platform.cybercorrect.com
VITE_ENVIRONMENT=production
VITE_REQUIRE_AUTH=true
VITE_DEBUG_MODE=false
VITE_RATE_LIMIT_ENABLED=true
```

**Privacy Portal Required Variables:**
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx_YOUR_ANON_KEY
VITE_APP_URL=https://portal.cybercorrect.com
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
VITE_REQUIRE_AUTH=false
```

**Optional (Recommended):**
```
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

**Option B: Via CLI (After first deployment)**
```powershell
cd apps/framework-compliance
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
# ... add all other variables
```

### Step 4: Deploy Framework Compliance

```powershell
cd apps/framework-compliance
vercel --prod
```

**When prompted:**
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account/team
- **Link to existing project?** → `N` (first time) or `Y` (updates)
- **Project name:** → `cybercorrect-framework-compliance`
- **Directory:** → `./`
- **Override settings?** → `N`

After deployment, note the deployment URL (e.g., `https://cybercorrect-framework-compliance.vercel.app`)

### Step 5: Deploy Privacy Portal

```powershell
cd ../privacy-portal
vercel --prod
```

**When prompted:**
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account/team
- **Link to existing project?** → `N` (first time) or `Y` (updates)
- **Project name:** → `cybercorrect-privacy-portal`
- **Directory:** → `./`
- **Override settings?** → `N`

After deployment, note the deployment URL (e.g., `https://cybercorrect-privacy-portal.vercel.app`)

### Step 6: Configure Custom Domains (Optional but Recommended)

**Via Vercel Dashboard:**

1. **Framework Compliance:**
   - Go to project → Settings → Domains
   - Add domain: `platform.cybercorrect.com`
   - Follow DNS configuration instructions
   - Wait for SSL certificate (~5 minutes)

2. **Privacy Portal:**
   - Go to project → Settings → Domains
   - Add domain: `portal.cybercorrect.com`
   - Follow DNS configuration instructions
   - Wait for SSL certificate (~5 minutes)

**DNS Configuration (at your domain registrar):**
```
# Framework Compliance
platform.cybercorrect.com → CNAME → cname.vercel-dns.com

# Privacy Portal
portal.cybercorrect.com → CNAME → cname.vercel-dns.com
```

### Step 7: Post-Deployment Verification

Run the verification script:
```powershell
.\scripts\verify-deployment.ps1
```

**Manual Verification Checklist:**

**Framework Compliance:**
- [ ] Homepage loads without errors
- [ ] Can create account
- [ ] Can login
- [ ] Can access Privacy Gap Analyzer
- [ ] Can create assessment
- [ ] Data persists after logout/login
- [ ] No console errors
- [ ] HTTPS padlock visible

**Privacy Portal:**
- [ ] Homepage loads without errors
- [ ] Can submit data rights request
- [ ] Form validation works
- [ ] Data persists
- [ ] No console errors
- [ ] HTTPS padlock visible

**Performance Tests:**
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] Best Practices score > 95
- [ ] SEO score > 90

**Security Tests:**
- [ ] HTTPS enforced (no HTTP access)
- [ ] Security headers present (test at securityheaders.com)
- [ ] RLS working (users see only their data)
- [ ] No API keys exposed in client code

---

## 🔧 Quick Deployment Script

For automated deployment, use:

```powershell
.\scripts\deploy-production.ps1
```

This script will:
1. Verify prerequisites
2. Build both applications
3. Deploy to Vercel
4. Guide you through environment variable setup

---

## 📊 Monitoring Setup

### Vercel Analytics (Included)
- Go to Vercel Dashboard → Your Project → Analytics
- Enable Web Analytics
- Monitor Core Web Vitals

### Sentry Error Monitoring (Optional but Recommended)

1. **Create Sentry Project:**
   - Go to [sentry.io](https://sentry.io)
   - Create account or login
   - Create new project → **React** → **Vite**
   - Copy DSN: `https://xxx@sentry.io/yyy`

2. **Add to Vercel Environment Variables:**
   - `VITE_SENTRY_DSN=https://xxx@sentry.io/yyy`
   - `VITE_ENABLE_ERROR_REPORTING=true`

3. **Redeploy:**
   ```powershell
   cd apps/framework-compliance
   vercel --prod
   ```

### Google Analytics (Optional but Recommended)

1. **Create GA4 Property:**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Admin → Create Property
   - Copy Measurement ID: `G-XXXXXXXXXX`

2. **Add to Vercel Environment Variables:**
   - `VITE_ANALYTICS_ID=G-XXXXXXXXXX`
   - `VITE_ENABLE_ANALYTICS=true`

3. **Redeploy** to apply changes

---

## 🐛 Troubleshooting

### Build Failures

**Error**: "Cannot find module"
```powershell
# Solution: Install dependencies
npm install
```

**Error**: "Environment variable not defined"
- Check Vercel Dashboard → Settings → Environment Variables
- Ensure all required variables are set for production environment

### Deployment Issues

**Error**: "Domain not found"
- Wait for DNS propagation (can take up to 48 hours)
- Check DNS: `nslookup platform.cybercorrect.com`

**Error**: "502 Bad Gateway"
```powershell
# Check Vercel logs
vercel logs [deployment-url]
```

### Authentication Issues

**Error**: "Invalid login credentials"
- Check Site URL in Supabase Authentication settings
- Must match your production domain
- Verify redirect URLs are configured

---

## ✅ Success Criteria

### Day 1 Targets
- ✅ Zero critical errors
- ✅ Page load < 3 seconds
- ✅ 100% uptime
- ✅ Successful user signups

### Week 1 Targets
- ✅ < 1% error rate
- ✅ Lighthouse scores > 90
- ✅ Positive user feedback
- ✅ Feature requests collected

---

## 📞 Support Resources

### Documentation
- **Deployment Guide**: `/PRODUCTION_DEPLOYMENT_GUIDE.md`
- **Database Schema**: `/apps/framework-compliance/supabase/migrations/SCHEMA_SUMMARY.md`
- **Environment Examples**: See `.env.production.example` files

### External Resources
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

## 🎉 You're Ready!

Your platform is deployed and ready for production use!

**Next Steps:**
1. Monitor error rates continuously
2. Watch user signups
3. Check performance metrics
4. Gather user feedback
5. Plan feature iterations

**Estimated Timeline:**
- Vercel Deployment: 30 minutes
- Domain Configuration: 15 minutes
- Verification: 15 minutes
- **Total: ~1 hour**

🚀 **Congratulations on your deployment!**

