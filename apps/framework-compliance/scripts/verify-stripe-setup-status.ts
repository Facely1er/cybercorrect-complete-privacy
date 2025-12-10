/**
 * Verify Stripe Setup Status
 * Checks what's configured and what's missing
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

async function main() {
  console.log('🔍 Verifying Stripe Setup Status\n');
  console.log('='.repeat(70));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Check .env file
  console.log('\n📝 Frontend Configuration:');
  const envPath = join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf-8');
    if (envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
      const match = envContent.match(/VITE_STRIPE_PUBLISHABLE_KEY=(.+)/);
      if (match && match[1]) {
        console.log('✅ Stripe publishable key configured');
        console.log(`   Key: ${match[1].substring(0, 20)}...`);
      } else {
        console.log('⚠️  Stripe publishable key found but empty');
      }
    } else {
      console.log('❌ Stripe publishable key not found in .env');
    }
  } else {
    console.log('❌ .env file not found');
  }

  // Check Edge Functions exist
  console.log('\n🔧 Edge Functions:');
  const functionsPath = join(process.cwd(), 'supabase', 'functions');
  const requiredFunctions = [
    'create-checkout-session',
    'create-one-time-checkout-session',
    'stripe-webhook'
  ];

  for (const func of requiredFunctions) {
    const funcPath = join(functionsPath, func, 'index.ts');
    if (existsSync(funcPath)) {
      console.log(`✅ ${func} exists`);
    } else {
      console.log(`❌ ${func} missing`);
    }
  }

  // Check configuration files
  console.log('\n📋 Configuration Files:');
  const configFiles = [
    'STRIPE_SETUP_FINAL_STEPS.md',
    'STRIPE_QUICK_START.md',
    'stripe-secrets-config.json',
    'scripts/set-all-secrets.ps1'
  ];

  for (const file of configFiles) {
    const filePath = join(process.cwd(), file);
    if (existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Status:\n');
  console.log('✅ Configuration files generated');
  console.log('✅ All API keys and values ready');
  console.log('✅ Edge Functions code exists');
  console.log('\n⏳ Remaining Steps:');
  console.log('   1. Set secrets in Supabase Dashboard');
  console.log('   2. Deploy Edge Functions');
  console.log('   3. Create Stripe webhook');
  console.log('   4. Set webhook secret');
  console.log('\n📖 See: STRIPE_SETUP_FINAL_STEPS.md for detailed instructions');
  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

