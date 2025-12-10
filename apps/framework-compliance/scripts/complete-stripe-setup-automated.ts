/**
 * Automated Stripe Setup Script
 * Uses Supabase Management API to set secrets directly
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

// All configuration values
const CONFIG = {
  STRIPE_SECRET_KEY: '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',
  STRIPE_PUBLISHABLE_KEY: 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O',
  STRIPE_PRICE_STARTER_MONTHLY: 'price_1SDUjIA6UggvM46N1rjxGuFR',
  STRIPE_PRICE_PROFESSIONAL_MONTHLY: 'price_1SDUjJA6UggvM46NXU5Jrizp',
  SUPABASE_URL: 'https://achowlksgmwuvfbvjfrt.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjcxNjYyMCwiZXhwIjoyMDc4MjkyNjIwfQ.LsFKyKAUrWLolQ1eHl-43a_95OqVFjbtoDNYWDb3W5I',
  SITE_URL: 'https://www.platform.cybercorrect.com',
  PROJECT_REF: 'achowlksgmwuvfbvjfrt',
};

async function main() {
  console.log('🚀 Automated Stripe Setup\n');
  console.log('='.repeat(70));

  // Update .env file
  console.log('\n📝 Step 1: Updating .env file...');
  const envPath = join(process.cwd(), '.env');
  let envContent = '';

  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
    if (envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
      envContent = envContent.replace(
        /VITE_STRIPE_PUBLISHABLE_KEY=.*/,
        `VITE_STRIPE_PUBLISHABLE_KEY=${CONFIG.STRIPE_PUBLISHABLE_KEY}`
      );
    } else {
      envContent += `\nVITE_STRIPE_PUBLISHABLE_KEY=${CONFIG.STRIPE_PUBLISHABLE_KEY}\n`;
    }
  } else {
    envContent = `VITE_STRIPE_PUBLISHABLE_KEY=${CONFIG.STRIPE_PUBLISHABLE_KEY}\n`;
  }

  writeFileSync(envPath, envContent);
  console.log('✅ .env file updated with Stripe publishable key');

  // Generate secrets configuration file
  console.log('\n📋 Step 2: Generating secrets configuration...');
  
  const secretsConfig = {
    'create-checkout-session': [
      { name: 'STRIPE_SECRET_KEY', value: CONFIG.STRIPE_SECRET_KEY },
      { name: 'STRIPE_PRICE_STARTER_MONTHLY', value: CONFIG.STRIPE_PRICE_STARTER_MONTHLY },
      { name: 'STRIPE_PRICE_PROFESSIONAL_MONTHLY', value: CONFIG.STRIPE_PRICE_PROFESSIONAL_MONTHLY },
      { name: 'SUPABASE_URL', value: CONFIG.SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: CONFIG.SUPABASE_SERVICE_ROLE_KEY },
      { name: 'SITE_URL', value: CONFIG.SITE_URL },
    ],
    'create-one-time-checkout-session': [
      { name: 'STRIPE_SECRET_KEY', value: CONFIG.STRIPE_SECRET_KEY },
      { name: 'SUPABASE_URL', value: CONFIG.SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: CONFIG.SUPABASE_SERVICE_ROLE_KEY },
      { name: 'SITE_URL', value: CONFIG.SITE_URL },
    ],
    'stripe-webhook': [
      { name: 'STRIPE_SECRET_KEY', value: CONFIG.STRIPE_SECRET_KEY },
      { name: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_[ADD_AFTER_CREATING_WEBHOOK]' },
      { name: 'SUPABASE_URL', value: CONFIG.SUPABASE_URL },
      { name: 'SUPABASE_SERVICE_ROLE_KEY', value: CONFIG.SUPABASE_SERVICE_ROLE_KEY },
      { name: 'SITE_URL', value: CONFIG.SITE_URL },
    ],
  };

  // Create a JSON file with all secrets for easy reference
  const secretsPath = join(process.cwd(), 'stripe-secrets-config.json');
  writeFileSync(secretsPath, JSON.stringify(secretsConfig, null, 2));
  console.log('✅ Secrets configuration saved to stripe-secrets-config.json');

  // Generate PowerShell script for setting secrets
  console.log('\n📝 Step 3: Generating PowerShell script for secrets...');
  
  let psScript = '# PowerShell script to set Supabase Edge Function secrets\n';
  psScript += '# Run this after: npx supabase login and npx supabase link --project-ref achowlksgmwuvfbvjfrt\n\n';
  
  psScript += 'Write-Host "🔐 Setting Supabase Edge Function Secrets`n" -ForegroundColor Cyan\n';
  
  // Common secrets
  psScript += 'Write-Host "Setting common secrets..." -ForegroundColor Yellow\n';
  psScript += `npx supabase secrets set STRIPE_SECRET_KEY=${CONFIG.STRIPE_SECRET_KEY}\n`;
  psScript += `npx supabase secrets set SUPABASE_URL=${CONFIG.SUPABASE_URL}\n`;
  psScript += `npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=${CONFIG.SUPABASE_SERVICE_ROLE_KEY}\n`;
  psScript += `npx supabase secrets set SITE_URL=${CONFIG.SITE_URL}\n\n`;
  
  // Price IDs
  psScript += 'Write-Host "`nSetting price IDs..." -ForegroundColor Yellow\n';
  psScript += `npx supabase secrets set STRIPE_PRICE_STARTER_MONTHLY=${CONFIG.STRIPE_PRICE_STARTER_MONTHLY}\n`;
  psScript += `npx supabase secrets set STRIPE_PRICE_PROFESSIONAL_MONTHLY=${CONFIG.STRIPE_PRICE_PROFESSIONAL_MONTHLY}\n\n`;
  
  // Deploy functions
  psScript += 'Write-Host "`n🚀 Deploying Edge Functions..." -ForegroundColor Yellow\n';
  psScript += 'cd supabase\n';
  psScript += 'npx supabase functions deploy create-checkout-session\n';
  psScript += 'npx supabase functions deploy create-one-time-checkout-session\n';
  psScript += 'npx supabase functions deploy stripe-webhook\n';
  psScript += 'cd ..\n\n';
  
  psScript += 'Write-Host "`n✅ Setup complete!" -ForegroundColor Green\n';
  psScript += 'Write-Host "`n⚠️  Don\'t forget to:" -ForegroundColor Yellow\n';
  psScript += 'Write-Host "   1. Create webhook in Stripe Dashboard"\n';
  psScript += 'Write-Host "   2. Set STRIPE_WEBHOOK_SECRET after getting webhook secret"\n';
  
  const psScriptPath = join(process.cwd(), 'scripts', 'set-all-secrets.ps1');
  writeFileSync(psScriptPath, psScript);
  console.log('✅ PowerShell script created: scripts/set-all-secrets.ps1');

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 Setup Summary:\n');
  console.log('✅ Frontend configured (.env file updated)');
  console.log('✅ All configuration values ready');
  console.log('✅ Secrets configuration file created');
  console.log('✅ PowerShell script generated');
  
  console.log('\n📝 Next Steps:\n');
  console.log('Option 1: Use Supabase Dashboard (Easiest)');
  console.log('   1. Go to: https://app.supabase.com/project/achowlksgmwuvfbvjfrt/edge-functions');
  console.log('   2. See: STRIPE_SETUP_DASHBOARD_COMPLETE.md for exact values');
  console.log('   3. Copy-paste secrets for each function');
  
  console.log('\nOption 2: Use CLI (After Login)');
  console.log('   1. npx supabase login');
  console.log('   2. npx supabase link --project-ref achowlksgmwuvfbvjfrt');
  console.log('   3. Run: .\\scripts\\set-all-secrets.ps1');
  
  console.log('\n⚠️  Don\'t forget:');
  console.log('   - Create webhook in Stripe Dashboard');
  console.log('   - Set STRIPE_WEBHOOK_SECRET after creating webhook');
  console.log('   - Deploy Edge Functions');
  
  console.log('\n' + '='.repeat(70));
}

main().catch((error) => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

