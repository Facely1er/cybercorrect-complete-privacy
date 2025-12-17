/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Complete Stripe Integration Setup Script
 * 
 * This script completes the Stripe integration by:
 * 1. Configuring environment variables
 * 2. Setting up Supabase Edge Function secrets
 * 3. Deploying Edge Functions
 * 4. Verifying the setup
 * 
 * Usage:
 *   tsx scripts/complete-stripe-setup.ts
 * 
 * Or with explicit values:
 *   STRIPE_SECRET_KEY=sk_live_... STRIPE_PUBLISHABLE_KEY=pk_live_... tsx scripts/complete-stripe-setup.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Get values from environment variables or command line arguments
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || process.argv[2];
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || process.argv[3];
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || process.argv[4];
const SUPABASE_URL = process.env.SUPABASE_URL || process.argv[5];
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.argv[6];
const SITE_URL = process.env.SITE_URL || process.argv[7] || 'https://www.cybercorrect.com';

// Price IDs (can be provided via environment variables)
const PRICE_STARTER_MONTHLY = process.env.STRIPE_PRICE_STARTER_MONTHLY || process.argv[8];
const PRICE_STARTER_ANNUAL = process.env.STRIPE_PRICE_STARTER_ANNUAL || process.argv[9];
const PRICE_PROFESSIONAL_MONTHLY = process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || process.argv[10];
const PRICE_PROFESSIONAL_ANNUAL = process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL || process.argv[11];

const EDGE_FUNCTIONS = [
  'create-checkout-session',
  'create-one-time-checkout-session',
  'stripe-webhook',
];

interface SetupStep {
  name: string;
  status: 'pending' | 'success' | 'failed' | 'skipped';
  message?: string;
}

const steps: SetupStep[] = [];

function logStep(step: SetupStep) {
  const icons = {
    pending: '⏳',
    success: '✅',
    failed: '❌',
    skipped: '⏭️',
  };
  console.log(`${icons[step.status]} ${step.name}${step.message ? `: ${step.message}` : ''}`);
  steps.push(step);
}

function validateStripeKey(key: string | undefined, type: 'secret' | 'publishable'): boolean {
  if (!key) return false;
  if (type === 'secret') {
    return key.startsWith('sk_test_') || key.startsWith('sk_live_');
  } else {
    return key.startsWith('pk_test_') || key.startsWith('pk_live_');
  }
}

function validatePriceId(priceId: string | undefined): boolean {
  if (!priceId) return false;
  return priceId.startsWith('price_');
}

function checkSupabaseCLI(): boolean {
  try {
    execSync('npx supabase --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function setEdgeFunctionSecret(secretName: string, secretValue: string, functionName?: string): boolean {
  try {
    const command = `npx supabase secrets set ${secretName}=${secretValue}`;
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    return true;
  } catch (error: any) {
    console.error(`   Error: ${error.message || 'Unknown error'}`);
    return false;
  }
}

function deployEdgeFunction(functionName: string): boolean {
  try {
    const command = `npx supabase functions deploy ${functionName}`;
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: join(process.cwd(), 'supabase'),
    });
    return true;
  } catch (error: any) {
    console.error(`   Error: ${error.message || 'Unknown error'}`);
    return false;
  }
}

