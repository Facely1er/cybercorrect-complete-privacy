#!/usr/bin/env node

/**
 * CyberCorrect Production Testing Script
 * Runs comprehensive tests across all workspaces to verify production readiness
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command, description, cwd = process.cwd()) {
  try {
    log(`  ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit', cwd });
    log(`  ✅ ${description} passed`, 'green');
    return true;
  } catch (error) {
    log(`  ❌ ${description} failed`, 'red');
    return false;
  }
}

function checkWorkspace(workspaceName, workspacePath) {
  log(`\n📦 Testing ${workspaceName}`, 'cyan');
  log('─'.repeat(50), 'cyan');

  let passed = 0;
  let failed = 0;

  const fullPath = path.join(process.cwd(), workspacePath);

  if (!fs.existsSync(fullPath)) {
    log(`  ⚠️  Workspace not found: ${workspacePath}`, 'yellow');
    return { passed: 0, failed: 1 };
  }

  // Build
  if (checkCommand('npm run build', 'Production build', fullPath)) {
    passed++;
  } else {
    failed++;
  }

  // Lint
  try {
    if (checkCommand('npm run lint', 'Linting', fullPath)) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    log('  ⚠️  Linting skipped', 'yellow');
  }

  // Test
  try {
    if (checkCommand('npm test -- --run', 'Tests', fullPath)) {
      passed++;
    } else {
      failed++;
    }
  } catch (error) {
    log('  ⚠️  Tests skipped', 'yellow');
  }

  return { passed, failed };
}

function main() {
  log('\n🚀 CyberCorrect Production Readiness Test Suite', 'blue');
  log('='.repeat(60), 'blue');

  const workspaces = [
    { name: 'Framework Compliance', path: 'apps/framework-compliance' },
    { name: 'Privacy Portal', path: 'apps/privacy-portal' },
    { name: 'Marketing Site', path: 'apps/marketing-site' },
  ];

  let totalPassed = 0;
  let totalFailed = 0;

  // Test each workspace
  workspaces.forEach(workspace => {
    const result = checkWorkspace(workspace.name, workspace.path);
    totalPassed += result.passed;
    totalFailed += result.failed;
  });

  // Root level checks
  log('\n🔍 Root Level Checks', 'cyan');
  log('─'.repeat(50), 'cyan');

  // CI/CD workflow files
  log('\n📋 CI/CD Configuration', 'yellow');
  const ciFiles = [
    { path: '.github/workflows/ci.yml', desc: 'CI Workflow' },
    { path: '.github/workflows/deploy.yml', desc: 'Deploy Workflow' },
    { path: '.github/dependabot.yml', desc: 'Dependabot Config' },
  ];

  ciFiles.forEach(({ path: filePath, desc }) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      log(`  ✅ ${desc} exists`, 'green');
      totalPassed++;
    } else {
      log(`  ❌ ${desc} missing: ${filePath}`, 'red');
      totalFailed++;
    }
  });

  // Security audit
  log('\n🔒 Security Audit', 'yellow');
  try {
    const auditResult = execSync('npm audit --audit-level=moderate', { encoding: 'utf-8' });
    if (auditResult.includes('found 0 vulnerabilities')) {
      log('  ✅ No security vulnerabilities found', 'green');
      totalPassed++;
    } else {
      log('  ⚠️  Security vulnerabilities found - review npm audit output', 'yellow');
      totalFailed++;
    }
  } catch (error) {
    log('  ⚠️  Security audit failed - review manually', 'yellow');
    totalFailed++;
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('\n📊 Test Summary', 'blue');
  log(`✅ Passed: ${totalPassed}`, 'green');
  log(`❌ Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');
  log(`\n${'='.repeat(60)}\n`, 'blue');

  if (totalFailed === 0) {
    log('🎉 All production readiness checks passed!', 'green');
    log('✅ Ready for deployment\n', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some checks failed. Please review and fix before deploying.\n', 'yellow');
    process.exit(1);
  }
}

main();

