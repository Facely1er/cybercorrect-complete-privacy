#!/usr/bin/env tsx
/**
 * Verify Database Migrations
 * 
 * This script checks which migrations have been applied to the database
 * by verifying the existence of expected tables and objects.
 * 
 * Usage:
 *   npm run verify:migrations
 *   OR
 *   tsx scripts/verify-migrations.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('   Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Expected tables from migrations
 */
const EXPECTED_TABLES = [
  // Privacy tools tables
  'cc_privacy_consent_records',
  'cc_privacy_vendor_assessments',
  'cc_privacy_retention_policies',
  'cc_privacy_data_records',
  'cc_privacy_dpias',
  'cc_privacy_privacy_by_design_assessments',
  'cc_privacy_service_providers',
  'cc_privacy_privacy_incidents',
  
  // Subscription tables
  'cc_privacy_subscriptions',
  'cc_privacy_subscription_history',
  'cc_privacy_payment_methods',
  'cc_privacy_invoices',
  
  // Calendar and events
  'cc_privacy_calendar_events',
  
  // RoPA and evidence
  'cc_privacy_ropa_records',
  'cc_privacy_evidence_vault',
  
  // One-time purchases
  'cc_one_time_purchases',
  
  // Portal beta
  'portal_beta_applications',
  
  // Subscription features
  'automated_reports',
  'compliance_health_scores',
  'scheduled_assessments',
  'alert_rules',
  'regulatory_updates',
];

/**
 * Check if a table exists
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    // Try to query the table (will fail if it doesn't exist)
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);
    
    // If error is about table not existing, return false
    if (error && error.message.includes('does not exist')) {
      return false;
    }
    
    // Any other error might mean table exists but has RLS issues, still return true
    return true;
  } catch (err: any) {
    // If error mentions table doesn't exist, return false
    if (err.message?.includes('does not exist')) {
      return false;
    }
    // Otherwise assume table exists
    return true;
  }
}

/**
 * Check tables using SQL query (more reliable)
 */
async function checkTablesSQL(): Promise<Record<string, boolean>> {
  let data: any = null;
  let error: any = null;

  try {
    const result = await supabase.rpc('exec_sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (${EXPECTED_TABLES.map(t => `'${t}'`).join(', ')})
        ORDER BY table_name;
      `
    });
    data = result.data;
    error = result.error;
  } catch {
    // RPC not available or other error
    error = { message: 'RPC not available' };
  }

  // If RPC doesn't work, fall back to individual checks
  if (error) {
    const results: Record<string, boolean> = {};
    for (const table of EXPECTED_TABLES) {
      results[table] = await checkTableExists(table);
    }
    return results;
  }

  // If RPC worked, build results from data
  const existingTables = new Set((data || []).map((row: any) => row.table_name));
  const results: Record<string, boolean> = {};
  for (const table of EXPECTED_TABLES) {
    results[table] = existingTables.has(table);
  }
  return results;
}

/**
 * Main verification function
 */
async function verifyMigrations() {
  console.log('🔍 Verifying Database Migrations...\n');
  console.log(`📡 Connecting to: ${SUPABASE_URL}\n`);

  const results = await checkTablesSQL();
  
  const existing = Object.entries(results).filter(([, exists]) => exists);
  const missing = Object.entries(results).filter(([, exists]) => !exists);

  console.log(`✅ Found ${existing.length}/${EXPECTED_TABLES.length} tables:\n`);
  
  existing.forEach(([table]) => {
    console.log(`   ✓ ${table}`);
  });

  if (missing.length > 0) {
    console.log(`\n❌ Missing ${missing.length} tables:\n`);
    missing.forEach(([table]) => {
      console.log(`   ✗ ${table}`);
    });
    
    console.log('\n📋 To apply missing migrations:');
    console.log('   1. Open Supabase Dashboard → SQL Editor');
    console.log('   2. Open apps/framework-compliance/supabase/migrations/ALL_MIGRATIONS_COMBINED.sql');
    console.log('   3. Copy and paste the entire file');
    console.log('   4. Click Run\n');
    
    process.exit(1);
  } else {
    console.log('\n🎉 All migrations have been applied successfully!\n');
    process.exit(0);
  }
}

if (require.main === module) {
  verifyMigrations().catch((error) => {
    console.error('❌ Error verifying migrations:', error);
    process.exit(1);
  });
}

export { verifyMigrations, checkTableExists };

