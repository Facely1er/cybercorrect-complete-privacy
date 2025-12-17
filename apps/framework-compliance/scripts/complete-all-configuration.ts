#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Complete All Configuration - Automated Setup
 * 
 * This script attempts to complete as much configuration as possible:
 * - Creates .env.local with all environment variables
 * - Generates configuration files
 * - Provides step-by-step instructions for manual steps
 * 
 * Usage:
 *   npm run config:complete
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O';
const STRIPE_SECRET_KEY = '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';
const SITE_URL = 'https://www.cybercorrect.com';

interface ConfigStep {
  name: string;
  status: '✅' | '⚠️' | '❌';
  message: string;
  action?: string;
}

const steps: ConfigStep[] = [];

function createEnvFile(): void {
  const envPath = join(process.cwd(), '.env.local');
  const envContent = `# CyberCorrect Configuration
# Generated: ${new Date().toISOString()}

# Supabase
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}

# Site
VITE_SITE_URL=${SITE_URL}
`;

  writeFileSync(envPath, envContent, 'utf-8');
  steps.push({
    name: 'Environment Variables',
    status: '✅',
    message: 'Created .env.local with all required variables'
  });
}

function createSupabaseSecretsFile(): void {
  const secretsPath = join(process.cwd(), 'SUPABASE_SECRETS_TO_SET.md');
  const secretsContent = `# Supabase Edge Function Secrets - Ready to Copy

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

## Function: create-checkout-session

| Secret Name | Secret Value |
|------------|--------------|
| \`STRIPE_SECRET_KEY\` | \`${STRIPE_SECRET_KEY}\` |
| \`SITE_URL\` | \`${SITE_URL}\` |

## Function: create-one-time-checkout-session

| Secret Name | Secret Value |
|------------|--------------|
| \`STRIPE_SECRET_KEY\` | \`${STRIPE_SECRET_KEY}\` |
| \`SITE_URL\` | \`${SITE_URL}\` |

## Function: stripe-webhook

| Secret Name | Secret Value |
|------------|--------------|
| \`STRIPE_SECRET_KEY\` | \`${STRIPE_SECRET_KEY}\` |
| \`SITE_URL\` | \`${SITE_URL}\` |
| \`STRIPE_WEBHOOK_SECRET\` | \`whsec_...\` (get from Stripe Dashboard after creating webhook) |

## Function: send-email-notification

| Secret Name | Secret Value |
|------------|--------------|
| \`SUPABASE_URL\` | \`${SUPABASE_URL}\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | \`${SUPABASE_SERVICE_ROLE_KEY}\` |

## Function: generate-automated-reports

| Secret Name | Secret Value |
|------------|--------------|
| \`SUPABASE_URL\` | \`${SUPABASE_URL}\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | \`${SUPABASE_SERVICE_ROLE_KEY}\` |

## Function: run-scheduled-assessments

| Secret Name | Secret Value |
|------------|--------------|
| \`SUPABASE_URL\` | \`${SUPABASE_URL}\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | \`${SUPABASE_SERVICE_ROLE_KEY}\` |

## Function: track-compliance-health

| Secret Name | Secret Value |
|------------|--------------|
| \`SUPABASE_URL\` | \`${SUPABASE_URL}\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | \`${SUPABASE_SERVICE_ROLE_KEY}\` |

## Function: check-regulatory-updates

| Secret Name | Secret Value |
|------------|--------------|
| \`SUPABASE_URL\` | \`${SUPABASE_URL}\` |
| \`SUPABASE_SERVICE_ROLE_KEY\` | \`${SUPABASE_SERVICE_ROLE_KEY}\` |

---

**Next Steps:**
1. Go to Supabase Dashboard → Edge Functions → Settings → Secrets
2. For each function, add the secrets listed above
3. Deploy all functions
4. Create Stripe webhook
`;

  writeFileSync(secretsPath, secretsContent, 'utf-8');
  steps.push({
    name: 'Secrets Reference',
    status: '✅',
    message: 'Created SUPABASE_SECRETS_TO_SET.md with all secrets ready to copy'
  });
}

