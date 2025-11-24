/**
 * Stripe Integration Verification Script
 * 
 * This script verifies that Stripe is properly configured and functional.
 * Run with: tsx scripts/verify-stripe-integration.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

interface EnvCheck {
  name: string;
  required: boolean;
  value: string | undefined;
  status: '✅' | '⚠️' | '❌';
  message: string;
}

function checkEnvironmentVariables(): EnvCheck[] {
  const checks: EnvCheck[] = [];
  
  // Try to read .env file
  let envContent = '';
  try {
    envContent = readFileSync(join(process.cwd(), '.env'), 'utf-8');
  } catch (error) {
    console.warn('⚠️  .env file not found');
  }

  // Check required variables
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ];

  const optionalVars = [
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ];

  // Check required variables
  for (const varName of requiredVars) {
    const value = process.env[varName] || extractFromEnvContent(envContent, varName);
    const status = value ? '✅' : '❌';
    checks.push({
      name: varName,
      required: true,
      value: value ? maskValue(value) : undefined,
      status,
      message: value ? 'Configured' : 'Missing (required)',
    });
  }

  // Check optional variables
  for (const varName of optionalVars) {
    const value = process.env[varName] || extractFromEnvContent(envContent, varName);
    const status = value ? '✅' : '⚠️';
    checks.push({
      name: varName,
      required: false,
      value: value ? maskValue(value) : undefined,
      status,
      message: value ? 'Configured' : 'Missing (optional, but required for payments)',
    });
  }

  return checks;
}

function extractFromEnvContent(content: string, varName: string): string | undefined {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = content.match(regex);
  return match ? match[1].trim() : undefined;
}

function maskValue(value: string): string {
  if (value.length <= 10) return value;
  return value.substring(0, 8) + '...' + value.substring(value.length - 4);
}

function verifyStripeKeyFormat(key: string | undefined): boolean {
  if (!key) return false;
  // Stripe publishable keys start with pk_test_ or pk_live_
  return /^pk_(test|live)_/.test(key);
}

async function main() {
  console.log('🔍 Verifying Stripe Integration...\n');
  console.log('='.repeat(60));

  // Check environment variables
  console.log('\n📋 Environment Variables:');
  const envChecks = checkEnvironmentVariables();
  
  for (const check of envChecks) {
    console.log(`  ${check.status} ${check.name}: ${check.message}`);
    if (check.value) {
      console.log(`     Value: ${check.value}`);
      
      // Special check for Stripe key format
      if (check.name === 'VITE_STRIPE_PUBLISHABLE_KEY') {
        if (verifyStripeKeyFormat(check.value)) {
          console.log('     ✅ Valid Stripe key format');
        } else {
          console.log('     ⚠️  Invalid Stripe key format (should start with pk_test_ or pk_live_)');
        }
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  
  const requiredMissing = envChecks.filter(c => c.required && c.status === '❌');
  const optionalMissing = envChecks.filter(c => !c.required && c.status === '⚠️');

  if (requiredMissing.length === 0 && optionalMissing.length === 0) {
    console.log('  ✅ All environment variables are configured!');
  } else {
    if (requiredMissing.length > 0) {
      console.log(`  ❌ Missing ${requiredMissing.length} required variable(s):`);
      requiredMissing.forEach(c => console.log(`     - ${c.name}`));
    }
    if (optionalMissing.length > 0) {
      console.log(`  ⚠️  Missing ${optionalMissing.length} optional variable(s):`);
      optionalMissing.forEach(c => console.log(`     - ${c.name}`));
    }
  }

  // Next steps
  console.log('\n📝 Next Steps:');
  console.log('  1. Ensure all required variables are set in .env file');
  console.log('  2. Restart your dev server after updating .env');
  console.log('  3. For production, set variables in your deployment platform');
  console.log('  4. Deploy Edge Functions to Supabase');
  console.log('  5. Configure Edge Function secrets (STRIPE_SECRET_KEY, etc.)');
  console.log('  6. Test checkout flow in browser');

  console.log('\n' + '='.repeat(60));
}

main().catch(console.error);

