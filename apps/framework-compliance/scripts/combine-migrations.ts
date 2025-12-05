/**
 * Combine all migration files into a single SQL file for easy execution
 * 
 * Usage:
 *   cd apps/framework-compliance
 *   npx tsx scripts/combine-migrations.ts
 * 
 * This creates: supabase/migrations/ALL_MIGRATIONS_COMBINED.sql
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

function main() {
  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');
  const outputFile = join(migrationsDir, 'ALL_MIGRATIONS_COMBINED.sql');
  
  let combinedSQL = `/*
  CyberCorrect Database Migrations - Combined File
  ================================================
  
  This file contains all migrations in order for easy execution.
  Execute this entire file in Supabase SQL Editor.
  
  Database: Shared ERMITS database (CyberCorrect, CyberCaution, CyberSoluce)
  Project: achowlksgmwuvfbvjfrt
  
  Instructions:
  1. Go to https://app.supabase.com
  2. Select project: achowlksgmwuvfbvjfrt
  3. Go to SQL Editor → New query
  4. Copy and paste this entire file
  5. Click Run (or press Ctrl+Enter)
  
  Note: All tables use the 'cc_privacy_' prefix to avoid conflicts.
  
*/\n\n`;

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const migrationPath = join(migrationsDir, migration);
    
    if (!existsSync(migrationPath)) {
      console.log(`⚠️  Migration file not found: ${migration}`);
      failCount++;
      continue;
    }

    try {
      const sql = readFileSync(migrationPath, 'utf-8');
      combinedSQL += `-- ============================================================================\n`;
      combinedSQL += `-- Migration: ${migration}\n`;
      combinedSQL += `-- ============================================================================\n\n`;
      combinedSQL += sql;
      combinedSQL += `\n\n`;
      successCount++;
      console.log(`✅ Added: ${migration}`);
    } catch (error: any) {
      console.error(`❌ Error reading ${migration}:`, error.message);
      failCount++;
    }
  }

  // Write combined file
  try {
    writeFileSync(outputFile, combinedSQL, 'utf-8');
    console.log(`\n✅ Combined SQL file created: ${outputFile}`);
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Successfully combined: ${successCount}/${migrations.length}`);
    console.log(`   ❌ Failed: ${failCount}/${migrations.length}`);
    console.log(`\n📋 Next Steps:`);
    console.log(`   1. Open: ${outputFile}`);
    console.log(`   2. Copy all contents`);
    console.log(`   3. Go to https://app.supabase.com → SQL Editor`);
    console.log(`   4. Paste and run the SQL`);
  } catch (error: any) {
    console.error(`❌ Error writing combined file:`, error.message);
    process.exit(1);
  }
}

main();

