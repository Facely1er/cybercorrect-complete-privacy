/**
 * Input Validation Service
 * Provides comprehensive input validation and sanitization for security
 * Adapted from toolkitv2 for privacy compliance platform
 */

// Check if DOMPurify is available (it's in package-lock but may need to be installed)
let DOMPurify: any = null;
try {
  DOMPurify = require('dompurify');
} catch {
  // DOMPurify not available, will use fallback sanitization
}

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface SanitizationConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
  stripUnknownTags: boolean;
  stripUnknownAttributes: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
}

export interface SecurityValidationResult {
  isSecure: boolean;
  threats: string[];
  recommendations: string[];
  sanitizedValue?: any;
}

class InputValidationService {
  private static instance: InputValidationService;
  
  private readonly DEFAULT_SANITIZATION_CONFIG: SanitizationConfig = {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    stripUnknownTags: true,
    stripUnknownAttributes: true,
  };

  private constructor() {}

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  // Basic validation methods
  validateRequired(value: any, fieldName: string): ValidationResult {
    const isValid = value !== null && value !== undefined && value !== '';
    return {
      isValid,
      errors: isValid ? [] : [`${fieldName} is required`],
    };
  }

  validateEmail(email: string): ValidationResult {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    return {
      isValid,
      errors: isValid ? [] : ['Invalid email format'],
    };
  }

