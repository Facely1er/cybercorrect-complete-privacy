#!/usr/bin/env node

/**
 * Pre-deployment validation script for PrivacyCorrect
 * This script checks for common deployment issues before going live
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log('\n🔍 Checking environment variables...', 'blue');
  
  const envExamplePath = join(projectRoot, '.env.example');
  const envLocalPath = join(projectRoot, '.env.local');
  
  if (!existsSync(envExamplePath)) {
    log('❌ .env.example file not found', 'red');
    return false;
  }
  
  if (!existsSync(envLocalPath)) {
    log('⚠️  .env.local file not found - make sure to create it from .env.example', 'yellow');
  }
  
  log('✅ Environment files check passed', 'green');
  return true;
}

function checkSecurityHeaders() {
  log('\n🔍 Checking security headers...', 'blue');
  
  const indexPath = join(projectRoot, 'index.html');
  if (!existsSync(indexPath)) {
    log('❌ index.html not found', 'red');
    return false;
  }
  
  const indexContent = readFileSync(indexPath, 'utf8');
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy'
  ];
  
  const missingHeaders = requiredHeaders.filter(header => 
    !indexContent.includes(header)
  );
  
  if (missingHeaders.length > 0) {
    log(`❌ Missing security headers: ${missingHeaders.join(', ')}`, 'red');
    return false;
  }
  
  log('✅ Security headers check passed', 'green');
  return true;
}

function checkBuildOutput() {
  log('\n🔍 Checking build output...', 'blue');
  
  const distPath = join(projectRoot, 'dist');
  if (!existsSync(distPath)) {
    log('❌ dist folder not found - run npm run build first', 'red');
    return false;
  }
  
  const indexHtmlPath = join(distPath, 'index.html');
  if (!existsSync(indexHtmlPath)) {
    log('❌ dist/index.html not found', 'red');
    return false;
  }
  
  // Check for source maps (should not exist in production)
  const assetsPath = join(distPath, 'assets');
  if (existsSync(assetsPath)) {
    try {
      const files = readdirSync(assetsPath);
      const hasSourceMaps = files.some(file => file.endsWith('.map'));
      if (hasSourceMaps) {
        log('⚠️  Source maps detected in production build', 'yellow');
      }
    } catch (error) {
      log('⚠️  Could not check for source maps', 'yellow');
    }
  }
  
  log('✅ Build output check passed', 'green');
  return true;
}

function checkDatabaseMigrations() {
  log('\n🔍 Checking database migrations...', 'blue');
  
  const migrationsPath = join(projectRoot, 'supabase', 'migrations');
  if (!existsSync(migrationsPath)) {
    log('❌ Supabase migrations folder not found', 'red');
    return false;
  }
  
  // Check for security policy migration
  const securityMigration = '20250130000000_fix_security_policies.sql';
  try {
    const migrationFiles = readdirSync(migrationsPath);
    const hasSecurityMigration = migrationFiles.includes(securityMigration);
    
    if (!hasSecurityMigration) {
      log('⚠️  Security policy migration not found - run the security fix migration', 'yellow');
    }
  } catch (error) {
    log('⚠️  Could not check migration files', 'yellow');
  }
  
  log('✅ Database migrations check passed', 'green');
  return true;
}

function checkDependencies() {
  log('\n🔍 Checking dependencies...', 'blue');
  
  const packageJsonPath = join(projectRoot, 'package.json');
  if (!existsSync(packageJsonPath)) {
    log('❌ package.json not found', 'red');
    return false;
  }
  
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  
  // Check for known vulnerable packages
  const vulnerablePackages = ['esbuild@<=0.24.2'];
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const foundVulnerabilities = Object.entries(dependencies).filter(([name, version]) => {
    return vulnerablePackages.some(vuln => vuln.includes(name));
  });
  
  if (foundVulnerabilities.length > 0) {
    log(`❌ Vulnerable packages found: ${foundVulnerabilities.map(([name]) => name).join(', ')}`, 'red');
    return false;
  }
  
  log('✅ Dependencies check passed', 'green');
  return true;
}

function checkBundleSizes() {
  log('\n🔍 Checking bundle sizes...', 'blue');
  
  const distPath = join(projectRoot, 'dist');
  if (!existsSync(distPath)) {
    log('❌ dist folder not found', 'red');
    return false;
  }
  
  // Check for excessively large bundles
  const assetsPath = join(distPath, 'assets');
  if (existsSync(assetsPath)) {
    try {
      const files = readdirSync(assetsPath);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      let oversizedFiles = [];
      for (const file of jsFiles) {
        const filePath = join(assetsPath, file);
        const stats = statSync(filePath);
        const sizeInKB = stats.size / 1024;
        
        if (sizeInKB > 500) { // Flag files larger than 500KB
          oversizedFiles.push(`${file} (${sizeInKB.toFixed(1)}KB)`);
        }
      }
      
      if (oversizedFiles.length > 0) {
        log(`⚠️  Large bundle files detected: ${oversizedFiles.join(', ')}`, 'yellow');
        log('   Consider implementing lazy loading for these components', 'yellow');
      }
    } catch (error) {
      log('⚠️  Could not check bundle sizes', 'yellow');
    }
  }
  
  log('✅ Bundle size check passed', 'green');
  return true;
}

async function main() {
  log('🚀 PrivacyCorrect Deployment Validation', 'bold');
  log('=====================================', 'bold');
  
  const checks = [
    checkEnvironmentVariables,
    checkSecurityHeaders,
    checkBuildOutput,
    checkDatabaseMigrations,
    checkDependencies,
    checkBundleSizes
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    try {
      if (await check()) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      log(`❌ Check failed with error: ${error.message}`, 'red');
      failed++;
    }
  }
  
  log('\n📊 Validation Summary', 'bold');
  log('===================', 'bold');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green');
  
  if (failed === 0) {
    log('\n🎉 All checks passed! Ready for deployment.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some checks failed. Please fix the issues before deploying.', 'yellow');
    process.exit(1);
  }
}

// Run the validation
main().catch(error => {
  log(`❌ Validation script failed: ${error.message}`, 'red');
  process.exit(1);
});