// Error reporting service for production monitoring
import { environment, appConfig } from '../config/environment';
import { reportError } from './sentryService';

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  version: string;
  environment: string;
}

class ErrorReportingService {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadUserId(): void {
    try {
      const stored = localStorage.getItem('privacy_portal_user_id');
      this.userId = stored || undefined;
    } catch {
      // Ignore localStorage errors
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    try {
      localStorage.setItem('privacy_portal_user_id', userId);
    } catch {
      // Ignore localStorage errors
    }
  }

  clearUserId(): void {
    this.userId = undefined;
    try {
      localStorage.removeItem('privacy_portal_user_id');
    } catch {
      // Ignore localStorage errors
    }
  }

  private createErrorReport(
    error: Error,
    errorInfo?: { componentStack?: string }
  ): ErrorReport {
    return {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      version: appConfig.version,
      environment: environment.environment
    };
  }

  async logError(error: Error, errorInfo?: { componentStack?: string }): Promise<void> {
    // Always log to console in development or debug mode
    if (environment.development || environment.debugMode) {
      console.error('Error reported:', error, errorInfo);
    }

    // Only send to external service in production and if enabled
    if (!environment.production || !appConfig.errorReporting.enabled) {
      return;
    }

    try {
      const errorReport = this.createErrorReport(error, errorInfo);
      
      // Send to Sentry if configured
      if (appConfig.errorReporting.sentryDsn) {
        await this.sendToSentry(errorReport);
      }
      
      // Send to custom endpoint if configured
      if (appConfig.errorReporting.customEndpoint) {
        await this.sendToCustomEndpoint(errorReport);
      }
      
    } catch (reportingError) {
      // Don't let error reporting break the app
      if (environment.debugMode) {
        console.warn('Failed to report error:', reportingError);
      }
    }
  }

  private async sendToSentry(errorReport: ErrorReport): Promise<void> {
    // Use the existing Sentry service for error reporting
    if (!appConfig.errorReporting.sentryDsn) {
      return;
    }

    try {
      // Create an Error object from the error report
      const error = new Error(errorReport.message);
      if (errorReport.stack) {
        error.stack = errorReport.stack;
      }

      // Report to Sentry with additional context
      reportError(error, {
        componentStack: errorReport.componentStack,
        url: errorReport.url,
        userId: errorReport.userId,
        sessionId: errorReport.sessionId,
        userAgent: errorReport.userAgent,
        timestamp: errorReport.timestamp,
        version: errorReport.version,
        environment: errorReport.environment
      });
    } catch (sentryError) {
      // Don't let Sentry errors break error reporting
      if (environment.debugMode) {
        console.warn('Failed to send error to Sentry:', sentryError);
      }
    }
  }

  private async sendToCustomEndpoint(errorReport: ErrorReport): Promise<void> {
    // Send to a custom error reporting endpoint if configured
    const endpoint = appConfig.errorReporting.customEndpoint;
    if (!endpoint) {
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // Silently fail - don't break the app for error reporting
      if (environment.debugMode) {
        console.warn('Failed to send error to custom endpoint:', error);
      }
    }
  }

  // Log non-error events for debugging
  async logEvent(event: string, data?: Record<string, unknown>): Promise<void> {
    if (!environment.debugMode) {
      return;
    }

    const eventReport = {
      event,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      version: appConfig.version
    };

    console.log('Event logged:', eventReport);
  }
}

// Export singleton instance
export const errorReportingService = new ErrorReportingService();

// Export class for testing
export { ErrorReportingService };