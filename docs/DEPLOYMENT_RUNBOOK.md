# Deployment Runbook

This document provides step-by-step procedures for deploying, troubleshooting, and maintaining the CyberCorrect Privacy Platform in production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Procedures](#deployment-procedures)
3. [Post-Deployment Verification](#post-deployment-verification)
4. [Rollback Procedures](#rollback-procedures)
5. [Troubleshooting](#troubleshooting)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Emergency Contacts](#emergency-contacts)

---

## Pre-Deployment Checklist

### Environment Variables

Verify all required environment variables are set:

**Required:**
- [ ] `VITE_SUPABASE_URL` - Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Optional (Recommended):**
- [ ] `VITE_SENTRY_DSN` - Sentry error monitoring
- [ ] `VITE_ERROR_MONITORING_ENDPOINT` - Error monitoring endpoint
- [ ] `VITE_ANALYTICS_ID` - Analytics ID
- [ ] `VITE_ENABLE_ANALYTICS` - Enable analytics (true/false)

**Cross-App URLs (Monorepo):**
- [ ] `VITE_FRAMEWORK_COMPLIANCE_URL` - Framework compliance app URL
- [ ] `VITE_PRIVACY_PORTAL_URL` - Privacy portal app URL
- [ ] `VITE_MARKETING_SITE_URL` - Marketing site URL

### Database Migrations

- [ ] All migrations have been tested in staging
- [ ] Migration scripts are ready
- [ ] Database backup completed
- [ ] Rollback plan documented

### Build Verification

- [ ] `npm run build:all` completes successfully
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] All tests pass (`npm run test:run`)
- [ ] Test coverage meets threshold (80%)

### Security Checks

- [ ] Security audit completed (`npm audit`)
- [ ] No critical vulnerabilities
- [ ] Dependencies updated
- [ ] Secrets rotated (if needed)

---

## Deployment Procedures

### Automated Deployment (Recommended)

The platform uses GitHub Actions for automated deployment:

1. **Merge to Main Branch**
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```

2. **GitHub Actions Workflow**
   - CI pipeline runs automatically
   - Tests execute
   - Build verification
   - Deployment to staging
   - Manual approval for production

3. **Monitor Deployment**
   - Check GitHub Actions workflow status
   - Monitor deployment logs
   - Verify staging deployment

### Manual Deployment

If automated deployment is unavailable:

#### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Staging**
   ```bash
   vercel --env=staging
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod --env=production
   ```

#### Netlify Deployment

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   npm run build:all
   netlify deploy --prod --dir=dist
   ```

---

## Post-Deployment Verification

### Health Checks

1. **Landing Page**
   - [ ] Loads correctly
   - [ ] No console errors
   - [ ] All assets load

2. **Authentication**
   - [ ] Login works
   - [ ] Logout works
   - [ ] Session management works

3. **Core Features**
   - [ ] Assessments load
   - [ ] Reports generate
   - [ ] PDF exports work
   - [ ] Checkout flow works

4. **Performance**
   - [ ] Page load time < 3s
   - [ ] First Contentful Paint < 2s
   - [ ] Largest Contentful Paint < 4s

5. **Error Monitoring**
   - [ ] Sentry receiving errors
   - [ ] No critical errors
   - [ ] Error rate normal

### Database Verification

1. **Connection**
   ```sql
   SELECT 1;
   ```

2. **Migrations Applied**
   ```sql
   SELECT * FROM supabase_migrations.schema_migrations;
   ```

3. **Data Integrity**
   - [ ] User data accessible
   - [ ] Projects load correctly
   - [ ] Reports generate

---

## Rollback Procedures

### Quick Rollback (Vercel)

1. **Access Vercel Dashboard**
   - Go to project settings
   - Navigate to Deployments

2. **Select Previous Deployment**
   - Find last known good deployment
   - Click "Promote to Production"

3. **Verify Rollback**
   - Check health endpoints
   - Verify core functionality
   - Monitor error logs

### Database Rollback

1. **Restore Database Backup**
   ```bash
   # Using Supabase CLI
   supabase db restore <backup-file>
   ```

2. **Revert Migrations**
   ```bash
   # Rollback specific migration
   supabase migration down <migration-name>
   ```

### Code Rollback

1. **Revert Git Commit**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Redeploy**
   - Trigger deployment workflow
   - Monitor deployment

---

## Troubleshooting

### Common Issues

#### Build Failures

**Symptom:** Build fails during deployment

**Diagnosis:**
```bash
# Check build logs
npm run build:all

# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

**Solution:**
- Fix TypeScript errors
- Resolve linting issues
- Update dependencies if needed

#### Database Connection Issues

**Symptom:** Application cannot connect to database

**Diagnosis:**
```bash
# Test Supabase connection
npm run supabase:test --workspace=@cybercorrect/framework-compliance
```

**Solution:**
- Verify `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check Supabase project status
- Verify network connectivity

#### Payment Processing Issues

**Symptom:** Stripe checkout fails

**Diagnosis:**
- Check Stripe dashboard for errors
- Verify webhook endpoint is configured
- Check Stripe API keys

**Solution:**
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is correct
- Check Stripe webhook configuration
- Verify edge function secrets are set

#### Performance Issues

**Symptom:** Slow page loads or timeouts

**Diagnosis:**
- Check Vercel Analytics
- Review Sentry performance data
- Check database query performance

**Solution:**
- Optimize database queries
- Enable caching
- Review bundle size
- Check CDN configuration

### Error Monitoring

#### Sentry Dashboard

1. **Access Sentry**
   - Go to Sentry dashboard
   - Navigate to project

2. **Review Errors**
   - Check error frequency
   - Review error details
   - Identify patterns

3. **Take Action**
   - Fix critical errors
   - Monitor error trends
   - Update error handling

---

## Monitoring & Alerts

### Key Metrics

1. **Uptime**
   - Target: 99.9%
   - Monitor: Vercel Analytics

2. **Error Rate**
   - Target: < 0.1%
   - Monitor: Sentry

3. **Response Time**
   - Target: < 2s (p95)
   - Monitor: Vercel Analytics

4. **Database Performance**
   - Target: < 100ms query time
   - Monitor: Supabase Dashboard

### Alert Thresholds

- **Critical:** Error rate > 1%
- **Warning:** Error rate > 0.5%
- **Critical:** Response time > 5s
- **Warning:** Response time > 3s
- **Critical:** Uptime < 99%

### Monitoring Tools

- **Vercel Analytics:** Performance and uptime
- **Sentry:** Error tracking and performance
- **Supabase Dashboard:** Database metrics
- **Stripe Dashboard:** Payment metrics

---

## Emergency Contacts

### Development Team

- **Lead Developer:** [Contact Info]
- **DevOps Engineer:** [Contact Info]
- **On-Call Engineer:** [Contact Info]

### Service Providers

- **Vercel Support:** support@vercel.com
- **Supabase Support:** support@supabase.com
- **Stripe Support:** support@stripe.com
- **Sentry Support:** support@sentry.io

### Escalation Path

1. **Level 1:** Development Team
2. **Level 2:** Engineering Manager
3. **Level 3:** CTO / Technical Director

---

## Maintenance Windows

### Scheduled Maintenance

- **Weekly:** Dependency updates
- **Monthly:** Security patches
- **Quarterly:** Major updates

### Maintenance Procedure

1. **Notify Users**
   - Send maintenance notification
   - Update status page

2. **Perform Maintenance**
   - Apply updates
   - Run migrations
   - Verify functionality

3. **Post-Maintenance**
   - Verify all systems
   - Monitor error rates
   - Update documentation

---

## Appendix

### Useful Commands

```bash
# Build all apps
npm run build:all

# Run tests
npm run test:run

# Check production readiness
npm run verify:production --workspace=@cybercorrect/framework-compliance

# Verify migrations
npm run verify:migrations --workspace=@cybercorrect/framework-compliance

# Test Supabase connection
npm run supabase:test --workspace=@cybercorrect/framework-compliance
```

### Useful Links

- **GitHub Repository:** https://github.com/cybercorrect/cybercorrect-complete-privacy
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Sentry Dashboard:** https://sentry.io/organizations/cybercorrect
- **Stripe Dashboard:** https://dashboard.stripe.com

---

**Last Updated:** January 2025  
**Version:** 1.0.0

