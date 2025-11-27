/**
 * Lazy import wrapper with retry logic and error handling
 * 
 * This utility wraps React.lazy() to handle dynamic import failures gracefully.
 * It provides:
 * - Automatic retry on failure
 * - Error boundary integration
 * - Fallback UI for failed imports
 * - Error reporting to monitoring services
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';
import { errorMonitoring } from '../../lib/errorMonitoring';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, retryCount: number) => void;
}

/**
 * Creates a lazy-loaded component with retry logic for failed dynamic imports
 * 
 * @param importFn - Function that returns a dynamic import promise
 * @param options - Retry configuration options
 * @returns A React lazy component with retry support
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: RetryOptions = {}
): LazyExoticComponent<T> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError
  } = options;

  let retryCount = 0;

  const retryImport = async (): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      const importError = error as Error;
      
      // Log the error
      console.error(`Failed to load dynamic import (attempt ${retryCount + 1}/${maxRetries + 1}):`, importError);
      
      // Report to error monitoring
      errorMonitoring.captureException(importError, {
        context: {
          retryCount,
          maxRetries,
          type: 'dynamic_import_failure'
        }
      });

      // Call custom error handler if provided
      if (onError) {
        onError(importError, retryCount);
      }

      // Retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        retryCount++;
        
        // Wait before retrying (exponential backoff)
        const delay = retryDelay * Math.pow(2, retryCount - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return retryImport();
      }

      // If all retries failed, throw the error
      throw new Error(
        `Failed to load module after ${maxRetries + 1} attempts. ` +
        `Original error: ${importError.message}. ` +
        `This may be due to a network issue or missing build artifact. ` +
        `Please refresh the page or contact support if the issue persists.`
      );
    }
  };

  return lazy(() => retryImport()) as LazyExoticComponent<T>;
}
