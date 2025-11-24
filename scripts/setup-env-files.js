#!/usr/bin/env node

/**
 * Setup script to create .env files from templates
 * Run: node scripts/setup-env-files.js
 */

import { writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const envTemplates = {
  'apps/marketing-site/.env': `# Marketing Site Environment Variables
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
`,
  'apps/framework-compliance/.env': `# Framework Compliance Environment Variables
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_PRIVACY_PORTAL_URL=https://www.portal.cybercorrect.com
`,
  'apps/privacy-portal/.env': `# Privacy Portal Environment Variables
VITE_MARKETING_SITE_URL=https://www.cybercorrect.com
VITE_FRAMEWORK_COMPLIANCE_URL=https://www.app.cybercorrect.com
`
};

console.log('Setting up environment files...\n');

let created = 0;
let skipped = 0;

for (const [filePath, content] of Object.entries(envTemplates)) {
  const fullPath = join(rootDir, filePath);
  
  if (existsSync(fullPath)) {
    console.log(`⏭️  Skipped: ${filePath} (already exists)`);
    skipped++;
  } else {
    try {
      writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Created: ${filePath}`);
      created++;
    } catch (error) {
      console.error(`❌ Error creating ${filePath}:`, error.message);
    }
  }
}

console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
console.log('\n⚠️  Remember to update the URLs in .env files with your actual domain names!');

