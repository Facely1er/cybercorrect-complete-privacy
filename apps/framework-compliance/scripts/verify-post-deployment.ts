#!/usr/bin/env tsx`n/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Post-Deployment Verification Script
 * 
 * This script verifies that the production deployment is working correctly.
 * Run this after deploying to production.
 */

import { createClient } from '@supabase/supabase-js';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'skip';
  message: string;
  details?: string;
}

const checks: CheckResult[] = [];

// Get production URL from environment or prompt
const PRODUCTION_URL = process.env.PRODUCTION_URL || process.env.VERCEL_URL || '';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Check 1: Verify environment variables are set
function checkEnvironmentVariables(): CheckResult {
  const missing: string[] = [];
  
  if (!SUPABASE_URL || SUPABASE_URL === '') {
    missing.push('VITE_SUPABASE_URL');
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === '') {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }
  
  if (missing.length > 0) {
    return {
      name: 'Environment Variables',
      status: 'fail',
      message: `Missing required environment variables: ${missing.join(', ')}`,
      details: 'Set these in Vercel Dashboard → Settings → Environment Variables'
    };
  }
  
  return {
    name: 'Environment Variables',
    status: 'pass',
    message: 'All required environment variables are set',
    details: `Supabase URL: ${SUPABASE_URL.substring(0, 30)}...`
  };
}

// Check 2: Test Supabase connection
async function checkSupabaseConnection(): Promise<CheckResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      name: 'Supabase Connection',
      status: 'skip',
      message: 'Skipped: Environment variables not set'
    };
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Test connection by querying a simple table
    const { data, error } = await supabase
      .from('cc_privacy_subscriptions')
      .select('id')
      .limit(1);
    
    if (error) {
      // Check if it's a table not found error (42P01) or permission error
      if (error.code === '42P01') {
        return {
          name: 'Supabase Connection',
          status: 'warning',
          message: 'Connected but table not found (migrations may not be applied)',
          details: error.message
        };
      } else if (error.code === 'PGRST116') {
        return {
          name: 'Supabase Connection',
          status: 'warning',
          message: 'Connected but no rows found (expected for new deployments)',
          details: 'This is normal for a fresh deployment'
        };
      } else {
        return {
          name: 'Supabase Connection',
          status: 'fail',
          message: `Connection error: ${error.message}`,
          details: error.code
        };
      }
    }
    
    return {
      name: 'Supabase Connection',
      status: 'pass',
      message: 'Successfully connected to Supabase',
      details: 'Database queries are working correctly'
    };
  } catch (error: any) {
    return {
      name: 'Supabase Connection',
      status: 'fail',
      message: `Failed to connect: ${error.message}`,
      details: error.stack
    };
  }
}

// Check 3: Verify database tables exist
async function checkDatabaseTables(): Promise<CheckResult> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return {
      name: 'Database Tables',
      status: 'skip',
      message: 'Skipped: Environment variables not set'
    };
  }
  
  const EXPECTED_TABLES = [
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
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const existingTables: string[] = [];
    const missingTables: string[] = [];
    
    for (const table of EXPECTED_TABLES) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (error && error.code === '42P01') {
          missingTables.push(table);
        } else {
          existingTables.push(table);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }
    
    if (missingTables.length > 0) {
      return {
        name: 'Database Tables',
        status: 'fail',
        message: `Missing ${missingTables.length} table(s): ${missingTables.slice(0, 3).join(', ')}${missingTables.length > 3 ? '...' : ''}`,
        details: `Found: ${existingTables.length}/${EXPECTED_TABLES.length} tables. Apply migrations if needed.`
      };
    }
    
    return {
      name: 'Database Tables',
      status: 'pass',
      message: `All ${EXPECTED_TABLES.length} expected tables exist`,
      details: 'Database migrations appear to be applied correctly'
    };
  } catch (error: any) {
    return {
      name: 'Database Tables',
      status: 'fail',
      message: `Error checking tables: ${error.message}`,
      details: error.stack
    };
  }
}

