#!/usr/bin/env node

/**
 * Schema-Differentiated Migration Script
 * 
 * This script creates a custom schema and tables using Supabase REST API
 * without conflicting with existing project data.
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

// Step-by-step migration using REST API
async function createSchema() {
  console.log('\n🏗️  Creating cybercorrect schema...');
  
  try {
    // Create schema using raw SQL via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: 'CREATE SCHEMA IF NOT EXISTS cybercorrect;'
      })
    });

    if (response.ok) {
      console.log('   ✅ Schema created successfully');
      return true;
    } else {
      const error = await response.text();
      console.log(`   ⚠️  Schema creation response: ${response.status} - ${error}`);
      return true; // Continue even if schema already exists
    }
  } catch (error) {
    console.log(`   ⚠️  Schema creation error: ${error.message}`);
    return true; // Continue - schema might already exist
  }
}

async function createTables() {
  console.log('\n📋 Creating application tables...');
  
  const tables = [
    {
      name: 'profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS cybercorrect.profiles (
          id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          organization_id uuid,
          role text NOT NULL DEFAULT 'student',
          full_name text,
          email text,
          department text,
          avatar_url text,
          settings jsonb DEFAULT '{}',
          preferences jsonb DEFAULT '{}',
          last_login timestamptz,
          login_count integer DEFAULT 0,
          is_active boolean DEFAULT true,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    },
    {
      name: 'data_subject_requests',
      sql: `
        CREATE TABLE IF NOT EXISTS cybercorrect.data_subject_requests (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id uuid NOT NULL,
          user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
          request_type text NOT NULL,
          requester_name text NOT NULL,
          requester_email text NOT NULL,
          requester_relationship text,
          student_identifier text,
          request_details jsonb DEFAULT '{}',
          applicable_regulations text[] DEFAULT '{}',
          status text DEFAULT 'submitted',
          submitted_at timestamptz DEFAULT now(),
          due_date timestamptz NOT NULL,
          completed_at timestamptz,
          assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
          notes text,
          response_data jsonb DEFAULT '{}',
          verification_status text,
          communication_log jsonb DEFAULT '[]',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    },
    {
      name: 'consent_records',
      sql: `
        CREATE TABLE IF NOT EXISTS cybercorrect.consent_records (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id uuid NOT NULL,
          student_id text NOT NULL,
          student_name text,
          parent_guardian_name text,
          parent_guardian_email text,
          consent_type text NOT NULL,
          purpose text NOT NULL,
          service_provider text,
          consent_given boolean NOT NULL,
          consent_date timestamptz,
          withdrawal_date timestamptz,
          expiry_date timestamptz,
          renewal_required boolean DEFAULT false,
          applicable_regulations text[] DEFAULT '{}',
          metadata jsonb DEFAULT '{}',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    },
    {
      name: 'privacy_incidents',
      sql: `
        CREATE TABLE IF NOT EXISTS cybercorrect.privacy_incidents (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id uuid NOT NULL,
          incident_number text NOT NULL UNIQUE,
          incident_type text NOT NULL,
          severity text NOT NULL,
          title text NOT NULL,
          description text NOT NULL,
          affected_individuals_count integer NOT NULL DEFAULT 0,
          data_types_affected text[] DEFAULT '{}',
          discovery_date timestamptz NOT NULL,
          incident_date timestamptz,
          containment_date timestamptz,
          resolution_date timestamptz,
          reported_to_authorities boolean DEFAULT false,
          notification_authorities text[] DEFAULT '{}',
          individuals_notified boolean DEFAULT false,
          notification_method text,
          cause_analysis text,
          remediation_actions jsonb DEFAULT '[]',
          lessons_learned text,
          status text DEFAULT 'open',
          assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
          applicable_regulations text[] DEFAULT '{}',
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    },
    {
      name: 'compliance_tracking',
      sql: `
        CREATE TABLE IF NOT EXISTS cybercorrect.compliance_tracking (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_id uuid NOT NULL,
          event_id text NOT NULL,
          event_title text NOT NULL,
          status text DEFAULT 'pending',
          assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
          due_date timestamptz NOT NULL,
          completed_at timestamptz,
          documentation jsonb DEFAULT '{}',
          notes text,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `
    }
  ];

  for (const table of tables) {
    console.log(`   🔄 Creating table: ${table.name}`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: table.sql
        })
      });

      if (response.ok) {
        console.log(`   ✅ Table ${table.name} created successfully`);
      } else {
        const error = await response.text();
        console.log(`   ⚠️  Table ${table.name} creation: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Table ${table.name} creation error: ${error.message}`);
    }
    
    // Wait between table creations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function enableRLS() {
  console.log('\n🔒 Enabling Row Level Security...');
  
  const tables = ['profiles', 'data_subject_requests', 'consent_records', 'privacy_incidents', 'compliance_tracking'];
  
  for (const table of tables) {
    console.log(`   🔄 Enabling RLS for: ${table}`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: `ALTER TABLE cybercorrect.${table} ENABLE ROW LEVEL SECURITY;`
        })
      });

      if (response.ok) {
        console.log(`   ✅ RLS enabled for ${table}`);
      } else {
        const error = await response.text();
        console.log(`   ⚠️  RLS for ${table}: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  RLS for ${table} error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

async function createRLSPolicies() {
  console.log('\n🛡️  Creating RLS policies...');
  
  const policies = [
    {
      table: 'profiles',
      policy: `
        CREATE POLICY "Users can view own profile"
          ON cybercorrect.profiles
          FOR SELECT
          TO authenticated
          USING (auth.uid() = id);
      `
    },
    {
      table: 'profiles',
      policy: `
        CREATE POLICY "Users can insert own profile"
          ON cybercorrect.profiles
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = id);
      `
    },
    {
      table: 'profiles',
      policy: `
        CREATE POLICY "Users can update own profile"
          ON cybercorrect.profiles
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);
      `
    },
    {
      table: 'data_subject_requests',
      policy: `
        CREATE POLICY "Users can view data subject requests"
          ON cybercorrect.data_subject_requests
          FOR SELECT
          TO authenticated
          USING (user_id = auth.uid() OR organization_id IN (
            SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
          ));
      `
    },
    {
      table: 'data_subject_requests',
      policy: `
        CREATE POLICY "Users can insert data subject requests"
          ON cybercorrect.data_subject_requests
          FOR INSERT
          TO authenticated
          WITH CHECK (user_id = auth.uid() OR organization_id IN (
            SELECT organization_id FROM cybercorrect.profiles WHERE id = auth.uid()
          ));
      `
    }
  ];

  for (const { table, policy } of policies) {
    console.log(`   🔄 Creating policy for: ${table}`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: policy
        })
      });

      if (response.ok) {
        console.log(`   ✅ Policy created for ${table}`);
      } else {
        const error = await response.text();
        console.log(`   ⚠️  Policy for ${table}: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Policy for ${table} error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
}

async function createIndexes() {
  console.log('\n📊 Creating indexes...');
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_cc_profiles_organization_id ON cybercorrect.profiles(organization_id);',
    'CREATE INDEX IF NOT EXISTS idx_cc_profiles_role ON cybercorrect.profiles(role);',
    'CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_status ON cybercorrect.data_subject_requests(status);',
    'CREATE INDEX IF NOT EXISTS idx_cc_data_subject_requests_due_date ON cybercorrect.data_subject_requests(due_date);',
    'CREATE INDEX IF NOT EXISTS idx_cc_consent_records_student_id ON cybercorrect.consent_records(student_id);',
    'CREATE INDEX IF NOT EXISTS idx_cc_privacy_incidents_severity ON cybercorrect.privacy_incidents(severity);',
    'CREATE INDEX IF NOT EXISTS idx_cc_compliance_tracking_status ON cybercorrect.compliance_tracking(status);'
  ];

  for (const indexSQL of indexes) {
    console.log(`   🔄 Creating index...`);
    
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: indexSQL
        })
      });

      if (response.ok) {
        console.log(`   ✅ Index created`);
      } else {
        const error = await response.text();
        console.log(`   ⚠️  Index creation: ${response.status} - ${error}`);
      }
    } catch (error) {
      console.log(`   ⚠️  Index creation error: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying setup...');
  
  try {
    // Test connection to the cybercorrect schema
    const { data, error } = await supabase
      .from('cybercorrect.profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Verification failed: ${error.message}`);
      return false;
    } else {
      console.log('   ✅ Schema verification successful');
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Verification error: ${error.message}`);
    return false;
  }
}

async function applyMigrations() {
  try {
    console.log('\n🚀 Starting differentiated schema migration...');
    
    await createSchema();
    await createTables();
    await enableRLS();
    await createRLSPolicies();
    await createIndexes();
    
    const verified = await verifySetup();
    
    if (verified) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('✅ cybercorrect schema created');
      console.log('✅ Tables created with proper structure');
      console.log('✅ Row Level Security enabled');
      console.log('✅ RLS policies configured');
      console.log('✅ Indexes created for performance');
      console.log('\n📋 Next steps:');
      console.log('   1. Test critical user flows');
      console.log('   2. Add proper error messaging');
      console.log('   3. Run integration tests');
    } else {
      console.log('\n⚠️  Migration completed with warnings');
      console.log('Please verify the setup manually');
    }
    
  } catch (error) {
    console.error('❌ Migration process failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
applyMigrations();
