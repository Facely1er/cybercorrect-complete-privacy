/**
 * Diagnostic script to identify Stripe checkout issues
 * 
 * This script checks:
 * 1. Environment variables (VITE_STRIPE_PUBLISHABLE_KEY)
 * 2. Supabase configuration
 * 3. Edge Function availability
 * 4. Edge Function secrets (if accessible)
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), '.env') });
config({ path: join(process.cwd(), '.env.local') });

interface DiagnosticResult {
  check: string;
  status: '✅' | '❌' | '⚠️';
  message: string;
  details?: string;
  fix?: string;
}

const results: DiagnosticResult[] = [];

function addResult(check: string, status: '✅' | '❌' | '⚠️', message: string, details?: string, fix?: string) {
  results.push({ check, status, message, details, fix });
}

console.log('🔍 Stripe Checkout Diagnostic Tool\n');
console.log('='.repeat(60));

// Check 1: Frontend Environment Variables
console.log('\n📋 Checking Frontend Environment Variables...\n');

const stripePublishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;
if (stripePublishableKey) {
  if (stripePublishableKey.startsWith('pk_live_') || stripePublishableKey.startsWith('pk_test_')) {
    addResult(
      'VITE_STRIPE_PUBLISHABLE_KEY',
      '✅',
      'Stripe publishable key is configured',
      `Key starts with: ${stripePublishableKey.substring(0, 12)}...`
    );
  } else {
    addResult(
      'VITE_STRIPE_PUBLISHABLE_KEY',
      '❌',
      'Invalid Stripe publishable key format',
      `Key should start with "pk_live_" or "pk_test_"`,
      'Update .env file with correct key: VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...'
    );
  }
} else {
  addResult(
    'VITE_STRIPE_PUBLISHABLE_KEY',
    '❌',
    'Stripe publishable key is missing',
    'Required for frontend checkout initialization',
    'Add to .env file: VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...'
  );
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseAnonKey) {
  addResult(
    'Supabase Configuration',
    '✅',
    'Supabase is configured',
    `URL: ${supabaseUrl.substring(0, 30)}...`
  );
} else {
  addResult(
    'Supabase Configuration',
    '❌',
    'Supabase is not configured',
    'Required for Edge Function calls',
    'Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env file'
  );
}

// Check 2: Edge Function Files
console.log('\n📦 Checking Edge Function Files...\n');

const edgeFunctionPath = join(process.cwd(), 'supabase', 'functions', 'create-one-time-checkout-session', 'index.ts');
try {
  const functionContent = readFileSync(edgeFunctionPath, 'utf-8');
  if (functionContent.includes('STRIPE_SECRET_KEY')) {
    addResult(
      'Edge Function File',
      '✅',
      'create-one-time-checkout-session function exists',
      'File found and contains Stripe integration'
    );
  } else {
    addResult(
      'Edge Function File',
      '⚠️',
      'Function file exists but may be incomplete',
      'Check if STRIPE_SECRET_KEY is referenced'
    );
  }
} catch {
  addResult(
    'Edge Function File',
    '❌',
    'Edge Function file not found',
    `Path: ${edgeFunctionPath}`,
    'Ensure the function is deployed: npx supabase functions deploy create-one-time-checkout-session'
  );
}

// Check 3: Edge Function Deployment Status
console.log('\n🚀 Checking Edge Function Deployment...\n');

addResult(
  'Edge Function Deployment',
  '⚠️',
  'Cannot verify deployment status automatically',
  'Please check manually in Supabase Dashboard',
  'Go to: https://supabase.com/dashboard → Edge Functions → create-one-time-checkout-session'
);

// Check 4: Edge Function Secrets
console.log('\n🔑 Checking Edge Function Secrets...\n');

addResult(
  'Edge Function Secrets',
  '⚠️',
  'Cannot verify secrets automatically',
  'Secrets are stored in Supabase Dashboard',
  'Verify in Supabase Dashboard → Edge Functions → create-one-time-checkout-session → Secrets\n' +
  'Required secrets:\n' +
  '  - STRIPE_SECRET_KEY (should start with sk_live_ or sk_test_)\n' +
  '  - SITE_URL (e.g., https://www.cybercorrect.com)'
);

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Diagnostic Summary:\n');

results.forEach(result => {
  console.log(`${result.status} ${result.check}`);
  console.log(`   ${result.message}`);
  if (result.details) {
    console.log(`   Details: ${result.details}`);
  }
  if (result.fix) {
    console.log(`   Fix: ${result.fix}`);
  }
  console.log('');
});

const errorCount = results.filter(r => r.status === '❌').length;
const warningCount = results.filter(r => r.status === '⚠️').length;
const successCount = results.filter(r => r.status === '✅').length;

console.log('='.repeat(60));
console.log(`\n✅ Passed: ${successCount} | ⚠️  Warnings: ${warningCount} | ❌ Errors: ${errorCount}\n`);

if (errorCount > 0) {
  console.log('❌ Issues found that need to be fixed before checkout will work.\n');
  process.exit(1);
} else if (warningCount > 0) {
  console.log('⚠️  Some checks require manual verification. Please review the warnings above.\n');
  process.exit(0);
} else {
  console.log('✅ All automated checks passed! If checkout still fails, check Edge Function logs in Supabase Dashboard.\n');
  process.exit(0);
}