function createDeploymentChecklist(): void {
  const checklistPath = join(process.cwd(), 'CONFIGURATION_CHECKLIST.md');
  const checklistContent = `# ✅ Configuration Checklist

**Date:** ${new Date().toISOString().split('T')[0]}

## ✅ Automated (Completed)

- [x] Environment variables file created (.env.local)
- [x] Secrets reference file created (SUPABASE_SECRETS_TO_SET.md)
- [x] Configuration documentation created

## ⚠️ Manual Steps Required

### Step 1: Deploy Edge Functions (10-15 min)

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

Deploy these 8 functions:
- [ ] create-checkout-session
- [ ] create-one-time-checkout-session
- [ ] stripe-webhook
- [ ] send-email-notification
- [ ] generate-automated-reports
- [ ] run-scheduled-assessments
- [ ] track-compliance-health
- [ ] check-regulatory-updates

### Step 2: Set Edge Function Secrets (10-15 min)

**Go to:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

**Reference:** See SUPABASE_SECRETS_TO_SET.md for all secrets

For each function:
- [ ] create-checkout-session (2 secrets)
- [ ] create-one-time-checkout-session (2 secrets)
- [ ] stripe-webhook (3 secrets - webhook secret after Step 3)
- [ ] send-email-notification (2 secrets)
- [ ] generate-automated-reports (2 secrets)
- [ ] run-scheduled-assessments (2 secrets)
- [ ] track-compliance-health (2 secrets)
- [ ] check-regulatory-updates (2 secrets)

### Step 3: Create Stripe Webhook (5 min)

1. **Go to:** https://dashboard.stripe.com/webhooks
2. **Click:** "+ Add endpoint"
3. **Endpoint URL:** \`https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook\`
4. **Events:**
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
5. **Copy webhook secret** (whsec_...)
6. **Add to stripe-webhook function** as STRIPE_WEBHOOK_SECRET

### Step 4: Set Deployment Platform Variables (5 min)

Set in Vercel/Netlify/Your Platform:

- [ ] VITE_SUPABASE_URL = ${SUPABASE_URL}
- [ ] VITE_SUPABASE_ANON_KEY = ${SUPABASE_ANON_KEY}
- [ ] VITE_STRIPE_PUBLISHABLE_KEY = ${STRIPE_PUBLISHABLE_KEY}

### Step 5: Verify (5 min)

- [ ] All functions deployed and active
- [ ] All secrets set
- [ ] Webhook created
- [ ] Test checkout flow

---

## 📊 Progress

**Automated:** ✅ Complete  
**Manual:** ⚠️ Requires Dashboard access

**Estimated Time Remaining:** 30-40 minutes

---

## 📚 Reference Files

- **Secrets:** SUPABASE_SECRETS_TO_SET.md
- **Complete Guide:** SUPABASE_CONFIGURATION_COMPLETE.md
- **Quick Reference:** SUPABASE_SECRETS_QUICK_REFERENCE.md
`;

  writeFileSync(checklistPath, checklistContent, 'utf-8');
  steps.push({
    name: 'Deployment Checklist',
    status: '✅',
    message: 'Created CONFIGURATION_CHECKLIST.md with step-by-step tasks'
  });
}

function createQuickStartGuide(): void {
  const guidePath = join(process.cwd(), 'QUICK_START_CONFIGURATION.md');
  const guideContent = `# 🚀 Quick Start - Complete Configuration

**Time Required:** 30-40 minutes

---

## ✅ What's Already Done

- ✅ Environment variables file created (.env.local)
- ✅ All secrets documented and ready to copy
- ✅ Configuration files generated

---

## 📋 Next Steps (In Order)

### 1. Deploy Edge Functions (10-15 min)

**URL:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions

Click "Deploy" for each function:
1. create-checkout-session
2. create-one-time-checkout-session
3. stripe-webhook
4. send-email-notification
5. generate-automated-reports
6. run-scheduled-assessments
7. track-compliance-health
8. check-regulatory-updates

### 2. Set Secrets (10-15 min)

**URL:** https://app.supabase.com/project/achowlksgmwuvfbvjfrt/settings/functions

**Reference:** Open SUPABASE_SECRETS_TO_SET.md

For each function, add the secrets listed in the reference file.

### 3. Create Stripe Webhook (5 min)

**URL:** https://dashboard.stripe.com/webhooks

1. Click "+ Add endpoint"
2. Endpoint: \`https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook\`
3. Select events (see main guide)
4. Copy webhook secret
5. Add to stripe-webhook function

### 4. Set Deployment Variables (5 min)

Add to your deployment platform:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLISHABLE_KEY

### 5. Test (5 min)

- Test checkout flow
- Verify webhook receives events

---

## 📚 Full Documentation

- **Complete Guide:** SUPABASE_CONFIGURATION_COMPLETE.md
- **Secrets Reference:** SUPABASE_SECRETS_TO_SET.md
- **Checklist:** CONFIGURATION_CHECKLIST.md

---

**Ready to start!** Follow the steps above. 🎉
`;

  writeFileSync(guidePath, guideContent, 'utf-8');
  steps.push({
    name: 'Quick Start Guide',
    status: '✅',
    message: 'Created QUICK_START_CONFIGURATION.md'
  });
}

async function main() {
  console.log('🚀 Completing All Configuration...\n');
  console.log('='.repeat(60));

  // Create all configuration files
  createEnvFile();
  createSupabaseSecretsFile();
  createDeploymentChecklist();
  createQuickStartGuide();

  // Display results
  console.log('\n📊 Configuration Summary:\n');
  steps.forEach(step => {
    console.log(`${step.status} ${step.name}`);
    console.log(`   ${step.message}\n`);
  });

  console.log('='.repeat(60));
  console.log('\n✅ Automated Configuration Complete!\n');
  console.log('📋 Next Steps:\n');
  console.log('1. Review: QUICK_START_CONFIGURATION.md');
  console.log('2. Follow: CONFIGURATION_CHECKLIST.md');
  console.log('3. Use: SUPABASE_SECRETS_TO_SET.md for secrets\n');
  console.log('⚠️  Manual Steps Required:');
  console.log('   - Deploy Edge Functions (Supabase Dashboard)');
  console.log('   - Set Secrets (Supabase Dashboard)');
  console.log('   - Create Stripe Webhook (Stripe Dashboard)');
  console.log('   - Set Deployment Platform Variables\n');
  console.log('📚 All files created in: apps/framework-compliance/\n');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});

