# Complete Production Deployment Guide

**Time Required:** 1-2 hours  
**Status:** ✅ **READY TO DEPLOY**

---

## Overview

This guide walks you through the complete production deployment process for the CyberCorrect Privacy Platform. Follow these steps in order.

---

## Prerequisites

- [ ] GitHub repository access
- [ ] Supabase account and project
- [ ] Stripe account (live mode)
- [ ] Hosting platform account (Vercel/Netlify/etc.)
- [ ] Domain name configured (optional)

---

## Step 1: Stripe Configuration (30-60 minutes)

### 1.1 Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Switch to **Live Mode**
3. Navigate to **Developers** → **API keys**
4. Copy:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### 1.2 Create Products

1. Navigate to **Products** → **Add product**
2. Create products matching your catalog
3. Set prices and descriptions

### 1.3 Set Up Webhook

1. Navigate to **Developers** → **Webhooks**
2. Add endpoint: `https://your-project-id.supabase.co/functions/v1/stripe-webhook`
3. Select events: `checkout.session.completed`
4. Copy webhook secret: `whsec_...`

**📖 Detailed Guide:** See `STRIPE_PRODUCTION_SETUP.md`

---

## Step 2: Supabase Configuration (15-20 minutes)

### 2.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project
3. Wait for project to be ready

### 2.2 Run Database Migrations

1. Go to **SQL Editor**
2. Open `supabase/migrations/ALL_MIGRATIONS_COMBINED.sql`
3. Copy and paste entire file
4. Click **Run**
5. Verify tables created

### 2.3 Set Edge Function Secrets

1. Go to **Edge Functions** → **Secrets**
2. Add secrets:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   SITE_URL=https://www.cybercorrect.com
   ```

**📖 Detailed Guide:** See `DEPLOY_EDGE_FUNCTIONS.md`

---

## Step 3: Deploy Edge Functions (10-15 minutes)

### 3.1 Install Supabase CLI

```bash
npm install -g supabase
```

### 3.2 Login and Link Project

```bash
supabase login
supabase link --project-ref your-project-ref
```

### 3.3 Deploy Functions

```bash
cd apps/framework-compliance
supabase functions deploy create-one-time-checkout-session
supabase functions deploy stripe-webhook
```

**Or use deployment script:**
```bash
# Windows
.\scripts\deploy-production.ps1

# Linux/Mac
./scripts/deploy-production.sh
```

**📖 Detailed Guide:** See `DEPLOY_EDGE_FUNCTIONS.md`

---

## Step 4: Environment Variables (5-10 minutes)

### 4.1 Create .env.production

1. Copy `.env.production.example` to `.env.production`
2. Fill in all values:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
VITE_SITE_URL=https://www.cybercorrect.com
```

### 4.2 Set in Hosting Platform

**Vercel:**
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select "Production" environment

**Netlify:**
1. Go to Site Settings → Environment Variables
2. Add each variable

**Other Platforms:**
- Follow platform-specific documentation

---

## Step 5: Build and Deploy (10-15 minutes)

### 5.1 Build Locally (Test)

```bash
cd apps/framework-compliance
npm install
npm run build
npm run preview  # Test production build
```

### 5.2 Deploy to Hosting Platform

**Vercel:**
```bash
vercel --prod
```

**Netlify:**
```bash
netlify deploy --prod
```

**Or use platform dashboard:**
- Connect GitHub repository
- Configure build settings
- Deploy

---

## Step 6: Post-Deployment Verification (15-30 minutes)

### 6.1 Verify Application

- [ ] Application loads at production URL
- [ ] All pages accessible
- [ ] Navigation works
- [ ] No console errors

### 6.2 Test Checkout Flow

- [ ] Store page loads
- [ ] Products display correctly
- [ ] Add to cart works
- [ ] Checkout page loads
- [ ] Stripe checkout redirects
- [ ] Test payment succeeds
- [ ] Success page displays
- [ ] License activation works