  validateURL(url: string): ValidationResult {
    try {
      const urlObj = new URL(url);
      const isValid = ['http:', 'https:'].includes(urlObj.protocol);
      return {
        isValid,
        errors: isValid ? [] : ['Invalid URL format or protocol'],
      };
    } catch {
      return {
        isValid: false,
        errors: ['Invalid URL format'],
      };
    }
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateLength(value: string, minLength?: number, maxLength?: number): ValidationResult {
    const errors: string[] = [];
    
    if (minLength !== undefined && value.length < minLength) {
      errors.push(`Minimum length is ${minLength} characters`);
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      errors.push(`Maximum length is ${maxLength} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validatePattern(value: string, pattern: RegExp, message: string): ValidationResult {
    const isValid = pattern.test(value);
    return {
      isValid,
      errors: isValid ? [] : [message],
    };
  }

  // Advanced validation methods
  validateObject(obj: any, schema: Record<string, ValidationRule[]>): ValidationResult {
    const errors: string[] = [];
    const sanitizedObj: any = {};

    for (const [field, rules] of Object.entries(schema)) {
      const value = obj[field];
      const fieldErrors: string[] = [];
      let sanitizedValue = value;

      for (const rule of rules) {
        let isValid = true;

        switch (rule.type) {
          case 'required':
            const requiredResult = this.validateRequired(value, field);
            isValid = requiredResult.isValid;
            if (!isValid) fieldErrors.push(rule.message || requiredResult.errors[0]);
            break;

          case 'minLength':
            if (typeof value === 'string') {
              const lengthResult = this.validateLength(value, rule.value);
              isValid = lengthResult.isValid;
              if (!isValid) fieldErrors.push(rule.message || lengthResult.errors[0]);
            }
            break;

          case 'maxLength':
            if (typeof value === 'string') {
              const lengthResult = this.validateLength(value, undefined, rule.value);
              isValid = lengthResult.isValid;
              if (!isValid) fieldErrors.push(rule.message || lengthResult.errors[0]);
            }
            break;

          case 'pattern':
            if (typeof value === 'string' && rule.value instanceof RegExp) {
              const patternResult = this.validatePattern(value, rule.value, rule.message);
              isValid = patternResult.isValid;
              if (!isValid) fieldErrors.push(rule.message);
            }
            break;

          case 'email':
            if (typeof value === 'string') {
              const emailResult = this.validateEmail(value);
              isValid = emailResult.isValid;
              if (!isValid) fieldErrors.push(rule.message || emailResult.errors[0]);
            }
            break;

          case 'url':
            if (typeof value === 'string') {
              const urlResult = this.validateURL(value);
              isValid = urlResult.isValid;
              if (!isValid) fieldErrors.push(rule.message || urlResult.errors[0]);
            }
            break;

          case 'custom':
            if (rule.validator) {
              isValid = rule.validator(value);
              if (!isValid) fieldErrors.push(rule.message);
            }
            break;
        }

        if (!isValid) break; // Stop validation on first error for this field
      }

      if (fieldErrors.length === 0) {
        sanitizedObj[field] = sanitizedValue;
      } else {
        errors.push(...fieldErrors.map(error => `${field}: ${error}`));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: errors.length === 0 ? sanitizedObj : undefined,
    };
  }

  // Sanitization methods
  sanitizeHTML(html: string, config?: Partial<SanitizationConfig>): string {
    if (DOMPurify) {
      const finalConfig = { ...this.DEFAULT_SANITIZATION_CONFIG, ...config };
      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: finalConfig.allowedTags,
        ALLOWED_ATTR: Object.keys(finalConfig.allowedAttributes),
      });
    }
    
    // Fallback sanitization without DOMPurify
    return this.sanitizeString(html);
  }

  sanitizeString(str: string): string {
    // Remove potentially dangerous characters
    return str
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  // Security validation methods
  validateForSecurity(value: any, type: 'input' | 'file' | 'url' | 'html' = 'input'): SecurityValidationResult {
    const threats: string[] = [];
    const recommendations: string[] = [];
    let sanitizedValue = value;

    if (typeof value === 'string') {
      // Check for XSS patterns
      const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(value)) {
          threats.push('Potential XSS attack detected');
          recommendations.push('Sanitize input to remove script tags and event handlers');
          break;
        }
      }

      // Check for SQL injection patterns
      const sqlPatterns = [
        /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
        /(--|\/\*|\*\/|;)/g,
        /(\b(and|or)\b\s+\d+\s*=\s*\d+)/gi,
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(value)) {
          threats.push('Potential SQL injection detected');
          recommendations.push('Use parameterized queries and input validation');
          break;
        }
      }

      // Check for command injection patterns
      const commandPatterns = [
        /[;&|`$(){}[\]]/g,
        /\b(cat|ls|pwd|whoami|id|uname|hostname)\b/gi,
      ];

      for (const pattern of commandPatterns) {
        if (pattern.test(value)) {
          threats.push('Potential command injection detected');
          recommendations.push('Avoid shell command execution and validate input');
          break;
        }
      }

      // Sanitize based on type
      switch (type) {
        case 'html':
          sanitizedValue = this.sanitizeHTML(value);
          break;
        case 'url':
          try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
              threats.push('Invalid URL protocol');
              recommendations.push('Only allow HTTP and HTTPS protocols');
            }
            sanitizedValue = url.toString();
          } catch {
            threats.push('Invalid URL format');
            recommendations.push('Validate URL format before processing');
          }
          break;
        default:
          sanitizedValue = this.sanitizeString(value);
      }
    }

    return {
      isSecure: threats.length === 0,
      threats,
      recommendations,
      sanitizedValue,
    };
  }

  // File validation
  validateFile(file: File, allowedTypes: string[], maxSize: number): ValidationResult {
    const errors: string[] = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      errors.push(`File size exceeds maximum allowed size of ${maxSizeMB}MB`);
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
    
    if (hasDangerousExtension) {
      errors.push('File type is potentially dangerous and not allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Batch validation
  validateBatch(items: any[], validator: (item: any) => ValidationResult): ValidationResult {
    const allErrors: string[] = [];
    const validItems: any[] = [];

    for (let i = 0; i < items.length; i++) {
      const result = validator(items[i]);
      if (result.isValid) {
        validItems.push(result.sanitizedValue || items[i]);
      } else {
        allErrors.push(`Item ${i + 1}: ${result.errors.join(', ')}`);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      sanitizedValue: validItems,
    };
  }

  // Custom validation helpers
  validatePhoneNumber(phone: string): ValidationResult {
    const phonePattern = /^[+]?[1-9][\d]{0,15}$/;
    return this.validatePattern(phone, phonePattern, 'Invalid phone number format');
  }

  validateIPAddress(ip: string): ValidationResult {
    const ipv4Pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    const isValidIPv4 = ipv4Pattern.test(ip);
    const isValidIPv6 = ipv6Pattern.test(ip);
    
    return {
      isValid: isValidIPv4 || isValidIPv6,
      errors: (isValidIPv4 || isValidIPv6) ? [] : ['Invalid IP address format'],
    };
  }
}

export const inputValidationService = InputValidationService.getInstance();

// Common validation schemas
export const commonValidationSchemas = {
  email: {
    required: { type: 'required' as const, message: 'Email is required' },
    format: { type: 'email' as const, message: 'Invalid email format' },
  },
  password: {
    required: { type: 'required' as const, message: 'Password is required' },
    strength: { type: 'custom' as const, message: 'Password does not meet security requirements', validator: (value: string) => {
      return inputValidationService.validatePassword(value).isValid;
    }},
  },
  name: {
    required: { type: 'required' as const, message: 'Name is required' },
    length: { type: 'maxLength' as const, value: 100, message: 'Name must be less than 100 characters' },
  },
  url: {
    format: { type: 'url' as const, message: 'Invalid URL format' },
  },
};


