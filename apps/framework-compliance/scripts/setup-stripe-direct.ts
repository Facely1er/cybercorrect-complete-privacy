/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Direct Stripe Setup using Supabase Management API
 * 
 * This script sets Edge Function secrets directly via Supabase Management API
 * without requiring CLI login.
 * 
 * Usage:
 *   tsx scripts/setup-stripe-direct.ts
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Supabase configuration (found in migration scripts)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

// Stripe keys (from .env and script)
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY; // Need fresh key

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Error: Could not extract project ref from Supabase URL');
  process.exit(1);
}

const MANAGEMENT_API_URL = `https://api.supabase.com/v1/projects/${projectRef}/secrets`;

interface Secret {
  name: string;
  value: string;
}

async function setSecretViaAPI(secret: Secret): Promise<boolean> {
  try {
    const response = await fetch(MANAGEMENT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: secret.name,
        value: secret.value,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`   Error: ${response.status} - ${errorText}`);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error(`   Error: ${error.message || 'Unknown error'}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Direct Stripe Setup via Supabase Management API\n');
  console.log('='.repeat(70));

  console.log('\n📋 Configuration:');
  console.log(`   Supabase Project: ${projectRef}`);
  console.log(`   Supabase URL: ${SUPABASE_URL}`);
  console.log(`   Stripe Publishable Key: ${STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...`);

  if (!STRIPE_SECRET_KEY) {
    console.error('\n❌ Error: STRIPE_SECRET_KEY environment variable is required');
    console.error('   The key in the script is expired. Please provide a fresh key:');
    console.error('   $env:STRIPE_SECRET_KEY="sk_live_..."');
    console.error('\n   You can get it from: https://dashboard.stripe.com/apikeys');
    process.exit(1);
  }

  console.log(`   Stripe Secret Key: ${STRIPE_SECRET_KEY.substring(0, 20)}...`);

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

  // Set secrets via Management API
  console.log('\n🔐 Setting Edge Function secrets via Management API...\n');

  const commonSecrets: Secret[] = [
    { name: 'STRIPE_SECRET_KEY', value: STRIPE_SECRET_KEY },
    { name: 'SUPABASE_URL', value: SUPABASE_URL },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_ROLE_KEY },
    { name: 'SITE_URL', value: 'https://www.platform.cybercorrect.com' },
  ];

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    commonSecrets.push({ name: 'STRIPE_WEBHOOK_SECRET', value: process.env.STRIPE_WEBHOOK_SECRET });
  }

  if (process.env.STRIPE_PRICE_STARTER_MONTHLY) {
    commonSecrets.push({ name: 'STRIPE_PRICE_STARTER_MONTHLY', value: process.env.STRIPE_PRICE_STARTER_MONTHLY });
  }
  if (process.env.STRIPE_PRICE_STARTER_ANNUAL) {
    commonSecrets.push({ name: 'STRIPE_PRICE_STARTER_ANNUAL', value: process.env.STRIPE_PRICE_STARTER_ANNUAL });
  }
  if (process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY) {
    commonSecrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', value: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY });
  }
  if (process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL) {
    commonSecrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_ANNUAL', value: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL });
  }

  let successCount = 0;
  for (const secret of commonSecrets) {
    console.log(`Setting ${secret.name}...`);
    if (await setSecretViaAPI(secret)) {
      console.log(`✅ Set ${secret.name}`);
      successCount++;
    } else {
      console.log(`❌ Failed to set ${secret.name}`);
    }
  }

  console.log(`\n✅ Configured ${successCount}/${commonSecrets.length} secrets`);

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Summary:\n');
  console.log('✅ Frontend configured (.env file updated)');
  console.log(`✅ Backend secrets configured: ${successCount}/${commonSecrets.length}`);

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('\n⚠️  Webhook secret not provided. You need to:');
    console.log('   1. Create webhook in Stripe Dashboard');
    console.log('   2. Set webhook secret:');
    console.log('      $env:STRIPE_WEBHOOK_SECRET="whsec_..."');
    console.log('      tsx scripts/setup-stripe-direct.ts');
  }

  if (!process.env.STRIPE_PRICE_STARTER_MONTHLY) {
    console.log('\n⚠️  Price IDs not provided. You need to:');
    console.log('   1. Create products in Stripe Dashboard');
    console.log('   2. Get Price IDs');
    console.log('   3. Set them as environment variables and run this script again');
  }

  console.log('\n📝 Next Steps:');
  console.log('   1. Deploy Edge Functions (via Supabase Dashboard or CLI)');
  console.log('   2. Configure webhook in Stripe Dashboard');
  console.log('   3. Test checkout flow');

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});


