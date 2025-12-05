/**
 * Form Validation Utilities
 * Reusable validation functions for consistent form error handling across the platform
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FieldValidators {
  [fieldName: string]: (value: any) => ValidationResult;
}

/**
 * Required field validator
 */
export const required = (fieldName: string = 'This field') => (value: any): ValidationResult => {
  const stringValue = typeof value === 'string' ? value.trim() : String(value || '');

  if (!stringValue) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }

  return { isValid: true };
};

/**
 * Email format validator (RFC 5322 simplified)
 */
export const email = (value: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: true }; // Empty is valid, use required() separately if needed
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address'
    };
  }

  return { isValid: true };
};

/**
 * Minimum length validator
 */
export const minLength = (min: number, fieldName: string = 'This field') => (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true }; // Empty is valid, use required() separately if needed
  }

  if (value.trim().length < min) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${min} characters`
    };
  }

  return { isValid: true };
};

/**
 * Maximum length validator
 */
export const maxLength = (max: number, fieldName: string = 'This field') => (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true };
  }

  if (value.length > max) {
    return {
      isValid: false,
      error: `${fieldName} must not exceed ${max} characters`
    };
  }

  return { isValid: true };
};

/**
 * Pattern validator (custom regex)
 */
export const pattern = (regex: RegExp, errorMessage: string) => (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true };
  }

  if (!regex.test(value)) {
    return {
      isValid: false,
      error: errorMessage
    };
  }

  return { isValid: true };
};

/**
 * Combine multiple validators
 */
export const combine = (...validators: ((value: any) => ValidationResult)[]): ((value: any) => ValidationResult) => {
  return (value: any): ValidationResult => {
    for (const validator of validators) {
      const result = validator(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  };
};

/**
 * Validate an entire form object
 */
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validators: { [K in keyof T]?: (value: T[K]) => ValidationResult }
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const field in validators) {
    const validator = validators[field];
    if (validator) {
      const result = validator(formData[field]);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
      }
    }
  }

  return { isValid, errors };
};

/**
 * Name validator (letters, spaces, hyphens, apostrophes)
 */
export const name = (fieldName: string = 'Name') => (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true };
  }

  const nameRegex = /^[a-zA-Z\s\-']+$/;

  if (!nameRegex.test(value)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
    };
  }

  return { isValid: true };
};

/**
 * URL validator
 */
export const url = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: true };
  }

  try {
    new URL(value);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
};

/**
 * Date validator (checks if date is valid and optionally in range)
 */
export const date = (options?: { min?: Date; max?: Date; futureOnly?: boolean; pastOnly?: boolean }) => (
  value: string
): ValidationResult => {
  if (!value) {
    return { isValid: true };
  }

  const dateValue = new Date(value);

  if (isNaN(dateValue.getTime())) {
    return {
      isValid: false,
      error: 'Please enter a valid date'
    };
  }

  if (options?.futureOnly && dateValue < new Date()) {
    return {
      isValid: false,
      error: 'Date must be in the future'
    };
  }

  if (options?.pastOnly && dateValue > new Date()) {
    return {
      isValid: false,
      error: 'Date must be in the past'
    };
  }

  if (options?.min && dateValue < options.min) {
    return {
      isValid: false,
      error: `Date must be after ${options.min.toLocaleDateString()}`
    };
  }

  if (options?.max && dateValue > options.max) {
    return {
      isValid: false,
      error: `Date must be before ${options.max.toLocaleDateString()}`
    };
  }

  return { isValid: true };
};

/**
 * Number range validator
 */
export const numberRange = (min?: number, max?: number) => (value: number | string): ValidationResult => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: true };
  }

  const numValue = typeof value === 'number' ? value : parseFloat(value);

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: 'Please enter a valid number'
    };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `Value must be at least ${min}`
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `Value must not exceed ${max}`
    };
  }

  return { isValid: true };
};