// Check 4: Test production URL (if provided)
async function checkProductionURL(): Promise<CheckResult> {
  if (!PRODUCTION_URL || PRODUCTION_URL === '') {
    return {
      name: 'Production URL',
      status: 'skip',
      message: 'Skipped: Production URL not provided',
      details: 'Set PRODUCTION_URL environment variable or visit the URL manually'
    };
  }
  
  try {
    const url = PRODUCTION_URL.startsWith('http') ? PRODUCTION_URL : `https://${PRODUCTION_URL}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Post-Deployment-Verification/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      return {
        name: 'Production URL',
        status: 'fail',
        message: `Production URL returned status ${response.status}`,
        details: `URL: ${url}`
      };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      return {
        name: 'Production URL',
        status: 'warning',
        message: 'Production URL accessible but content type may be incorrect',
        details: `Content-Type: ${contentType}`
      };
    }
    
    return {
      name: 'Production URL',
      status: 'pass',
      message: 'Production URL is accessible and returns HTML',
      details: `URL: ${url}, Status: ${response.status}`
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        name: 'Production URL',
        status: 'fail',
        message: 'Production URL request timed out',
        details: 'The URL may be slow or unreachable'
      };
    }
    
    return {
      name: 'Production URL',
      status: 'fail',
      message: `Failed to access production URL: ${error.message}`,
      details: error.stack
    };
  }
}

// Check 5: Verify Edge Function secrets (informational)
function checkEdgeFunctionSecrets(): CheckResult {
  return {
    name: 'Edge Function Secrets',
    status: 'skip',
    message: 'Manual verification required',
    details: 'Check Supabase Dashboard → Edge Functions → Settings → Secrets to verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are configured'
  };
}

// Run all checks
async function runChecks(): Promise<void> {
  console.log('🔍 Post-Deployment Verification\n');
  console.log('='.repeat(60));
  console.log(`📡 Supabase URL: ${SUPABASE_URL || 'Not set'}`);
  console.log(`🌐 Production URL: ${PRODUCTION_URL || 'Not set'}`);
  console.log('='.repeat(60));
  console.log('\n');
  
  // Run synchronous checks
  checks.push(checkEnvironmentVariables());
  checks.push(checkEdgeFunctionSecrets());
  
  // Run async checks
  checks.push(await checkSupabaseConnection());
  checks.push(await checkDatabaseTables());
  checks.push(await checkProductionURL());
  
  // Display results
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;
  let skipCount = 0;
  
  console.log('Verification Results:\n');
  
  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : 
                 check.status === 'fail' ? '❌' : 
                 check.status === 'warning' ? '⚠️' : '⏭️';
    const color = check.status === 'pass' ? '\x1b[32m' : 
                  check.status === 'fail' ? '\x1b[31m' : 
                  check.status === 'warning' ? '\x1b[33m' : '\x1b[90m';
    const reset = '\x1b[0m';
    
    console.log(`${icon} ${color}${check.name}${reset}: ${check.message}`);
    if (check.details) {
      console.log(`   ${check.details}`);
    }
    console.log('');
    
    if (check.status === 'pass') passCount++;
    else if (check.status === 'fail') failCount++;
    else if (check.status === 'warning') warningCount++;
    else skipCount++;
  }
  
  console.log('='.repeat(60));
  console.log('\n📊 Summary:\n');
  console.log(`   ✅ Passed: ${passCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⚠️  Warnings: ${warningCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   📋 Total: ${checks.length}\n`);
  
  if (failCount > 0) {
    console.log('❌ Post-deployment verification FAILED');
    console.log('Please address the failed checks before considering the deployment successful.\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  Post-deployment verification PASSED with warnings');
    console.log('Review warnings and address them as needed.\n');
    process.exit(0);
  } else {
    console.log('✅ Post-deployment verification PASSED');
    console.log('Production deployment appears to be working correctly!\n');
    process.exit(0);
  }
}

// Run checks
runChecks().catch((error) => {
  console.error('❌ Fatal error during verification:', error);
  process.exit(1);
});



