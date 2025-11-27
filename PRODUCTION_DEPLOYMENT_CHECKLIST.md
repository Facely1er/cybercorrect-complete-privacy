# CyberCorrect Production Deployment Checklist

**Status**: ✅ 100% Code Ready | ⚠️ Configuration Required  
**Last Updated**: November 2025

---

## Pre-Deployment Configuration

### 1. GitHub Secrets Setup (Required for CI/CD)

Configure in GitHub Repository Settings → Secrets and variables → Actions:

#### Required Secrets
- [ ] `VERCEL_TOKEN` - Vercel deployment token
- [ ] `VERCEL_ORG_ID` - Vercel organization ID
- [ ] `VERCEL_PROJECT_ID_FRAMEWORK_COMPLIANCE` - Framework compliance app project ID
- [ ] `VERCEL_PROJECT_ID_PRIVACY_PORTAL` - Privacy portal project ID
- [ ] `VERCEL_PROJECT_ID_MARKETING_SITE` - Marketing site project ID
- [ ] `SENTRY_DSN` - Sentry error tracking DSN
- [ ] `SENTRY_AUTH_TOKEN` - Sentry authentication token for releases

**How to Get:**
- **Vercel Token**: https://vercel.com/account/tokens → Create token
- **Vercel Org/Project IDs**: https://vercel.com/account → Select project → Settings
- **Sentry DSN**: https://sentry.io/settings/YOUR_ORG/projects/YOUR_PROJECT/keys/
- **Sentry Auth Token**: https://sentry.io/settings/account/api/auth-tokens/

---

### 2. Environment Variables Setup

Set the following in your deployment platform for each workspace:

#### Framework Compliance App

```bash
# Required
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
VITE_ERROR_MONITORING_ENDPOINT=https://your-dsn@sentry.io/project-id
```

#### Privacy Portal App

```bash
# Required
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
```

#### Marketing Site

```bash
# Optional
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
```

---

### 3. Branch Protection Setup (Recommended)

Configure in GitHub Repository Settings → Branches:

- [ ] Enable branch protection for `main` branch
- [ ] Require pull request reviews (at least 1)
- [ ] Require status checks to pass
  - [ ] CI workflow (lint, type-check, test, build)
- [ ] Require branches to be up to date
- [ ] Require conversation resolution before merging
- [ ] Include administrators

---

### 4. Supabase Database Setup

- [ ] Create Supabase project (if not exists)
- [ ] Run database migrations
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up database backups
- [ ] Test database connections

**Migration Commands:**
```bash
# Install Supabase CLI
npm install -g supabase

# Link to project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## Deployment Steps

### Step 1: Pre-Deployment Verification

- [ ] All tests passing (`npm test` in each workspace)
- [ ] Build succeeds locally (`npm run build` in each workspace)
- [ ] No linter errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Security audit clean (`npm audit`)
- [ ] CI/CD pipeline configured
- [ ] Branch protection enabled

### Step 2: Test CI/CD Pipeline

- [ ] Create test PR to verify CI workflow
- [ ] Verify linting runs correctly
- [ ] Verify type checking runs correctly
- [ ] Verify tests run correctly
- [ ] Verify builds complete successfully
- [ ] Verify security scanning works
- [ ] Test deployment workflow (staging)
- [ ] Verify Dependabot is working

### Step 3: Environment Configuration

- [ ] GitHub secrets configured
- [ ] Environment variables set for each workspace
- [ ] Supabase credentials configured
- [ ] Sentry DSN configured (if using)
- [ ] Stripe keys configured (if using e-commerce)

### Step 4: Deploy to Staging

- [ ] Deploy Framework Compliance app to staging
- [ ] Deploy Privacy Portal app to staging
- [ ] Deploy Marketing Site to staging
- [ ] Verify all staging deployments successful
- [ ] Test all features in staging
- [ ] Verify monitoring is working
- [ ] Get stakeholder approval

### Step 5: Deploy to Production

- [ ] Review staging deployment
- [ ] Get final approval for production
- [ ] Deploy using CI/CD workflow
- [ ] Monitor deployment process
- [ ] Verify production deployments successful

### Step 6: Post-Deployment Verification

- [ ] Framework Compliance app loads correctly
- [ ] Privacy Portal app loads correctly
- [ ] Marketing Site loads correctly
- [ ] All services are running
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify monitoring and alerts

---

## Testing Checklist

### Framework Compliance App

- [ ] Homepage loads correctly
- [ ] Assessment flow works
- [ ] Compliance scoring works
- [ ] Reports generate correctly
- [ ] User authentication works
- [ ] Data export/import works
- [ ] All framework assessments functional

### Privacy Portal App

- [ ] Privacy rights requests work
- [ ] DPIA generation works
- [ ] Policy generation works
- [ ] Request tracking works
- [ ] User dashboard works
- [ ] Multi-regulation support works

### Marketing Site

- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Navigation works
- [ ] Contact forms work
- [ ] Links to other apps work

### Cross-App Integration

- [ ] Links between apps work correctly
- [ ] Shared authentication works (if applicable)
- [ ] Consistent branding across apps
- [ ] Cross-app navigation works

---

## Monitoring Setup

### Error Tracking

- [ ] Sentry configured and working
- [ ] Error alerts set up
- [ ] Error filtering configured
- [ ] Error reporting tested
- [ ] Release tracking configured

### Performance Monitoring

- [ ] Performance monitoring set up
- [ ] Performance alerts configured
- [ ] Bundle sizes monitored
- [ ] Page load times tracked
- [ ] Core Web Vitals monitored

### Security Monitoring

- [ ] Dependabot PRs reviewed regularly
- [ ] Security alerts monitored
- [ ] Vulnerability fixes tracked
- [ ] Security audit reports reviewed

---

## Rollback Procedure

If deployment fails:

1. **Via CI/CD**:
   - Go to GitHub Actions → Deployments
   - Find previous successful deployment
   - Re-run workflow or revert commit

2. **Via Vercel Dashboard**:
   - Go to project → Deployments
   - Find previous successful deployment
   - Click "Promote to Production"

---

## Troubleshooting

### Common Issues

**Issue**: Build fails in CI/CD
- **Solution**: Check build logs for errors
- **Solution**: Verify environment variables are set
- **Solution**: Check Node version compatibility

**Issue**: Supabase connection errors
- **Solution**: Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- **Solution**: Check Supabase project is active
- **Solution**: Verify RLS policies are configured

**Issue**: Deployment succeeds but app shows blank page
- **Solution**: Check browser console for errors
- **Solution**: Verify environment variables are set in production
- **Solution**: Check build output directory

---

## Success Criteria

✅ **Deployment Successful When:**
- All tests passing
- CI/CD pipeline working
- All apps deployed successfully
- All features functional
- Monitoring configured
- Error tracking working
- Performance metrics acceptable
- Security measures in place

---

**Ready to Deploy**: ✅ Code is 100% production-ready  
**Next Step**: Configure GitHub secrets and environment variables, then deploy to staging

---

*Last Updated: November 2025*

