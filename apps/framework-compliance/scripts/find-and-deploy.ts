#!/usr/bin/env tsx
/* eslint-disable no-console */
/**
 * Find Supabase Project and Deploy Functions
 * 
 * This script helps identify the correct project and deploys functions.
 */

import { execSync } from 'child_process';

async function main() {
  console.log('🔍 Finding Supabase Projects...\n');

  try {
    // List all projects
    const output = execSync('npx supabase projects list', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });

    console.log('Available Projects:');
    console.log(output);
    console.log('\n' + '='.repeat(60));
    console.log('\n📋 Next Steps:\n');
    console.log('1. Identify your project from the list above');
    console.log('2. Note the REFERENCE ID (not the org ID)');
    console.log('3. Deploy using one of these methods:\n');
    console.log('   Option A: Link project first');
    console.log('     npx supabase link --project-ref [REFERENCE_ID]');
    console.log('     npm run deploy:functions\n');
    console.log('   Option B: Deploy directly with project ref');
    console.log('     npx supabase functions deploy create-checkout-session --project-ref [REFERENCE_ID]\n');
    console.log('   Option C: Use Supabase Dashboard');
    console.log('     https://app.supabase.com/project/[REFERENCE_ID]/functions\n');
    console.log('='.repeat(60));
    console.log('\n💡 If you see "achowlksgmwuvfbvjfrt" in your Supabase Dashboard:');
    console.log('   - It might be in a different organization');
    console.log('   - Or the project ref might be different\n');
    console.log('📚 See: DEPLOY_FUNCTIONS_GUIDE.md for detailed instructions\n');

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', errorMessage);
    console.log('\n💡 Try: npx supabase login (if not already logged in)\n');
  }
}

main();

