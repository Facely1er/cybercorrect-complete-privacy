#!/usr/bin/env tsx
/**
 * Complete Stripe Configuration - Interactive Setup
 * 
 * This script guides you through completing Stripe configuration:
 * 1. Collects Stripe API keys
 * 2. Sets Edge Function secrets
 * 3. Deploys Edge Functions
 * 4. Configures webhook
 * 5. Verifies setup
 * 
 * Usage:
 *   npm run stripe:complete
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

interface Config {
  stripeSecretKey: string;
  stripePublishableKey: string;
  stripeWebhookSecret: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  siteUrl: string;
  priceStarterMonthly: string;
  priceStarterAnnual: string;
  priceProfessionalMonthly: string;
  priceProfessionalAnnual: string;
}

const config: Partial<Config> = {};

async function collectConfiguration(): Promise<Config> {
  console.log('🚀 Stripe Configuration Setup\n');
  console.log('This script will help you complete Stripe configuration.\n');
  console.log('─'.repeat(60));

  // Get Stripe keys
  console.log('\n📋 Step 1: Stripe API Keys\n');
  console.log('Get these from: https://dashboard.stripe.com/apikeys\n');

  const secretKey = await question('Stripe Secret Key (sk_live_... or sk_test_...): ');
  if (!secretKey || (!secretKey.startsWith('sk_live_') && !secretKey.startsWith('sk_test_'))) {
    throw new Error('Invalid Stripe secret key. Must start with sk_live_ or sk_test_');
  }
  config.stripeSecretKey = secretKey;

  const publishableKey = await question('Stripe Publishable Key (pk_live_... or pk_test_...): ');
  if (!publishableKey || (!publishableKey.startsWith('pk_live_') && !publishableKey.startsWith('pk_test_'))) {
    throw new Error('Invalid Stripe publishable key. Must start with pk_live_ or pk_test_');
  }
  config.stripePublishableKey = publishableKey;

  // Get Supabase info
  console.log('\n📋 Step 2: Supabase Configuration\n');
  const supabaseUrl = await question('Supabase URL (https://xxx.supabase.co): ') || 'https://achowlksgmwuvfbvjfrt.supabase.co';
  config.supabaseUrl = supabaseUrl;

  const serviceRoleKey = await question('Supabase Service Role Key (optional, for automated setup): ');
  config.supabaseServiceRoleKey = serviceRoleKey || '';

  // Get site URL
  console.log('\n📋 Step 3: Site Configuration\n');
  const siteUrl = await question('Site URL (https://your-domain.com): ') || 'https://www.cybercorrect.com';
  config.siteUrl = siteUrl;

  // Get Price IDs
  console.log('\n📋 Step 4: Stripe Price IDs\n');
  console.log('Get these from: https://dashboard.stripe.com/products\n');
  console.log('(You can skip these and set them later in Edge Function secrets)\n');

  const priceStarterMonthly = await question('Starter Monthly Price ID (price_...): ');
  config.priceStarterMonthly = priceStarterMonthly || '';

  const priceStarterAnnual = await question('Starter Annual Price ID (price_...): ');
  config.priceStarterAnnual = priceStarterAnnual || '';

  const priceProfessionalMonthly = await question('Professional Monthly Price ID (price_...): ');
  config.priceProfessionalMonthly = priceProfessionalMonthly || '';

  const priceProfessionalAnnual = await question('Professional Annual Price ID (price_...): ');
  config.priceProfessionalAnnual = priceProfessionalAnnual || '';

  // Webhook secret (optional - can be set after webhook creation)
  console.log('\n📋 Step 5: Webhook Configuration\n');
  console.log('(You can create the webhook in Stripe Dashboard and get the secret later)\n');
  const webhookSecret = await question('Stripe Webhook Secret (whsec_...): ');
  config.stripeWebhookSecret = webhookSecret || '';

  return config as Config;
}

function saveEnvFile(config: Config): void {
  const envPath = join(process.cwd(), '.env');
  const envLocalPath = join(process.cwd(), '.env.local');

  const envContent = `# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=${config.stripePublishableKey}
VITE_SUPABASE_URL=${config.supabaseUrl}
VITE_SUPABASE_ANON_KEY=${process.env.VITE_SUPABASE_ANON_KEY || ''}
`;

  // Save to .env.local (preferred for local development)
  writeFileSync(envLocalPath, envContent, 'utf-8');
  console.log(`✅ Saved environment variables to .env.local`);
}

function generateSecretsCommands(config: Config): string {
  const commands = [
    '# Stripe Edge Function Secrets',
    '# Run these commands after logging into Supabase CLI: npx supabase login',
    '',
    `# For create-checkout-session:`,
    `npx supabase secrets set STRIPE_SECRET_KEY=${config.stripeSecretKey} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`,
    `npx supabase secrets set SITE_URL=${config.siteUrl} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`,
  ];

  if (config.priceStarterMonthly) {
    commands.push(`npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=${config.priceStarterMonthly} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  }
  if (config.priceStarterAnnual) {
    commands.push(`npx supabase secrets set STRIPE_PRICE_STARTER_ANNUAL=${config.priceStarterAnnual} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  }
  if (config.priceProfessionalMonthly) {
    commands.push(`npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=${config.priceProfessionalMonthly} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  }
  if (config.priceProfessionalAnnual) {
    commands.push(`npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_ANNUAL=${config.priceProfessionalAnnual} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  }

  commands.push('');
  commands.push(`# For create-one-time-checkout-session:`);
  commands.push(`npx supabase secrets set STRIPE_SECRET_KEY=${config.stripeSecretKey} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  commands.push(`npx supabase secrets set SITE_URL=${config.siteUrl} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);

  commands.push('');
  commands.push(`# For stripe-webhook:`);
  commands.push(`npx supabase secrets set STRIPE_SECRET_KEY=${config.stripeSecretKey} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  if (config.stripeWebhookSecret) {
    commands.push(`npx supabase secrets set STRIPE_WEBHOOK_SECRET=${config.stripeWebhookSecret} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);
  }
  commands.push(`npx supabase secrets set SITE_URL=${config.siteUrl} --project-ref ${config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF'}`);

  commands.push('');
  commands.push('# Deploy Edge Functions:');
  commands.push('npx supabase functions deploy create-checkout-session');
  commands.push('npx supabase functions deploy create-one-time-checkout-session');
  commands.push('npx supabase functions deploy stripe-webhook');

  return commands.join('\n');
}

function generateDashboardInstructions(config: Config): string {
  const projectRef = config.supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || 'YOUR_PROJECT_REF';
  const webhookUrl = `${config.supabaseUrl}/functions/v1/stripe-webhook`;

  return `
# Stripe Configuration - Dashboard Method

## Step 1: Set Edge Function Secrets in Supabase Dashboard

1. Go to: https://app.supabase.com/project/${projectRef}/settings/functions
2. For each function, set these secrets:

### create-checkout-session
- STRIPE_SECRET_KEY: ${config.stripeSecretKey}
- SITE_URL: ${config.siteUrl}
${config.priceStarterMonthly ? `- STRIPE_PRICE_STARTER_MONTHLY: ${config.priceStarterMonthly}` : ''}
${config.priceStarterAnnual ? `- STRIPE_PRICE_STARTER_ANNUAL: ${config.priceStarterAnnual}` : ''}
${config.priceProfessionalMonthly ? `- STRIPE_PRICE_PROFESSIONAL_MONTHLY: ${config.priceProfessionalMonthly}` : ''}
${config.priceProfessionalAnnual ? `- STRIPE_PRICE_PROFESSIONAL_ANNUAL: ${config.priceProfessionalAnnual}` : ''}

### create-one-time-checkout-session
- STRIPE_SECRET_KEY: ${config.stripeSecretKey}
- SITE_URL: ${config.siteUrl}

### stripe-webhook
- STRIPE_SECRET_KEY: ${config.stripeSecretKey}
${config.stripeWebhookSecret ? `- STRIPE_WEBHOOK_SECRET: ${config.stripeWebhookSecret}` : '- STRIPE_WEBHOOK_SECRET: (set after creating webhook)'}
- SITE_URL: ${config.siteUrl}

## Step 2: Deploy Edge Functions

1. Go to: https://app.supabase.com/project/${projectRef}/functions
2. Deploy each function:
   - create-checkout-session
   - create-one-time-checkout-session
   - stripe-webhook

## Step 3: Create Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: ${webhookUrl}
4. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
5. Copy the webhook signing secret (whsec_...)
6. Add it to stripe-webhook function secrets: STRIPE_WEBHOOK_SECRET

## Step 4: Set Environment Variables in Deployment Platform

Set these in your deployment platform (Vercel, Netlify, etc.):
- VITE_STRIPE_PUBLISHABLE_KEY=${config.stripePublishableKey}
- VITE_SUPABASE_URL=${config.supabaseUrl}
- VITE_SUPABASE_ANON_KEY=(your anon key)

## Step 5: Verify

Run: npm run verify:stripe
`;
}

async function main() {
  try {
    // Collect configuration
    const config = await collectConfiguration();

    console.log('\n' + '='.repeat(60));
    console.log('📋 Configuration Summary\n');
    console.log(`✅ Stripe Secret Key: ${config.stripeSecretKey.substring(0, 20)}...`);
    console.log(`✅ Stripe Publishable Key: ${config.stripePublishableKey.substring(0, 20)}...`);
    console.log(`✅ Supabase URL: ${config.supabaseUrl}`);
    console.log(`✅ Site URL: ${config.siteUrl}`);
    console.log(`✅ Price IDs: ${config.priceStarterMonthly ? 'Configured' : 'Not set (optional)'}`);
    console.log(`✅ Webhook Secret: ${config.stripeWebhookSecret ? 'Configured' : 'Not set (set after webhook creation)'}`);

    // Save .env file
    console.log('\n💾 Saving configuration...\n');
    saveEnvFile(config);

    // Generate instructions
    const commands = generateSecretsCommands(config);
    const dashboardInstructions = generateDashboardInstructions(config);

    // Save to files
    const commandsPath = join(process.cwd(), 'STRIPE_SECRETS_COMMANDS.txt');
    writeFileSync(commandsPath, commands, 'utf-8');
    console.log(`✅ Saved CLI commands to: ${commandsPath}`);

    const dashboardPath = join(process.cwd(), 'STRIPE_DASHBOARD_INSTRUCTIONS.md');
    writeFileSync(dashboardPath, dashboardInstructions, 'utf-8');
    console.log(`✅ Saved dashboard instructions to: ${dashboardPath}`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Configuration Complete!\n');
    console.log('📋 Next Steps:\n');
    console.log('Option 1: Use Supabase Dashboard (Recommended)');
    console.log('   1. Open: STRIPE_DASHBOARD_INSTRUCTIONS.md');
    console.log('   2. Follow the step-by-step instructions\n');

    console.log('Option 2: Use Supabase CLI');
    console.log('   1. Run: npx supabase login');
    console.log('   2. Run: npx supabase link --project-ref YOUR_PROJECT_REF');
    console.log('   3. Run commands from: STRIPE_SECRETS_COMMANDS.txt\n');

    console.log('After setup, verify with:');
    console.log('   npm run verify:stripe\n');

    rl.close();
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

main();

