#!/usr/bin/env tsx
/**
 * Deploy All Supabase Edge Functions with Authentication
 * 
 * This script helps you deploy all functions by guiding through authentication.
 * 
 * Usage:
 *   npm run deploy:functions:auth
 */

import { execSync } from 'child_process';

const PROJECT_REF = 'achowlksgmwuvfbvjfrt';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

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

async function main() {
  console.log('🚀 Supabase Edge Functions Deployment\n');
  console.log('='.repeat(60));
  console.log('\n📋 Prerequisites:\n');
  console.log('1. Login to Supabase CLI');
  console.log('2. Link your project');
  console.log('3. Deploy functions\n');
  console.log('='.repeat(60));

  // Step 1: Login
  console.log('\n📋 Step 1: Login to Supabase\n');
  console.log('Run this command (it will open your browser):');
  console.log('   npx supabase login\n');
  console.log('Press Enter after you complete the login...');
  
  // Wait for user (in real scenario, they'd run this manually)
  console.log('\n⚠️  Please run: npx supabase login');
  console.log('   Then come back and run the deployment script.\n');

  // Step 2: Link
  console.log('📋 Step 2: Link Project\n');
  console.log('Run this command:');
  console.log(`   npx supabase link --project-ref ${PROJECT_REF} --password [YOUR_DB_PASSWORD]`);
  console.log('   OR use anon key:');
  console.log(`   npx supabase link --project-ref ${PROJECT_REF} --anon-key ${SUPABASE_ANON_KEY}\n`);

  // Step 3: Deploy
  console.log('📋 Step 3: Deploy Functions\n');
  console.log('After login and link, run:');
  console.log('   npm run deploy:functions\n');
  console.log('Or deploy individually:\n');
  
  FUNCTIONS.forEach(func => {
    console.log(`   npx supabase functions deploy ${func}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n📚 Alternative: Use Supabase Dashboard\n');
  console.log('If CLI authentication is complex, you can deploy via Dashboard:');
  console.log('   1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/functions');
  console.log('   2. Click "Deploy" for each function\n');
  console.log('See: DEPLOY_FUNCTIONS_CLI.md for detailed instructions\n');
}

main();

