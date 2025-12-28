# ⚡ Quick Start: Deploy to Production

**Migrations**: ✅ Complete  
**Time**: 30-45 minutes

---

## 🚀 Fast Track Deployment

### 1. Install & Login (2 min)

```powershell
npm install -g vercel
vercel login
```

### 2. Deploy Framework Compliance (5 min)

```powershell
cd apps/framework-compliance
vercel --prod
```

**When prompted:**
- Project name: `cybercorrect-framework-compliance`
- Link to existing? `N` (first time)
- Directory: `./`

### 3. Deploy Privacy Portal (5 min)

```powershell
cd ../privacy-portal
vercel --prod
```

**When prompted:**
- Project name: `cybercorrect-privacy-portal`
- Link to existing? `N` (first time)
- Directory: `./`

### 4. Configure Environment Variables (10 min)

**Go to Vercel Dashboard → Each Project → Settings → Environment Variables**

**Add these for BOTH projects:**
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx_YOUR_ANON_KEY
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
```

**Framework Compliance only:**
```
VITE_APP_URL=https://platform.cybercorrect.com
VITE_REQUIRE_AUTH=true
```

**Privacy Portal only:**
```
VITE_APP_URL=https://portal.cybercorrect.com
VITE_REQUIRE_AUTH=false
```

### 5. Redeploy with Environment Variables (5 min)

```powershell
cd apps/framework-compliance
vercel --prod

cd ../privacy-portal
vercel --prod
```

### 6. Verify (5 min)

Visit your deployment URLs and test:
- ✅ Homepage loads
- ✅ Can create account
- ✅ Can login
- ✅ Features work

---

## 📋 Full Guide

For detailed instructions, see: `DEPLOYMENT_COMPLETE_GUIDE.md`

---

## 🎯 Automated Deployment

Run the automated script:

```powershell
.\scripts\deploy-production.ps1
```

---

**That's it! Your platform is live! 🎉**

