#!/usr/bin/env node

/**
 * Backend Setup Script for CyberCorrect Privacy Portal
 * 
 * This script helps set up the backend configuration and validates
 * the environment setup.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = join(projectRoot, filePath);
  if (existsSync(fullPath)) {
    log(`✓ ${description}`, 'green');
    return true;
  } else {
    log(`✗ ${description}`, 'red');
    return false;
  }
}

function checkEnvironmentVariables() {
  log('\n🔍 Checking Environment Variables...', 'cyan');
  
  const envExamplePath = join(projectRoot, '.env.example');
  if (!existsSync(envExamplePath)) {
    log('✗ .env.example file not found', 'red');
    return false;
  }
  
  const envExample = readFileSync(envExamplePath, 'utf8');
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_APP_URL',
    'VITE_ENVIRONMENT'
  ];
  
  let allPresent = true;
  requiredVars.forEach(varName => {
    if (envExample.includes(varName)) {
      log(`✓ ${varName} defined in .env.example`, 'green');
    } else {
      log(`✗ ${varName} missing from .env.example`, 'red');
      allPresent = false;
    }
  });
  
  return allPresent;
}

function checkSupabaseConfiguration() {
  log('\n🔍 Checking Supabase Configuration...', 'cyan');
  
  const configPath = join(projectRoot, 'supabase', 'config.toml');
  if (!existsSync(configPath)) {
    log('✗ supabase/config.toml not found', 'red');
    return false;
  }
  
  const config = readFileSync(configPath, 'utf8');
  
  const requiredSections = [
    '[api]',
    '[db]',
    '[auth]',
    '[storage]',
    '[realtime]'
  ];
  
  let allPresent = true;
  requiredSections.forEach(section => {
    if (config.includes(section)) {
      log(`✓ ${section} configured`, 'green');
    } else {
      log(`✗ ${section} missing`, 'red');
      allPresent = false;
    }
  });
  
  // Check for cybercorrect schema
  if (config.includes('cybercorrect')) {
    log('✓ cybercorrect schema configured', 'green');
  } else {
    log('✗ cybercorrect schema not found', 'red');
    allPresent = false;
  }
  
  return allPresent;
}

function checkDatabaseMigrations() {
  log('\n🔍 Checking Database Migrations...', 'cyan');
  
  const migrationsDir = join(projectRoot, 'supabase', 'migrations');
  if (!existsSync(migrationsDir)) {
    log('✗ supabase/migrations directory not found', 'red');
    return false;
  }
  
  const migrationFiles = [
    '20250115000000_cybercorrect_schema_differentiation.sql',
    '20250115000001_migrate_to_cybercorrect_schema.sql'
  ];
  
  let allPresent = true;
  migrationFiles.forEach(file => {
    const filePath = join(migrationsDir, file);
    if (existsSync(filePath)) {
      log(`✓ ${file}`, 'green');
    } else {
      log(`✗ ${file} missing`, 'red');
      allPresent = false;
    }
  });
  
  return allPresent;
}

function checkBackendServices() {
  log('\n🔍 Checking Backend Services...', 'cyan');
  
  const servicesDir = join(projectRoot, 'src', 'services');
  const requiredServices = [
    'backendService.ts',
    'databaseHealthService.ts',
    'dataRightsService.ts'
  ];
  
  let allPresent = true;
  requiredServices.forEach(service => {
    const servicePath = join(servicesDir, service);
    if (existsSync(servicePath)) {
      log(`✓ ${service}`, 'green');
    } else {
      log(`✗ ${service} missing`, 'red');
      allPresent = false;
    }
  });
  
  return allPresent;
}

function checkSupabaseFunctions() {
  log('\n🔍 Checking Supabase Functions...', 'cyan');
  
  const functionsDir = join(projectRoot, 'supabase', 'functions');
  const requiredFunctions = [
    'health-check/index.ts',
    'sync-data/index.ts'
  ];
  
  let allPresent = true;
  requiredFunctions.forEach(func => {
    const funcPath = join(functionsDir, func);
    if (existsSync(funcPath)) {
      log(`✓ ${func}`, 'green');
    } else {
      log(`✗ ${func} missing`, 'red');
      allPresent = false;
    }
  });
  
  return allPresent;
}

function generateSetupInstructions() {
  log('\n📋 Setup Instructions:', 'yellow');
  log('1. Copy .env.example to .env and fill in your Supabase credentials', 'blue');
  log('2. Run: supabase start', 'blue');
  log('3. Run: supabase db reset', 'blue');
  log('4. Run: npm run dev', 'blue');
  log('5. Test the health check endpoint: http://localhost:54321/functions/v1/health-check', 'blue');
}

function main() {
  log('🚀 CyberCorrect Privacy Portal - Backend Setup Check', 'bright');
  log('=' .repeat(60), 'cyan');
  
  const checks = [
    { name: 'Environment Variables', fn: checkEnvironmentVariables },
    { name: 'Supabase Configuration', fn: checkSupabaseConfiguration },
    { name: 'Database Migrations', fn: checkDatabaseMigrations },
    { name: 'Backend Services', fn: checkBackendServices },
    { name: 'Supabase Functions', fn: checkSupabaseFunctions }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const passed = check.fn();
    if (!passed) {
      allPassed = false;
    }
  });
  
  log('\n' + '=' .repeat(60), 'cyan');
  
  if (allPassed) {
    log('🎉 All checks passed! Backend is properly configured.', 'green');
    log('\nNext steps:', 'yellow');
    generateSetupInstructions();
  } else {
    log('❌ Some checks failed. Please review the issues above.', 'red');
    log('\nSetup instructions:', 'yellow');
    generateSetupInstructions();
  }
  
  log('\n📚 For detailed information, see BACKEND_CONFIGURATION.md', 'magenta');
}

// Run the main function
main();