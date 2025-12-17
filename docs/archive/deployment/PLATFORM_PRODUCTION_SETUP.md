# 🚀 CyberCorrect Platform - Production Setup Guide

**Last Updated**: December 17, 2025  
**Status**: Ready for Production Deployment

---

## 📋 Overview

This guide covers the complete setup for launching the **CyberCorrect Platform** to production, while keeping the **Privacy Portal** as a beta prototype for white-label development.

### Product Strategy:
- ✅ **Platform**: Production-ready compliance tools (revenue-generating)
- 🧪 **Portal**: Beta prototype for co-creation (100 organizations, white-label development)

---

## 🎯 Production Checklist

### **Phase 1: Platform Production (Critical)**

- [ ] **Database Setup** (Supabase)
- [ ] **Authentication System** (Supabase Auth)
- [ ] **Payment Processing** (Stripe Live Mode)
- [ ] **Email Service** (SendGrid/Resend)
- [ ] **Error Monitoring** (Sentry)
- [ ] **Analytics** (PostHog/Mixpanel)
- [ ] **Deployment** (Vercel/Netlify)
- [ ] **Domain & SSL**
- [ ] **Environment Variables**
- [ ] **Legal Pages** (Terms, Privacy Policy)

### **Phase 2: Portal Beta (Non-Critical - Can Stay Prototype)**

- [ ] Beta application form (✅ Already built)
- [ ] Manual application review workflow
- [ ] Beta participant onboarding
- [ ] Feedback collection

---

## 1️⃣ **Supabase Setup**

### **1.1 Create Production Project**

```bash
# 1. Go to https://supabase.com/dashboard
# 2. Create new project: "cybercorrect-production"
# 3. Choose region closest to users
# 4. Set strong database password
# 5. Wait for provisioning (~2 minutes)
```

### **1.2 Run Platform Migrations**

Create the following tables in Supabase SQL Editor:

```sql
-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  organization_name VARCHAR(255),
  organization_size VARCHAR(50),
  industry VARCHAR(100),
  role VARCHAR(100),
  country VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Results Table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  framework VARCHAR(50) NOT NULL,
  overall_score INTEGER,
  maturity_level VARCHAR(50),
  results_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS cc_privacy_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription History Table
CREATE TABLE IF NOT EXISTS cc_privacy_subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES cc_privacy_subscriptions(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  old_tier VARCHAR(50),
  new_tier VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE cc_privacy_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own assessments" ON assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON cc_privacy_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_profiles_user_id ON user_profiles(id);
CREATE INDEX idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX idx_assessment_results_created ON assessment_results(created_at DESC);
CREATE INDEX idx_subscriptions_user_id ON cc_privacy_subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON cc_privacy_subscriptions(stripe_subscription_id);
```

### **1.3 Run Portal Beta Migrations (Optional - Can defer)**

```bash
# Run the migration file already created:
# supabase/migrations/001_portal_beta_schema.sql
```

### **1.4 Configure Authentication**

In Supabase Dashboard → Authentication → Providers:

```yaml
Email Provider:
  - Enable email/password authentication
  - Configure email templates
  - Set up custom SMTP (or use Supabase's)
  
OAuth Providers (Optional):
  - Google OAuth
  - Microsoft OAuth
  - GitHub OAuth
```

### **1.5 Get API Credentials**

```
Settings → API:
- Project URL: https://xxxxx.supabase.co
- anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
```

---

## 2️⃣ **Stripe Setup**

### **2.1 Switch to Live Mode**

```bash
# 1. Go to https://dashboard.stripe.com
# 2. Toggle from "Test mode" to "Live mode" (top right)
# 3. Complete account activation (business details, banking info)
```

### **2.2 Create Products & Prices**

