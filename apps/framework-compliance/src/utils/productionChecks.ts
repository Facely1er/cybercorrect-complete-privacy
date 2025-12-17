/**
 * Production Readiness Checks
 * 
 * Utilities to verify that required services are configured
 * and the application is ready for production use.
 */

import { isSupabaseConfigured } from '../lib/supabase';

export interface ProductionCheckResult {
  isReady: boolean;
  service: string;
  status: 'ready' | 'warning' | 'error';
  message: string;
  required: boolean;
}

export interface ProductionReadiness {
  overall: 'ready' | 'partial' | 'not_ready';
  checks: ProductionCheckResult[];
  readyCount: number;
  totalRequired: number;
}

/**
 * Check if Stripe is configured
 */
export function checkStripeConfiguration(): ProductionCheckResult {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    return {
      isReady: false,
      service: 'Stripe',
      status: 'error',
      message: 'Stripe not configured. Payments will not work.',
      required: true
    };
  }
  
  if (stripeKey.startsWith('pk_test_')) {
    return {
      isReady: true,
      service: 'Stripe',
      status: 'warning',
      message: 'Stripe in test mode. Switch to live mode for production.',
      required: true
    };
  }
  
  return {
    isReady: true,
    service: 'Stripe',
    status: 'ready',
    message: 'Stripe configured for live mode',
    required: true
  };
}

/**
 * Check if Supabase is configured
 */
export function checkSupabaseConfiguration(): ProductionCheckResult {
  const isConfigured = isSupabaseConfigured();
  
  if (!isConfigured) {
    return {
      isReady: false,
      service: 'Supabase',
      status: 'error',
      message: 'Supabase not configured. Data persistence will not work.',
      required: true
    };
  }
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const isLocalDev = supabaseUrl?.includes('localhost') || supabaseUrl?.includes('127.0.0.1');
  
  if (isLocalDev) {
    return {
      isReady: true,
      service: 'Supabase',
      status: 'warning',
      message: 'Supabase pointing to local instance. Use production URL for deployment.',
      required: true
    };
  }
  
  return {
    isReady: true,
    service: 'Supabase',
    status: 'ready',
    message: 'Supabase configured for production',
    required: true
  };
}

/**
 * Check if email service is configured
 */
export function checkEmailConfiguration(): ProductionCheckResult {
  const emailService = import.meta.env.EMAIL_SERVICE;
  const sendgridKey = import.meta.env.SENDGRID_API_KEY;
  const resendKey = import.meta.env.RESEND_API_KEY;
  
  if (!emailService && !sendgridKey && !resendKey) {
    return {
      isReady: false,
      service: 'Email',
      status: 'warning',
      message: 'No email service configured. Notifications will not be sent.',
      required: false
    };
  }
  
  return {
    isReady: true,
    service: 'Email',
    status: 'ready',
    message: `Email service configured (${emailService || 'detected'})`,
    required: false
  };
}

/**
 * Check if error monitoring is configured
 */
export function checkErrorMonitoring(): ProductionCheckResult {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!sentryDsn) {
    return {
      isReady: false,
      service: 'Error Monitoring',
      status: 'warning',
      message: 'Sentry not configured. Production errors will not be tracked.',
      required: false
    };
  }
  
  return {
    isReady: true,
    service: 'Error Monitoring',
    status: 'ready',
    message: 'Sentry configured for error tracking',
    required: false
  };
}

/**
 * Check if analytics is configured
 */
export function checkAnalytics(): ProductionCheckResult {
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const mixpanelKey = import.meta.env.VITE_MIXPANEL_KEY;
  
  if (!posthogKey && !mixpanelKey) {
    return {
      isReady: false,
      service: 'Analytics',
      status: 'warning',
      message: 'No analytics configured. User behavior will not be tracked.',
      required: false
    };
  }
  
  return {
    isReady: true,
    service: 'Analytics',
    status: 'ready',
    message: `Analytics configured (${posthogKey ? 'PostHog' : 'Mixpanel'})`,
    required: false
  };
}

/**
 * Check if environment is production
 */
export function checkEnvironment(): ProductionCheckResult {
  const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    return {
      isReady: true,
      service: 'Environment',
      status: 'warning',
      message: 'Running in development mode',
      required: true
    };
  }
  
  if (env === 'production') {
    return {
      isReady: true,
      service: 'Environment',
      status: 'ready',
      message: 'Running in production mode',
      required: true
    };
  }
  
  return {
    isReady: true,
    service: 'Environment',
    status: 'warning',
    message: `Running in ${env} mode`,
    required: true
  };
}

/**
 * Run all production readiness checks
 */
export function checkProductionReadiness(): ProductionReadiness {
  const checks: ProductionCheckResult[] = [
    checkEnvironment(),
    checkSupabaseConfiguration(),
    checkStripeConfiguration(),
    checkEmailConfiguration(),
    checkErrorMonitoring(),
    checkAnalytics(),
  ];
  
  const requiredChecks = checks.filter(c => c.required);
  const readyCount = requiredChecks.filter(c => c.isReady).length;
  const totalRequired = requiredChecks.length;
  
  let overall: 'ready' | 'partial' | 'not_ready';
  if (readyCount === totalRequired) {
    overall = 'ready';
  } else if (readyCount > 0) {
    overall = 'partial';
  } else {
    overall = 'not_ready';
  }
  
  return {
    overall,
    checks,
    readyCount,
    totalRequired
  };
}

/**
 * Check if specific feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  switch (feature) {
    case 'portal_beta':
      return import.meta.env.VITE_ENABLE_PORTAL_BETA === 'true';
    case 'stripe_payments':
      return import.meta.env.VITE_ENABLE_STRIPE_PAYMENTS === 'true';
    case 'email_notifications':
      return !!import.meta.env.EMAIL_SERVICE || !!import.meta.env.SENDGRID_API_KEY;
    default:
      return false;
  }
}

/**
 * Log production readiness status (for debugging)
 */
export function logProductionReadiness(): void {
  const readiness = checkProductionReadiness();
  
  const statusLines = [
    '🚀 Production Readiness Check',
    `Overall Status: ${readiness.overall.toUpperCase()}`,
    `Ready: ${readiness.readyCount}/${readiness.totalRequired} required services`,
    '\nDetailed Status:'
  ];
  
  readiness.checks.forEach(check => {
    const icon = check.status === 'ready' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
    const required = check.required ? '[REQUIRED]' : '[OPTIONAL]';
    statusLines.push(`${icon} ${check.service} ${required}: ${check.message}`);
  });
  
  if (readiness.overall === 'not_ready') {
    console.error([...statusLines, '\n⚠️ Application is NOT ready for production. Please configure required services.'].join('\n'));
  } else if (readiness.overall === 'partial') {
    console.warn([...statusLines, '\n⚠️ Application is partially ready. Some optional services are not configured.'].join('\n'));
  } else {
    console.warn([...statusLines, '\n✅ Application is ready for production!'].join('\n'));
  }
}

/**
 * Get user-friendly production status message
 */
export function getProductionStatusMessage(): string {
  const readiness = checkProductionReadiness();
  
  if (readiness.overall === 'ready') {
    return 'All systems operational';
  }
  
  const failedRequired = readiness.checks
    .filter(c => c.required && !c.isReady)
    .map(c => c.service);
  
  if (failedRequired.length > 0) {
    return `Configuration required: ${failedRequired.join(', ')}`;
  }
  
  return 'Some optional services not configured';
}

