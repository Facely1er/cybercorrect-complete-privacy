# Fix: Stripe Environment Variable Not Loading

## Problem
You're seeing: `Stripe not configured. Subscription checkout unavailable.`

This means `VITE_STRIPE_PUBLISHABLE_KEY` is not being loaded.

## Solution

### Step 1: Create/Update `.env` File

Create a `.env` file in your project root (same folder as `package.json`) with:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Important:** 
- Replace `pk_test_your_key_here` with your actual Stripe publishable key
- Get it from: [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) → Publishable key
- For test mode, use `pk_test_...`
- For production, use `pk_live_...`

### Step 2: Restart Dev Server

**CRITICAL:** After adding/updating `.env` file, you MUST restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
# or
pnpm dev
```

**Why?** Vite only reads environment variables when the dev server starts. Changes to `.env` won't take effect until you restart.

### Step 3: Verify It's Loaded

After restarting, open browser console and run:

```javascript
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

You should see your Stripe key (it will be visible in dev mode).

### Step 4: For Production Deployment

If deploying to production, set the environment variable in your deployment platform:

**Netlify:**
1. Site Settings → Environment Variables
2. Add: `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
3. Redeploy

**Vercel:**
1. Project Settings → Environment Variables
2. Add: `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
3. Redeploy

**Other Platforms:**
- Set `VITE_STRIPE_PUBLISHABLE_KEY` in your platform's environment variables
- Redeploy after setting

## Common Mistakes

1. ❌ **Forgot to restart dev server** - Most common issue!
2. ❌ **Wrong file location** - `.env` must be in project root
3. ❌ **Wrong variable name** - Must be exactly `VITE_STRIPE_PUBLISHABLE_KEY`
4. ❌ **Missing VITE_ prefix** - Vite only exposes variables starting with `VITE_`
5. ❌ **Using secret key instead of publishable key** - Use `pk_...` not `sk_...`

## Verify Your Setup

Your `.env` file should look like:

```env
# Supabase (required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe (required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Optional
VITE_ENABLE_ANALYTICS=false
```

## Still Not Working?

1. **Check file name:** Must be exactly `.env` (not `.env.local` unless you're using that)
2. **Check location:** Must be in project root (same folder as `package.json`)
3. **Check format:** No spaces around `=`, no quotes needed
4. **Restart dev server:** Always restart after changing `.env`
5. **Clear cache:** Try `rm -rf node_modules/.vite` then restart

## Quick Test

After setting up, try this in browser console:

```javascript
// Should show your Stripe key (in dev mode)
console.log(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Should be true if configured
console.log('Stripe configured:', !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

