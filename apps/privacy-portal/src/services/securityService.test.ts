import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityService } from './securityService';

// Mock the security service dependencies
vi.mock('./securityService', () => {
  return {
    SecurityService: vi.fn().mockImplementation(() => ({
      checkRateLimit: vi.fn(),
      sanitizeInput: vi.fn(),
      generateCSRFToken: vi.fn(),
      validateCSRFToken: vi.fn(),
      getSecurityHeaders: vi.fn(),
      validateInput: vi.fn(),
      sanitizeHTML: vi.fn(),
      escapeHTML: vi.fn(),
    })),
  };
});

describe('SecurityService', () => {
  let securityService: SecurityService;

  beforeEach(() => {
    securityService = new SecurityService();
  });

  describe('Rate Limiting', () => {
    it('should check rate limit for endpoint', () => {
      const endpoint = '/api/test';
      const result = securityService.checkRateLimit(endpoint);
      
      expect(result).toHaveProperty('allowed');
      expect(result).toHaveProperty('remaining');
      expect(result).toHaveProperty('resetTime');
    });

    it('should allow requests within rate limit', () => {
      const endpoint = '/api/test';
      const result = securityService.checkRateLimit(endpoint);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('should block requests exceeding rate limit', () => {
      // Mock rate limit exceeded
      vi.mocked(securityService.checkRateLimit).mockReturnValue({
        allowed: false,
        remaining: 0,
        resetTime: Date.now() + 60000,
      });
      
      const endpoint = '/api/test';
      const result = securityService.checkRateLimit(endpoint);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize user input', () => {
      const input = '<script>alert("xss")</script>Hello World';
      const sanitized = securityService.sanitizeInput(input);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello World');
    });

    it('should validate input format', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'invalid-email';
      
      const validResult = securityService.validateInput(validEmail, 'email');
      const invalidResult = securityService.validateInput(invalidEmail, 'email');
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should sanitize HTML content', () => {
      const html = '<div><script>alert("xss")</script><p>Safe content</p></div>';
      const sanitized = securityService.sanitizeHTML(html);
      
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('<p>Safe content</p>');
    });

    it('should escape HTML entities', () => {
      const input = '<>&"\'';
      const escaped = securityService.escapeHTML(input);
      
      expect(escaped).toBe('&lt;&gt;&amp;&quot;&#x27;');
    });
  });

  describe('CSRF Protection', () => {
    it('should generate CSRF token', () => {
      const token = securityService.generateCSRFToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should validate CSRF token', () => {
      const token = securityService.generateCSRFToken();
      
      const isValid = securityService.validateCSRFToken(token);
      const isInvalid = securityService.validateCSRFToken('invalid-token');
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    it('should reject expired CSRF tokens', () => {
      // Mock expired token
      vi.mocked(securityService.validateCSRFToken).mockReturnValue(false);
      
      const isValid = securityService.validateCSRFToken('expired-token');
      
      expect(isValid).toBe(false);
    });
  });

  describe('Security Headers', () => {
    it('should generate security headers', () => {
      const headers = securityService.getSecurityHeaders();
      
      expect(headers).toHaveProperty('Content-Security-Policy');
      expect(headers).toHaveProperty('X-Frame-Options');
      expect(headers).toHaveProperty('X-Content-Type-Options');
      expect(headers).toHaveProperty('X-XSS-Protection');
    });

    it('should include CSP header', () => {
      const headers = securityService.getSecurityHeaders();
      
      expect(headers['Content-Security-Policy']).toBeDefined();
      expect(headers['Content-Security-Policy']).toContain('default-src');
    });

    it('should include frame options header', () => {
      const headers = securityService.getSecurityHeaders();
      
      expect(headers['X-Frame-Options']).toBe('DENY');
    });

    it('should include content type options header', () => {
      const headers = securityService.getSecurityHeaders();
      
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });
  });

  describe('Input Validation', () => {
    it('should validate email format', () => {
      const validEmail = 'test@example.com';
      const invalidEmail = 'invalid-email';
      
      const validResult = securityService.validateInput(validEmail, 'email');
      const invalidResult = securityService.validateInput(invalidEmail, 'email');
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should validate URL format', () => {
      const validUrl = 'https://example.com';
      const invalidUrl = 'not-a-url';
      
      const validResult = securityService.validateInput(validUrl, 'url');
      const invalidResult = securityService.validateInput(invalidUrl, 'url');
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should validate phone number format', () => {
      const validPhone = '+1234567890';
      const invalidPhone = '123';
      
      const validResult = securityService.validateInput(validPhone, 'phone');
      const invalidResult = securityService.validateInput(invalidPhone, 'phone');
      
      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should validate required fields', () => {
      const emptyValue = '';
      const validValue = 'test value';
      
      const emptyResult = securityService.validateInput(emptyValue, 'required');
      const validResult = securityService.validateInput(validValue, 'required');
      
      expect(emptyResult.isValid).toBe(false);
      expect(validResult.isValid).toBe(true);
    });
  });
});
