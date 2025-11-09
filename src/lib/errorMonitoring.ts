// Error monitoring service
// Integrates with Sentry if configured, otherwise uses fallback logging

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class ErrorMonitoringService {
  private isEnabled: boolean;
  private apiEndpoint?: string;

  constructor() {
    this.isEnabled = import.meta.env.PROD;
    this.apiEndpoint = import.meta.env.VITE_ERROR_MONITORING_ENDPOINT;
  }

  private isDev(): boolean {
    try {
      // Prefer Vite env if available, fallback to NODE_ENV
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const viteDev = (import.meta as any)?.env?.DEV;
      if (typeof viteDev === 'boolean') return viteDev;
    } catch {
      // ignore
    }
    // Fallback to Node env
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeEnv = (globalThis as any)?.process?.env?.NODE_ENV;
    return nodeEnv !== 'production';
  }

  captureException(error: Error, context?: Record<string, unknown>) {
    if (!this.isEnabled) {
      // Only log in development
      if (this.isDev()) {
        console.error('Error (development):', error, context);
      }
      return;
    }

    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      ...context
    };

    // Send to monitoring service
    this.sendError(errorInfo);
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, unknown>) {
    if (!this.isEnabled) {
      // Only log in development
      if (this.isDev()) {
        console.log(`[${level.toUpperCase()}] ${message}`, context);
      }
      return;
    }

    const errorInfo: ErrorInfo = {
      message,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      ...context
    };

    this.sendError(errorInfo);
  }

  private async sendError(errorInfo: ErrorInfo) {
    try {
      // Try Sentry first if available
      const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
      if (sentryDsn) {
        try {
          const { captureException: sentryCaptureException, captureMessage: sentryCaptureMessage } = await import('./sentry');
          if (errorInfo.stack) {
            // It's an exception
            const error = new Error(errorInfo.message);
            error.stack = errorInfo.stack;
            // Convert ErrorInfo to Record<string, unknown> for Sentry
            const context: Record<string, unknown> = {
              url: errorInfo.url,
              userAgent: errorInfo.userAgent,
              timestamp: errorInfo.timestamp,
              userId: errorInfo.userId,
              sessionId: errorInfo.sessionId,
              componentStack: errorInfo.componentStack,
            };
            sentryCaptureException(error, context);
          } else {
            // It's a message
            sentryCaptureMessage(errorInfo.message, 'error');
          }
          return; // Sentry handled it
        } catch (sentryError) {
          // Sentry not available or failed - fall through to other methods (never throw)
          console.warn('Sentry not available or failed:', sentryError);
          // Continue to fallback methods
        }
      }

      // Fallback: Use API endpoint if configured
      if (this.apiEndpoint) {
        try {
          const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorInfo),
          });
          
          if (!response.ok) {
            console.warn('Error monitoring API returned non-OK status:', response.status);
          }
        } catch (fetchError) {
          // API endpoint failed - fall through to console (never throw)
          console.warn('Error monitoring API endpoint failed:', fetchError);
          // Continue to console fallback
        }
      }
      
      // Final fallback: send to console in development (never throw)
      if (this.isDev()) {
        console.error('Error captured (no monitoring service available):', errorInfo);
      }
    } catch (sendError) {
      // Never throw - always log to console as final fallback
      if (this.isDev()) {
        console.error('Failed to send error to monitoring service (all methods failed):', sendError);
        console.error('Original error:', errorInfo);
      }
      // In production, silently fail (don't crash the app)
    }
  }

  private getUserId(): string | undefined {
    try {
      return localStorage.getItem('userId') || undefined;
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  setUser(userId: string, userInfo?: Record<string, unknown>) {
    if (this.isEnabled) {
      // Set user context for error tracking
      localStorage.setItem('errorMonitoringUser', JSON.stringify({ userId, ...userInfo }));
    }
  }

  clearUser() {
    if (this.isEnabled) {
      localStorage.removeItem('errorMonitoringUser');
    }
  }
}

// Export singleton instance
export const errorMonitoring = new ErrorMonitoringService();

// Export for easy integration with other services
export default errorMonitoring;