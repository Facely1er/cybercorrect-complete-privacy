import * as Sentry from '@sentry/react';

// Initialize Sentry
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured. Error monitoring disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0.5,
    replaysOnErrorSampleRate: 1.0,
    
    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive information
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      
      // Filter out development errors in production
      if (import.meta.env.PROD && event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('localhost') || error?.value?.includes('127.0.0.1')) {
          return null;
        }
      }
      
      return event;
    },
    
    // Set user context
    beforeSendTransaction(event) {
      // Add custom tags
      event.tags = {
        ...event.tags,
        component: 'cybercorrect',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      };
      
      return event;
    },
  });

  // Set user context when available
  const userId = localStorage.getItem('userId');
  if (userId) {
    Sentry.setUser({ id: userId });
  }

  console.log('Sentry initialized successfully');
}

// Error boundary component
export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: React.ReactNode }) => <>{children}</>,
  {
    fallback: ({ error, resetError }) => (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-4">
                We're sorry, but something unexpected happened. Our team has been notified.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={resetError}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
            
            {import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    ),
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', errorInfo);
    },
  }
);

// Utility functions for manual error reporting
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, {
    tags: {
      source: 'manual',
    },
    extra: context,
  });
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level);
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

export const clearUser = () => {
  Sentry.setUser(null);
};

export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}) => {
  Sentry.addBreadcrumb(breadcrumb);
};

export default Sentry;


