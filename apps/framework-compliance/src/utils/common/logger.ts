/**
 * Production-safe logger utility
 * 
 * - In development: Logs to console
 * - In production: Sends errors to error monitoring, suppresses debug logs
 */

import { errorMonitoring } from '../../lib/errorMonitoring';

const isDev = import.meta.env.DEV;

/**
 * Log debug information (only in development)
 */
export function logDebug(...args: unknown[]): void {
  if (isDev) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Log info messages (only in development)
 */
export function logInfo(...args: unknown[]): void {
  if (isDev) {
    console.info('[INFO]', ...args);
  }
}

/**
 * Log warnings
 * - In development: Logs to console
 * - In production: Sends to error monitoring
 */
export function logWarning(message: string, context?: Record<string, unknown>): void {
  if (isDev) {
    console.warn('[WARN]', message, context);
  } else {
    // In production, send to error monitoring
    errorMonitoring.captureMessage(message, 'warning', context);
  }
}

/**
 * Log errors
 * - In development: Logs to console
 * - In production: Sends to error monitoring
 */
export function logError(error: Error | string, context?: Record<string, unknown>): void {
  if (isDev) {
    console.error('[ERROR]', error, context);
  } else {
    // In production, send to error monitoring
    if (error instanceof Error) {
      errorMonitoring.captureException(error, context);
    } else {
      errorMonitoring.captureMessage(error, 'error', context);
    }
  }
}

/**
 * Log errors that should always be sent to monitoring (even in dev)
 */
export function logErrorToMonitoring(error: Error | string, context?: Record<string, unknown>): void {
  if (error instanceof Error) {
    errorMonitoring.captureException(error, context);
  } else {
    errorMonitoring.captureMessage(error, 'error', context);
  }
  
  // Also log to console in development for debugging
  if (isDev) {
    console.error('[ERROR]', error, context);
  }
}

