// Security hooks for React components
import { useState, useEffect, useCallback } from 'react';
import { securityService } from '../services/securityService';

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

interface SecurityHookReturn {
  // Rate limiting
  checkRateLimit: (endpoint: string) => RateLimitStatus;
  isRateLimited: (endpoint: string) => boolean;
  
  // CSRF protection
  csrfToken: string | null;
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  
  // Input sanitization
  sanitizeInput: (input: unknown) => unknown;
  sanitizeEmail: (email: string) => string;
  sanitizeUrl: (url: string) => string;
  
  // Security logging
  logSecurityEvent: (event: string, details: Record<string, unknown>) => void;
  
  // Request signing
  signRequest: (data: unknown, secret: string) => string;
  validateSignedRequest: (signedData: string, secret: string, maxAge?: number) => boolean;
}

export function useSecurity(): SecurityHookReturn {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Initialize CSRF token
  useEffect(() => {
    const token = securityService.generateCSRFToken();
    setCsrfToken(token);
  }, []);

  const checkRateLimit = useCallback((endpoint: string): RateLimitStatus => {
    return securityService.checkRateLimit(endpoint);
  }, []);

  const isRateLimited = useCallback((endpoint: string): boolean => {
    const status = securityService.checkRateLimit(endpoint);
    return !status.allowed;
  }, []);

  const generateCSRFToken = useCallback((): string => {
    const token = securityService.generateCSRFToken();
    setCsrfToken(token);
    return token;
  }, []);

  const validateCSRFToken = useCallback((token: string): boolean => {
    return securityService.validateCSRFToken(token);
  }, []);

  const sanitizeInput = useCallback((input: unknown) => {
    return securityService.sanitizeInput(input);
  }, []);

  const sanitizeEmail = useCallback((email: string): string => {
    return securityService.sanitizeEmail(email);
  }, []);

  const sanitizeUrl = useCallback((url: string): string => {
    return securityService.sanitizeUrl(url);
  }, []);

  const logSecurityEvent = useCallback((event: string, details: Record<string, unknown>) => {
    securityService.logSecurityEvent(event, details);
  }, []);

  const signRequest = useCallback((data: unknown, secret: string): string => {
    return securityService.signRequest(data, secret);
  }, []);

  const validateSignedRequest = useCallback((signedData: string, secret: string, maxAge?: number): boolean => {
    return securityService.validateSignedRequest(signedData, secret, maxAge);
  }, []);

  return {
    checkRateLimit,
    isRateLimited,
    csrfToken,
    generateCSRFToken,
    validateCSRFToken,
    sanitizeInput,
    sanitizeEmail,
    sanitizeUrl,
    logSecurityEvent,
    signRequest,
    validateSignedRequest
  };
}

// Hook for form security
export function useFormSecurity() {
  const { csrfToken, generateCSRFToken, validateCSRFToken, sanitizeInput, logSecurityEvent } = useSecurity();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const secureSubmit = useCallback(async (
    submitFn: () => Promise<unknown>,
    formData: Record<string, unknown>
  ) => {
    if (isSubmitting) {
      return { success: false, error: 'Form is already being submitted' };
    }

    setIsSubmitting(true);
    
    try {
      // Sanitize form data
      const sanitizedData = sanitizeInput(formData);
      
      // Log form submission attempt
      logSecurityEvent('form_submission_attempt', {
        formType: 'user_form',
        hasData: Object.keys(sanitizedData).length > 0
      });

      // Execute the actual submit function
      const result = await submitFn();
      
      // Log successful submission
      logSecurityEvent('form_submission_success', {
        formType: 'user_form'
      });

      return { success: true, data: result };
    } catch (error) {
      // Log failed submission
      logSecurityEvent('form_submission_failure', {
        formType: 'user_form',
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Submission failed' 
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, sanitizeInput, logSecurityEvent]);

  return {
    csrfToken,
    generateCSRFToken,
    validateCSRFToken,
    sanitizeInput,
    secureSubmit,
    isSubmitting
  };
}

// Hook for API security
export function useAPISecurity() {
  const { 
    checkRateLimit, 
    isRateLimited, 
    sanitizeInput, 
    logSecurityEvent, 
    signRequest, 
    validateSignedRequest 
  } = useSecurity();

  const secureAPICall = useCallback(async (
    apiCall: () => Promise<unknown>,
    endpoint: string,
    data?: unknown
  ) => {
    // Check rate limiting
    const rateLimitStatus = checkRateLimit(endpoint);
    if (!rateLimitStatus.allowed) {
      logSecurityEvent('rate_limit_exceeded', {
        endpoint,
        remaining: rateLimitStatus.remaining,
        resetTime: rateLimitStatus.resetTime
      });
      
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    // Sanitize data if provided
    const sanitizedData = data ? sanitizeInput(data) : undefined;

    try {
      // Log API call attempt
      logSecurityEvent('api_call_attempt', {
        endpoint,
        hasData: !!sanitizedData
      });

      const result = await apiCall();
      
      // Log successful API call
      logSecurityEvent('api_call_success', {
        endpoint,
        remaining: rateLimitStatus.remaining
      });

      return result;
    } catch (error) {
      // Log failed API call
      logSecurityEvent('api_call_failure', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }, [checkRateLimit, sanitizeInput, logSecurityEvent]);

  return {
    secureAPICall,
    isRateLimited,
    checkRateLimit,
    signRequest,
    validateSignedRequest
  };
}