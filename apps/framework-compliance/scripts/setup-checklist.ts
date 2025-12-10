/**
 * Interactive Setup Checklist
 * Guides you through completing the Stripe setup
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('📋 Stripe Setup Checklist\n');
  console.log('='.repeat(70));
  console.log('\nThis interactive guide will help you complete the Stripe setup.\n');

  const checklist = [
    {
      id: 'secrets-create-checkout',
      name: 'Set secrets for create-checkout-session',
      url: 'https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions/create-checkout-session',
      secrets: [
        'STRIPE_SECRET_KEY',
        'STRIPE_PRICE_STARTER_MONTHLY',
        'STRIPE_PRICE_PROFESSIONAL_MONTHLY',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SITE_URL'
      ]
    },
    {
      id: 'secrets-one-time',
      name: 'Set secrets for create-one-time-checkout-session',
      url: 'https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions/create-one-time-checkout-session',
      secrets: [
        'STRIPE_SECRET_KEY',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SITE_URL'
      ]
    },
    {
      id: 'deploy-functions',
      name: 'Deploy all Edge Functions',
      url: 'https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions',
      note: 'Deploy: create-checkout-session, create-one-time-checkout-session, stripe-webhook'
    },
    {
      id: 'create-webhook',
      name: 'Create Stripe webhook',
      url: 'https://dashboard.stripe.com/webhooks',
      note: 'Endpoint: https://achowlksgmwuvfbvjfrt.supabase.co/functions/v1/stripe-webhook'
    },
    {
      id: 'webhook-secret',
      name: 'Set STRIPE_WEBHOOK_SECRET',
      url: 'https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions/stripe-webhook',
      note: 'Get secret from Stripe Dashboard after creating webhook'
    }
  ];

  // Load secrets config
  const secretsPath = join(process.cwd(), 'stripe-secrets-config.json');
  let secretsConfig: any = {};
  
  if (existsSync(secretsPath)) {
    secretsConfig = JSON.parse(readFileSync(secretsPath, 'utf-8'));
  }

  console.log('📝 Checklist Items:\n');
  
  for (let i = 0; i < checklist.length; i++) {
    const item = checklist[i];
    console.log(`${i + 1}. ${item.name}`);
    if (item.url) {
      console.log(`   URL: ${item.url}`);
    }
    if (item.secrets) {
      console.log(`   Secrets needed: ${item.secrets.join(', ')}`);
      console.log(`   See: STRIPE_SETUP_COMPLETE.md for values`);
    }
    if (item.note) {
      console.log(`   Note: ${item.note}`);
    }
    console.log();
  }

  console.log('='.repeat(70));
  console.log('\n💡 Tips:');
  console.log('   - Open STRIPE_SETUP_COMPLETE.md for all values');
  console.log('   - All secrets are ready to copy-paste');
  console.log('   - Run "npm run stripe:verify" after each step to check progress');
  console.log('   - Run "npm run stripe:test" after setup to test integration');
  
  console.log('\n' + '='.repeat(70));
  
  const answer = await question('\nHave you completed all checklist items? (yes/no): ');
  
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\n✅ Great! Running verification...\n');
    rl.close();
    // Import and run verification
    const { execSync } = require('child_process');
    try {
      execSync('npm run stripe:verify', { stdio: 'inherit' });
    } catch (error) {
      console.error('Verification failed. Please check manually.');
    }
  } else {
    console.log('\n📖 Open STRIPE_SETUP_COMPLETE.md to see detailed instructions.');
    console.log('   All values are ready to copy-paste!');
    rl.close();
  }
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  rl.close();
  process.exit(1);
});

