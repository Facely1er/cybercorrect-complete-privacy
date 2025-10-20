# 🚨 QUICK FIX: Blank Pages on Deployment

## The Problem
Your deployment shows blank/white pages with no content.

## The Cause
Missing environment variables cause the app to crash before React can render.

## The Solution (3 Steps)

### 1️⃣ Get Supabase Credentials
1. Go to https://app.supabase.com
2. Select your project (or create new)
3. Go to Settings → API
4. Copy these two values:
   - **Project URL**
   - **anon public key**

### 2️⃣ Set Environment Variables in Your Deployment

#### On Netlify:
- Site settings → Environment variables → Add variables
- Add: `VITE_SUPABASE_URL` = your project URL
- Add: `VITE_SUPABASE_ANON_KEY` = your anon key
- Click "Trigger deploy"

#### On Vercel:
- Settings → Environment Variables → Add variables
- Add: `VITE_SUPABASE_URL` = your project URL
- Add: `VITE_SUPABASE_ANON_KEY` = your anon key
- Redeploy

### 3️⃣ Verify Fix
1. Wait for deployment to complete
2. Visit your site
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Open console (F12) - should see no critical errors

## Still Not Working?

### Check These:
- [ ] Variable names are **exactly** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] You redeployed after adding variables
- [ ] You cleared browser cache (hard refresh)
- [ ] Check browser console (F12) for error messages
- [ ] Verify Supabase URL starts with `https://`

### Console Shows Warnings?
This is OK if you see warnings about missing Supabase variables - the app will now load but some features won't work until you configure Supabase properly.

## Need More Help?

📖 **Detailed guides:**
- `DEPLOYMENT_FIX_SUMMARY.md` - Complete fix details
- `ENV_SETUP_GUIDE.md` - Environment variable setup
- `DEPLOYMENT.md` - Full deployment guide

## What Was Fixed?

✅ **Before**: App crashed immediately if env vars missing → blank page  
✅ **After**: App loads with warnings, gracefully handles missing config

The code has been updated to:
- Not crash on startup if env vars are missing
- Show helpful warnings in console
- Allow app to load with limited functionality
- Initialize Supabase lazily (only when needed)

---

**Last Updated**: After fixing blank page deployment issues

