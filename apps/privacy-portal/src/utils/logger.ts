// Production-safe logging utility with Sentry integration
import { environment, appConfig } from '../config/environment';
import { reportError, reportMessage, addBreadcrumb } from '../services/sentryService';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  userId?: string;
  operation?: string;
  component?: string;
  [key: string]: unknown;
}

class Logger {
  private isProduction: boolean;
  private isDebugMode: boolean;

  constructor() {
    this.isProduction = environment.production;
    this.isDebugMode = environment.debugMode || false;
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log errors and warnings unless debug mode is enabled
    if (this.isProduction && !this.isDebugMode) {
      return level === 'error' || level === 'warn';
    }
    
    // In development or debug mode, log everything
    return true;
  }

  private formatMessage(level: LogLevel, message: string, data?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>, context?: LogContext): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, data);
    
    // Use appropriate console method
    switch (level) {
      case 'debug':
        console.debug(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'error':
        console.error(formattedMessage);
        break;
    }

    // Send to Sentry for errors and warnings in production
    if (appConfig.errorReporting.enabled) {
      if (level === 'error') {
        const error = data?.error instanceof Error 
          ? data.error 
          : new Error(message);
        reportError(error, { ...data, ...context });
      } else if (level === 'warn' && this.isProduction) {
        reportMessage(message, 'warning', { ...data, ...context });
      }
      
      // Add breadcrumb for all logs
      addBreadcrumb(message, context?.component || 'app', level, { ...data, ...context });
    }
  }

  debug(message: string, data?: Record<string, unknown>, context?: LogContext): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: Record<string, unknown>, context?: LogContext): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: Record<string, unknown>, context?: LogContext): void {
    this.log('warn', message, data, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorData: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorData.error = error;
      errorData.errorMessage = error.message;
      errorData.errorStack = error.stack;
    } else if (error) {
      errorData.error = error;
    }
    
    this.log('error', message, errorData, context);
  }

  // Special method for service worker logs (always show in production)
  sw(message: string, data?: Record<string, unknown>): void {
    if (this.isProduction) {
      console.log(`[SW] ${message}`, data);
    } else {
      this.info(`[SW] ${message}`, data);
    }
  }

  // Method for security events (always log)
  security(message: string, data?: Record<string, unknown>): void {
    console.warn(`[SECURITY] ${message}`, data);
    if (appConfig.errorReporting.enabled) {
      reportMessage(`Security Event: ${message}`, 'warning', data);
    }
  }

  // Method for performance metrics
  performance(message: string, data?: Record<string, unknown>): void {
    if (this.isDebugMode || !this.isProduction) {
      console.info(`[PERF] ${message}`, data);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export individual methods for convenience
export const { debug, info, warn, error, sw, security, performance } = logger;