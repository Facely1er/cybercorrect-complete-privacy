// Production-safe logging utility
import { environment } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// interface LogEntry {
//   level: LogLevel;
//   message: string;
//   data?: Record<string, unknown>;
//   timestamp: string;
// }

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

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
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
  }

  debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
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