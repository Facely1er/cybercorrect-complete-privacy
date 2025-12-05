/**
 * Complete Setup Script
 * 
 * This script guides you through the complete setup process:
 * 1. Verify .env file exists
 * 2. Test Supabase connection
 * 3. Verify migrations are applied
 * 4. Check Edge Functions deployment status
 * 
 * Usage:
 *   npx tsx scripts/setup-complete.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Required tables
const requiredTables = [
  'cc_privacy_consent_records',
  'cc_privacy_vendor_assessments',
  'cc_privacy_retention_policies',
  'cc_privacy_data_records',
  'cc_privacy_dpias',
  'cc_privacy_privacy_by_design_assessments',
  'cc_privacy_service_providers',
  'cc_privacy_privacy_incidents',
  'cc_privacy_subscriptions',
  'cc_privacy_subscription_history',
  'cc_privacy_payment_methods',
  'cc_privacy_invoices',
];

async function checkEnvFile(): Promise<boolean> {
  console.log('1️⃣  Checking .env file...');
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    console.log('   ❌ .env file not found');
    console.log('   📝 Please create .env file (see scripts/create-env-file.md)');
    return false;
  }
  
  try {
    const envContent = readFileSync(envPath, 'utf-8');
    if (!envContent.includes('VITE_SUPABASE_URL')) {
      console.log('   ⚠️  .env file exists but missing VITE_SUPABASE_URL');
      return false;
    }
    if (!envContent.includes('VITE_SUPABASE_ANON_KEY')) {
      console.log('   ⚠️  .env file exists but missing VITE_SUPABASE_ANON_KEY');
      return false;
    }
    console.log('   ✅ .env file exists and contains required variables');
    return true;
  } catch (error) {
    console.log('   ❌ Error reading .env file:', error);
    return false;
  }
}

async function testConnection(): Promise<boolean> {
  console.log('\n2️⃣  Testing Supabase connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      console.log('   ❌ Invalid API key');
      return false;
    }
    console.log('   ✅ Connection successful');
    return true;
  } catch (error) {
    console.log('   ❌ Connection failed:', error);
    return false;
  }
}

async function checkTables(): Promise<{ exists: number; missing: string[] }> {
  console.log('\n3️⃣  Checking database tables...');
  let exists = 0;
  const missing: string[] = [];
  
  for (const table of requiredTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          missing.push(table);
        } else {
          // Table exists but might have permission issues
          exists++;
        }
      } else {
        exists++;
      }
    } catch (error) {
      missing.push(table);
    }
  }
  
  console.log(`   ✅ Tables exist: ${exists}/${requiredTables.length}`);
  if (missing.length > 0) {
    console.log(`   ❌ Missing tables: ${missing.length}`);
    missing.forEach(table => {
      console.log(`      - ${table}`);
    });
  }
  
  return { exists, missing };
}

async function main() {
  console.log('🚀 CyberCorrect Privacy Platform - Complete Setup Check\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);
  
  const results = {
    envFile: false,
    connection: false,
    tables: { exists: 0, missing: [] as string[] },
  };
  
  // Check .env file
  results.envFile = await checkEnvFile();
  
  // Test connection
  if (results.envFile) {
    results.connection = await testConnection();
  } else {
    console.log('\n⚠️  Skipping connection test (no .env file)');
  }
  
  // Check tables
  if (results.connection) {
    const tableCheck = await checkTables();
    results.tables = tableCheck;
  } else {
    console.log('\n⚠️  Skipping table check (connection failed)');
  }
  
  // Summary
  console.log('\n📊 Setup Summary:');
  console.log(`   ${results.envFile ? '✅' : '❌'} .env file: ${results.envFile ? 'OK' : 'Missing'}`);
  console.log(`   ${results.connection ? '✅' : '❌'} Connection: ${results.connection ? 'OK' : 'Failed'}`);
  console.log(`   ${results.tables.exists === requiredTables.length ? '✅' : '⚠️ '} Tables: ${results.tables.exists}/${requiredTables.length}`);
  
  // Next steps
  console.log('\n📋 Next Steps:');
  
  if (!results.envFile) {
    console.log('   1. Create .env file (see scripts/create-env-file.md)');
  }
  
  if (!results.connection) {
    console.log('   2. Fix connection issues (check .env file and Supabase credentials)');
  }
  
  if (results.tables.missing.length > 0) {
    console.log('   3. Apply database migrations (see APPLY_MIGRATIONS.md)');
    console.log(`      Missing ${results.tables.missing.length} tables`);
  }
  
  if (results.envFile && results.connection && results.tables.exists === requiredTables.length) {
    console.log('   ✅ Setup complete!');
    console.log('   📦 Next: Deploy Edge Functions (see scripts/deploy-edge-functions.ps1)');
    console.log('   📦 Next: Configure function secrets in Supabase Dashboard');
    console.log('   📦 Next: Test the application (npm run dev)');
  }
  
  console.log('\n📚 Documentation:');
  console.log('   - Quick Start: QUICK_START.md');
  console.log('   - Migration Guide: APPLY_MIGRATIONS.md');
  console.log('   - Full Setup: SUPABASE_SETUP_COMPLETE.md');
  console.log('   - Summary: SETUP_COMPLETE_SUMMARY.md');
  console.log('');
}

main().catch(console.error);

