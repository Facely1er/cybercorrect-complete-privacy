/**
 * Test Stripe Integration
 * Verifies that Stripe integration is working correctly
 */

/* eslint-disable no-console */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

async function testEdgeFunction(functionName: string): Promise<{ available: boolean; status?: number; error?: string }> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'OPTIONS',
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (response.ok || response.status === 200 || response.status === 204) {
      return { available: true, status: response.status };
    }
    return { available: false, status: response.status, error: `HTTP ${response.status}` };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { available: false, error: errorMessage };
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

  const results: Record<string, { available: boolean; status?: number; error?: string }> = {};
  
  for (const func of functions) {
    const result = await testEdgeFunction(func);
    results[func] = result;
    if (result.available) {
      console.log(`✅ ${func}: Available (Status: ${result.status || 'OK'})`);
    } else {
      console.log(`❌ ${func}: Not available`);
      if (result.status) {
        console.log(`   HTTP Status: ${result.status}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
      console.log(`   → Check if function is deployed in Supabase Dashboard`);
    }
  }

  // Test database connection
  console.log('\n📊 Testing Database Connection:');
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      if (error.code === 'PGRST116') {
        // Table not found is OK - might not exist yet
        console.log('⚠️  Database connection OK (users table not found - this is OK)');
      } else {
        console.log(`⚠️  Database connection issue: ${error.message} (Code: ${error.code})`);
      }
    } else {
      console.log('✅ Database connection successful');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`❌ Database connection failed: ${errorMessage}`);
  }
  
  // Test subscriptions table (if it exists)
  console.log('\n💳 Testing Subscriptions Table:');
  try {
    const { error } = await supabase.from('subscriptions').select('count').limit(1);
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Subscriptions table not found - ensure migrations are applied');
      } else {
        console.log(`⚠️  Subscriptions table issue: ${error.message}`);
      }
    } else {
      console.log('✅ Subscriptions table accessible');
    }
  } catch {
    console.log('⚠️  Could not access subscriptions table');
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Test Results:\n');
  
  const allFunctionsAvailable = Object.values(results).every(r => r.available);
  
  if (allFunctionsAvailable) {
    console.log('✅ All Edge Functions are available');
    console.log('\n🎉 Integration appears to be working!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Test subscription checkout flow');
    console.log('   2. Test one-time purchase checkout flow');
    console.log('   3. Verify webhook receives events in Stripe Dashboard');
    console.log('   4. Check Supabase function logs for any warnings');
  } else {
    console.log('⚠️  Some Edge Functions are not available');
    console.log('\n📝 Action Required:');
    console.log('   1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions');
    console.log('   2. Deploy missing Edge Functions');
    console.log('   3. Verify secrets are set correctly for each function');
    console.log('   4. Check function logs for errors');
    console.log('   5. See STRIPE_SETUP_COMPLETE.md for detailed troubleshooting');
    
    // List which functions are missing
    const missingFunctions = Object.entries(results)
      .filter(([, result]) => !result.available)
      .map(([name]) => name);
    
    if (missingFunctions.length > 0) {
      console.log(`\n   Missing functions: ${missingFunctions.join(', ')}`);
    }
  }

  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

