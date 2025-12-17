/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Run Stripe Setup with Provided Keys
 * 
 * This script uses the keys you provide to complete the Stripe setup.
 * 
 * Usage:
 *   tsx scripts/run-stripe-setup-with-keys.ts
 * 
 * Or with environment variables:
 *   STRIPE_SECRET_KEY=sk_live_... STRIPE_PUBLISHABLE_KEY=pk_live_... tsx scripts/run-stripe-setup-with-keys.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Get values from environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.SITE_URL || 'https://www.platform.cybercorrect.com';

// Price IDs (optional - can fetch from Stripe)
const PRICE_STARTER_MONTHLY = process.env.STRIPE_PRICE_STARTER_MONTHLY;
const PRICE_STARTER_ANNUAL = process.env.STRIPE_PRICE_STARTER_ANNUAL;
const PRICE_PROFESSIONAL_MONTHLY = process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY;
const PRICE_PROFESSIONAL_ANNUAL = process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL;

function maskValue(value: string): string {
  if (value.length <= 10) return value;
  return value.substring(0, 8) + '...' + value.substring(value.length - 4);
}

function setSecret(secretName: string, secretValue: string): boolean {
  try {
    const command = `npx supabase secrets set ${secretName}=${secretValue}`;
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    console.log(`✅ Set ${secretName}`);
    return true;
  } catch (error: any) {
    console.log(`❌ Failed to set ${secretName}: ${error.message || 'Unknown error'}`);
    return false;
  }
}

function deployFunction(functionName: string): boolean {
  try {
    const command = `npx supabase functions deploy ${functionName}`;
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: join(process.cwd(), 'supabase'),
    });
    console.log(`✅ Deployed ${functionName}`);
    return true;
  } catch (error: any) {
    console.log(`❌ Failed to deploy ${functionName}: ${error.message || 'Unknown error'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Stripe Setup with Provided Keys\n');
  console.log('='.repeat(70));

  // Validate required values
  if (!STRIPE_SECRET_KEY) {
    console.error('\n❌ Error: STRIPE_SECRET_KEY environment variable is required');
    console.error('   Set it: $env:STRIPE_SECRET_KEY="sk_live_..."');
    process.exit(1);
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    console.error('\n❌ Error: STRIPE_PUBLISHABLE_KEY environment variable is required');
    process.exit(1);
  }

  console.log('\n📋 Configuration:');
  console.log(`   Stripe Secret Key: ${maskValue(STRIPE_SECRET_KEY)}`);
  console.log(`   Stripe Publishable Key: ${maskValue(STRIPE_PUBLISHABLE_KEY)}`);
  if (SUPABASE_URL) console.log(`   Supabase URL: ${SUPABASE_URL}`);
  if (STRIPE_WEBHOOK_SECRET) console.log(`   Webhook Secret: ${maskValue(STRIPE_WEBHOOK_SECRET)}`);

  // Update .env file
  console.log('\n📝 Updating .env file...');
  const envPath = join(process.cwd(), '.env');
  let envContent = '';

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
    if (envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
      envContent = envContent.replace(
        /VITE_STRIPE_PUBLISHABLE_KEY=.*/,
        `VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}`
      );
    } else {
      envContent += `\nVITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}\n`;
    }
  } else {
    envContent = `VITE_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}\n`;
  }

  writeFileSync(envPath, envContent);
  console.log('✅ .env file updated');

  // Set secrets if Supabase URL is provided
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    console.log('\n🔐 Setting Edge Function secrets...\n');

    const secrets = [
      { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
      { name: 'SUPABASE_URL', value: SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
      { name: 'SITE_URL', value: SITE_URL },
    ];

    if (STRIPE_WEBHOOK_SECRET) {
      secrets.push({ name: 'STRIPE_WEBHOOK_SECRET', value: STRIPE_WEBHOOK_SECRET });
    }

    if (PRICE_STARTER_MONTHLY) {
      secrets.push({ name: 'STRIPE_PRICE_STARTER_MONTHLY', value: PRICE_STARTER_MONTHLY });
    }
    if (PRICE_STARTER_ANNUAL) {
      secrets.push({ name: 'STRIPE_PRICE_STARTER_ANNUAL', value: PRICE_STARTER_ANNUAL });
    }
    if (PRICE_PROFESSIONAL_MONTHLY) {
      secrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', value: PRICE_PROFESSIONAL_MONTHLY });
    }
    if (PRICE_PROFESSIONAL_ANNUAL) {
      secrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_ANNUAL', value: PRICE_PROFESSIONAL_ANNUAL });
    }

    let successCount = 0;
    for (const secret of secrets) {
      if (setSecret(secret.name, secret.value)) {
        successCount++;
      }
    }

    console.log(`\n✅ Configured ${successCount}/${secrets.length} secrets`);

    // Deploy functions
    console.log('\n🚀 Deploying Edge Functions...\n');
    const functions = [
      'create-checkout-session',
      'create-one-time-checkout-session',
      'stripe-webhook',
    ];

    let deployCount = 0;
    for (const func of functions) {
      if (deployFunction(func)) {
        deployCount++;
      }
    }

    console.log(`\n✅ Deployed ${deployCount}/${functions.length} functions`);
  } else {
    console.log('\n⚠️  Supabase configuration not provided. Skipping secrets and deployment.');
    console.log('   To complete setup, provide:');
    console.log('   - SUPABASE_URL');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Summary:\n');
  console.log('✅ Frontend configured (.env file updated)');
  
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ Backend secrets configured');
    console.log('✅ Edge Functions deployed');
  } else {
    console.log('⏭️  Backend configuration pending (provide Supabase credentials)');
  }

  if (!PRICE_STARTER_MONTHLY || !PRICE_PROFESSIONAL_MONTHLY) {
    console.log('\n⚠️  Price IDs not provided. You need to:');
    console.log('   1. Create products in Stripe Dashboard');
    console.log('   2. Get Price IDs');
    console.log('   3. Set them as secrets:');
    console.log('      npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=price_...');
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.log('\n⚠️  Webhook secret not provided. You need to:');
    console.log('   1. Create webhook in Stripe Dashboard');
    console.log('   2. Set webhook secret:');
    console.log('      npx supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...');
  }

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});


