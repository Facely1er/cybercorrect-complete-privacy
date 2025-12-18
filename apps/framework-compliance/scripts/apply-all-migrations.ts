#!/usr/bin/env tsx
/**
 * Apply All Database Migrations
 * 
 * This script applies all database migrations in the correct order.
 * It can be run via Supabase CLI or by generating SQL for manual execution.
 * 
 * Usage:
 *   npm run migrate:all
 *   OR
 *   tsx scripts/apply-all-migrations.ts
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '../supabase/migrations');

interface Migration {
  filename: string;
  timestamp: string;
  content: string;
}

/**
 * Get all migration files in chronological order
 */
function getMigrations(): Migration[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql') && file !== 'ALL_MIGRATIONS_COMBINED.sql')
    .sort(); // Sort alphabetically (timestamps ensure chronological order)

  return files.map(filename => {
    const content = readFileSync(join(MIGRATIONS_DIR, filename), 'utf-8');
    const timestamp = filename.split('_')[0];
    return { filename, timestamp, content };
  });
}

/**
 * Generate combined migration SQL
 */
function generateCombinedMigration(): string {
  const migrations = getMigrations();
  
  let combined = `/*
  CyberCorrect Database Migrations - Auto-Generated Combined File
  ================================================================
  
  This file contains all migrations in chronological order.
  Execute this entire file in Supabase SQL Editor.
  
  Generated: ${new Date().toISOString()}
  Total Migrations: ${migrations.length}
  
  Instructions:
  1. Go to https://app.supabase.com
  2. Select your project
  3. Go to SQL Editor → New query
  4. Copy and paste this entire file
  5. Click Run (or press Ctrl+Enter)
  
  Note: All tables use the 'cc_privacy_' prefix to avoid conflicts.
  
*/\n\n`;

  migrations.forEach((migration, index) => {
    combined += `-- ============================================================================\n`;
    combined += `-- Migration ${index + 1}/${migrations.length}: ${migration.filename}\n`;
    combined += `-- ============================================================================\n\n`;
    combined += migration.content;
    combined += `\n\n`;
  });

  combined += `-- ============================================================================\n`;
  combined += `-- Migration Complete\n`;
  combined += `-- ============================================================================\n`;
  combined += `-- All migrations have been applied.\n`;
  combined += `-- Verify by checking the tables in Supabase Table Editor.\n\n`;

  return combined;
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 CyberCorrect Database Migration Tool\n');
  
  const migrations = getMigrations();
  console.log(`📦 Found ${migrations.length} migration files:\n`);
  
  migrations.forEach((migration, index) => {
    console.log(`  ${index + 1}. ${migration.filename}`);
  });
  
  console.log('\n📝 Generating combined migration file...\n');
  
  const combined = generateCombinedMigration();
  const outputPath = join(MIGRATIONS_DIR, 'ALL_MIGRATIONS_COMBINED.sql');
  
  // Write combined file
  writeFileSync(outputPath, combined, 'utf-8');
  
  console.log('✅ Combined migration file generated:');
  console.log(`   ${outputPath}\n`);
  console.log('📋 Next Steps:');
  console.log('   1. Open Supabase Dashboard: https://app.supabase.com');
  console.log('   2. Select your project');
  console.log('   3. Go to SQL Editor → New query');
  console.log('   4. Open the ALL_MIGRATIONS_COMBINED.sql file');
  console.log('   5. Copy all content and paste into SQL Editor');
  console.log('   6. Click Run (or press Ctrl+Enter)');
  console.log('   7. Wait for "Success" message\n');
  console.log('⚠️  Important:');
  console.log('   - This will create all tables, indexes, policies, and functions');
  console.log('   - Some migrations may show warnings if objects already exist (this is OK)');
  console.log('   - The cron_jobs migration requires pg_cron extension (may need Pro plan)\n');
}

if (require.main === module) {
  main();
}

export { getMigrations, generateCombinedMigration };

