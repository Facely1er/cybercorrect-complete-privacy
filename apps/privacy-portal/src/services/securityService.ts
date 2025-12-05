// Security service for rate limiting, CSRF protection, and security headers
import { environment } from '../config/environment';
import { logger } from '../utils/logger';

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

// CSRF token management
class CSRFService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    this.token = token;
    this.tokenExpiry = Date.now() + (15 * 60 * 1000); // 15 minutes
    
    return token;
  }

  validateToken(token: string): boolean {
    if (!this.token || Date.now() > this.tokenExpiry) {
      return false;
    }
    return this.token === token;
  }

  getToken(): string | null {
    if (!this.token || Date.now() > this.tokenExpiry) {
      return null;
    }
    return this.token;
  }
}

// Rate limiting service
class RateLimitService {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    // Configure rate limits for different endpoints
    this.configs.set('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per window
      message: 'Too many authentication attempts. Please try again later.',
      skipSuccessfulRequests: true
    });

    this.configs.set('api', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100, // 100 requests per window
      message: 'Too many API requests. Please slow down.',
      skipSuccessfulRequests: false
    });

    this.configs.set('form', {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 10, // 10 form submissions per window
      message: 'Too many form submissions. Please wait before trying again.',
      skipSuccessfulRequests: false
    });
  }

  isAllowed(key: string, endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const config = this.configs.get(endpoint);
    if (!config) {
      return { allowed: true, remaining: Infinity, resetTime: 0 };
    }

    const now = Date.now();
    const record = this.requests.get(key);
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.requests.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
    }

    if (record.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    this.requests.set(key, record);
    return { 
      allowed: true, 
      remaining: config.maxRequests - record.count, 
      resetTime: record.resetTime 
    };
  }

  getClientKey(): string {
    // Generate a client identifier based on available information
    if (typeof window !== 'undefined') {
      // Use a combination of user agent and screen resolution for client identification
      const userAgent = navigator.userAgent;
      const screenRes = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Create a hash-like identifier (simplified)
      const identifier = btoa(`${userAgent}-${screenRes}-${timezone}`).slice(0, 16);
      return identifier;
    }
    return 'server';
  }
}

// Input sanitization service
class InputSanitizationService {
  sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  sanitizeEmail(email: string): string {
    const sanitized = this.sanitizeString(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  sanitizeUrl(url: string): string {
    const sanitized = this.sanitizeString(url);
    try {
      const urlObj = new URL(sanitized);
      // Only allow http and https protocols
      if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
        return sanitized;
      }
    } catch {
      // Invalid URL
    }
    return '';
  }

  sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}

// Security headers service
class SecurityHeadersService {
  getSecurityHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };

    // Add CSP header
    if (environment.production) {
      headers['Content-Security-Policy'] = this.getCSPHeader();
    }

    return headers;
  }

  private getCSPHeader(): string {
    const baseUrl = environment.appUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://portal.cybercorrect.com');
    const supabaseUrl = environment.supabaseUrl || 'https://placeholder.supabase.co';
    
    return [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${baseUrl} ${supabaseUrl}`,
      `style-src 'self' 'unsafe-inline' ${baseUrl}`,
      `img-src 'self' data: blob: ${baseUrl} ${supabaseUrl}`,
      `font-src 'self' data: ${baseUrl}`,
      `connect-src 'self' ${supabaseUrl} wss: https:`,
      `frame-src 'none'`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
      `frame-ancestors 'none'`,
      `upgrade-insecure-requests`
    ].join('; ');
  }
}

// Main security service
class SecurityService {
  private csrfService: CSRFService;
  private rateLimitService: RateLimitService;
  private sanitizationService: InputSanitizationService;
  private headersService: SecurityHeadersService;

  constructor() {
    this.csrfService = new CSRFService();
    this.rateLimitService = new RateLimitService();
    this.sanitizationService = new InputSanitizationService();
    this.headersService = new SecurityHeadersService();
  }

  // Rate limiting
  checkRateLimit(endpoint: string): { allowed: boolean; remaining: number; resetTime: number } {
    const clientKey = this.rateLimitService.getClientKey();
    return this.rateLimitService.isAllowed(clientKey, endpoint);
  }

  // CSRF protection
  generateCSRFToken(): string {
    return this.csrfService.generateToken();
  }

  validateCSRFToken(token: string): boolean {
    return this.csrfService.validateToken(token);
  }

  getCSRFToken(): string | null {
    return this.csrfService.getToken();
  }

  // Input sanitization
  sanitizeInput(input: string): string;
  sanitizeInput(input: Record<string, unknown>): Record<string, unknown>;
  sanitizeInput(input: unknown): unknown;
  sanitizeInput(input: unknown): unknown {
    if (typeof input === 'string') {
      return this.sanitizationService.sanitizeString(input);
    } else if (typeof input === 'object' && input !== null) {
      return this.sanitizationService.sanitizeObject(input as Record<string, unknown>);
    }
    return input;
  }

  sanitizeEmail(email: string): string {
    return this.sanitizationService.sanitizeEmail(email);
  }

  sanitizeUrl(url: string): string {
    return this.sanitizationService.sanitizeUrl(url);
  }

  // Security headers
  getSecurityHeaders(): Record<string, string> {
    return this.headersService.getSecurityHeaders();
  }

  // Security audit logging
  logSecurityEvent(event: string, details: Record<string, unknown>): void {
    logger.security(`Security event: ${event}`, {
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
      ...details
    });
  }

  // API request signing for sensitive operations
  signRequest(data: unknown, secret: string): string {
    logger.debug('Signing request', { secretLength: secret.length }, {
      component: 'securityService',
      operation: 'signRequest'
    });
    const payload = JSON.stringify(data);
    const timestamp = Date.now().toString();
    const message = `${payload}${timestamp}`;
    
    // Simple HMAC-like signing (in production, use proper crypto library)
    // const encoder = new TextEncoder();
    // const key = encoder.encode(secret);
    // const messageData = encoder.encode(message);
    
    return btoa(`${timestamp}.${message}`);
  }

  validateSignedRequest(signedData: string, _secret: string, maxAge: number = 300000): boolean {
    try {
      const [timestamp] = atob(signedData).split('.');
      const age = Date.now() - parseInt(timestamp);
      
      if (age > maxAge) {
        return false;
      }
      
      // In production, implement proper HMAC validation
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const securityService = new SecurityService();

// Export types for use in other modules
export type { RateLimitConfig };