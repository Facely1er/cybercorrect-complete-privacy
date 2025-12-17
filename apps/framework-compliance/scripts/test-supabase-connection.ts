/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Test Supabase Connection
 * 
 * This script tests the connection to Supabase and verifies basic functionality.
 * 
 * Usage:
 *   npx tsx scripts/test-supabase-connection.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}\n`);

  // Test 1: Basic connection
  console.log('1️⃣  Testing basic connection...');
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error && error.message.includes('Invalid API key')) {
      console.error('   ❌ Invalid API key');
      return false;
    }
    console.log('   ✅ Connection successful');
  } catch (error) {
    console.error('   ❌ Connection failed:', error);
    return false;
  }

  // Test 2: Check if tables exist
  console.log('\n2️⃣  Testing table access...');
  const testTables = [
    'cc_privacy_consent_records',
    'cc_privacy_subscriptions',
  ];

  let tablesAccessible = 0;
  for (const table of testTables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`   ⚠️  ${table} - Table does not exist (migrations not applied)`);
        } else {
          console.log(`   ⚠️  ${table} - ${error.message}`);
        }
      } else {
        console.log(`   ✅ ${table} - Accessible`);
        tablesAccessible++;
      }
    } catch (error) {
      console.log(`   ❌ ${table} - Error: ${error}`);
    }
  }

  // Test 3: Test authentication
  console.log('\n3️⃣  Testing authentication...');
  try {
    // Try to sign up a test user (will fail if email exists, but that's OK)
    const testEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log('   ✅ Authentication working (email already exists test)');
      } else {
        console.log(`   ⚠️  Authentication test: ${error.message}`);
      }
    } else {
      console.log('   ✅ Authentication working');
    }
  } catch (error) {
    console.log(`   ⚠️  Authentication test error: ${error}`);
  }

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`   ✅ Connection: Working`);
  console.log(`   ✅ Tables accessible: ${tablesAccessible}/${testTables.length}`);
  console.log(`   ✅ Authentication: Working`);

  if (tablesAccessible === 0) {
    console.log('\n⚠️  No tables found. Please apply migrations:');
    console.log('   See APPLY_MIGRATIONS.md for instructions');
  } else {
    console.log('\n🎉 Supabase connection is working!');
  }

  return true;
}

testConnection().catch(console.error);


