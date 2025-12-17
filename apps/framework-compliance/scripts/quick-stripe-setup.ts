/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Quick Stripe Setup Script
 * 
 * Interactive script to quickly set up Stripe integration.
 * Prompts for required values if not provided as environment variables.
 * 
 * Usage:
 *   tsx scripts/quick-stripe-setup.ts
 */

import * as readline from 'readline';
import { execSync } from 'child_process';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function maskValue(value: string): string {
  if (value.length <= 10) return value;
  return value.substring(0, 8) + '...' + value.substring(value.length - 4);
}

async function main() {
  console.log('🚀 Quick Stripe Integration Setup\n');
  console.log('='.repeat(70));
  console.log('\nThis script will help you configure Stripe integration.\n');
  console.log('You can skip any step by pressing Enter (if already configured).\n');

  // Collect values
  const config: Record<string, string> = {};

  // Stripe Secret Key
  config.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
  if (!config.STRIPE_SECRET_KEY) {
    config.STRIPE_SECRET_KEY = await question('Enter Stripe Secret Key (sk_live_... or sk_test_...): ');
  } else {
    console.log(`✅ Stripe Secret Key: ${maskValue(config.STRIPE_SECRET_KEY)} (from environment)`);
  }

  // Stripe Publishable Key
  config.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
  if (!config.STRIPE_PUBLISHABLE_KEY) {
    config.STRIPE_PUBLISHABLE_KEY = await question('Enter Stripe Publishable Key (pk_live_... or pk_test_...): ');
  } else {
    console.log(`✅ Stripe Publishable Key: ${maskValue(config.STRIPE_PUBLISHABLE_KEY)} (from environment)`);
  }

  // Supabase URL
  config.SUPABASE_URL = process.env.SUPABASE_URL || '';
  if (!config.SUPABASE_URL) {
    config.SUPABASE_URL = await question('Enter Supabase URL (https://xxx.supabase.co): ');
  } else {
    console.log(`✅ Supabase URL: ${config.SUPABASE_URL} (from environment)`);
  }

  // Supabase Service Role Key
  config.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!config.SUPABASE_SERVICE_ROLE_KEY) {
    config.SUPABASE_SERVICE_ROLE_KEY = await question('Enter Supabase Service Role Key: ');
  } else {
    console.log(`✅ Supabase Service Role Key: ${maskValue(config.SUPABASE_SERVICE_ROLE_KEY)} (from environment)`);
  }

  // Site URL
  config.SITE_URL = process.env.SITE_URL || 'https://www.cybercorrect.com';
  const siteUrlInput = await question(`Enter Site URL [${config.SITE_URL}]: `);
  if (siteUrlInput.trim()) {
    config.SITE_URL = siteUrlInput.trim();
  }

  // Webhook Secret (optional)
  config.STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!config.STRIPE_WEBHOOK_SECRET) {
    const webhookInput = await question('Enter Stripe Webhook Secret (whsec_...) [optional, can set later]: ');
    if (webhookInput.trim()) {
      config.STRIPE_WEBHOOK_SECRET = webhookInput.trim();
    }
  } else {
    console.log(`✅ Webhook Secret: ${maskValue(config.STRIPE_WEBHOOK_SECRET)} (from environment)`);
  }

  // Price IDs (optional - can fetch later)
  console.log('\n💰 Price IDs (optional - you can set these later):');
  config.PRICE_STARTER_MONTHLY = process.env.STRIPE_PRICE_STARTER_MONTHLY || '';
  if (!config.PRICE_STARTER_MONTHLY) {
    const priceInput = await question('Enter Starter Monthly Price ID (price_...) [optional]: ');
    if (priceInput.trim()) {
      config.PRICE_STARTER_MONTHLY = priceInput.trim();
    }
  }

  config.PRICE_STARTER_ANNUAL = process.env.STRIPE_PRICE_STARTER_ANNUAL || '';
  if (!config.PRICE_STARTER_ANNUAL) {
    const priceInput = await question('Enter Starter Annual Price ID (price_...) [optional]: ');
    if (priceInput.trim()) {
      config.PRICE_STARTER_ANNUAL = priceInput.trim();
    }
  }

  config.PRICE_PROFESSIONAL_MONTHLY = process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || '';
  if (!config.PRICE_PROFESSIONAL_MONTHLY) {
    const priceInput = await question('Enter Professional Monthly Price ID (price_...) [optional]: ');
    if (priceInput.trim()) {
      config.PRICE_PROFESSIONAL_MONTHLY = priceInput.trim();
    }
  }

  config.PRICE_PROFESSIONAL_ANNUAL = process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL || '';
  if (!config.PRICE_PROFESSIONAL_ANNUAL) {
    const priceInput = await question('Enter Professional Annual Price ID (price_...) [optional]: ');
    if (priceInput.trim()) {
      config.PRICE_PROFESSIONAL_ANNUAL = priceInput.trim();
    }
  }

  rl.close();

  // Validate required values
  if (!config.STRIPE_SECRET_KEY || !config.STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.error('\n❌ Error: Invalid Stripe Secret Key');
    process.exit(1);
  }

  if (!config.STRIPE_PUBLISHABLE_KEY || !config.STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    console.error('\n❌ Error: Invalid Stripe Publishable Key');
    process.exit(1);
  }

  // Create .env file
  console.log('\n📝 Creating .env file...');
  const envPath = join(process.cwd(), '.env');
  let envContent = '';

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
    // Update or add Stripe key
    if (envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
      envContent = envContent.replace(
        /VITE_STRIPE_PUBLISHABLE_KEY=.*/,
        `VITE_STRIPE_PUBLISHABLE_KEY=${config.STRIPE_PUBLISHABLE_KEY}`
      );
    } else {
      envContent += `\nVITE_STRIPE_PUBLISHABLE_KEY=${config.STRIPE_PUBLISHABLE_KEY}\n`;
    }
  } else {
    envContent = `VITE_STRIPE_PUBLISHABLE_KEY=${config.STRIPE_PUBLISHABLE_KEY}\n`;
  }

  writeFileSync(envPath, envContent);
  console.log('✅ .env file created/updated');

  // Set Edge Function secrets
  console.log('\n🔐 Setting Edge Function secrets...\n');

  const secrets = [
    { name: 'STRIPE_SECRET_KEY', value: config.STRIPE_SECRET_KEY },
    { name: 'SUPABASE_URL', value: config.SUPABASE_URL },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: config.SUPABASE_SERVICE_ROLE_KEY },
    { name: 'SITE_URL', value: config.SITE_URL },
  ];

  if (config.STRIPE_WEBHOOK_SECRET) {
    secrets.push({ name: 'STRIPE_WEBHOOK_SECRET', value: config.STRIPE_WEBHOOK_SECRET });
  }

  if (config.PRICE_STARTER_MONTHLY) {
    secrets.push({ name: 'STRIPE_PRICE_STARTER_MONTHLY', value: config.PRICE_STARTER_MONTHLY });
  }
  if (config.PRICE_STARTER_ANNUAL) {
    secrets.push({ name: 'STRIPE_PRICE_STARTER_ANNUAL', value: config.PRICE_STARTER_ANNUAL });
  }
  if (config.PRICE_PROFESSIONAL_MONTHLY) {
    secrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', value: config.PRICE_PROFESSIONAL_MONTHLY });
  }
  if (config.PRICE_PROFESSIONAL_ANNUAL) {
    secrets.push({ name: 'STRIPE_PRICE_PROFESSIONAL_ANNUAL', value: config.PRICE_PROFESSIONAL_ANNUAL });
  }

  let successCount = 0;
  for (const secret of secrets) {
    if (!secret.value) continue;
    
    try {
      execSync(`npx supabase secrets set ${secret.name}=${secret.value}`, { 
        stdio: 'pipe',
        encoding: 'utf-8',
      });
      console.log(`✅ Set ${secret.name}`);
      successCount++;
    } catch (error: any) {
      console.log(`❌ Failed to set ${secret.name}: ${error.message || 'Unknown error'}`);
    }
  }

  // Deploy Edge Functions
  console.log('\n🚀 Deploying Edge Functions...\n');
  const functions = [
    'create-checkout-session',
    'create-one-time-checkout-session',
    'stripe-webhook',
  ];

  let deployCount = 0;
  for (const func of functions) {
    try {
      execSync(`npx supabase functions deploy ${func}`, {
        stdio: 'pipe',
        encoding: 'utf-8',
        cwd: join(process.cwd(), 'supabase'),
      });
      console.log(`✅ Deployed ${func}`);
      deployCount++;
    } catch (error: any) {
      console.log(`❌ Failed to deploy ${func}: ${error.message || 'Unknown error'}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Summary:\n');
  console.log(`   ✅ Secrets configured: ${successCount}/${secrets.length}`);
  console.log(`   ✅ Functions deployed: ${deployCount}/${functions.length}`);

  console.log('\n📝 Next Steps:\n');
  if (!config.PRICE_STARTER_MONTHLY || !config.PRICE_PROFESSIONAL_MONTHLY) {
    console.log('   1. Get Price IDs: npm run stripe:prices <STRIPE_SECRET_KEY>');
    console.log('   2. Set Price IDs as secrets');
  }
  if (!config.STRIPE_WEBHOOK_SECRET) {
    console.log('   3. Configure webhook in Stripe Dashboard');
    console.log('   4. Set webhook secret: supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...');
  }
  console.log('   5. Restart dev server: npm run dev');
  console.log('   6. Test checkout: Go to /pricing page');

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  rl.close();
  process.exit(1);
});


