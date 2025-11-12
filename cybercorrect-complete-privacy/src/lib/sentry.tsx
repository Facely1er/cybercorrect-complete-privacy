import * as Sentry from '@sentry/react';
import React from 'react';

// Track Sentry initialization status
let sentryInitialized = false;
let sentryAvailable = false;

// Initialize Sentry with comprehensive fallback handling
export function initSentry() {
  try {
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    
    if (!dsn) {
      // Only show warning in development mode
      if (import.meta.env.DEV) {
        console.warn('Sentry DSN not configured. Error monitoring will use fallback methods.');
      }
      sentryAvailable = false;
      return;
    }

    try {
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
          try {
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
          } catch (beforeSendError) {
            // If beforeSend fails, still send the event (don't block error reporting)
            console.warn('Sentry beforeSend failed:', beforeSendError);
            return event;
          }
        },
        
        // Set user context
        beforeSendTransaction(event) {
          try {
            // Add custom tags
            event.tags = {
              ...event.tags,
              component: 'cybercorrect',
              version: import.meta.env.VITE_APP_VERSION || '1.0.0',
            };
            
            return event;
          } catch (beforeSendTransactionError) {
            // If beforeSendTransaction fails, still send the transaction
            console.warn('Sentry beforeSendTransaction failed:', beforeSendTransactionError);
            return event;
          }
        },
      });

      // Set user context when available (with error handling)
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          Sentry.setUser({ id: userId });
        }
      } catch (userError) {
        console.warn('Failed to set Sentry user context:', userError);
        // Continue - user context is optional
      }

      sentryInitialized = true;
      sentryAvailable = true;
      console.log('Sentry initialized successfully');
    } catch (initError) {
      // Sentry initialization failed - use fallback methods
      console.warn('Sentry initialization failed, using fallback error monitoring:', initError);
      sentryAvailable = false;
      // Don't throw - app should continue working
    }
  } catch (error) {
    // Any unexpected error during Sentry setup - use fallback methods
    console.warn('Sentry setup error, using fallback error monitoring:', error);
    sentryAvailable = false;
    // Don't throw - app should continue working
  }
}

// Check if Sentry is available
export function isSentryAvailable(): boolean {
  return sentryAvailable && sentryInitialized;
}

