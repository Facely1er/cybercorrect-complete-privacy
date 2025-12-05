# Monitoring Setup Guide - CyberCorrect

This guide helps you set up comprehensive monitoring for the CyberCorrect platform across all workspaces.

---

## 1. Error Tracking with Sentry (Required for Production)

### Setup Steps

1. **Create Sentry Account**
   - Go to https://sentry.io/signup/
   - Create a new organization
   - Create separate projects for each workspace:
     - Framework Compliance App
     - Privacy Portal App
     - Marketing Site

2. **Get Your DSNs**
   - In Sentry dashboard, go to Settings → Projects → Your Project → Client Keys (DSN)
   - Copy the DSN for each project

3. **Configure GitHub Secrets**
   ```bash
   SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
   ```

4. **Configure Environment Variables** (per workspace)
   ```bash
   VITE_ERROR_MONITORING_ENDPOINT=https://xxxxx@sentry.io/xxxxx
   ```

5. **Verify Integration**
   - Check that error boundaries are configured
   - Test error reporting in staging
   - Verify events appear in Sentry dashboard

### Sentry Features to Configure

- [ ] **Alerts**: Set up alerts for error rates (> 5% threshold)
- [ ] **Releases**: Configure release tracking for CI/CD
- [ ] **Performance Monitoring**: Enable for all apps
- [ ] **User Context**: Add user information to errors
- [ ] **Source Maps**: Upload source maps for better debugging
- [ ] **Issue Assignment**: Set up team assignment rules

---

## 2. Performance Monitoring

### Core Web Vitals

Monitor these metrics for each workspace:

1. **Largest Contentful Paint (LCP)**
   - Target: < 2.5 seconds
   - Monitor via Google Search Console

2. **First Input Delay (FID)**
   - Target: < 100 milliseconds
   - Monitor via Google Search Console

3. **Cumulative Layout Shift (CLS)**
   - Target: < 0.1
   - Monitor via Google Search Console

### Tools

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Lighthouse CI**: Automated performance testing in CI/CD
- **Sentry Performance**: Built-in performance monitoring

### Setup Checklist

- [ ] Set up Core Web Vitals monitoring for each app
- [ ] Configure performance budgets
- [ ] Set up alerts for performance degradation
- [ ] Regular performance audits
- [ ] Monitor bundle sizes

---

## 3. Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free tier available)
   - Monitor all three app URLs
   - Set up alerts for downtime
   - Monitor API endpoints

2. **Pingdom** (Paid)
   - Advanced monitoring features
   - Real user monitoring
   - Transaction monitoring

### URLs to Monitor

- Framework Compliance App: `https://www.platform.cybercorrect.com`
- Privacy Portal: `https://www.portal.cybercorrect.com`
- Marketing Site: `https://www.cybercorrect.com`

### Setup Checklist

- [ ] Set up uptime monitoring for all three apps
- [ ] Configure alert notifications
- [ ] Set monitoring interval (recommended: 5 minutes)
- [ ] Test alert system

---

## 4. CI/CD Monitoring

### GitHub Actions Monitoring

Monitor CI/CD pipeline health:

- [ ] Set up notifications for failed builds
- [ ] Monitor build times
- [ ] Track deployment success rates
- [ ] Review Dependabot PRs regularly

### Deployment Monitoring

- [ ] Monitor deployment durations
- [ ] Track deployment frequency
- [ ] Monitor rollback frequency
- [ ] Review deployment logs

---

## 5. Database Monitoring (Supabase)

### Supabase Dashboard

Monitor database health:

- [ ] Database connection pool usage
- [ ] Query performance
- [ ] Storage usage
- [ ] API request rates
- [ ] Error rates

### Alerts to Configure

- [ ] High database CPU usage
- [ ] Storage approaching limits
- [ ] High error rates
- [ ] Slow query performance

---

## 6. Security Monitoring

### Security Headers

Verify security headers for all apps:
- Test at https://securityheaders.com/
- Check for: CSP, HSTS, X-Frame-Options, etc.

### Vulnerability Scanning

- [ ] Dependabot configured (already done)
- [ ] Regular security audits (`npm audit`)
- [ ] Monitor security advisories
- [ ] Set up alerts for critical vulnerabilities
- [ ] Review Dependabot PRs weekly

### Security Checklist

