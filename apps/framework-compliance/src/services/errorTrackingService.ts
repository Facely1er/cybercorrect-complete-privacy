/**
 * Error Tracking Service
 * Provides comprehensive error tracking with database storage and analytics
 * Integrates with existing errorMonitoring service
 * Adapted from toolkitv2 for privacy compliance platform
 */

import { supabase } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';

// Types
export type ErrorLevel = 'error' | 'warning' | 'info' | 'debug' | 'critical';
export type ErrorCategory = 'auth' | 'api' | 'ui' | 'data' | 'security' | 'performance' | 'unknown';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  timestamp?: Date;
  environment?: string;
  release?: string;
  category?: ErrorCategory;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

export interface ErrorReportRecord {
  id: string;
  timestamp: string;
  level: ErrorLevel;
  category: ErrorCategory;
  message: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, unknown>;
  resolved: boolean;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Alias for backward compatibility
export type ErrorReport = ErrorReportRecord;

export interface ErrorAnalytics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsByLevel: Record<string, number>;
  errorsByPriority: Record<string, number>;
  recentErrors: ErrorReportRecord[];
  unresolvedErrors: ErrorReportRecord[];
}

export class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private initialized = false;

  private constructor() {}

  static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.setupGlobalHandlers();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize error tracking:', error);
    }
  }

  /**
   * Calculate error priority based on category and level
   */
  private calculatePriority(category: ErrorCategory, level: ErrorLevel): 'low' | 'medium' | 'high' | 'critical' {
    const categoryWeights: Record<ErrorCategory, number> = {
      'security': 4,
      'auth': 3,
      'data': 3,
      'api': 2,
      'ui': 1,
      'performance': 2,
      'unknown': 1
    };

    const levelWeights: Record<Exclude<ErrorLevel, 'critical'>, number> = {
      'error': 3,
      'warning': 2,
      'info': 1,
      'debug': 0
    };

    const levelScore = level === 'critical' ? 4 : levelWeights[level as Exclude<ErrorLevel, 'critical'>];
    const score = categoryWeights[category] + levelScore;

    if (score >= 7) return 'critical';
    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  // Overloads to support both calling styles
  async trackError(error: Error | string, context?: Partial<ErrorContext>): Promise<void>;
  async trackError(error: Error | string, category?: ErrorCategory, additionalData?: Record<string, unknown>): Promise<void>;
  async trackError(
    error: Error | string,
    arg2?: Partial<ErrorContext> | ErrorCategory,
    arg3?: Record<string, unknown>
  ): Promise<void> {
    const errorObj = typeof error === 'string' ? new Error(error) : error;

    const baseContext: ErrorContext = await this.buildContext();
    let finalContext: ErrorContext = { ...baseContext };

    if (typeof arg2 === 'string') {
      finalContext.category = arg2;
      if (arg3) {
        finalContext.extra = { ...(finalContext.extra || {}), ...arg3 };
      }
    } else if (arg2) {
      finalContext = { ...finalContext, ...arg2 };
    }

    try {
      // Use existing errorMonitoring service
      errorMonitoring.captureException(errorObj, {
        category: finalContext.category || 'unknown',
        url: finalContext.url,
        userId: finalContext.userId,
        ...finalContext.extra
      });

      // Store in database if available (graceful degradation if table doesn't exist)
      try {
        const { error: dbError } = await supabase
          .from('error_logs')
          .insert({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            level: 'error',
            category: finalContext.category || 'unknown',
            message: errorObj.message,
            stack: errorObj.stack,
            userAgent: finalContext.userAgent || navigator.userAgent,
            url: finalContext.url || window.location.href,
            userId: finalContext.userId,
            sessionId: finalContext.sessionId,
            additionalData: finalContext.extra || null,
            resolved: false,
            priority: this.calculatePriority(finalContext.category || 'unknown', 'error')
          });

        if (dbError && dbError.code !== '42P01') { // Ignore "table doesn't exist" errors
          console.warn('Error tracking database insert failed:', dbError);
        }
      } catch (dbErr) {
        // Database not available or table doesn't exist - continue silently
        // This is expected in some environments
      }
    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
    }
  }

  async trackWarning(message: string, context?: Partial<ErrorContext>): Promise<void>;
  async trackWarning(message: string, category?: ErrorCategory, additionalData?: Record<string, unknown>): Promise<void>;
  async trackWarning(message: string, arg2?: Partial<ErrorContext> | ErrorCategory, arg3?: Record<string, unknown>): Promise<void> {
    const context = typeof arg2 === 'string' ? { category: arg2, extra: arg3 } : arg2;
    await this.trackWithLevel('warning', message, context);
  }

  async trackInfo(message: string, context?: Partial<ErrorContext>): Promise<void>;
  async trackInfo(message: string, category?: ErrorCategory, additionalData?: Record<string, unknown>): Promise<void>;
  async trackInfo(message: string, arg2?: Partial<ErrorContext> | ErrorCategory, arg3?: Record<string, unknown>): Promise<void> {
    const context = typeof arg2 === 'string' ? { category: arg2, extra: arg3 } : arg2;
    await this.trackWithLevel('info', message, context);
  }

  private async trackWithLevel(level: Exclude<ErrorLevel, 'error'>, message: string, context?: Partial<ErrorContext>): Promise<void> {
    const baseContext = await this.buildContext();
    const finalContext: ErrorContext = { ...baseContext, ...context };

    try {
      // Use existing errorMonitoring service
      errorMonitoring.captureMessage(message, level === 'warning' ? 'warning' : 'info', {
        category: finalContext.category || 'unknown',
        url: finalContext.url,
        userId: finalContext.userId,
        ...finalContext.extra
      });

      // Store in database if available
      try {
        const { error: dbError } = await supabase
          .from('error_logs')
          .insert({
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            level,
            category: finalContext.category || 'unknown',
            message,
            userAgent: finalContext.userAgent || navigator.userAgent,
            url: finalContext.url || window.location.href,
            userId: finalContext.userId,
            sessionId: finalContext.sessionId,
            additionalData: finalContext.extra || null,
            resolved: false,
            priority: this.calculatePriority(finalContext.category || 'unknown', level)
          });

        if (dbError && dbError.code !== '42P01') {
          console.warn('Error tracking database insert failed:', dbError);
        }
      } catch (dbErr) {
        // Database not available - continue silently
      }
    } catch (e) {
      console.error('Log tracking failed:', e);
    }
  }

  // Analytics APIs
  async getErrorAnalytics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<ErrorAnalytics> {
    const now = new Date();
    const ranges: Record<'24h' | '7d' | '30d', Date> = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    };
    const startDate = ranges[timeRange];

    try {
      const { data: errors, error } = await supabase
        .from('error_logs')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        // Table might not exist - return empty analytics
        if (error.code === '42P01') {
          return this.getEmptyAnalytics();
        }
        throw error;
      }

      const analytics: ErrorAnalytics = {
        totalErrors: errors?.length || 0,
        errorsByCategory: {},
        errorsByLevel: {},
        errorsByPriority: {},
        recentErrors: (errors || []).slice(0, 10) as ErrorReportRecord[],
        unresolvedErrors: (errors || []).filter((e: any) => !e.resolved) as ErrorReportRecord[]
      };

      (errors || []).forEach((e: any) => {
        analytics.errorsByCategory[e.category] = (analytics.errorsByCategory[e.category] || 0) + 1;
        analytics.errorsByLevel[e.level] = (analytics.errorsByLevel[e.level] || 0) + 1;
        analytics.errorsByPriority[e.priority] = (analytics.errorsByPriority[e.priority] || 0) + 1;
      });

      return analytics;
    } catch (err) {
      console.error('Error fetching error analytics:', err);
      return this.getEmptyAnalytics();
    }
  }

  async getUnresolvedErrors(): Promise<ErrorReportRecord[]> {
    try {
      const { data: errors, error } = await supabase
        .from('error_logs')
        .select('*')
        .eq('resolved', false)
        .order('timestamp', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          return [];
        }
        throw error;
      }
      return (errors as ErrorReportRecord[]) || [];
    } catch (err) {
      console.error('Error fetching unresolved errors:', err);
      return [];
    }
  }

  async markErrorResolved(errorId: string, assignedTo?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('error_logs')
        .update({ resolved: true, assignedTo, resolved_at: new Date().toISOString() })
        .eq('id', errorId);
      
      if (error) {
        if (error.code === '42P01') {
          return; // Table doesn't exist - ignore
        }
        throw error;
      }
    } catch (err) {
      console.error('Error marking error as resolved:', err);
      throw err;
    }
  }

  async assignError(errorId: string, assignedTo: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('error_logs')
        .update({ assignedTo })
        .eq('id', errorId);
      
      if (error) {
        if (error.code === '42P01') {
          return; // Table doesn't exist - ignore
        }
        throw error;
      }
    } catch (err) {
      console.error('Error assigning error:', err);
      throw err;
    }
  }

  private getEmptyAnalytics(): ErrorAnalytics {
    return {
      totalErrors: 0,
      errorsByCategory: {},
      errorsByLevel: {},
      errorsByPriority: {},
      recentErrors: [],
      unresolvedErrors: []
    };
  }

  private async buildContext(): Promise<ErrorContext> {
    try {
      const { data } = await supabase.auth.getUser();
      const user = (data as any)?.user;
      return {
        userId: user?.id,
        sessionId: this.getSessionId(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
        timestamp: new Date(),
        environment: import.meta.env.MODE || 'development',
        release: import.meta.env.VITE_APP_VERSION
      };
    } catch {
      return {
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'node',
        timestamp: new Date(),
        environment: import.meta.env.MODE || 'development',
        release: import.meta.env.VITE_APP_VERSION
      };
    }
  }

  private getSessionId(): string {
    if (typeof sessionStorage === 'undefined') return 'unknown';
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  private setupGlobalHandlers(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.trackError(event.error || event.message, { 
        url: event.filename, 
        extra: { lineno: (event as any).lineno, colno: (event as any).colno } 
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 
        { extra: { promise: (event as any).promise } }
      );
    });
  }
}

// Export singletons
export const errorTracking = ErrorTrackingService.getInstance();
export const errorTrackingService = ErrorTrackingService.getInstance();