```javascript
// Platform Subscription Products:

Product 1: "CyberCorrect Free"
- Price: $0/month
- Recurring: Monthly
- Features: Basic assessment, 3 exports/month

Product 2: "CyberCorrect Starter"
- Price: $29/month (or $24/month annual)
- Recurring: Monthly/Annual
- Features: All assessments, unlimited exports, basic templates

Product 3: "CyberCorrect Professional"
- Price: $99/month (or $82/month annual)
- Recurring: Monthly/Annual
- Features: Everything + advanced analytics, API access, priority support

Product 4: "CyberCorrect Enterprise"
- Price: Custom (contact sales)
- Recurring: Annual
- Features: Everything + white-glove support, custom integrations

Product 5: "Privacy Portal Add-On" (BETA)
- Price: $99/month (beta pricing - normally $199)
- Recurring: Monthly
- Metadata: beta_product=true, beta_price_locked=true
- Note: Add-on to any Platform tier
```

### **2.3 Set Up Webhooks**

```
Stripe Dashboard → Developers → Webhooks:

Endpoint URL: https://your-domain.com/api/webhooks/stripe

Events to listen for:
✓ checkout.session.completed
✓ customer.subscription.created
✓ customer.subscription.updated
✓ customer.subscription.deleted
✓ invoice.payment_succeeded
✓ invoice.payment_failed

Get webhook signing secret: whsec_xxxxx
```

### **2.4 Get API Keys**

```
Stripe Dashboard → Developers → API keys:

Publishable key: pk_live_xxxxx
Secret key: sk_live_xxxxx (keep secret!)
Webhook secret: whsec_xxxxx (keep secret!)
```

---

## 3️⃣ **Environment Variables**

Create `.env.production` file:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# App Configuration
VITE_APP_URL=https://app.cybercorrect.com
VITE_APP_ENV=production

# Email Service (SendGrid or Resend)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@cybercorrect.com
EMAIL_FROM_NAME=CyberCorrect

# Error Monitoring (Sentry)
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx

# Analytics (PostHog or Mixpanel)
VITE_POSTHOG_KEY=phc_xxxxx
VITE_POSTHOG_HOST=https://app.posthog.com

# Feature Flags
VITE_ENABLE_PORTAL_BETA=true
VITE_ENABLE_STRIPE_PAYMENTS=true
```

---

## 4️⃣ **Email Service Setup**

### **Option A: SendGrid** (Recommended)

```bash
# 1. Sign up at https://sendgrid.com
# 2. Verify sender identity (your@cybercorrect.com)
# 3. Create API key
# 4. Create email templates:
#    - Welcome email
#    - Assessment completion
#    - Subscription confirmation
#    - Payment receipt
#    - Password reset
```

### **Option B: Resend** (Alternative)

```bash
# 1. Sign up at https://resend.com
# 2. Add domain DNS records
# 3. Create API key
# 4. Use React Email for templates
```

### **Email Templates Needed:**

1. **Welcome Email** - New user registration
2. **Assessment Complete** - Assessment results ready
3. **Subscription Confirmation** - Payment successful
4. **Trial Expiring** - 3 days before trial ends
5. **Payment Failed** - Subscription payment issue
6. **Portal Beta Invitation** - Beta access granted
7. **Password Reset** - Security

---

## 5️⃣ **Deployment**

### **5.1 Vercel Deployment** (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add environment variables in Vercel Dashboard
# Settings → Environment Variables → Add all from .env.production

# 5. Configure custom domain
# Settings → Domains → Add app.cybercorrect.com
```

### **5.2 Build Configuration**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 6️⃣ **Error Monitoring (Sentry)**

```bash
# 1. Sign up at https://sentry.io
# 2. Create project "cybercorrect-platform"
# 3. Get DSN
# 4. Install SDK (already included)
# 5. Configure in app
```

```typescript
// Already configured in apps/framework-compliance/src/lib/errorMonitoring.ts
```

---

## 7️⃣ **Analytics Setup**

### **PostHog** (Recommended for product analytics)