- [ ] All apps have security headers
- [ ] HTTPS enforced
- [ ] No sensitive data in client-side code
- [ ] XSS protection working
- [ ] CSRF protection in place
- [ ] Rate limiting configured (if applicable)

---

## 7. Analytics (Optional)

### Google Analytics

If using analytics:

1. **Create GA4 Properties**
   - One property per app (or use one with separate streams)
   - Get Measurement IDs

2. **Configure Environment Variables**
   ```bash
   VITE_ANALYTICS_ID=G-XXXXXXXXXX
   VITE_ENABLE_ANALYTICS=true
   ```

3. **Verify Tracking**
   - Test in staging
   - Verify events in GA4 dashboard

### Analytics Events to Monitor

- Page views per app
- User interactions
- Assessment completions
- Feature usage
- Error occurrences

---

## 8. Log Monitoring

### Application Logs

Monitor logs for:

1. **Vercel Logs**
   - Access via Vercel Dashboard → Project → Logs
   - Real-time log streaming
   - Filter by workspace

2. **Edge Function Logs**
   - Monitor Supabase Edge Functions
   - Check for errors and performance issues

### Log Aggregation (Optional)

For advanced log management:

- **LogRocket**: Session replay and log aggregation
- **Datadog**: Comprehensive logging and monitoring
- **New Relic**: Application performance monitoring

---

## 9. Monitoring Dashboard

### Recommended Setup

Create a centralized monitoring dashboard with:

1. **Error Rates**: Track error frequency per app
2. **Performance Metrics**: Page load times, Core Web Vitals
3. **User Metrics**: Active users, sessions per app
4. **System Health**: Uptime, response times, availability
5. **Deployment Status**: Recent deployments, success rates
6. **Security Status**: Vulnerability count, security alerts

### Tools for Dashboards

- **Grafana**: Custom dashboards with multiple data sources
- **Datadog**: Comprehensive monitoring platform
- **New Relic**: Application monitoring
- **Custom Dashboard**: Build your own with APIs

---

## 10. Alert Configuration

### Critical Alerts

Set up alerts for:

- [ ] **High Error Rate**: > 5% error rate (any app)
- [ ] **Downtime**: Any app unavailable
- [ ] **Performance Degradation**: LCP > 4 seconds
- [ ] **Security Issues**: Critical vulnerabilities
- [ ] **Database Issues**: High error rate or slow queries
- [ ] **Deployment Failures**: Failed CI/CD deployments

### Alert Channels

- Email notifications
- Slack/Discord webhooks
- PagerDuty (for on-call)
- SMS alerts (for critical issues)

---

## 11. Regular Monitoring Tasks

### Daily

- [ ] Check error rates across all apps
- [ ] Review performance metrics
- [ ] Monitor deployment status
- [ ] Check security alerts

### Weekly

- [ ] Review security alerts and Dependabot PRs
- [ ] Analyze performance trends
- [ ] Review user analytics
- [ ] Check dependency updates
- [ ] Review database performance

### Monthly

- [ ] Comprehensive security audit
- [ ] Performance optimization review
- [ ] Cost optimization review
- [ ] Review monitoring effectiveness
- [ ] Update monitoring configuration

---

## 12. Workspace-Specific Monitoring

### Framework Compliance App

- [ ] Monitor assessment completion rates
- [ ] Track compliance scoring accuracy
- [ ] Monitor report generation performance
- [ ] Check Stripe integration (if using)

### Privacy Portal App

- [ ] Monitor privacy rights request processing
- [ ] Track DPIA generation performance
- [ ] Monitor policy generation
- [ ] Check request SLA compliance

### Marketing Site

- [ ] Monitor page load times
- [ ] Track conversion rates
- [ ] Monitor form submissions
- [ ] Check link integrity

---

## Quick Start Checklist

- [ ] Set up Sentry for error tracking (all apps)
- [ ] Configure GitHub secrets for CI/CD
- [ ] Set up uptime monitoring (all apps)
- [ ] Configure performance monitoring
- [ ] Set up security monitoring
- [ ] Configure alerts
- [ ] Create monitoring dashboard
- [ ] Test all monitoring systems
- [ ] Document monitoring procedures

---

## Support

For issues with monitoring setup:

1. Check service documentation
2. Review environment variable configuration
3. Verify API keys and tokens are correct
4. Test in staging environment first
5. Check browser console and network logs

---

*Last Updated: November 2025*