// Fallback Error Boundary component (works without Sentry)
interface FallbackErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class FallbackErrorBoundary extends React.Component<
  { children: React.ReactNode },
  FallbackErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<FallbackErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console as fallback
    console.error('Error caught by fallback error boundary:', error, errorInfo);
    
    // Try to capture with Sentry if available
    if (sentryAvailable && sentryInitialized) {
      try {
        Sentry.captureException(error, {
          tags: { errorBoundary: true },
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });
      } catch (sentryError) {
        console.warn('Failed to capture error in Sentry:', sentryError);
      }
    }
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
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
                  {sentryAvailable && sentryInitialized
                    ? "We're sorry, but something unexpected happened. Our team has been notified."
                    : "We're sorry, but something unexpected happened. Please try again or contact support."}
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleReset}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Go Home
                </button>
              </div>
              
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        {'\n\nComponent Stack:\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error boundary component with Sentry integration and fallback
let SentryErrorBoundaryComponent: React.ComponentType<{ children: React.ReactNode }>;

try {
  // Try to create Sentry error boundary if available
  if (typeof Sentry !== 'undefined' && Sentry.withErrorBoundary) {
    SentryErrorBoundaryComponent = Sentry.withErrorBoundary(
      ({ children }: { children: React.ReactNode }) => <>{children}</>,
      {
        fallback: ({ error, resetError }) => {
          try {
            // Log to console as fallback
            console.error('Error caught by Sentry error boundary:', error);
            
            return (
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
                        onClick={() => (window.location.href = '/')}
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
            );
          } catch (fallbackError) {
            // If Sentry error boundary fails, use simple fallback
            console.error('Sentry error boundary render failed:', fallbackError);
            return (
              <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            );
          }
        },
        beforeCapture: (scope, _error, errorInfo) => {
          try {
            if (sentryAvailable && sentryInitialized) {
              scope.setTag('errorBoundary', true);
              if (errorInfo && typeof errorInfo === 'object') {
                scope.setContext('errorInfo', errorInfo as Record<string, unknown>);
              } else if (errorInfo) {
                scope.setContext('errorInfo', { message: String(errorInfo) });
              }
            }
          } catch (beforeCaptureError) {
            // If beforeCapture fails, continue anyway
            console.warn('Sentry beforeCapture failed:', beforeCaptureError);
          }
        },
      }
    );
  } else {
    // Fallback: Use React ErrorBoundary if Sentry not available
    SentryErrorBoundaryComponent = FallbackErrorBoundary;
  }
} catch (error) {
  // If Sentry error boundary setup fails, use fallback React ErrorBoundary
  console.warn('Sentry error boundary setup failed, using fallback:', error);
  SentryErrorBoundaryComponent = FallbackErrorBoundary;
}

// Export error boundary that works with or without Sentry
export const SentryErrorBoundary = SentryErrorBoundaryComponent;

// Utility functions for manual error reporting with fallback handling
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  try {
    if (sentryAvailable && sentryInitialized) {
      Sentry.captureException(error, {
        tags: {
          source: 'manual',
        },
        extra: context,
      });
    } else {
      // Fallback: log to console if Sentry not available
      console.error('Error (Sentry not available):', error, context);
    }
  } catch (sentryError) {
    // Sentry capture failed - log to console as fallback
    console.error('Sentry captureException failed, logging to console:', error, context);
    console.error('Sentry error:', sentryError);
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  try {
    if (sentryAvailable && sentryInitialized) {
      Sentry.captureMessage(message, level);
    } else {
      // Fallback: log to console if Sentry not available
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  } catch (sentryError) {
    // Sentry capture failed - log to console as fallback
    console.log(`[${level.toUpperCase()}] ${message} (Sentry failed: ${sentryError})`);
  }
};

export const setUser = (user: { id: string; email?: string; username?: string }) => {
  try {
    if (sentryAvailable && sentryInitialized) {
      Sentry.setUser(user);
    } else {
      // Fallback: store in localStorage if Sentry not available
      try {
        localStorage.setItem('sentryUserFallback', JSON.stringify(user));
      } catch (storageError) {
        console.warn('Failed to store user in localStorage fallback:', storageError);
      }
    }
  } catch (sentryError) {
    // Sentry setUser failed - use localStorage fallback
    console.warn('Sentry setUser failed, using localStorage fallback:', sentryError);
    try {
      localStorage.setItem('sentryUserFallback', JSON.stringify(user));
    } catch (storageError) {
      console.warn('Failed to store user in localStorage fallback:', storageError);
    }
  }
};

export const clearUser = () => {
  try {
    if (sentryAvailable && sentryInitialized) {
      Sentry.setUser(null);
    } else {
      // Fallback: remove from localStorage if Sentry not available
      try {
        localStorage.removeItem('sentryUserFallback');
      } catch (storageError) {
        console.warn('Failed to remove user from localStorage fallback:', storageError);
      }
    }
  } catch (sentryError) {
    // Sentry clearUser failed - use localStorage fallback
    console.warn('Sentry clearUser failed, using localStorage fallback:', sentryError);
    try {
      localStorage.removeItem('sentryUserFallback');
    } catch (storageError) {
      console.warn('Failed to remove user from localStorage fallback:', storageError);
    }
  }
};

export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, unknown>;
}) => {
  try {
    if (sentryAvailable && sentryInitialized) {
      Sentry.addBreadcrumb(breadcrumb);
    } else {
      // Fallback: log to console if Sentry not available
      console.log(`[Breadcrumb] ${breadcrumb.message}`, breadcrumb);
    }
  } catch (sentryError) {
    // Sentry addBreadcrumb failed - log to console as fallback
    console.log(`[Breadcrumb] ${breadcrumb.message} (Sentry failed: ${sentryError})`, breadcrumb);
  }
};

export default Sentry;


