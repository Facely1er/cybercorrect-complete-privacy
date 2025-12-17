#!/usr/bin/env tsx
/**
 * Set All Edge Function Secrets via CLI
 * 
 * This script attempts to set all required secrets for Edge Functions.
 * 
 * Note: Some secrets (SUPABASE_*) may need to be set via Dashboard.
 * 
 * Usage:
 *   npm run secrets:set
 */

import { execSync } from 'child_process';

const PROJECT_REF = 'dfklqsdfycwjlcasfciu'; // CORE_REVENUE
const STRIPE_SECRET_KEY = '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';
const SITE_URL = 'https://www.cybercorrect.com';
const SUPABASE_URL = 'https://dfklqsdfycwjlcasfciu.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRma2xxc2RmeWN3amxjYXNmY2l1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

interface SecretConfig {
  function: string;
  secrets: { name: string; value: string }[];
}

const SECRETS_CONFIG: SecretConfig[] = [
  {
    function: 'create-checkout-session',
    secrets: [
      { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
      { name: 'SITE_URL', value: SITE_URL },
    ]
  },
  {
    function: 'create-one-time-checkout-session',
    secrets: [
      { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
      { name: 'SITE_URL', value: SITE_URL },
    ]
  },
  {
    function: 'stripe-webhook',
    secrets: [
      { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
      { name: 'SITE_URL', value: SITE_URL },
      // STRIPE_WEBHOOK_SECRET will be added after webhook creation
    ]
  },
  {
    function: 'send-email-notification',
    secrets: [
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    ]
  },
  {
    function: 'generate-automated-reports',
    secrets: [
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    ]
  },
  {
    function: 'run-scheduled-assessments',
    secrets: [
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    ]
  },
  {
    function: 'track-compliance-health',
    secrets: [
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    ]
  },
  {
    function: 'check-regulatory-updates',
    secrets: [
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    ]
  },
];

function setSecret(functionName: string, secretName: string, secretValue: string): { success: boolean; message: string } {
  try {
    // Note: Supabase CLI may have restrictions on setting secrets
    // We'll try the command and handle errors gracefully
    const command = `npx supabase secrets set ${secretName}="${secretValue}"`;
    execSync(command, { 
      stdio: 'pipe',
      encoding: 'utf-8',
      cwd: process.cwd(),
    });
    return { success: true, message: 'Set successfully' };
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    
    // Check if it's a known limitation
    if (errorMsg.includes('SUPABASE_') || errorMsg.includes('not allowed')) {
      return { 
        success: false, 
        message: 'Cannot set via CLI (use Dashboard)' 
      };
    }
    
    return { success: false, message: errorMsg.substring(0, 100) };
  }
}

async function main() {
  console.log('🔑 Setting Edge Function Secrets...\n');
  console.log(`📡 Project: ${PROJECT_REF} (CORE_REVENUE)\n`);
  console.log('='.repeat(60));

  const results: Array<{ function: string; secret: string; status: string; message: string }> = [];

  for (const config of SECRETS_CONFIG) {
    console.log(`\n📦 Function: ${config.function}`);
    console.log('─'.repeat(60));

    for (const secret of config.secrets) {
      console.log(`   Setting ${secret.name}...`);
      
      const result = setSecret(config.function, secret.name, secret.value);
      results.push({
        function: config.function,
        secret: secret.name,
        status: result.success ? '✅' : '⚠️',
        message: result.message
      });

      if (result.success) {
        console.log(`   ✅ ${secret.name} set successfully`);
      } else {
        console.log(`   ⚠️  ${secret.name}: ${result.message}`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:\n');

  const successCount = results.filter(r => r.status === '✅').length;
  const warningCount = results.filter(r => r.status === '⚠️').length;

  console.log(`   ✅ Successfully set: ${successCount}/${results.length}`);
  console.log(`   ⚠️  Needs manual setup: ${warningCount}/${results.length}\n`);

  if (warningCount > 0) {
    console.log('⚠️  Some secrets cannot be set via CLI.\n');
    console.log('📋 Manual Setup Required:\n');
    console.log('   1. Go to: https://supabase.com/dashboard/project/dfklqsdfycwjlcasfciu/settings/functions');
    console.log('   2. For each function, add the secrets listed in: SUPABASE_SECRETS_TO_SET.md');
    console.log('   3. See: DEPLOYMENT_SUCCESS.md for detailed instructions\n');
  } else {
    console.log('🎉 All secrets set successfully!\n');
  }

  console.log('📚 Next Steps:');
  console.log('   1. Create Stripe webhook (see STRIPE_DASHBOARD_SETUP.md)');
  console.log('   2. Add webhook secret to stripe-webhook function');
  console.log('   3. Test functions\n');
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

