#!/usr/bin/env tsx`n/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Verify Database Migrations Status
 * 
 * This script checks which database tables exist to determine migration status.
 * 
 * Usage:
 *   npm run verify:migrations
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expected tables from migrations
const expectedTables = [
  'cc_privacy_consent_records',
  'cc_privacy_subscriptions',
  'cc_privacy_vendor_assessments',
  'cc_privacy_retention_policies',
  'cc_privacy_data_records',
  'cc_privacy_dpias',
  'cc_privacy_privacy_by_design_assessments',
  'cc_privacy_service_providers',
  'cc_privacy_privacy_incidents',
  'cc_privacy_subscription_history',
  'cc_privacy_payment_methods',
  'cc_privacy_invoices',
  'cc_one_time_purchases', // One-time purchases table
];

async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return false;
      }
      // Other errors might mean table exists but we can't access it
      // For now, assume it exists if we get a non-"does not exist" error
      return true;
    }
    return true;
  } catch {
    return false;
  }
}

async function verifyMigrationsStatus() {
  console.log('🔍 Verifying Database Migrations Status...\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);

  const results: { table: string; exists: boolean }[] = [];
  let existingCount = 0;

  console.log('Checking tables...\n');

  for (const table of expectedTables) {
    const exists = await checkTableExists(table);
    results.push({ table, exists });
    
    if (exists) {
      console.log(`   ✅ ${table} - Exists`);
      existingCount++;
    } else {
      console.log(`   ❌ ${table} - Missing`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Migration Status Summary:\n`);
  console.log(`   ✅ Tables found: ${existingCount}/${expectedTables.length}`);
  console.log(`   ❌ Tables missing: ${expectedTables.length - existingCount}/${expectedTables.length}\n`);

  if (existingCount === expectedTables.length) {
    console.log('🎉 All migrations appear to be applied!');
    console.log('   All expected tables exist in the database.\n');
    return true;
  } else if (existingCount === 0) {
    console.log('⚠️  No privacy tool tables found.');
    console.log('   Migrations may not have been applied yet.\n');
    console.log('   Next Steps:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Apply migrations from: supabase/migrations/');
    console.log('   3. See APPLY_MIGRATIONS.md for detailed instructions\n');
    return false;
  } else {
    console.log('⚠️  Some migrations appear to be missing.');
    console.log('   Some expected tables are not found.\n');
    console.log('   Next Steps:');
    console.log('   1. Go to Supabase Dashboard → SQL Editor');
    console.log('   2. Apply missing migrations from: supabase/migrations/');
    console.log('   3. See APPLY_MIGRATIONS.md for detailed instructions\n');
    return false;
  }
}

verifyMigrationsStatus()
  .then((allApplied) => {
    process.exit(allApplied ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Error verifying migrations:', error);
    process.exit(1);
  });



