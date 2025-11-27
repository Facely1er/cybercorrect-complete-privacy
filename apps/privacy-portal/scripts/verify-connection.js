#!/usr/bin/env node

/**
 * Connection Verification Script
 * 
 * This script verifies that the application can connect to the remote Supabase database.
 * Run this script to diagnose connection issues.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load environment variables from .env file
function loadEnvFile() {
  const envPath = join(__dirname, '../../../../.env');
  const envLocalPath = join(__dirname, '../../../../.env.local');
  
  let envContent = '';
  
  if (existsSync(envLocalPath)) {
    envContent = readFileSync(envLocalPath, 'utf-8');
    console.log('📄 Loaded .env.local file');
  } else if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
    console.log('📄 Loaded .env file');
  } else {
    console.log('⚠️  No .env file found. Using environment variables from system.');
  }
  
  // Parse .env file
  if (envContent) {
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = value.trim();
        }
      }
    });
  }
}

// Load environment variables
loadEnvFile();

// Get Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('\n🔍 CyberCorrect Remote Connection Verification\n');
console.log('=' .repeat(60));

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERROR: Missing required environment variables\n');
  console.error('Required variables:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - VITE_SUPABASE_ANON_KEY\n');
  console.error('To fix this:');
  console.error('1. Create a .env file in the project root');
  console.error('2. Add your Supabase credentials:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key-here\n');
  console.error('Get your credentials from:');
  console.error('  https://app.supabase.com → Your Project → Settings → API\n');
  process.exit(1);
}

console.log('\n✅ Environment variables found');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'cybercorrect'
  }
});

async function testBasicConnection() {
  console.log('🔌 Testing basic connection...');
  
  try {
    // Test connection by querying a simple endpoint
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      // Check if it's a schema/table issue vs connection issue
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('   ⚠️  Connection successful, but tables may not exist yet');
        console.log(`   Error: ${error.message}`);
        return { connected: true, tablesExist: false, error: error.message };
      } else if (error.code === 'PGRST301') {
        console.log('   ⚠️  Connection successful, but RLS policies may be blocking access');
        console.log(`   Error: ${error.message}`);
        return { connected: true, tablesExist: true, rlsIssue: true, error: error.message };
      } else {
        console.log(`   ❌ Connection failed: ${error.message}`);
        return { connected: false, error: error.message };
      }
    } else {
      console.log('   ✅ Connection successful!');
      return { connected: true, tablesExist: true };
    }
  } catch (error) {
    console.log(`   ❌ Connection error: ${error.message}`);
    return { connected: false, error: error.message };
  }
}

async function testSchemaAccess() {
  console.log('\n📋 Testing schema access...');
  
  try {
    const { data, error } = await supabase
      .from('cybercorrect.profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.message.includes('schema') || error.message.includes('does not exist')) {
        console.log('   ⚠️  cybercorrect schema may not exist');
        console.log(`   Error: ${error.message}`);
        return false;
      }
      console.log(`   ⚠️  Schema access issue: ${error.message}`);
      return false;
    } else {
      console.log('   ✅ Schema access successful');
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Schema test error: ${error.message}`);
    return false;
  }
}

async function checkNetworkConnectivity() {
  console.log('\n🌐 Checking network connectivity...');
  
  try {
    const url = new URL(supabaseUrl);
    const response = await fetch(`https://${url.hostname}`, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok || response.status === 404) {
      console.log('   ✅ Network connectivity OK');
      return true;
    } else {
      console.log(`   ⚠️  Network response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Network connectivity failed: ${error.message}`);
    console.log('   💡 Check your internet connection and firewall settings');
    return false;
  }
}

async function verifyCredentials() {
  console.log('\n🔐 Verifying credentials...');
  
  try {
    // Try to access Supabase REST API directly
    const url = new URL(supabaseUrl);
    const apiUrl = `${supabaseUrl}/rest/v1/`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.status === 401 || response.status === 403) {
      console.log('   ❌ Invalid credentials');
      console.log('   💡 Check that VITE_SUPABASE_ANON_KEY is correct');
      return false;
    } else if (response.ok || response.status === 404) {
      console.log('   ✅ Credentials are valid');
      return true;
    } else {
      console.log(`   ⚠️  Unexpected response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ⚠️  Credential verification error: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  console.log('\n🚀 Running connection diagnostics...\n');
  
  const networkOk = await checkNetworkConnectivity();
  if (!networkOk) {
    console.log('\n❌ Cannot proceed without network connectivity');
    return;
  }
  
  const credentialsOk = await verifyCredentials();
  if (!credentialsOk) {
    console.log('\n❌ Invalid credentials. Please check your environment variables.');
    return;
  }
  
  const connectionResult = await testBasicConnection();
  const schemaOk = await testSchemaAccess();
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Connection Summary:\n');
  
  if (connectionResult.connected) {
    console.log('✅ Remote connection: SUCCESS');
    if (connectionResult.tablesExist) {
      console.log('✅ Database tables: EXIST');
    } else {
      console.log('⚠️  Database tables: MISSING (run migrations)');
    }
    if (schemaOk) {
      console.log('✅ Schema access: WORKING');
    } else {
      console.log('⚠️  Schema access: ISSUES DETECTED');
    }
    console.log('\n🎉 CyberCorrect is connected to remote Supabase!');
  } else {
    console.log('❌ Remote connection: FAILED');
    console.log(`   Error: ${connectionResult.error}`);
    console.log('\n💡 Troubleshooting steps:');
    console.log('1. Verify VITE_SUPABASE_URL is correct');
    console.log('2. Verify VITE_SUPABASE_ANON_KEY is correct');
    console.log('3. Check that your Supabase project is active');
    console.log('4. Verify network connectivity');
    console.log('5. Check firewall/proxy settings');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

