/**
 * Verify Supabase Setup
 * 
 * This script verifies that your Supabase connection is working correctly
 * and that all required tables exist.
 * 
 * Usage:
 *   npx tsx scripts/verify-supabase-setup.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Required tables for privacy tools
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

async function checkTable(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Table exists but is empty - that's OK
        return true;
      }
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return false;
      }
      // Other error - table might exist but have permission issues
      console.warn(`   ⚠️  ${tableName}: ${error.message}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`   ❌ ${tableName}: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Verifying Supabase Setup...\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);
  
  // Test connection
  console.log('1️⃣  Testing connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      console.error('   ❌ Invalid API key. Please check VITE_SUPABASE_ANON_KEY');
      process.exit(1);
    }
    console.log('   ✅ Connection successful\n');
  } catch (error) {
    console.error('   ❌ Connection failed:', error);
    process.exit(1);
  }
  
  // Check tables
  console.log('2️⃣  Checking required tables...\n');
  let allTablesExist = true;
  const results: { table: string; exists: boolean }[] = [];
  
  for (const table of requiredTables) {
    const exists = await checkTable(table);
    results.push({ table, exists });
    if (!exists) {
      allTablesExist = false;
    }
  }
  
  // Print results
  for (const { table, exists } of results) {
    if (exists) {
      console.log(`   ✅ ${table}`);
    } else {
      console.log(`   ❌ ${table} - MISSING`);
    }
  }
  
  console.log('\n📊 Summary:');
  const existingCount = results.filter(r => r.exists).length;
  const missingCount = results.filter(r => !r.exists).length;
  
  console.log(`   ✅ Existing: ${existingCount}/${requiredTables.length}`);
  console.log(`   ❌ Missing: ${missingCount}/${requiredTables.length}`);
  
  if (allTablesExist) {
    console.log('\n🎉 All tables exist! Setup is complete.');
    console.log('\n✅ Next steps:');
    console.log('   1. Deploy Edge Functions (see scripts/setup-supabase.md)');
    console.log('   2. Configure Stripe (for payments)');
    console.log('   3. Configure SendGrid (for emails)');
    console.log('   4. Test the application');
  } else {
    console.log('\n⚠️  Some tables are missing. Please apply migrations:');
    console.log('   See APPLY_MIGRATIONS.md for instructions');
    console.log('\nMissing tables:');
    results.filter(r => !r.exists).forEach(({ table }) => {
      console.log(`   - ${table}`);
    });
  }
}

main().catch(console.error);

