#!/usr/bin/env tsx
/**
 * Output Migration SQL for Easy Copy-Paste
 * 
 * This script outputs the migration SQL and checks if the table exists.
 * 
 * Usage:
 *   npx tsx scripts/apply-migration-sql.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
      return true;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking Migration Status...\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);

  // Check if table exists
  const exists = await checkTableExists();
  
  if (exists) {
    console.log('✅ Table cc_one_time_purchases already exists!');
    console.log('   Migration has already been applied.\n');
    console.log('📋 Verification:');
    console.log('   Run: npm run verify:one-time\n');
    process.exit(0);
    return;
  }

  console.log('📄 Table does not exist. Migration SQL ready to apply:\n');
  console.log('═'.repeat(70));
  console.log('COPY THE SQL BELOW AND PASTE INTO SUPABASE SQL EDITOR');
  console.log('═'.repeat(70));
  console.log('');

  // Read and output the SQL
  try {
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251217000000_one_time_purchases.sql');
    const sql = readFileSync(migrationPath, 'utf-8');
    console.log(sql);
    console.log('');
    console.log('═'.repeat(70));
    console.log('');

    console.log('📋 Application Steps:');
    console.log('   1. Go to: https://app.supabase.com');
    console.log('   2. Select project: achowlksgmwuvfbvjfrt');
    console.log('   3. Click: SQL Editor → New query');
    console.log('   4. Paste the SQL above');
    console.log('   5. Click: Run (or press Ctrl+Enter)');
    console.log('   6. Wait for "Success" message');
    console.log('   7. Verify: npm run verify:one-time\n');
    
  } catch (error: any) {
    console.error('❌ Error reading migration file:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