```bash
# 1. Sign up at https://posthog.com
# 2. Get project API key
# 3. Add to environment variables
# 4. Events auto-tracked:
#    - Page views
#    - Assessment completions
#    - Tool usage
#    - Subscription events
#    - Beta applications
```

---

## 8️⃣ **Domain & SSL**

```bash
# 1. Purchase domain: cybercorrect.com
# 2. Add DNS records:

A Record:
- Host: app
- Points to: Vercel IP (auto in Vercel)

CNAME Record:
- Host: www
- Points to: cname.vercel-dns.com

# 3. SSL certificate: Auto-provisioned by Vercel
```

---

## 9️⃣ **Testing Checklist**

### **Pre-Launch Tests:**

- [ ] User registration works
- [ ] Email verification works
- [ ] Login/logout works
- [ ] Password reset works
- [ ] Assessment completion saves to DB
- [ ] Stripe checkout works (live mode)
- [ ] Subscription upgrade/downgrade works
- [ ] Email notifications sent
- [ ] Error monitoring captures errors
- [ ] Analytics events tracked
- [ ] Mobile responsive
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## 🔟 **Portal Beta Setup (Optional - Can Defer)**

The Portal can launch as a prototype with manual workflows:

### **Manual Beta Workflow:**

1. **Applications** → Stored in Supabase (automated) ✅
2. **Review** → Manual in Supabase dashboard 👨‍💻
3. **Acceptance** → Manual email notification 📧
4. **Access Grant** → Manual flag update in DB 🔧
5. **Onboarding** → Manual email with instructions 📚

### **When to Automate:**

- After 50+ beta applications
- When white-label features are ready
- After successful co-creation phase

---

## 📊 **Production Monitoring**

### **Key Metrics to Track:**

1. **Platform Health:**
   - Uptime (99.9% target)
   - API response times
   - Error rates
   - Database performance

2. **Business Metrics:**
   - Sign-ups/day
   - Assessment completions
   - Free → Paid conversions
   - Churn rate
   - MRR (Monthly Recurring Revenue)

3. **Portal Beta:**
   - Applications received
   - Acceptance rate
   - Beta participant engagement
   - Feedback submissions

---

## 🚨 **Rollback Plan**

If issues occur in production:

```bash
# 1. Rollback to previous Vercel deployment
vercel rollback

# 2. Check error logs
vercel logs --follow

# 3. Database rollback (if needed)
# Run specific SQL commands to revert changes

# 4. Notify users via status page
```

---

## 📝 **Post-Launch Checklist**

- [ ] Monitor error rates for 24 hours
- [ ] Verify payment processing working
- [ ] Check email delivery rates
- [ ] Review analytics funnel
- [ ] Test customer support flow
- [ ] Update documentation
- [ ] Announce launch (marketing)

---

## 🎯 **Success Criteria**

### **Platform Production:**
- ✅ Zero critical bugs in first 48 hours
- ✅ Payment processing 100% functional
- ✅ <2s average page load time
- ✅ >99% uptime
- ✅ All emails delivered

### **Portal Beta:**
- ✅ 100 applications within 90 days
- ✅ 80% acceptance rate
- ✅ Weekly feedback from participants
- ✅ Path to white-label clear

---

## 📞 **Support Contacts**

**Technical Issues:**
- Supabase: support@supabase.io
- Stripe: support@stripe.com
- Vercel: support@vercel.com

**Emergency Contacts:**
- [Your email/phone]
- [Technical lead email/phone]

---

## 🔗 **Useful Links**

- Supabase Dashboard: https://supabase.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Vercel Dashboard: https://vercel.com/dashboard
- Sentry: https://sentry.io
- PostHog: https://app.posthog.com

---

**🎉 Ready to Launch!**

Follow this guide step-by-step, and the Platform will be production-ready in 2-4 days while Portal stays safely in beta prototype mode for white-label development.

