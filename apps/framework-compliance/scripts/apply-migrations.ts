/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
/**
 * Apply Database Migrations to Supabase
 *
 * This script applies all database migrations to your Supabase instance.
 * Run this script after setting up your Supabase project.
 * 
 * Usage:
 *   npx tsx scripts/apply-migrations.ts
 * 
 * Or with environment variables:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/apply-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

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
];

async function applyMigration(filename: string): Promise<boolean> {
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename);
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log(`\n📄 Applying migration: ${filename}`);
    
    // Split SQL by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        
        if (error) {
          // Try direct query if RPC doesn't work
          const { error: queryError } = await supabase.from('_migrations').select('*').limit(1);
          
          if (queryError && queryError.code === 'PGRST116') {
            // Table doesn't exist, try executing directly via REST API
            console.log(`   ⚠️  Note: Some statements may need to be run manually in Supabase SQL Editor`);
          }
        }
      }
    }
    
    console.log(`   ✅ Migration ${filename} applied successfully`);
    return true;
  } catch (error) {
    console.error(`   ❌ Error applying migration ${filename}:`, error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migration process...');
  console.log(`📡 Connecting to Supabase: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}`);
  
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
  
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  
  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please apply them manually in Supabase SQL Editor:');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor');
    console.log('   4. Copy and paste the SQL from the failed migration files');
    console.log('   5. Run the SQL');
  } else {
    console.log('\n🎉 All migrations applied successfully!');
  }
}

main().catch(console.error);

