#!/usr/bin/env tsx`n/* eslint-disable no-console, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
/**
 * Production Readiness Verification Script
 * 
 * This script verifies that the application is ready for production deployment.
 * Run this before deploying to production.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const checks: CheckResult[] = [];

// Check 1: Verify build output exists
function checkBuildOutput(): CheckResult {
  const distPath = join(process.cwd(), 'dist');
  const indexPath = join(distPath, 'index.html');
  
  if (!existsSync(distPath)) {
    return {
      name: 'Build Output',
      status: 'fail',
      message: 'dist/ directory does not exist. Run: npm run build'
    };
  }
  
  if (!existsSync(indexPath)) {
    return {
      name: 'Build Output',
      status: 'fail',
      message: 'dist/index.html does not exist. Build may have failed.'
    };
  }
  
  return {
    name: 'Build Output',
    status: 'pass',
    message: 'Build output exists in dist/'
  };
}

// Check 2: Verify environment variables template exists
function checkEnvTemplate(): CheckResult {
  const envTemplatePath = join(process.cwd(), '.env.production.example');
  
  if (!existsSync(envTemplatePath)) {
    return {
      name: 'Environment Template',
      status: 'warning',
      message: '.env.production.example not found (optional but recommended)'
    };
  }
  
  return {
    name: 'Environment Template',
    status: 'pass',
    message: '.env.production.example exists'
  };
}

// Check 3: Verify vercel.json exists
function checkVercelConfig(): CheckResult {
  const vercelPath = join(process.cwd(), 'vercel.json');
  
  if (!existsSync(vercelPath)) {
    return {
      name: 'Vercel Config',
      status: 'warning',
      message: 'vercel.json not found (optional if not using Vercel)'
    };
  }
  
  try {
    const config = JSON.parse(readFileSync(vercelPath, 'utf-8'));
    if (!config.rewrites || !Array.isArray(config.rewrites)) {
      return {
        name: 'Vercel Config',
        status: 'warning',
        message: 'vercel.json exists but may be misconfigured'
      };
    }
    
    return {
      name: 'Vercel Config',
      status: 'pass',
      message: 'vercel.json is properly configured'
    };
  } catch (error) {
    return {
      name: 'Vercel Config',
      status: 'warning',
      message: `vercel.json exists but has errors: ${error}`
    };
  }
}

// Check 4: Verify package.json has build script
function checkBuildScript(): CheckResult {
  const packageJsonPath = join(process.cwd(), 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    return {
      name: 'Build Script',
      status: 'fail',
      message: 'package.json not found'
    };
  }
  
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    
    if (!packageJson.scripts || !packageJson.scripts.build) {
      return {
        name: 'Build Script',
        status: 'fail',
        message: 'package.json missing build script'
      };
    }
    
    return {
      name: 'Build Script',
      status: 'pass',
      message: `Build script found: ${packageJson.scripts.build}`
    };
  } catch (error) {
    return {
      name: 'Build Script',
      status: 'fail',
      message: `Error reading package.json: ${error}`
    };
  }
}

// Check 5: Verify required dependencies
function checkDependencies(): CheckResult {
  const packageJsonPath = join(process.cwd(), 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    return {
      name: 'Dependencies',
      status: 'fail',
      message: 'package.json not found'
    };
  }
  
  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const requiredDeps = [
      '@supabase/supabase-js',
      'react',
      'react-dom',
      'react-router-dom'
    ];
    
    const missingDeps: string[] = [];
    
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]) {
        missingDeps.push(dep);
      }
    }
    
    if (missingDeps.length > 0) {
      return {
        name: 'Dependencies',
        status: 'fail',
        message: `Missing required dependencies: ${missingDeps.join(', ')}`
      };
    }
    
    return {
      name: 'Dependencies',
      status: 'pass',
      message: 'All required dependencies are present'
    };
  } catch (error) {
    return {
      name: 'Dependencies',
      status: 'fail',
      message: `Error checking dependencies: ${error}`
    };
  }
}

// Check 6: Verify source files exist
function checkSourceFiles(): CheckResult {
  const srcPath = join(process.cwd(), 'src');
  const mainPath = join(srcPath, 'main.tsx');
  const appPath = join(srcPath, 'App.tsx');
  
  if (!existsSync(srcPath)) {
    return {
      name: 'Source Files',
      status: 'fail',
      message: 'src/ directory does not exist'
    };
  }
  
  if (!existsSync(mainPath)) {
    return {
      name: 'Source Files',
      status: 'fail',
      message: 'src/main.tsx not found'
    };
  }
  
  if (!existsSync(appPath)) {
    return {
      name: 'Source Files',
      status: 'fail',
      message: 'src/App.tsx not found'
    };
  }
  
  return {
    name: 'Source Files',
    status: 'pass',
    message: 'Required source files exist'
  };
}

// Run all checks
function runChecks(): void {
  console.log('🔍 Verifying Production Readiness...\n');
  
  checks.push(checkBuildOutput());
  checks.push(checkEnvTemplate());
  checks.push(checkVercelConfig());
  checks.push(checkBuildScript());
  checks.push(checkDependencies());
  checks.push(checkSourceFiles());
  
  // Display results
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;
  
  console.log('Results:\n');
  
  for (const check of checks) {
    const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️';
    const color = check.status === 'pass' ? '\x1b[32m' : check.status === 'fail' ? '\x1b[31m' : '\x1b[33m';
    const reset = '\x1b[0m';
    
    console.log(`${icon} ${color}${check.name}${reset}: ${check.message}`);
    
    if (check.status === 'pass') passCount++;
    else if (check.status === 'fail') failCount++;
    else warningCount++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`Summary: ${passCount} passed, ${failCount} failed, ${warningCount} warnings\n`);
  
  if (failCount > 0) {
    console.log('❌ Production readiness check FAILED');
    console.log('Please fix the failed checks before deploying.\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('⚠️  Production readiness check PASSED with warnings');
    console.log('Review warnings before deploying.\n');
    process.exit(0);
  } else {
    console.log('✅ Production readiness check PASSED');
    console.log('Application is ready for deployment!\n');
    process.exit(0);
  }
}

// Run checks
runChecks();



