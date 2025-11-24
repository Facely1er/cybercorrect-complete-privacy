/**
 * Configure Stripe Secrets for Supabase Edge Functions
 * 
 * This script sets the Stripe secret key for all Edge Functions using Supabase CLI.
 * 
 * Usage:
 *   tsx scripts/configure-stripe-secrets.ts
 * 
 * Or with explicit key:
 *   tsx scripts/configure-stripe-secrets.ts sk_live_...
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const STRIPE_SECRET_KEY = process.argv[2] || process.env.STRIPE_SECRET_KEY || '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';

const EDGE_FUNCTIONS = [
  'create-checkout-session',
  'create-one-time-checkout-session',
  'stripe-webhook',
];

interface SupabaseProject {
  id: string;
  name: string;
  organization_id: string;
  region: string;
}

function getSupabaseProjectRef(): string | null {
  try {
    // Try to get from .supabase/config.toml
    const configPath = join(process.cwd(), '.supabase', 'config.toml');
    try {
      const config = readFileSync(configPath, 'utf-8');
      const match = config.match(/project_id\s*=\s*["']([^"']+)["']/);
      if (match) {
        return match[1];
      }
    } catch {
      // Config file doesn't exist
    }

    // Try to get from Supabase CLI
    try {
      const output = execSync('supabase projects list --json', { encoding: 'utf-8', stdio: 'pipe' });
      const projects: SupabaseProject[] = JSON.parse(output);
      if (projects.length > 0) {
        console.log(`\n📋 Found ${projects.length} Supabase project(s):`);
        projects.forEach((p, i) => {
          console.log(`   ${i + 1}. ${p.name} (${p.id})`);
        });
        
        if (projects.length === 1) {
          return projects[0].id;
        } else {
          console.log('\n⚠️  Multiple projects found. Please specify project-ref:');
          console.log('   supabase link --project-ref <project-ref>');
          return null;
        }
      }
    } catch {
      // CLI not available or not logged in
    }

    return null;
  } catch (error) {
    return null;
  }
}

function setSecret(functionName: string, secretName: string, secretValue: string, projectRef?: string): boolean {
  try {
    const projectFlag = projectRef ? `--project-ref ${projectRef}` : '';
    const command = `supabase secrets set ${secretName}=${secretValue} ${projectFlag}`.trim();
    
    console.log(`\n🔧 Setting ${secretName} for ${functionName}...`);
    console.log(`   Command: supabase secrets set ${secretName}=*** ${projectFlag ? `--project-ref ${projectRef}` : ''}`);
    
    execSync(command, { 
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    
    console.log(`   ✅ Successfully set ${secretName} for ${functionName}`);
    return true;
  } catch (error: any) {
    console.error(`   ❌ Failed to set ${secretName} for ${functionName}`);
    if (error.message) {
      console.error(`   Error: ${error.message}`);
    }
    return false;
  }
}

async function main() {
  console.log('🔐 Configuring Stripe Secrets for Supabase Edge Functions\n');
  console.log('='.repeat(60));

  // Validate Stripe key
  if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith('sk_')) {
    console.error('❌ Error: Invalid Stripe secret key');
    console.error('   Stripe secret keys must start with "sk_test_" or "sk_live_"');
    process.exit(1);
  }

  console.log(`\n✅ Using Stripe Secret Key: ${STRIPE_SECRET_KEY.substring(0, 12)}...${STRIPE_SECRET_KEY.substring(STRIPE_SECRET_KEY.length - 4)}`);
  console.log(`   Mode: ${STRIPE_SECRET_KEY.startsWith('sk_live_') ? 'LIVE' : 'TEST'}`);

  // Check if Supabase CLI is available
  try {
    execSync('supabase --version', { stdio: 'pipe' });
  } catch {
    console.error('\n❌ Error: Supabase CLI not found');
    console.error('   Please install Supabase CLI:');
    console.error('   npm install -g supabase');
    console.error('   Or visit: https://supabase.com/docs/guides/cli');
    process.exit(1);
  }

  // Check if logged in
  try {
    execSync('supabase projects list', { stdio: 'pipe' });
  } catch {
    console.error('\n❌ Error: Not logged in to Supabase CLI');
    console.error('   Please login:');
    console.error('   supabase login');
    process.exit(1);
  }

  // Get project ref
  const projectRef = getSupabaseProjectRef();
  if (!projectRef) {
    console.log('\n⚠️  Could not auto-detect project. You may need to:');
    console.log('   1. Link your project: supabase link --project-ref <project-ref>');
    console.log('   2. Or specify project-ref in each command');
    console.log('\n   Continuing with current linked project...\n');
  } else {
    console.log(`\n📦 Using project: ${projectRef}`);
  }

  // Set secrets for each function
  console.log('\n' + '='.repeat(60));
  console.log('\n🔧 Setting STRIPE_SECRET_KEY for all Edge Functions...\n');

  let successCount = 0;
  let failCount = 0;

  for (const functionName of EDGE_FUNCTIONS) {
    const success = setSecret(functionName, 'STRIPE_SECRET_KEY', STRIPE_SECRET_KEY, projectRef || undefined);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully configured: ${successCount}/${EDGE_FUNCTIONS.length} functions`);
  if (failCount > 0) {
    console.log(`   ❌ Failed: ${failCount}/${EDGE_FUNCTIONS.length} functions`);
  }

  if (successCount === EDGE_FUNCTIONS.length) {
    console.log('\n✅ All Stripe secrets configured successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Add other required secrets (Price IDs, webhook secret, etc.)');
    console.log('   2. Deploy Edge Functions: npm run supabase:deploy');
    console.log('   3. Test checkout flows');
  } else {
    console.log('\n⚠️  Some secrets failed to configure. Please check:');
    console.log('   1. Are you logged in? (supabase login)');
    console.log('   2. Is your project linked? (supabase link --project-ref <ref>)');
    console.log('   3. Do you have permission to set secrets?');
  }

  console.log('\n' + '='.repeat(60));
}

main().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});

