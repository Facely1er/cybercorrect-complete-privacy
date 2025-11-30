#!/usr/bin/env node

/**
 * Build Script - Build from Separate Source Folder
 * 
 * This script ensures builds are created from a separate source folder
 * and validates the build structure before completion.
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

/**
 * Validate source directory exists
 */
function validateSourceDir(appName, sourceDir) {
  if (!existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    process.exit(1);
  }
  
  // Check for required source files
  const requiredFiles = ['main.tsx', 'App.tsx'];
  const missingFiles = requiredFiles.filter(file => 
    !existsSync(join(sourceDir, file)) && 
    !existsSync(join(sourceDir, 'src', file))
  );
  
  if (missingFiles.length > 0) {
    console.warn(`⚠️  Missing source files in ${appName}:`, missingFiles);
  }
  
  console.log(`✅ Source directory validated: ${sourceDir}`);
}

/**
 * Validate build output
 */
function validateBuildOutput(outputDir) {
  if (!existsSync(outputDir)) {
    console.error(`❌ Build output directory not found: ${outputDir}`);
    return false;
  }
  
  // Check for required build files
  const requiredFiles = ['index.html'];
  const missingFiles = requiredFiles.filter(file => 
    !existsSync(join(outputDir, file))
  );
  
  if (missingFiles.length > 0) {
    console.error(`❌ Missing build files:`, missingFiles);
    return false;
  }
  
  // Check for assets directory
  const assetsDir = join(outputDir, 'assets');
  if (!existsSync(assetsDir)) {
    console.warn(`⚠️  Assets directory not found: ${assetsDir}`);
  }
  
  console.log(`✅ Build output validated: ${outputDir}`);
  return true;
}

/**
 * Build a specific app
 */
function buildApp(appName) {
  const appDir = join(rootDir, 'apps', appName);
  const sourceDir = join(appDir, 'src');
  const outputDir = join(appDir, 'dist');
  
  console.log(`\n📦 Building ${appName}...`);
  console.log(`   Source: ${sourceDir}`);
  console.log(`   Output: ${outputDir}`);
  
  // Validate source directory
  validateSourceDir(appName, sourceDir);
  
  try {
    // Change to app directory and run build
    process.chdir(appDir);
    
    // Run npm build command
    console.log(`\n🔨 Running build command...`);
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: appDir 
    });
    
    // Validate build output
    if (validateBuildOutput(outputDir)) {
      console.log(`\n✅ ${appName} built successfully!`);
      console.log(`   Output: ${outputDir}`);
      
      // Show build size
      const buildSize = getDirectorySize(outputDir);
      console.log(`   Size: ${formatBytes(buildSize)}`);
      
      return true;
    } else {
      console.error(`\n❌ ${appName} build validation failed!`);
      return false;
    }
  } catch (error) {
    console.error(`\n❌ Build failed for ${appName}:`, error.message);
    return false;
  }
}

/**
 * Get directory size recursively
 */
function getDirectorySize(dir) {
  let size = 0;
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      if (stat.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return size;
}

/**
 * Format bytes to human readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  const appName = args[0] || 'all';
  
  console.log('🚀 Building from separate source folders...\n');
  console.log(`   Root directory: ${rootDir}`);
  
  const apps = ['privacy-portal', 'framework-compliance', 'marketing-site'];
  
  if (appName === 'all') {
    console.log(`\n📋 Building all apps: ${apps.join(', ')}\n`);
    let successCount = 0;
    
    for (const app of apps) {
      if (buildApp(app)) {
        successCount++;
      }
    }
    
    console.log(`\n📊 Build Summary:`);
    console.log(`   Successful: ${successCount}/${apps.length}`);
    console.log(`   Failed: ${apps.length - successCount}/${apps.length}`);
    
    if (successCount === apps.length) {
      console.log(`\n✅ All builds completed successfully!`);
      process.exit(0);
    } else {
      console.log(`\n❌ Some builds failed!`);
      process.exit(1);
    }
  } else {
    if (!apps.includes(appName)) {
      console.error(`❌ Unknown app: ${appName}`);
      console.log(`   Available apps: ${apps.join(', ')}`);
      process.exit(1);
    }
    
    const success = buildApp(appName);
    process.exit(success ? 0 : 1);
  }
}

// Run main function
main();

