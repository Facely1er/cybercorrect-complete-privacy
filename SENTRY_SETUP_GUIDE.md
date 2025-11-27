# Sentry Error Monitoring Setup Guide

## Overview

Sentry has been integrated into the CyberCorrect application to provide comprehensive error monitoring, performance tracking, and user session replay capabilities.

## What's Been Implemented

### ✅ Core Integration
- **Sentry React SDK** installed and configured
- **Error Boundary** component wrapping the entire application
- **Automatic error capture** for unhandled exceptions
- **Performance monitoring** with transaction tracking
- **Session replay** for debugging user interactions

### ✅ Security & Privacy
- **Sensitive data filtering** (cookies, passwords)
- **Development error filtering** in production
- **User context tracking** with privacy controls
- **Custom error handling** with user-friendly fallbacks

## Setup Instructions

### 1. Create Sentry Project

1. **Go to [Sentry.io](https://sentry.io)** and sign up/login
2. **Create a new project**:
   - Platform: **React**
   - Project name: `cybercorrect`
   - Team: Select your team

3. **Get your DSN**:
   - Copy the DSN from the project settings
   - Format: `https://your-dsn@sentry.io/project-id`

### 2. Configure Environment Variables

Add these environment variables to your deployment platform:

#### Required Variables
```bash
# Sentry DSN (required for error monitoring)
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

#### Optional Variables (for advanced features)
```bash
# Sentry organization and project (for source maps)
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=cybercorrect
SENTRY_AUTH_TOKEN=your-auth-token

# Release tracking
SENTRY_RELEASE=cybercorrect@1.0.0
```

### 3. Platform-Specific Configuration

#### Netlify
1. Go to **Site Settings** → **Environment Variables**
2. Add `VITE_SENTRY_DSN` with your Sentry DSN
3. Redeploy your site

#### Vercel
1. Go to **Project Settings** → **Environment Variables**
2. Add `VITE_SENTRY_DSN` for Production, Preview, and Development
3. Redeploy your application

#### Other Platforms
- Ensure `VITE_SENTRY_DSN` is available at build time
- Redeploy after adding the environment variable

## Features & Capabilities

### 🚨 Error Monitoring
- **Automatic error capture** for JavaScript errors
- **Unhandled promise rejections** tracking
- **React error boundaries** for component errors
- **Custom error reporting** with context

### 📊 Performance Monitoring
- **Page load times** and Core Web Vitals
- **API call performance** tracking
- **User interaction timing** analysis
- **Custom transaction tracking**

### 🎥 Session Replay
- **User session recordings** for debugging
- **Error context** with user actions leading to errors
- **Privacy-focused** replay (no sensitive data)
- **Configurable sampling** rates

### 👤 User Context
- **User identification** for error tracking
- **Custom tags** and metadata
- **Breadcrumb tracking** for user actions
- **Release tracking** for deployment correlation

## Configuration Details

### Error Filtering
The integration includes smart filtering to protect user privacy:

```typescript
// Automatically filters out:
- Development errors in production
- Sensitive data (cookies, passwords)
- Localhost/127.0.0.1 references
- Internal debugging information
```

### Sampling Rates
- **Production**: 10% error sampling, 10% session replay
- **Development**: 100% error sampling, 50% session replay
- **Error replay**: 100% (always capture errors)

### Custom Error Handling
- **User-friendly error pages** instead of white screens
- **Retry mechanisms** for transient errors
- **Graceful degradation** when Sentry is unavailable
- **Development-only error details** display

## Monitoring Dashboard

### Key Metrics to Monitor
1. **Error Rate**: Should be < 1% of sessions
2. **Performance**: Page load times < 3 seconds
3. **User Experience**: Low error impact on users
4. **Release Health**: Track errors by deployment

### Alert Configuration
Set up alerts for:
- **High error rates** (> 5% of sessions)
- **New error types** (regression detection)
- **Performance degradation** (slow page loads)
- **Critical errors** (payment/auth failures)

## Testing the Integration

### 1. Test Error Capture
```javascript
// Add this to browser console to test
throw new Error('Test error for Sentry');
```

### 2. Test Performance Monitoring
- Navigate through the application
- Check Sentry Performance tab for transactions
- Verify Core Web Vitals are being tracked

### 3. Test Session Replay
- Perform actions that might cause errors
- Check Sentry Replays tab for session recordings
- Verify privacy filtering is working

## Troubleshooting

### Common Issues

#### Sentry Not Capturing Errors
- ✅ Check `VITE_SENTRY_DSN` is configured correctly
- ✅ Verify DSN format: `https://dsn@sentry.io/project-id`
- ✅ Check browser console for Sentry initialization messages
- ✅ Ensure environment variable is available at build time

#### Missing Source Maps
- ✅ Configure `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`
- ✅ Verify source maps are enabled in Vite config
- ✅ Check Sentry project settings for source map uploads

#### High Error Volume
- ✅ Review error filtering configuration
- ✅ Check for development errors in production
- ✅ Verify sampling rates are appropriate

### Debug Mode
Enable debug logging by adding to your environment:
```bash
VITE_SENTRY_DEBUG=true
```

## Best Practices

### 1. Error Context
```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry';

// Add context before operations
addBreadcrumb({
  message: 'User started assessment',
  category: 'user-action',
  data: { assessmentType: 'CMMC' }
});

// Capture errors with context
captureException(error, {
  userId: user.id,
  assessmentId: assessment.id,
  step: 'data-collection'
});
```

### 2. User Identification
```typescript
import { setUser } from '@/lib/sentry';

// When user logs in
setUser({
  id: user.id,
  email: user.email,
  username: user.username
});

// When user logs out
clearUser();
```

### 3. Release Tracking
- Tag releases with version numbers
- Track deployment success/failure
- Monitor error rates by release
- Set up alerts for new releases

## Security Considerations

### Data Privacy
- ✅ **No sensitive data** is sent to Sentry
- ✅ **User consent** should be obtained for session replay
- ✅ **GDPR compliance** with data retention policies
- ✅ **Local data filtering** before transmission

### Access Control
- ✅ **Team-based access** to Sentry projects
- ✅ **Role-based permissions** for error data
- ✅ **Audit logging** for Sentry access
- ✅ **Regular access reviews** for team members

## Cost Management

### Sentry Pricing Tiers
- **Free**: 5,000 errors/month, 1 user
- **Team**: $26/month, 50,000 errors, 5 users
- **Business**: $80/month, 200,000 errors, 20 users

### Optimization Tips
- **Adjust sampling rates** based on traffic
- **Filter out noise** (development errors)
- **Use error grouping** to reduce duplicate errors
- **Monitor usage** to stay within limits

## Support & Resources

- **Sentry Documentation**: https://docs.sentry.io/platforms/javascript/guides/react/
- **React Integration Guide**: https://docs.sentry.io/platforms/javascript/guides/react/
- **Performance Monitoring**: https://docs.sentry.io/product/performance/
- **Session Replay**: https://docs.sentry.io/product/session-replay/

## Next Steps

1. ✅ Configure Sentry DSN in environment variables
2. ✅ Deploy and test error capture
3. ✅ Set up alerts and monitoring dashboards
4. ✅ Train team on Sentry usage
5. ✅ Establish error response procedures
