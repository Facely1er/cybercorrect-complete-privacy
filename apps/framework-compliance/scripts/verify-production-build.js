/**
 * Production Build Verification Script
 * 
 * This script verifies that the production build does not contain any test files,
 * test utilities, or mock data that could leak into production.
 * 
 * Run this script after building to ensure production safety.
 * 
 * Note: This is a .js file to avoid esbuild version conflicts with tsx
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const DIST_PATH = join(process.cwd(), 'dist');
const TEST_FILE_PATTERNS = [
  /__tests__/,
  /__mocks__/,
  /\.test\./,
  /\.spec\./,
  /test\/setup/,
  /vitest/,
  /@testing-library/,
  /jest-dom/,
];

const TEST_CONTENT_PATTERNS = [
  /vi\.mock/,
  /vi\.fn/,
  /mockImplementation/,
  /mockResolvedValue/,
  /mockRejectedValue/,
  /@testing-library/,
  /vitest/,
  /jest-dom/,
  /describe\(/,
  /it\(/,
  /test\(/,
  /expect\(/,
];

async function checkFile(filePath, relativePath) {
  const issues = [];
  
  // Check filename
  for (const pattern of TEST_FILE_PATTERNS) {
    if (pattern.test(relativePath)) {
      issues.push({
        file: relativePath,
        reason: `Filename matches test pattern: ${pattern}`,
      });
      return issues; // Don't check content if filename is already problematic
    }
  }
  
  // Check file content for test-related code
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const pattern of TEST_CONTENT_PATTERNS) {
        if (pattern.test(line)) {
          issues.push({
            file: relativePath,
            reason: `Contains test code: ${pattern}`,
            line: i + 1,
          });
          break; // Only report once per line
        }
      }
    }
  } catch (error) {
    // Skip binary files or files we can't read
    if (error.message && !error.message.includes('EISDIR')) {
      console.warn(`⚠️  Could not read file ${relativePath}: ${error.message}`);
    }
  }
  
  return issues;
}

async function checkDirectory(dirPath, relativePath) {
  const issues = [];
  
  if (!existsSync(dirPath)) {
    console.warn(`⚠️  Directory does not exist: ${dirPath}`);
    return issues;
  }
  
  try {
    const entries = await readdir(dirPath);
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry);
      const relativeEntryPath = join(relativePath, entry);
      const stats = await stat(fullPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and other common non-source directories
        if (entry === 'node_modules' || entry === '.git') {
          continue;
        }
        const subIssues = await checkDirectory(fullPath, relativeEntryPath);
        issues.push(...subIssues);
      } else if (stats.isFile()) {
        // Only check JavaScript/TypeScript files
        if (/\.(js|mjs|cjs|ts|jsx|tsx)$/.test(entry)) {
          const fileIssues = await checkFile(fullPath, relativeEntryPath);
          issues.push(...fileIssues);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error checking directory ${relativePath}: ${error.message}`);
    }
  }
  
  return issues;
}

async function main() {
  console.log('🔍 Verifying production build for test file leaks...\n');
  
  if (!existsSync(DIST_PATH)) {
    console.error('❌ Production build directory not found!');
    console.error(`   Expected: ${DIST_PATH}`);
    console.error('   Run "npm run build" first.');
    process.exit(1);
  }
  
  try {
    const issues = await checkDirectory(DIST_PATH, 'dist');
    
    if (issues.length > 0) {
      console.error('❌ Production build contains test files or test code!\n');
      console.error('Issues found:');
      issues.forEach((issue, index) => {
        console.error(`\n${index + 1}. ${issue.file}`);
        console.error(`   Reason: ${issue.reason}`);
        if (issue.line) {
          console.error(`   Line: ${issue.line}`);
        }
      });
      console.error('\n⚠️  SECURITY RISK: Test mocks and utilities should never be in production builds!');
      console.error('   Please review your build configuration and ensure test files are excluded.');
      process.exit(1);
    }
    
    console.log('✅ Production build verified - no test files or test code found!');
    console.log('   Build is safe for production deployment.');
  } catch (error) {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Verification script failed:', error);
  process.exit(1);
});

