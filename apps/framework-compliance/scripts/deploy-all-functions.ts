#!/usr/bin/env tsx
/**
 * Deploy All Supabase Edge Functions via CLI
 * 
 * This script deploys all Edge Functions to Supabase.
 * 
 * Prerequisites:
 * - npx supabase login (or supabase CLI installed)
 * - npx supabase link --project-ref achowlksgmwuvfbvjfrt
 * 
 * Usage:
 *   npm run deploy:functions
 */

import { execSync } from 'child_process';

const PROJECT_REF = 'dfklqsdfycwjlcasfciu'; // CORE_REVENUE

const FUNCTIONS = [
  'create-checkout-session',
  'create-one-time-checkout-session',
  'stripe-webhook',
  'send-email-notification',
  'generate-automated-reports',
  'run-scheduled-assessments',
  'track-compliance-health',
  'check-regulatory-updates',
];

interface DeployResult {
  function: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
}

const results: DeployResult[] = [];

function checkSupabaseCLI(): boolean {
  try {
    execSync('npx supabase --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkSupabaseLink(): boolean {
  try {
    const output = execSync('npx supabase projects list', { 
      stdio: 'pipe',
      encoding: 'utf-8'
    });
    // Check if project is linked or if we can see projects
    return output.includes(PROJECT_REF) || output.length > 0;
  } catch {
    // If command fails, we might not be linked, but we can still try to deploy
    return false;
  }
}

function deployFunction(functionName: string): DeployResult {
  try {
    console.log(`\n📦 Deploying ${functionName}...`);
    
    const command = `npx supabase functions deploy ${functionName} --project-ref ${PROJECT_REF}`;
    
    const output = execSync(command, {
      stdio: 'inherit',
      encoding: 'utf-8',
      cwd: process.cwd(),
    });

    return {
      function: functionName,
      status: 'success',
      message: 'Deployed successfully'
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown error';
    
    // Check if function doesn't exist
    if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
      return {
        function: functionName,
        status: 'skipped',
        message: 'Function not found (may need to create first)'
      };
    }

    return {
      function: functionName,
      status: 'failed',
      message: errorMessage.substring(0, 100)
    };
  }
}

async function main() {
  console.log('🚀 Deploying All Supabase Edge Functions\n');
  console.log(`📡 Project: ${PROJECT_REF}`);
  console.log('='.repeat(60));

  // Check prerequisites
  console.log('\n🔍 Checking prerequisites...\n');

  if (!checkSupabaseCLI()) {
    console.error('❌ Supabase CLI not found.');
    console.log('\n💡 Using npx (no installation required):');
    console.log('   npx supabase --version\n');
    console.log('   If this fails, the CLI will be installed automatically via npx.\n');
  } else {
    console.log('✅ Supabase CLI available\n');
  }

  const isLinked = checkSupabaseLink();
  if (!isLinked) {
    console.log('⚠️  Project may not be linked.');
    console.log('   Attempting to deploy with --project-ref flag...\n');
    console.log('   If deployment fails, run:');
    console.log(`   npx supabase link --project-ref ${PROJECT_REF}\n`);
  } else {
    console.log('✅ Project appears to be linked\n');
  }

  // Deploy all functions
  console.log('📦 Deploying Functions...\n');
  console.log('='.repeat(60));

  for (const func of FUNCTIONS) {
    const result = deployFunction(func);
    results.push(result);
    
    // Small delay between deployments
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Display results
  console.log('\n' + '='.repeat(60));
  console.log('📊 Deployment Summary:\n');

  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    console.log(`${icon} ${result.function}`);
    console.log(`   ${result.message}\n`);

    if (result.status === 'success') successCount++;
    else if (result.status === 'failed') failCount++;
    else skipCount++;
  });

  console.log('='.repeat(60));
  console.log(`\n📈 Results: ${successCount} succeeded, ${failCount} failed, ${skipCount} skipped\n`);

  if (failCount === 0 && skipCount === 0) {
    console.log('🎉 All functions deployed successfully!\n');
    console.log('📋 Next Steps:');
    console.log('   1. Set Edge Function secrets (see SUPABASE_SECRETS_TO_SET.md)');
    console.log('   2. Create Stripe webhook');
    console.log('   3. Verify deployment in Supabase Dashboard\n');
    process.exit(0);
  } else if (failCount === 0) {
    console.log('⚠️  Some functions were skipped (may need to be created first).\n');
    console.log('📋 Next Steps:');
    console.log('   1. Check Supabase Dashboard for function status');
    console.log('   2. Create any missing functions manually if needed');
    console.log('   3. Set Edge Function secrets\n');
    process.exit(0);
  } else {
    console.log('❌ Some deployments failed.\n');
    console.log('📋 Troubleshooting:');
    console.log('   1. Ensure you are logged in: npx supabase login');
    console.log('   2. Link project: npx supabase link --project-ref ' + PROJECT_REF);
    console.log('   3. Check function files exist in: supabase/functions/');
    console.log('   4. Try deploying manually via Supabase Dashboard\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

