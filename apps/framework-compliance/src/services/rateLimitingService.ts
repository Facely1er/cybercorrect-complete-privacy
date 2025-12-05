/**
 * Rate Limiting Service
 * Provides API protection through configurable rate limits
 * Adapted from toolkitv2 for privacy compliance platform
 */

import { supabase } from '../lib/supabase';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (userId?: string, ip?: string) => string;
}

export interface RateLimitInfo {
  remaining: number;
  resetTime: Date;
  limit: number;
  current: number;
}

export interface RateLimitViolation {
  userId?: string;
  ip: string;
  endpoint: string;
  timestamp: Date;
  userAgent: string;
  blocked: boolean;
}

class RateLimitingService {
  private static instance: RateLimitingService;
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  };

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): RateLimitingService {
    if (!RateLimitingService.instance) {
      RateLimitingService.instance = new RateLimitingService();
    }
    return RateLimitingService.instance;
  }

  private generateKey(userId?: string, ip?: string, endpoint?: string): string {
    const userKey = userId || 'anonymous';
    const ipKey = ip || 'unknown';
    const endpointKey = endpoint || 'general';
    return `${userKey}:${ipKey}:${endpointKey}`;
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real implementation, you'd get this from your server
      return '127.0.0.1';
    } catch {
      return 'unknown';
    }
  }

  async checkRateLimit(
    endpoint: string,
    config?: Partial<RateLimitConfig>
  ): Promise<{ allowed: boolean; info: RateLimitInfo }> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    const userId = await this.getCurrentUserId();
    const ip = await this.getClientIP();
    const key = finalConfig.keyGenerator?.(userId, ip) || this.generateKey(userId, ip, endpoint);

    const now = Date.now();
    const windowStart = now - finalConfig.windowMs;

    // Get current count from memory
    const current = this.requestCounts.get(key);
    
    if (current && current.resetTime > now) {
      // Still in current window
      const remaining = Math.max(0, finalConfig.maxRequests - current.count);
      const allowed = remaining > 0;

      if (allowed) {
        current.count++;
      }

      return {
        allowed,
        info: {
          remaining,
          resetTime: new Date(current.resetTime),
          limit: finalConfig.maxRequests,
          current: current.count,
        },
      };
    } else {
      // New window or expired
      const resetTime = now + finalConfig.windowMs;
      this.requestCounts.set(key, { count: 1, resetTime });

      return {
        allowed: true,
        info: {
          remaining: finalConfig.maxRequests - 1,
          resetTime: new Date(resetTime),
          limit: finalConfig.maxRequests,
          current: 1,
        },
      };
    }
  }

  async recordRequest(
    endpoint: string,
    success: boolean,
    config?: Partial<RateLimitConfig>
  ): Promise<void> {
    const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
    
    // Skip recording based on config
    if (success && finalConfig.skipSuccessfulRequests) return;
    if (!success && finalConfig.skipFailedRequests) return;

    const userId = await this.getCurrentUserId();
    const ip = await this.getClientIP();
    const key = finalConfig.keyGenerator?.(userId, ip) || this.generateKey(userId, ip, endpoint);

    const current = this.requestCounts.get(key);
    if (current) {
      current.count++;
    }
  }

  async handleRateLimitViolation(
    endpoint: string,
    userId?: string,
    ip?: string
  ): Promise<void> {
    const violation: RateLimitViolation = {
      userId,
      ip: ip || await this.getClientIP(),
      endpoint,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      blocked: true,
    };

    try {
      const { error } = await supabase
        .from('rate_limit_violations')
        .insert(violation);

      if (error && error.code !== '42P01') { // Ignore "table doesn't exist"
        console.warn('Failed to log rate limit violation:', error);
      }
    } catch (error) {
      // Database not available - continue silently
    }
  }

  async getRateLimitAnalytics(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<{
    totalViolations: number;
    violationsByEndpoint: Record<string, number>;
    violationsByUser: Record<string, number>;
    recentViolations: RateLimitViolation[];
  }> {
    const now = new Date();
    const timeRanges = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    };

    const startDate = timeRanges[timeRange];

    try {
      const { data: violations, error } = await supabase
        .from('rate_limit_violations')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          return {
            totalViolations: 0,
            violationsByEndpoint: {},
            violationsByUser: {},
            recentViolations: [],
          };
        }
        throw error;
      }

      const analytics = {
        totalViolations: violations?.length || 0,
        violationsByEndpoint: {} as Record<string, number>,
        violationsByUser: {} as Record<string, number>,
        recentViolations: (violations || []).slice(0, 10) as RateLimitViolation[],
      };

      (violations || []).forEach((violation: any) => {
        analytics.violationsByEndpoint[violation.endpoint] = 
          (analytics.violationsByEndpoint[violation.endpoint] || 0) + 1;
        
        if (violation.userId) {
          analytics.violationsByUser[violation.userId] = 
            (analytics.violationsByUser[violation.userId] || 0) + 1;
        }
      });

      return analytics;
    } catch (error) {
      console.error('Error fetching rate limit analytics:', error);
      return {
        totalViolations: 0,
        violationsByEndpoint: {},
        violationsByUser: {},
        recentViolations: [],
      };
    }
  }

  private async getCurrentUserId(): Promise<string | undefined> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.id;
    } catch {
      return undefined;
    }
  }

  private startCleanupInterval(): void {
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, data] of this.requestCounts.entries()) {
        if (data.resetTime < now) {
          this.requestCounts.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Reset rate limits for testing
  resetRateLimits(): void {
    this.requestCounts.clear();
  }

  // Get current rate limit status for debugging
  getCurrentStatus(): Map<string, { count: number; resetTime: number }> {
    return new Map(this.requestCounts);
  }
}

export const rateLimitingService = RateLimitingService.getInstance();

// Rate limiting middleware for API calls
export const withRateLimit = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  endpoint: string,
  config?: Partial<RateLimitConfig>
) => {
  return async (...args: T): Promise<R> => {
    const { allowed, info } = await rateLimitingService.checkRateLimit(endpoint, config);
    
    if (!allowed) {
      await rateLimitingService.handleRateLimitViolation(endpoint);
      throw new Error(`Rate limit exceeded. Try again after ${info.resetTime.toLocaleString()}`);
    }

    try {
      const result = await fn(...args);
      await rateLimitingService.recordRequest(endpoint, true, config);
      return result;
    } catch (error) {
      await rateLimitingService.recordRequest(endpoint, false, config);
      throw error;
    }
  };
};

