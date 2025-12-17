/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
/**
 * Apply Database Migrations to Supabase using Management API
 *
 * This script applies all database migrations directly via Supabase Management API.
 * It uses the service role key to execute SQL statements.
 * 
 * Usage:
 *   cd apps/framework-compliance
 *   npx tsx scripts/apply-migrations-direct.ts
 * 
 * Or with environment variables:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key npx tsx scripts/apply-migrations-direct.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Credentials from the shared ERMITS database
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  process.exit(1);
}

// Migration files in order
const migrations = [
  '20250130000000_improve_security.sql',
  '20250201000000_subscription_features.sql',
  '20250201000001_cron_jobs.sql',
  '20250202000000_privacy_tools_schema.sql',
  '20250202000001_subscriptions.sql',
  '20250202000002_fix_function_search_path.sql',
  '20250202000003_fix_rls_performance.sql',
  '20250202000004_combined_fixes.sql',
  '20250203000000_calendar_events.sql',
  '20250729162343_orange_band.sql',
];

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Use Supabase Management API to execute SQL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectRef) {
      return { success: false, error: 'Could not extract project ref from URL' };
    }

    const managementUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
    
    const response = await fetch(managementUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({
        query: sql,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function applyMigration(filename: string): Promise<boolean> {
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', filename);
    
    if (!existsSync(migrationPath)) {
      console.log(`   ⚠️  Migration file not found: ${filename} (skipping)`);
      return true; // Skip if file doesn't exist
    }
    
    const sql = readFileSync(migrationPath, 'utf-8');
    
    console.log(`\n📄 Applying migration: ${filename}`);
    
    // Clean up SQL: remove comments and empty lines
    const cleanedSQL = sql
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 0 && 
               !trimmed.startsWith('--') && 
               !trimmed.startsWith('/*') &&
               !trimmed.endsWith('*/');
      })
      .join('\n')
      .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
    
    // Execute the SQL
    const result = await executeSQL(cleanedSQL);
    
    if (result.success) {
      console.log(`   ✅ Migration ${filename} applied successfully`);
      return true;
    } else {
      console.error(`   ❌ Error applying migration ${filename}: ${result.error}`);
      console.log(`   💡 Tip: You may need to apply this migration manually via Supabase SQL Editor`);
      return false;
    }
  } catch (error: any) {
    console.error(`   ❌ Error reading migration ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migration process...');
  console.log(`📡 Connecting to Supabase: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}`);
  console.log(`📦 Shared database with CyberCaution and CyberSoluce`);
  console.log(`🔒 Using service role key for migrations\n`);
  
  // Change to the correct directory
  const scriptDir = __dirname;
  const appDir = join(scriptDir, '..');
  process.chdir(appDir);
  
  let successCount = 0;
  let failCount = 0;
  const failedMigrations: string[] = [];
  
  for (const migration of migrations) {
    const success = await applyMigration(migration);
    if (success) {
      successCount++;
    } else {
      failCount++;
      failedMigrations.push(migration);
    }
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successful: ${successCount}/${migrations.length}`);
  console.log(`   ❌ Failed: ${failCount}/${migrations.length}`);
  
  if (failCount > 0) {
    console.log('\n⚠️  Some migrations failed. Please apply them manually:');
    console.log('   1. Go to https://app.supabase.com');
    console.log('   2. Select your project');
    console.log('   3. Go to SQL Editor → New query');
    console.log('   4. Copy and paste the SQL from these failed migration files:');
    failedMigrations.forEach(m => console.log(`      - ${m}`));
    console.log('   5. Run the SQL');
  } else {
    console.log('\n🎉 All migrations applied successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Verify tables in Supabase Dashboard → Table Editor');
    console.log('   2. Look for tables with `cc_privacy_` prefix');
    console.log('   3. Run: npx tsx scripts/verify-supabase-setup.ts');
  }
}

main().catch(console.error);

