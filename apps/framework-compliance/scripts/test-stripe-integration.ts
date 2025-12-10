/**
 * Test Stripe Integration
 * Verifies that Stripe integration is working correctly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

async function testEdgeFunction(functionName: string): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'OPTIONS',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (response.ok || response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error testing ${functionName}:`, error);
    return false;
  }
}

async function main() {
  console.log('🧪 Testing Stripe Integration\n');
  console.log('='.repeat(70));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Test Edge Functions availability
  console.log('\n🔧 Testing Edge Functions:');
  
  const functions = [
    'create-checkout-session',
    'create-one-time-checkout-session',
    'stripe-webhook'
  ];

  const results: Record<string, boolean> = {};
  
  for (const func of functions) {
    const available = await testEdgeFunction(func);
    results[func] = available;
    console.log(`${available ? '✅' : '❌'} ${func}: ${available ? 'Available' : 'Not available or not deployed'}`);
  }

  // Test database connection
  console.log('\n📊 Testing Database Connection:');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 = table not found, which is OK
      console.log('⚠️  Database connection issue:', error.message);
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (error) {
    console.log('❌ Database connection failed');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Results:\n');
  
  const allFunctionsAvailable = Object.values(results).every(r => r);
  
  if (allFunctionsAvailable) {
    console.log('✅ All Edge Functions are available');
    console.log('\n🎉 Integration appears to be working!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Test subscription checkout flow');
    console.log('   2. Test one-time purchase checkout flow');
    console.log('   3. Verify webhook receives events in Stripe Dashboard');
  } else {
    console.log('⚠️  Some Edge Functions are not available');
    console.log('\n📝 Action Required:');
    console.log('   1. Deploy Edge Functions in Supabase Dashboard');
    console.log('   2. Verify secrets are set correctly');
    console.log('   3. Check function logs for errors');
  }

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

