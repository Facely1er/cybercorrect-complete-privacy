#!/usr/bin/env tsx
/**
 * Apply One-Time Purchases Migration
 * 
 * This script applies the migration to create the cc_one_time_purchases table.
 * 
 * Usage:
 *   npm run migrate:one-time
 * 
 * Or with environment variables:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... tsx scripts/apply-one-time-purchases-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌');
  console.error('\nPlease set these environment variables and try again.');
  console.error('\nExample:');
  console.error('  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx tsx scripts/apply-one-time-purchases-migration.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkTableExists(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('cc_one_time_purchases')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return false;
      }
      // Other errors might mean table exists but we can't access it
      throw error;
    }
    return true;
  } catch (error: any) {
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      return false;
    }
    throw error;
  }
}

async function applyMigration(): Promise<boolean> {
  try {
    // Check if table already exists
    console.log('🔍 Checking if table already exists...');
    const exists = await checkTableExists();
    
    if (exists) {
      console.log('✅ Table cc_one_time_purchases already exists!');
      console.log('   Migration may have already been applied.');
      return true;
    }

    console.log('📄 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250205000000_one_time_purchases.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log('🚀 Applying migration: 20250205000000_one_time_purchases.sql');
    console.log('   This will create the cc_one_time_purchases table...\n');

    // Execute the SQL using Supabase REST API
    // Note: We'll use the SQL execution endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: sql })
    });

    // If RPC doesn't work, try direct SQL execution via PostgREST
    // Actually, Supabase doesn't have a direct SQL execution endpoint via REST
    // We need to use the SQL Editor API or execute statements one by one
    
    // Alternative: Execute via Supabase client using raw SQL
    // Split SQL into individual statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.match(/^\/\*/));

    let successCount = 0;
    let failCount = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          // Use Supabase's query method - but this doesn't support DDL
          // We'll need to guide the user to use SQL Editor instead
          console.log('⚠️  Direct SQL execution via API is not supported for DDL statements.');
          console.log('   Please apply the migration manually in Supabase SQL Editor.\n');
          return false;
        } catch (error: any) {
          console.error(`   ❌ Error executing statement: ${error.message}`);
          failCount++;
        }
      }
    }

    if (failCount === 0) {
      console.log('✅ Migration applied successfully!');
      return true;
    } else {
      console.error(`❌ Migration failed: ${failCount} statements failed`);
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error applying migration:', error.message);
    return false;
  }
}

async function verifyMigration(): Promise<boolean> {
  try {
    console.log('\n🔍 Verifying migration...');
    
    const exists = await checkTableExists();
    
    if (exists) {
      // Check indexes
      const { data: indexes, error: indexError } = await supabase
        .rpc('exec_sql', { 
          sql_query: `
            SELECT indexname 
            FROM pg_indexes 
            WHERE tablename = 'cc_one_time_purchases'
          `
        } as any);

      console.log('✅ Table cc_one_time_purchases exists');
      console.log('✅ Migration verified successfully!\n');
      return true;
    } else {
      console.log('❌ Table cc_one_time_purchases does not exist');
      console.log('   Migration may not have been applied.\n');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error verifying migration:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 One-Time Purchases Migration Tool\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}\n`);

  // Check if already applied
  const exists = await checkTableExists();
  
  if (exists) {
    console.log('✅ Migration already applied!');
    console.log('   Table cc_one_time_purchases exists in the database.\n');
    
    const verified = await verifyMigration();
    process.exit(verified ? 0 : 1);
    return;
  }

  console.log('📋 Migration Instructions:\n');
  console.log('   Since Supabase REST API does not support DDL statements directly,');
  console.log('   please apply this migration manually in Supabase SQL Editor:\n');
  console.log('   1. Go to: https://app.supabase.com');
  console.log('   2. Select your project');
  console.log('   3. Click "SQL Editor" in the left sidebar');
  console.log('   4. Click "New query"');
  console.log('   5. Copy the contents of:');
  console.log('      apps/framework-compliance/supabase/migrations/20250205000000_one_time_purchases.sql');
  console.log('   6. Paste into SQL Editor');
  console.log('   7. Click "Run" (or press Ctrl+Enter)\n');
  console.log('   Or use the combined migrations file:');
  console.log('      apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql\n');
  
  console.log('   After applying, run: npm run verify:one-time\n');

  // Show the SQL for easy copy-paste
  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20250205000000_one_time_purchases.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    console.log('📄 Migration SQL (for copy-paste):\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('\n');
  } catch (error) {
    console.error('⚠️  Could not read migration file:', error);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

