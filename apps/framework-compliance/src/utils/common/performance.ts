/**
 * Performance monitoring utilities
 * 
 * Tracks Web Vitals and custom performance metrics
 */

import { errorMonitoring } from '../../lib/errorMonitoring';

interface WebVitals {
  name: string;
  value: number;
  id: string;
  delta?: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Report Web Vitals to monitoring service
 */
function reportWebVital(metric: WebVitals): void {
  try {
    // Send to error monitoring service (which can forward to analytics)
    errorMonitoring.captureMessage('Web Vital', 'info', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
    });

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Web Vital] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
      });
    }
  } catch (error) {
    // Silently fail - don't break the app
    if (import.meta.env.DEV) {
      console.warn('Failed to report Web Vital:', error);
    }
  }
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitals(): void {
  try {
    // Only load Web Vitals in production or if explicitly enabled
    if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_WEB_VITALS === 'true') {
      // Dynamically import web-vitals to reduce bundle size
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(reportWebVital);
        onFID(reportWebVital);
        onFCP(reportWebVital);
        onLCP(reportWebVital);
        onTTFB(reportWebVital);
        onINP(reportWebVital);
      }).catch((error) => {
        // web-vitals not available - silently fail
        if (import.meta.env.DEV) {
          console.warn('web-vitals package not available:', error);
        }
      });
    }
  } catch (error) {
    // Silently fail - don't break the app
    if (import.meta.env.DEV) {
      console.warn('Failed to initialize Web Vitals:', error);
    }
  }
}

/**
 * Measure custom performance metric
 */
export function measurePerformance(name: string, fn: () => void | Promise<void>): void {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      result.then(() => {
        const duration = performance.now() - start;
        reportCustomMetric(name, duration);
      }).catch((error) => {
        if (import.meta.env.DEV) {
          console.error(`Performance measurement failed for ${name}:`, error);
        }
      });
    } else {
      const duration = performance.now() - start;
      reportCustomMetric(name, duration);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Performance measurement failed for ${name}:`, error);
    }
  }
}

/**
 * Report custom performance metric
 */
function reportCustomMetric(name: string, value: number): void {
  try {
    errorMonitoring.captureMessage('Performance Metric', 'info', {
      metric: name,
      value,
      unit: 'ms',
    });

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    }
  } catch (error) {
    // Silently fail
    if (import.meta.env.DEV) {
      console.warn('Failed to report custom metric:', error);
    }
  }
}

/**
 * Mark performance timing
 */
export function markTiming(name: string): void {
  try {
    performance.mark(name);
  } catch (error) {
    // Silently fail
    if (import.meta.env.DEV) {
      console.warn(`Failed to mark timing ${name}:`, error);
    }
  }
}

/**
 * Measure between two marks
 */
export function measureTiming(name: string, startMark: string, endMark: string): void {
  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      reportCustomMetric(name, measure.duration);
    }
  } catch (error) {
    // Silently fail
    if (import.meta.env.DEV) {
      console.warn(`Failed to measure timing ${name}:`, error);
    }
  }
}

