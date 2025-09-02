// Error monitoring service
// This can be easily replaced with Sentry, LogRocket, or other monitoring services

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

  captureException(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) {
      console.error('Error (development):', error, context);
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

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    if (!this.isEnabled) {
      console.log(`[${level.toUpperCase()}] ${message}`, context);
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
      if (this.apiEndpoint) {
        await fetch(this.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorInfo),
        });
      } else {
        // Fallback: send to console in production
        console.error('Error captured:', errorInfo);
      }
    } catch (sendError) {
      console.error('Failed to send error to monitoring service:', sendError);
    }
  }

  private getUserId(): string | undefined {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).id : undefined;
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

  setUser(userId: string, userInfo?: Record<string, any>) {
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