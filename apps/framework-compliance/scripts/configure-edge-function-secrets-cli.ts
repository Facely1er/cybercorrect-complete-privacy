#!/usr/bin/env tsx`n/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Configure Edge Function Secrets via Supabase CLI
 * 
 * This script configures secrets for all Edge Functions using the Supabase CLI.
 * 
 * Prerequisites:
 * - Supabase CLI installed (npm install -g supabase)
 * - Logged in to Supabase CLI (supabase login)
 * - Project linked (supabase link --project-ref achowlksgmwuvfbvjfrt)
 * 
 * Usage:
 *   npm run configure:secrets
 */

import { execSync } from 'child_process';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';
const PROJECT_REF = 'achowlksgmwuvfbvjfrt';

const FUNCTIONS = [
  'send-email-notification',
  'stripe-webhook',
  'generate-automated-reports',
  'run-scheduled-assessments',
  'track-compliance-health',
  'check-regulatory-updates',
];

interface SecretConfig {
  name: string;
  value: string;
}

const SECRETS: SecretConfig[] = [
  {
    name: 'SUPABASE_URL',
    value: SUPABASE_URL,
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    value: SUPABASE_SERVICE_ROLE_KEY,
  },
];

function checkSupabaseCLI(): boolean {
  try {
    execSync('npx supabase --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function checkSupabaseLogin(): boolean {
  try {
    execSync('npx supabase projects list', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function setSecret(functionName: string, secretName: string, secretValue: string): boolean {
  try {
    // Supabase CLI command to set secret for a specific function
    // Note: Supabase CLI sets secrets globally, not per function
    // We'll use the global secret setting with npx
    const command = `npx supabase secrets set ${secretName}="${secretValue}" --project-ref ${PROJECT_REF}`;
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`   ❌ Failed to set ${secretName} for ${functionName}:`, error);
    return false;
  }
}

async function configureSecrets() {
  console.log('🔧 Configuring Edge Function Secrets...\n');

  // Check if Supabase CLI is available (via npx)
  if (!checkSupabaseCLI()) {
    console.error('❌ Supabase CLI is not available.');
    console.log('\n📦 Using npx (no installation required):');
    console.log('   npx supabase --version');
    console.log('\n   If this fails, see INSTALL_SUPABASE_CLI.md');
    process.exit(1);
  }

  console.log('✅ Supabase CLI is available (via npx)\n');

  // Important: Supabase CLI cannot set secrets starting with "SUPABASE_"
  console.log('⚠️  IMPORTANT: Supabase CLI has restrictions on secret names.');
  console.log('   Secrets starting with "SUPABASE_" cannot be set via CLI.\n');
  console.log('📋 Edge Function secrets must be configured via Supabase Dashboard.\n');
  console.log('='.repeat(60));
  console.log('\n📝 Required Secrets (set via Dashboard):\n');
  
  for (const secret of SECRETS) {
    console.log(`   ${secret.name}:`);
    console.log(`   ${secret.value}\n`);
  }

  console.log('='.repeat(60));
  console.log('\n📋 Next Steps:\n');
  console.log('   1. Go to Supabase Dashboard → Edge Functions');
  console.log('   2. For each function, go to Settings → Secrets');
  console.log('   3. Add the secrets listed above');
  console.log('   4. See CONFIGURE_EDGE_FUNCTION_SECRETS.md for detailed instructions\n');
  console.log('✅ CLI tools are ready for other operations (deployments, migrations, etc.)\n');

  return false; // Indicate that secrets need manual configuration
}

async function main() {
  console.log('🚀 Starting Edge Function Secrets Configuration...\n');
  console.log('='.repeat(60));
  console.log('');

  try {
    const success = await configureSecrets();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error configuring secrets:', error);
    console.log('\n💡 Alternative: Set secrets manually in Supabase Dashboard');
    console.log('   See CONFIGURE_EDGE_FUNCTION_SECRETS.md for instructions');
    process.exit(1);
  }
}

main();



