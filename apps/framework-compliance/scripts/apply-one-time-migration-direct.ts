#!/usr/bin/env tsx
/**
 * Apply One-Time Purchases Migration Directly
 * 
 * This script checks if the one-time purchases table exists and provides
 * instructions for applying the migration manually via Supabase SQL Editor.
 * 
 * Note: Supabase REST API does not support DDL statements directly, so this
 * script outputs the SQL for manual execution.
 * 
 * Usage:
 *   tsx scripts/apply-one-time-migration-direct.ts
 * 
 * Environment Variables:
 *   - SUPABASE_URL or VITE_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
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

async function applyMigration() {
  try {
    console.log('🔍 Checking if table already exists...');
    const exists = await checkTableExists();
    
    if (exists) {
      console.log('✅ Table cc_one_time_purchases already exists!');
      console.log('   Migration has already been applied.\n');
      return true;
    }

    console.log('📄 Reading migration file...');
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251217000000_one_time_purchases.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log(
      '🚀 Applying migration: 20251217000000_one_time_purchases.sql\n'
    );
    console.log(
      '⚠️  Note: Supabase REST API does not support DDL statements directly.'
    );
    console.log('   Please apply this migration manually in Supabase SQL Editor:\n');
    console.log('   1. Go to: https://app.supabase.com');
    console.log('   2. Select your project');
    console.log('   3. Click "SQL Editor" in the left sidebar');
    console.log('   4. Click "New query"');
    console.log('   5. Copy and paste the SQL below');
    console.log('   6. Click "Run" (or press Ctrl+Enter)\n');
    console.log('─'.repeat(80));
    console.log(sql);
    console.log('─'.repeat(80));
    console.log('\n✅ After applying, the migration will be complete!\n');
    
    return false;
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 One-Time Purchases Migration Tool\n');
  const maskedUrl = SUPABASE_URL.replace(/\/\/.*@/, '//***@');
  console.log(`📡 Supabase URL: ${maskedUrl}\n`);
  
  const applied = await applyMigration();
  // Exit 0 either way since we're providing instructions
  process.exit(applied ? 0 : 0);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

