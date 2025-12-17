#!/usr/bin/env tsx
/**
 * Apply One-Time Purchases Migration - Direct Application
 * 
 * This script attempts to apply the migration using Supabase Management API.
 * 
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... tsx scripts/apply-migration-now.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is required');
  console.error('\nPlease set it as an environment variable:');
  console.error('  $env:SUPABASE_SERVICE_ROLE_KEY="your-key"');
  console.error('  tsx scripts/apply-migration-now.ts\n');
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

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract project reference from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectRef) {
      return { success: false, error: 'Could not extract project ref from URL' };
    }

    // Try using Supabase Management API
    const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
    
    const response = await fetch(managementUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        query: sql,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function applyMigration(): Promise<boolean> {
  console.log('🔍 Checking if table already exists...\n');
  
  const exists = await checkTableExists();
  if (exists) {
    console.log('✅ Table cc_one_time_purchases already exists!');
    console.log('   Migration has already been applied.\n');
    return true;
  }

  console.log('📄 Reading migration file...');
  const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20251217000000_one_time_purchases.sql');
  const sql = readFileSync(migrationPath, 'utf-8');
  
  console.log('🚀 Attempting to apply migration via Management API...\n');

  // Try to execute via Management API
  const result = await executeSQL(sql);
  
  if (result.success) {
    console.log('✅ Migration applied successfully via Management API!\n');
    
    // Verify
    const verified = await checkTableExists();
    if (verified) {
      console.log('✅ Verification: Table exists in database!');
      return true;
    } else {
      console.log('⚠️  Verification: Table not found (may need manual verification)');
      return false;
    }
  } else {
    console.log('⚠️  Management API execution failed:', result.error);
    console.log('\n📋 Manual Application Required:\n');
    console.log('   The Supabase Management API may not support DDL statements.');
    console.log('   Please apply the migration manually:\n');
    console.log('   1. Go to: https://app.supabase.com');
    console.log('   2. Select your project');
    console.log('   3. Click "SQL Editor" → "New query"');
    console.log('   4. Copy SQL from: supabase/migrations/20251217000000_one_time_purchases.sql');
    console.log('   5. Paste and click "Run"\n');
    
    // Show the SQL
    console.log('📄 Migration SQL:\n');
    console.log('─'.repeat(60));
    console.log(sql);
    console.log('─'.repeat(60));
    console.log('');
    
    return false;
  }
}

async function main() {
  console.log('🚀 One-Time Purchases Migration Application\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}\n`);

  try {
    const success = await applyMigration();
    
    if (success) {
      console.log('🎉 Migration complete!');
      console.log('\n📋 Next steps:');
      console.log('   1. Run: npm run verify:one-time');
      console.log('   2. Configure Stripe (see STRIPE_SETUP_COMPLETE.md)');
      console.log('   3. Test checkout flow\n');
      process.exit(0);
    } else {
      console.log('⚠️  Please apply migration manually (see instructions above)\n');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nPlease apply the migration manually in Supabase SQL Editor.\n');
    process.exit(1);
  }
}

main();

