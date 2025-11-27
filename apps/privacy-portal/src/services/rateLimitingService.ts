// Rate limiting service for API protection

interface RateLimitRule {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: Request) => string; // Custom key generator
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

class RateLimitingService {
  private rules: Map<string, RateLimitRule> = new Map();
  private counters: Map<string, { count: number; resetTime: number }> = new Map();
  private cleanupInterval?: NodeJS.Timeout;

  constructor() {
    this.setupDefaultRules();
    this.startCleanup();
  }

  private setupDefaultRules(): void {
    // API endpoints rate limiting
    this.addRule('api', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      keyGenerator: (req) => this.getClientIP(req)
    });

    // Authentication endpoints
    this.addRule('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
      keyGenerator: (req) => this.getClientIP(req)
    });

    // Data submission endpoints
    this.addRule('data_submission', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
      keyGenerator: (req) => this.getClientIP(req)
    });

    // File upload endpoints
    this.addRule('file_upload', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 3,
      keyGenerator: (req) => this.getClientIP(req)
    });

    // Password reset
    this.addRule('password_reset', {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3,
      keyGenerator: (req) => this.getClientIP(req)
    });

    // General user actions
    this.addRule('user_actions', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30,
      keyGenerator: (req) => this.getUserId(req) || this.getClientIP(req)
    });
  }

  private getClientIP(request: Request): string {
    // In a real implementation, this would extract the client IP
    // For now, we'll use a combination of headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    return forwarded || realIP || userAgent.substring(0, 20);
  }

  private getUserId(request: Request): string | null {
    // Extract user ID from request headers or JWT token
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        // In a real implementation, decode JWT to get user ID
        // For now, return a placeholder
        return `user_${token.substring(0, 10)}`;
    } catch {
      return null;
    }
    }
    return null;
  }

  addRule(name: string, rule: RateLimitRule): void {
    this.rules.set(name, rule);
  }

  removeRule(name: string): void {
    this.rules.delete(name);
  }

  checkRateLimit(ruleName: string, request: Request): RateLimitResult {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      return { allowed: true, remaining: Infinity, resetTime: Date.now() };
    }

    const key = rule.keyGenerator ? rule.keyGenerator(request) : 'default';
    const now = Date.now();
    
    // Clean up old entries
    this.cleanupCounters(now - rule.windowMs);

    const counterKey = `${ruleName}:${key}`;
    const counter = this.counters.get(counterKey);

    if (!counter || counter.resetTime <= now) {
      // Create new counter
      const newCounter = {
        count: 1,
        resetTime: now + rule.windowMs
      };
      this.counters.set(counterKey, newCounter);
      
      return {
        allowed: true,
        remaining: rule.maxRequests - 1,
        resetTime: newCounter.resetTime
      };
    }

    if (counter.count >= rule.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: counter.resetTime,
        retryAfter: Math.ceil((counter.resetTime - now) / 1000)
      };
    }

    // Increment counter
    counter.count++;
    this.counters.set(counterKey, counter);

    return {
      allowed: true,
      remaining: rule.maxRequests - counter.count,
      resetTime: counter.resetTime
    };
  }

  private cleanupCounters(before: number): void {
    for (const [key, counter] of this.counters.entries()) {
      if (counter.resetTime <= before) {
        this.counters.delete(key);
      }
    }
  }

  private startCleanup(): void {
    // Clean up expired counters every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      this.cleanupCounters(now - 5 * 60 * 1000);
    }, 5 * 60 * 1000);
  }

  // Client-side rate limiting for UI actions
  private clientCounters: Map<string, { count: number; resetTime: number }> = new Map();

  checkClientRateLimit(action: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    
    // Clean up old client counters
    for (const [key, counter] of this.clientCounters.entries()) {
      if (counter.resetTime <= now) {
        this.clientCounters.delete(key);
      }
    }

    const counter = this.clientCounters.get(action);
    
    if (!counter || counter.resetTime <= now) {
      this.clientCounters.set(action, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (counter.count >= maxRequests) {
      return false;
    }

    counter.count++;
    this.clientCounters.set(action, counter);
    return true;
  }

  // Rate limiting middleware for API calls
  async withRateLimit<T>(
    ruleName: string, 
    request: Request, 
    apiCall: () => Promise<T>
  ): Promise<{ success: boolean; data?: T; error?: string; rateLimitInfo?: RateLimitResult }> {
    const rateLimitResult = this.checkRateLimit(ruleName, request);
    
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: 'Rate limit exceeded',
        rateLimitInfo: rateLimitResult
      };
    }

    try {
      const data = await apiCall();
      return { success: true, data, rateLimitInfo: rateLimitResult };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        rateLimitInfo: rateLimitResult
      };
    }
  }

  // Get rate limit status for a specific rule and key
  getRateLimitStatus(ruleName: string, key: string): RateLimitResult {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      return { allowed: true, remaining: Infinity, resetTime: Date.now() };
    }

    const counterKey = `${ruleName}:${key}`;
    const counter = this.counters.get(counterKey);
    const now = Date.now();

    if (!counter || counter.resetTime <= now) {
      return {
        allowed: true,
        remaining: rule.maxRequests,
        resetTime: now + rule.windowMs
      };
    }

    return {
      allowed: counter.count < rule.maxRequests,
      remaining: Math.max(0, rule.maxRequests - counter.count),
      resetTime: counter.resetTime
    };
  }

  // Cleanup method
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.counters.clear();
    this.clientCounters.clear();
  }
}

// Create singleton instance
export const rateLimitingService = new RateLimitingService();

// Export types
export type { RateLimitRule, RateLimitResult };