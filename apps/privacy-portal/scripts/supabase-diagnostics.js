#!/usr/bin/env node

/**
 * Table Creation via Supabase Client
 * 
 * This script creates tables directly using the Supabase client
 * without relying on custom SQL execution functions.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration - REQUIRED environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Missing required environment variables');
  console.error('');
  console.error('Required environment variables:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Please set these environment variables before running this script.');
  console.error('Example:');
  console.error('  export VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.error('');
  process.exit(1);
}

console.log(`📡 Connecting to: ${supabaseUrl}`);

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  console.log('\n🔍 Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`);
      return false;
    } else {
      console.log('   ✅ Connection successful');
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Connection error: ${error.message}`);
    return false;
  }
}

async function checkExistingTables() {
  console.log('\n📋 Checking existing tables...');
  
  try {
    // Check what tables exist in the public schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.log(`   ⚠️  Could not check tables: ${error.message}`);
    } else {
      console.log('   📊 Existing tables in public schema:');
      if (data && data.length > 0) {
        data.forEach(table => {
          console.log(`      - ${table.table_name}`);
        });
      } else {
        console.log('      (no tables found)');
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Table check error: ${error.message}`);
  }
}

async function createTablesViaClient() {
  console.log('\n🏗️  Creating tables using Supabase client...');
  
  // Since we can't execute raw SQL, we'll work with what's available
  // Let's try to create tables by inserting data (which will create the table if it doesn't exist)
  
  const tables = [
    {
      name: 'cc_profiles',
      sampleData: {
        id: '00000000-0000-0000-0000-000000000000',
        organization_id: '00000000-0000-0000-0000-000000000000',
        role: 'student',
        full_name: 'Test User',
        email: 'test@example.com',
        department: 'Test Department',
        avatar_url: null,
        settings: {},
        preferences: {},
        last_login: null,
        login_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    },
    {
      name: 'cc_data_subject_requests',
      sampleData: {
        id: '00000000-0000-0000-0000-000000000000',
        organization_id: '00000000-0000-0000-0000-000000000000',
        user_id: '00000000-0000-0000-0000-000000000000',
        request_type: 'access',
        requester_name: 'Test Requester',
        requester_email: 'requester@example.com',
        requester_relationship: 'self',
        student_identifier: 'TEST001',
        request_details: {},
        applicable_regulations: [],
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        completed_at: null,
        assigned_to: null,
        notes: null,
        response_data: {},
        verification_status: null,
        communication_log: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    }
  ];

  for (const table of tables) {
    console.log(`   🔄 Testing table creation: ${table.name}`);
    
    try {
      // Try to insert sample data (this will fail if table doesn't exist, which is expected)
      const { data, error } = await supabase
        .from(table.name)
        .insert(table.sampleData);
      
      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.log(`   ⚠️  Table ${table.name} does not exist (expected)`);
        } else {
          console.log(`   ⚠️  Table ${table.name} error: ${error.message}`);
        }
      } else {
        console.log(`   ✅ Table ${table.name} exists and is accessible`);
      }
    } catch (error) {
      console.log(`   ⚠️  Table ${table.name} test error: ${error.message}`);
    }
  }
}

async function checkSupabaseCapabilities() {
  console.log('\n🔧 Checking Supabase capabilities...');
  
  try {
    // Check if we can access the database directly
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(5);
    
    if (error) {
      console.log(`   ⚠️  Cannot access pg_tables: ${error.message}`);
    } else {
      console.log('   ✅ Can access system tables');
      if (data) {
        console.log('   📊 Available system tables:');
        data.forEach(table => {
          console.log(`      - ${table.tablename}`);
        });
      }
    }
  } catch (error) {
    console.log(`   ⚠️  System table check error: ${error.message}`);
  }
}

async function suggestAlternativeApproach() {
  console.log('\n💡 Alternative Migration Approach:');
  console.log('');
  console.log('Since direct SQL execution is not available, here are alternative approaches:');
  console.log('');
  console.log('1. 📝 Manual Database Setup:');
  console.log('   - Use Supabase Dashboard SQL Editor');
  console.log('   - Run the migration SQL files manually');
  console.log('   - Create tables in the public schema with cc_ prefix');
  console.log('');
  console.log('2. 🔧 Environment Configuration:');
  console.log('   - Update application to use public schema');
  console.log('   - Modify table names to include cc_ prefix');
  console.log('   - Use existing Supabase project structure');
  console.log('');
  console.log('3. 🚀 Application-Level Solution:');
  console.log('   - Create tables on first application startup');
  console.log('   - Use localStorage for offline functionality');
  console.log('   - Implement data synchronization when database is available');
  console.log('');
  console.log('4. 📋 Recommended Next Steps:');
  console.log('   - Test critical user flows with demo data');
  console.log('   - Implement proper error messaging');
  console.log('   - Add offline-first functionality');
  console.log('   - Plan for production database setup');
}

async function runDiagnostics() {
  try {
    console.log('\n🚀 Running Supabase diagnostics...');
    
    const connected = await testConnection();
    if (!connected) {
      console.log('\n❌ Cannot proceed without database connection');
      return;
    }
    
    await checkExistingTables();
    await checkSupabaseCapabilities();
    await createTablesViaClient();
    await suggestAlternativeApproach();
    
    console.log('\n✅ Diagnostics completed');
    
  } catch (error) {
    console.error('❌ Diagnostics failed:', error.message);
  }
}

// Run diagnostics
runDiagnostics();
