// Sentry error reporting service
import * as Sentry from '@sentry/react';
import { environment, appConfig } from '../config/environment';
import { logger } from '../utils/logger';

// Initialize Sentry
export function initializeSentry() {
  if (!appConfig.errorReporting.enabled || !appConfig.errorReporting.sentryDsn) {
    logger.info('Sentry error reporting is disabled or DSN not configured', {}, {
      component: 'sentryService',
      operation: 'initializeSentry'
    });
    return;
  }

  Sentry.init({
    dsn: appConfig.errorReporting.sentryDsn,
    environment: environment.environment,
    release: `cybercorrect-privacy-portal@${appConfig.version}`,
    
    // Performance monitoring
    tracesSampleRate: environment.production ? 0.1 : 1.0,
    
    // Error sampling
    sampleRate: environment.production ? 0.1 : 1.0,
    
    // Security settings
    beforeSend(event) {
      // Filter out sensitive data
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      // Remove sensitive headers
      if (event.request?.headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        sensitiveHeaders.forEach(header => {
          delete event.request.headers[header];
        });
      }
      
      // Sanitize user data
      if (event.user) {
        event.user = {
          id: event.user.id,
          email: event.user.email ? event.user.email.replace(/(.{2}).*(@.*)/, '$1***$2') : undefined,
          username: event.user.username ? event.user.username.replace(/(.{2}).*(.{2})/, '$1***$2') : undefined
        };
      }
      
      return event;
    },
    
    // Integration configuration
    integrations: [
      // Basic integrations only - advanced features require additional packages
    ],
    
    // Additional options
    beforeBreadcrumb(breadcrumb) {
      // Filter out sensitive breadcrumbs
      if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
        const url = new URL(breadcrumb.data.url);
        if (url.searchParams.has('password') || url.searchParams.has('token')) {
          return null;
        }
      }
      return breadcrumb;
    },
  });

  // Set user context
  Sentry.setContext('app', {
    name: appConfig.name,
    version: appConfig.version,
    company: appConfig.company,
    environment: environment.environment
  });

  logger.info('Sentry error reporting initialized', {}, {
    component: 'sentryService',
    operation: 'initializeSentry'
  });
}

// Error reporting functions
export function reportError(error: Error, context?: Record<string, unknown>) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    
    scope.setLevel('error');
    Sentry.captureException(error);
  });
}

export function reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, unknown>) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
    }
    
    scope.setLevel(level);
    Sentry.captureMessage(message);
  });
}

export function setUserContext(user: { id: string; email?: string; role?: string }) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.role
  });
}

export function clearUserContext() {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.setUser(null);
}

export function addBreadcrumb(message: string, category: string, level: 'info' | 'warning' | 'error' = 'info', data?: Record<string, unknown>) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000
  });
}

// Performance monitoring
export function startTransaction(name: string, op: string) {
  if (!appConfig.errorReporting.enabled) {
    return null;
  }

  // Basic transaction tracking
  Sentry.addBreadcrumb({
    message: `Starting transaction: ${name}`,
    category: 'transaction',
    level: 'info',
    data: { operation: op, environment: environment.environment }
  });

  return { name, op, startTime: Date.now() };
}

export function finishTransaction(transaction: { name: string; op: string; startTime: number }) {
  if (!transaction) {
    return;
  }

  const duration = Date.now() - transaction.startTime;
  Sentry.addBreadcrumb({
    message: `Finished transaction: ${transaction.name}`,
    category: 'transaction',
    level: 'info',
    data: { 
      operation: transaction.op, 
      duration,
      environment: environment.environment 
    }
  });
}

// Security event reporting
export function reportSecurityEvent(event: string, details: Record<string, unknown>) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('event_type', 'security');
    scope.setContext('security_event', {
      event,
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server'
    });
    
    scope.setLevel('warning');
    Sentry.captureMessage(`Security Event: ${event}`);
  });
}

// API error reporting
export function reportAPIError(endpoint: string, error: Error, requestData?: unknown) {
  if (!appConfig.errorReporting.enabled) {
    return;
  }

  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'api');
    scope.setContext('api_error', {
      endpoint,
      requestData: requestData ? JSON.stringify(requestData) : undefined,
      errorMessage: error.message,
      errorStack: error.stack
    });
    
    scope.setLevel('error');
    Sentry.captureException(error);
  });
}

// Export Sentry instance for advanced usage
export { Sentry };