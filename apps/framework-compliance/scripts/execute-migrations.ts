/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Execute Database Migrations via Supabase REST API
 * 
 * This script executes the combined migration SQL file using Supabase REST API.
 * 
 * Usage:
 *   cd apps/framework-compliance
 *   npx tsx scripts/execute-migrations.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Credentials from the shared ERMITS database
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I';

async function executeSQL(sql: string): Promise<{ success: boolean; error?: string; result?: unknown }> {
  try {
    // Extract project ref from URL
    const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (!projectRef) {
      return { success: false, error: 'Could not extract project ref from URL' };
    }

    // Use Supabase REST API to execute SQL via PostgREST
    // Alternative: Use the Management API
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

    const result = await response.json();
    return { success: true, result };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function executeMigrationFile(filePath: string): Promise<boolean> {
  try {
    if (!existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return false;
    }

    const sql = readFileSync(filePath, 'utf-8');
    console.log(`\n📄 Executing migrations from: ${filePath}`);
    console.log(`   📝 SQL size: ${(sql.length / 1024).toFixed(2)} KB`);
    
    // Split into smaller chunks if needed (PostgreSQL has query size limits)
    // For now, execute the entire SQL
    const result = await executeSQL(sql);
    
    if (result.success) {
      console.log(`   ✅ Migrations executed successfully!`);
      return true;
    } else {
      console.error(`   ❌ Error: ${result.error}`);
      console.log(`\n   💡 The Management API approach may not be available.`);
      console.log(`   💡 Please execute the SQL manually in Supabase SQL Editor:`);
      console.log(`      1. Go to https://app.supabase.com`);
      console.log(`      2. Select project: achowlksgmwuvfbvjfrt`);
      console.log(`      3. Go to SQL Editor → New query`);
      console.log(`      4. Copy contents from: ${filePath}`);
      console.log(`      5. Paste and run`);
      return false;
    }
  } catch (error: unknown) {
    console.error(`❌ Error:`, error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

async function main() {
  console.log('🚀 Executing CyberCorrect Database Migrations');
  console.log(`📡 Supabase URL: ${SUPABASE_URL.replace(/\/\/.*@/, '//***@')}`);
  console.log(`📦 Shared database with CyberCaution and CyberSoluce\n`);

  const combinedFile = join(process.cwd(), 'supabase', 'migrations', 'ALL_MIGRATIONS_COMBINED.sql');
  
  if (!existsSync(combinedFile)) {
    console.log('⚠️  Combined migration file not found. Creating it first...\n');
    // Run the combine script first
    const { execSync } = await import('child_process');
    try {
      execSync('npx tsx scripts/combine-migrations.ts', { cwd: process.cwd(), stdio: 'inherit' });
    } catch {
      console.error('❌ Failed to create combined migration file');
      process.exit(1);
    }
  }

  const success = await executeMigrationFile(combinedFile);
  
  if (success) {
    console.log('\n🎉 All migrations executed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Verify tables in Supabase Dashboard → Table Editor');
    console.log('   2. Look for tables with `cc_privacy_` prefix');
    console.log('   3. Run: npx tsx scripts/verify-supabase-setup.ts');
  } else {
    console.log('\n⚠️  Automated execution failed. Please use manual method:');
    console.log(`   File location: ${combinedFile}`);
    console.log('   See instructions above for manual execution.');
    process.exit(1);
  }
}

main().catch(console.error);




