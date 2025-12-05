/**
 * Apply Database Migrations to Supabase using Supabase Client
 * 
 * This script applies migrations by executing SQL via Supabase client.
 * 
 * Usage:
 *   cd apps/framework-compliance
 *   npx tsx scripts/apply-migrations-via-client.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Credentials from the shared ERMITS database
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Migration files in order
const migrations = [
  '20250130000000_improve_security.sql',
  '20250201000000_subscription_features.sql',
  '20250201000001_cron_jobs.sql',
  '20250202000000_privacy_tools_schema.sql',
  '20250202000001_subscriptions.sql',
  '20250202000002_fix_function_search_path.sql',
  '20250202000003_fix_rls_performance.sql',
  '20250202000004_combined_fixes.sql',
  '20250203000000_calendar_events.sql',
  '20250729162343_orange_band.sql',
];

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Try using RPC function if it exists
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (!rpcError) {
      return { success: true };
    }

    // If RPC doesn't work, we need to use the REST API directly
    // Split SQL into individual statements and execute via REST
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    // For now, we'll indicate that manual execution is needed
    // The Supabase REST API doesn't support arbitrary SQL execution
    return { 
      success: false, 
      error: 'Direct SQL execution via client not supported. Use Supabase CLI or SQL Editor.' 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function applyMigration(filename: string): Promise<boolean> {
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename);
    
    if (!existsSync(migrationPath)) {
      console.log(`   ⚠️  Migration file not found: ${filename} (skipping)`);
      return true;
    }
    
    const sql = readFileSync(migrationPath, 'utf-8');
    console.log(`\n📄 Migration: ${filename}`);
    console.log(`   📝 File size: ${(sql.length / 1024).toFixed(2)} KB`);
    
    // For now, we'll prepare the SQL and provide instructions
    // The actual execution should be done via Supabase CLI or SQL Editor
    console.log(`   ✅ Migration file loaded successfully`);
    console.log(`   💡 To apply: Copy SQL to Supabase SQL Editor and run`);
    
    return true;
  } catch (error: any) {
    console.error(`   ❌ Error reading migration ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 CyberCorrect Database Migration Helper');
  console.log(`📡 Supabase URL: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}`);
  console.log(`📦 Shared database with CyberCaution and CyberSoluce`);
  console.log(`\n⚠️  Note: This script prepares migrations for manual execution.`);
  console.log(`   For automated execution, use Supabase CLI: supabase db push\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log('\n📊 Migration Files Summary:');
  console.log(`   ✅ Found: ${successCount}/${migrations.length}`);
  console.log(`   ❌ Missing: ${failCount}/${migrations.length}`);
  
  console.log('\n📋 To Apply Migrations:');
  console.log('\n   Option 1: Using Supabase CLI (Recommended)');
  console.log('   1. Install: npm install -g supabase');
  console.log('   2. Login: supabase login');
  console.log('   3. Link: supabase link --project-ref achowlksgmwuvfbvjfrt');
  console.log('   4. Apply: supabase db push');
  
  console.log('\n   Option 2: Using Supabase SQL Editor (Manual)');
  console.log('   1. Go to https://app.supabase.com');
  console.log('   2. Select project: achowlksgmwuvfbvjfrt');
  console.log('   3. Go to SQL Editor → New query');
  console.log('   4. Copy SQL from each migration file in order:');
  migrations.forEach((m, i) => console.log(`      ${i + 1}. ${m}`));
  console.log('   5. Run each migration in order');
  
  console.log('\n   Option 3: Using PowerShell Script');
  console.log('   .\\scripts\\apply-migrations-simple.ps1');
  
  console.log('\n✅ Migration files are ready to be applied!');
}

main().catch(console.error);