function createEnvFile(): boolean {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = `# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY || 'YOUR_PUBLISHABLE_KEY_HERE'}

# Supabase Configuration (if not already set)
# VITE_SUPABASE_URL=${SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE'}
# VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE

# Site URLs
VITE_FRAMEWORK_COMPLIANCE_URL=${SITE_URL}
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
`;

    // Check if .env exists
    if (existsSync(envPath)) {
      const existingContent = readFileSync(envPath, 'utf-8');
      // Update or add Stripe key
      if (existingContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
        const updatedContent = existingContent.replace(
          /VITE_STRIPE_PUBLISHABLE_KEY=.*/,
          `VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY || 'YOUR_PUBLISHABLE_KEY_HERE'}`
        );
        writeFileSync(envPath, updatedContent);
      } else {
        writeFileSync(envPath, existingContent + '\n' + envContent);
      }
    } else {
      writeFileSync(envPath, envContent);
    }
    return true;
  } catch (error: any) {
    console.error(`   Error: ${error.message || 'Unknown error'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Complete Stripe Integration Setup\n');
  console.log('='.repeat(70));

  // Validate inputs
  console.log('\n📋 Validating Inputs...\n');

  if (!STRIPE_SECRET_KEY) {
    logStep({
      name: 'Stripe Secret Key',
      status: 'failed',
      message: 'Missing (required)',
    });
    console.error('\n❌ Error: STRIPE_SECRET_KEY is required');
    console.error('   Usage: STRIPE_SECRET_KEY=sk_live_... tsx scripts/complete-stripe-setup.ts');
    console.error('   Or: tsx scripts/complete-stripe-setup.ts <secret_key> <publishable_key>');
    process.exit(1);
  }

  if (!validateStripeKey(STRIPE_SECRET_KEY, 'secret')) {
    logStep({
      name: 'Stripe Secret Key',
      status: 'failed',
      message: 'Invalid format',
    });
    console.error('\n❌ Error: Invalid Stripe secret key format');
    console.error('   Secret keys must start with "sk_test_" or "sk_live_"');
    process.exit(1);
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    logStep({
      name: 'Stripe Publishable Key',
      status: 'failed',
      message: 'Missing (required)',
    });
    console.error('\n❌ Error: STRIPE_PUBLISHABLE_KEY is required');
    process.exit(1);
  }

  if (!validateStripeKey(STRIPE_PUBLISHABLE_KEY, 'publishable')) {
    logStep({
      name: 'Stripe Publishable Key',
      status: 'failed',
      message: 'Invalid format',
    });
    console.error('\n❌ Error: Invalid Stripe publishable key format');
    console.error('   Publishable keys must start with "pk_test_" or "pk_live_"');
    process.exit(1);
  }

  // Check if keys match (both test or both live)
  const secretMode = STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'live' : 'test';
  const publishableMode = STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_') ? 'live' : 'test';
  
  if (secretMode !== publishableMode) {
    console.warn('\n⚠️  Warning: Secret key and publishable key are in different modes');
    console.warn(`   Secret: ${secretMode}, Publishable: ${publishableMode}`);
    console.warn('   They should both be test or both be live');
  }

  logStep({
    name: 'Stripe Secret Key',
    status: 'success',
    message: `${secretMode.toUpperCase()} mode`,
  });

  logStep({
    name: 'Stripe Publishable Key',
    status: 'success',
    message: `${publishableMode.toUpperCase()} mode`,
  });

  // Check Supabase CLI
  console.log('\n🔧 Checking Prerequisites...\n');
  
  if (!checkSupabaseCLI()) {
    logStep({
      name: 'Supabase CLI',
      status: 'failed',
      message: 'Not available',
    });
    console.error('\n❌ Error: Supabase CLI not available');
    console.error('   Using npx supabase (no installation required)');
    console.error('   If this fails, install: https://github.com/supabase/cli#install-the-cli');
    process.exit(1);
  }

  logStep({
    name: 'Supabase CLI',
    status: 'success',
    message: 'Available via npx',
  });

  // Step 1: Create/Update .env file
  console.log('\n📝 Step 1: Configuring Environment Variables...\n');
  
  if (createEnvFile()) {
    logStep({
      name: 'Create .env file',
      status: 'success',
    });
  } else {
    logStep({
      name: 'Create .env file',
      status: 'failed',
    });
  }

  // Step 2: Set Edge Function Secrets
  console.log('\n🔐 Step 2: Configuring Edge Function Secrets...\n');

  // Common secrets for all functions
  const commonSecrets = [
    { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
    { name: 'SUPABASE_URL', value: SUPABASE_URL },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    { name: 'SITE_URL', value: SITE_URL },
  ];

  // Set common secrets
  for (const secret of commonSecrets) {
    if (!secret.value) {
      logStep({
        name: `Set ${secret.name}`,
        status: 'skipped',
        message: 'Not provided',
      });
      continue;
    }

    if (setEdgeFunctionSecret(secret.name, secret.value)) {
      logStep({
        name: `Set ${secret.name}`,
        status: 'success',
      });
    } else {
      logStep({
        name: `Set ${secret.name}`,
        status: 'failed',
      });
    }
  }

  // Set webhook secret for stripe-webhook function
  if (STRIPE_WEBHOOK_SECRET) {
    if (setEdgeFunctionSecret('STRIPE_WEBHOOK_SECRET', STRIPE_WEBHOOK_SECRET)) {
      logStep({
        name: 'Set STRIPE_WEBHOOK_SECRET',
        status: 'success',
      });
    } else {
      logStep({
        name: 'Set STRIPE_WEBHOOK_SECRET',
        status: 'failed',
      });
    }
  } else {
    logStep({
      name: 'Set STRIPE_WEBHOOK_SECRET',
      status: 'skipped',
      message: 'Not provided (configure in Stripe Dashboard)',
    });
  }

  // Set price IDs for create-checkout-session
  const priceSecrets = [
    { name: 'STRIPE_PRICE_STARTER_MONTHLY', value: PRICE_STARTER_MONTHLY },
    { name: 'STRIPE_PRICE_STARTER_ANNUAL', value: PRICE_STARTER_ANNUAL },
    { name: 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', value: PRICE_PROFESSIONAL_MONTHLY },
    { name: 'STRIPE_PRICE_PROFESSIONAL_ANNUAL', value: PRICE_PROFESSIONAL_ANNUAL },
  ];

  console.log('\n💰 Setting Price IDs...\n');
  for (const secret of priceSecrets) {
    if (!secret.value) {
      logStep({
        name: `Set ${secret.name}`,
        status: 'skipped',
        message: 'Not provided (run get-stripe-price-ids.ts to get them)',
      });
      continue;
    }

    if (!validatePriceId(secret.value)) {
      logStep({
        name: `Set ${secret.name}`,
        status: 'failed',
        message: 'Invalid format (must start with "price_")',
      });
      continue;
    }

    if (setEdgeFunctionSecret(secret.name, secret.value)) {
      logStep({
        name: `Set ${secret.name}`,
        status: 'success',
      });
    } else {
      logStep({
        name: `Set ${secret.name}`,
        status: 'failed',
      });
    }
  }

  // Step 3: Deploy Edge Functions
  console.log('\n🚀 Step 3: Deploying Edge Functions...\n');

  for (const functionName of EDGE_FUNCTIONS) {
    if (deployEdgeFunction(functionName)) {
      logStep({
        name: `Deploy ${functionName}`,
        status: 'success',
      });
    } else {
      logStep({
        name: `Deploy ${functionName}`,
        status: 'failed',
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Summary:\n');

  const successCount = steps.filter(s => s.status === 'success').length;
  const failedCount = steps.filter(s => s.status === 'failed').length;
  const skippedCount = steps.filter(s => s.status === 'skipped').length;

  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log(`   ⏭️  Skipped: ${skippedCount}`);

  // Next steps
  console.log('\n📝 Next Steps:\n');

  if (failedCount === 0 && skippedCount === 0) {
    console.log('   ✅ All steps completed successfully!');
    console.log('\n   🧪 Test the integration:');
    console.log('      1. Restart your dev server: npm run dev');
    console.log('      2. Go to /pricing page');
    console.log('      3. Click "Subscribe Now" on a plan');
    console.log('      4. Complete checkout with test card: 4242 4242 4242 4242');
  } else {
    if (failedCount > 0) {
      console.log('   ⚠️  Some steps failed. Please check the errors above.');
    }
    if (skippedCount > 0) {
      console.log('   ⚠️  Some steps were skipped. You may need to:');
      if (steps.some(s => s.name.includes('PRICE') && s.status === 'skipped')) {
        console.log('      - Run: tsx scripts/get-stripe-price-ids.ts <STRIPE_SECRET_KEY>');
        console.log('      - Then set the price IDs as secrets');
      }
      if (steps.some(s => s.name.includes('WEBHOOK') && s.status === 'skipped')) {
        console.log('      - Configure webhook in Stripe Dashboard');
        console.log('      - Add webhook secret to Edge Functions');
      }
    }
  }

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});


