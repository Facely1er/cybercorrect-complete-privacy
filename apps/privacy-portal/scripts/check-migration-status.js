#!/usr/bin/env node

/**
 * Check Migration Status Script
 * 
 * This script connects to the remote Supabase instance and checks the migration status.
 * It will identify which migrations have been applied and which ones are missing.
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

console.log('🔍 Checking Supabase migration status...');
console.log(`📡 Connecting to: ${supabaseUrl}`);

// Create Supabase client with service role key for full access
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkMigrationStatus() {
  try {
    console.log('\n📊 Checking cybercorrect schema...');
    
    // Try to access cybercorrect schema directly by checking for application_metadata table
    const { data: metadata, error: metadataError } = await supabase
      .schema('cybercorrect')
      .from('application_metadata')
      .select('*')
      .limit(1);
    
    if (metadataError) {
      console.log('❌ cybercorrect schema not found or not accessible. Migrations need to be applied.');
      console.log('Error details:', metadataError.message);
      return;
    }
    
    console.log('✅ cybercorrect schema exists and is accessible');
    
    if (metadata && metadata.length > 0) {
      const appData = metadata[0];
      console.log('\n📋 Application Metadata:');
      console.log(`   Application: ${appData.application_name}`);
      console.log(`   Version: ${appData.version}`);
      console.log(`   Schema Version: ${appData.schema_version}`);
      console.log(`   Last Updated: ${appData.last_updated}`);
      
      if (appData.configuration) {
        console.log('\n🔧 Configuration:');
        Object.entries(appData.configuration).forEach(([key, value]) => {
          console.log(`   ${key}: ${value}`);
        });
      }
    }
    
    // Check all tables in cybercorrect schema by trying to access them
    const expectedTables = [
      'application_metadata',
      'profiles',
      'data_subject_requests',
      'consent_records',
      'privacy_incidents',
      'compliance_tracking',
      'cache_metadata',
      'data_sync_log'
    ];
    
    console.log('\n🔍 Checking for expected tables:');
    
    for (const tableName of expectedTables) {
      try {
        const { error } = await supabase
          .schema('cybercorrect')
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${tableName} - ${error.message}`);
        } else {
          console.log(`   ✅ ${tableName}`);
        }
      } catch (err) {
        console.log(`   ❌ ${tableName} - ${err.message}`);
      }
    }
    
    // Check if we can access the public schema tables (for migration comparison)
    console.log('\n🔍 Checking public schema tables:');
    const publicTables = ['profiles'];
    
    for (const tableName of publicTables) {
      try {
        const { error } = await supabase
          .schema('public')
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ public.${tableName} - ${error.message}`);
        } else {
          console.log(`   ✅ public.${tableName} exists`);
        }
      } catch (err) {
        console.log(`   ❌ public.${tableName} - ${err.message}`);
      }
    }
    
    console.log('\n✅ Migration status check completed!');
    
  } catch (error) {
    console.error('❌ Error during migration status check:', error);
  }
}

// Run the check
checkMigrationStatus();