### 6.3 Verify Webhook

- [ ] Webhook receives events in Stripe Dashboard
- [ ] License keys generated
- [ ] Email sent (if configured)
- [ ] Database records created

### 6.4 Monitor Logs

- [ ] Check Supabase Edge Functions logs
- [ ] Check application error logs
- [ ] Check Stripe Dashboard for events
- [ ] No errors or warnings

---

## Step 7: Production Testing

### 7.1 First Real Purchase

1. Make a small test purchase
2. Verify payment processes
3. Check license key received
4. Verify license activates
5. Check database records

### 7.2 End-to-End Test

1. Complete full user journey
2. Test all critical paths
3. Verify error handling
4. Check performance

---

## Troubleshooting

### Build Fails

- Check Node version (should be 18+)
- Clear `node_modules` and reinstall
- Check for TypeScript errors
- Verify all dependencies installed

### Deployment Fails

- Check environment variables set correctly
- Verify build succeeds locally
- Check platform-specific logs
- Verify repository access

### Functions Not Working

- Check Supabase Edge Functions logs
- Verify secrets are set correctly
- Test functions locally
- Check function URLs are correct

### Webhook Not Working

- Verify webhook URL in Stripe Dashboard
- Check webhook secret matches
- Verify function is deployed
- Check function logs

### Payment Issues

- Verify Stripe keys are correct (live vs test)
- Check Stripe Dashboard for errors
- Verify webhook is receiving events
- Check Edge Function logs

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enforced
- [ ] Webhook signature verification enabled
- [ ] RLS policies configured
- [ ] Input validation working
- [ ] Error messages don't expose sensitive data
- [ ] CORS configured correctly
- [ ] Rate limiting configured (if applicable)

---

## Monitoring Setup

### Error Tracking

- [ ] Sentry configured (if using)
- [ ] Error alerts set up
- [ ] Error logging working

### Performance Monitoring

- [ ] Performance tracking enabled
- [ ] Core Web Vitals monitored
- [ ] Bundle sizes tracked

### Business Metrics

- [ ] Stripe Dashboard monitoring
- [ ] Purchase tracking
- [ ] License activation tracking

---

## Rollback Plan

If issues are discovered:

1. **Immediate Actions:**
   - Disable checkout (if critical)
   - Notify team
   - Review error logs

2. **Rollback Steps:**
   - Revert to previous deployment
   - Restore previous environment variables
   - Verify previous version works

3. **Post-Rollback:**
   - Document issue
   - Create fix
   - Test thoroughly
   - Re-deploy when ready

---

## Success Criteria

✅ **Deployment Successful When:**
- Application loads correctly
- All features functional
- Checkout flow works
- Webhook processes events
- License keys generated
- No critical errors
- Performance acceptable

---

## Next Steps After Deployment

1. **Monitor:**
   - Watch error logs
   - Monitor performance
   - Track user activity

2. **Optimize:**
   - Review performance metrics
   - Optimize slow queries
   - Improve user experience

3. **Iterate:**
   - Gather user feedback
   - Fix issues
   - Add enhancements

---

## Support Resources

- **Stripe:** https://support.stripe.com
- **Supabase:** https://supabase.com/docs
- **Deployment Docs:** See `docs/deployment/`
- **Troubleshooting:** See platform-specific docs

---

## Quick Reference

| Task | Time | Guide |
|------|------|-------|
| Stripe Setup | 30-60 min | `STRIPE_PRODUCTION_SETUP.md` |
| Edge Functions | 10-15 min | `DEPLOY_EDGE_FUNCTIONS.md` |
| Environment Vars | 5-10 min | `.env.production.example` |
| Build & Deploy | 10-15 min | This guide |
| Verification | 15-30 min | `PRODUCTION_DEPLOYMENT_CHECKLIST.md` |

**Total Time:** ~1-2 hours

---

**Last Updated:** February 2025  
**Status:** ✅ Ready for Production Deployment

