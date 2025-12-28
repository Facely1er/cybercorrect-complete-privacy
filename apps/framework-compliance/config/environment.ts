/**
 * Environment Configuration
 * 
 * This file provides type-safe access to environment variables.
 * All environment variables should be defined here for easy reference.
 * 
 * ⚠️ SECURITY NOTE: This file is committed to the repo and contains
 * the actual production keys. This is intentional for this project.
 * The .env files are gitignored for local overrides.
 */

export const env = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://achowlksgmwuvfbvjfrt.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjaG93bGtzZ213dXZmYnZqZnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY2MjAsImV4cCI6MjA3ODI5MjYyMH0.VA3C-heQSKCyiRTfrDdhrb2ONUt44W-o-a2D7ci5eUo',
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51SDTm0A6UggvM46NqgXKcQyRNzG908jh9yWh6ZUiGZkO4ihkHar65ghpnMcH2EOXeLySmdUy3P7mCO1Qev64uzr600rPDDCU8O',
  },

  // Site URLs
  site: {
    url: import.meta.env.VITE_SITE_URL || 'https://www.cybercorrect.com',
    frameworkCompliance: import.meta.env.VITE_FRAMEWORK_COMPLIANCE_URL || 'https://www.platform.cybercorrect.com',
    privacyPortal: import.meta.env.VITE_PRIVACY_PORTAL_URL || 'https://www.portal.cybercorrect.com',
    marketingSite: import.meta.env.VITE_MARKETING_SITE_URL || 'https://www.cybercorrect.com',
  },

  // Error Monitoring (Optional)
  sentry: {
    dsn: import.meta.env.VITE_SENTRY_DSN,
  },

  // Environment
  mode: import.meta.env.MODE || 'development',
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
} as const;

/**
 * Validate that required environment variables are set
 */
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!env.supabase.url) missing.push('VITE_SUPABASE_URL');
  if (!env.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  if (!env.stripe.publishableKey) missing.push('VITE_STRIPE_PUBLISHABLE_KEY');
  if (!env.site.url) missing.push('VITE_SITE_URL');

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get Edge Function secrets (for reference - these are set in Supabase Dashboard)
 */
export const edgeFunctionSecrets = {
  stripeSecretKey: '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',
  siteUrl: 'https://www.cybercorrect.com',
  // Webhook secret is set in Supabase Dashboard after webhook is created
  webhookSecret: 'whsec_xxxxxxxxxxxxx', // Get from Stripe Dashboard after webhook setup
} as const;

