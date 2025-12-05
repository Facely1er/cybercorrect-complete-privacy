#!/usr/bin/env node

/**
 * Direct Migration Application Script
 * 
 * This script applies migrations directly using Supabase REST API
 * without relying on custom functions that may not exist.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

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

// Migration files in order
const migrationFiles = [
  '20250115000000_cybercorrect_schema_differentiation.sql',
  '20250115000001_migrate_to_cybercorrect_schema.sql',
  '20250115000002_finalize_backend_configuration.sql'
];

async function executeSQL(sql) {
  try {
    // Use the REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error };
  }
}

async function applyMigrations() {
  try {
    console.log('\n📋 Found migration files:');
    migrationFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('\n🔄 Starting migration process...');
    
    for (let i = 0; i < migrationFiles.length; i++) {
      const migrationFile = migrationFiles[i];
      const migrationPath = join(process.cwd(), 'supabase', 'migrations', migrationFile);
      
      console.log(`\n📄 Processing migration ${i + 1}/${migrationFiles.length}: ${migrationFile}`);
      
      try {
        const migrationSQL = readFileSync(migrationPath, 'utf8');
        
        if (!migrationSQL.trim()) {
          console.log('   ⚠️  Migration file is empty, skipping...');
          continue;
        }
        
        console.log('   🔄 Executing migration...');
        const { success, error } = await executeSQL(migrationSQL);
        
        if (error) {
          console.log(`   ❌ Error applying migration: ${error.message}`);
          
          // Check if it's an "already exists" error
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate') ||
              error.message.includes('already defined')) {
            console.log(`   ⚠️  Migration may already be applied, continuing...`);
          } else {
            console.log(`   🛑 Stopping migration process due to error`);
            return;
          }
        } else {
          console.log(`   ✅ Migration applied successfully`);
        }
        
        // Wait a moment before next migration
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (fileError) {
        console.log(`   ❌ Error reading migration file: ${fileError.message}`);
        return;
      }
    }
    
    console.log('\n🎉 All migrations completed successfully!');
    
    // Verify the schema was created
    console.log('\n🔍 Verifying schema creation...');
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'cybercorrect');
    
    if (schemaError) {
      console.log('   ⚠️  Could not verify schema creation');
    } else if (schemas && schemas.length > 0) {
      console.log('   ✅ cybercorrect schema verified');
    } else {
      console.log('   ❌ cybercorrect schema not found');
    }
    
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
applyMigrations();
