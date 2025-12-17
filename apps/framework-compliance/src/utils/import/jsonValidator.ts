/**
 * JSON Validator Utility
 * Provides JSON parsing and validation for data imports
 */

export interface ParsedJSONData<T = Record<string, unknown>> {
  data: T[];
  errors: string[];
  warnings: string[];
  validCount: number;
  invalidCount: number;
}

export interface JSONValidateOptions<T = Record<string, unknown>> {
  required?: (keyof T)[];
  schema?: Record<string, (value: unknown) => boolean>;
  transformKeys?: boolean;
  allowExtraFields?: boolean;
}

/**
 * Parse and validate JSON string
 */
export function parseJSON<T = Record<string, unknown>>(
  jsonContent: string,
  options: JSONValidateOptions<T> = {}
): ParsedJSONData<T> {
  const { required = [], schema = {}, transformKeys = true, allowExtraFields = true } = options;
  const errors: string[] = [];
  const warnings: string[] = [];
  const data: T[] = [];

  try {
    const parsed = JSON.parse(jsonContent);

    // Handle both single object and array of objects
    const items = Array.isArray(parsed) ? parsed : [parsed];

    let validCount = 0;
    let invalidCount = 0;

    items.forEach((item, index) => {
      const itemErrors: string[] = [];

      // Validate required fields
      required.forEach((field) => {
        if (!(field in item) || item[field] === null || item[field] === undefined || item[field] === '') {
          itemErrors.push(`Missing required field: ${String(field)}`);
        }
      });

      // Validate against schema
      Object.entries(schema).forEach(([key, validator]) => {
        if (key in item) {
          try {
            if (!validator(item[key])) {
              itemErrors.push(`Invalid value for field: ${key}`);
            }
          } catch (error) {
            itemErrors.push(`Validation error for ${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      });

      // Check for extra fields if not allowed
      if (!allowExtraFields) {
        const allowedFields = [...required.map(String), ...Object.keys(schema)];
        const extraFields = Object.keys(item).filter(key => !allowedFields.includes(key));
        if (extraFields.length > 0) {
          warnings.push(`Item ${index + 1}: Extra fields found: ${extraFields.join(', ')}`);
        }
      }

      if (itemErrors.length > 0) {
        errors.push(`Item ${index + 1}: ${itemErrors.join(', ')}`);
        invalidCount++;
      } else {
        // Transform keys if needed (e.g., snake_case to camelCase)
        const transformedItem = transformKeys ? transformObjectKeys(item) : item;
        data.push(transformedItem as T);
        validCount++;
      }
    });

    return {
      data,
      errors,
      warnings,
      validCount,
      invalidCount,
    };
  } catch (error) {
    errors.push(`JSON parsing failed: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
    return { data: [], errors, warnings, validCount: 0, invalidCount: 0 };
  }
}

/**
 * Transform object keys (e.g., snake_case to camelCase)
 */
function transformObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(transformObjectKeys);
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = transformObjectKeys((obj as Record<string, unknown>)[key]);
      return acc;
    }, {} as Record<string, unknown>);
  }

  return obj;
}

/**
 * Convert snake_case to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Read file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate JSON file
 */
export function validateJSONFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['application/json', 'text/plain'];
  const validExtensions = ['.json', '.txt'];

  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JSON file.',
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 10MB.',
    };
  }

  return { valid: true };
}

/**
 * Common field validators
 */
export const validators = {
  isString: (value: unknown): boolean => typeof value === 'string',
  isNumber: (value: unknown): boolean => typeof value === 'number' && !isNaN(value),
  isBoolean: (value: unknown): boolean => typeof value === 'boolean',
  isArray: (value: unknown): boolean => Array.isArray(value),
  isEmail: (value: unknown): boolean => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  isDate: (value: unknown): boolean => typeof value === 'string' && !isNaN(Date.parse(value)),
  isURL: (value: unknown): boolean => {
    try {
      new URL(value as string);
      return true;
    } catch {
      return false;
    }
  },
  oneOf: (allowedValues: unknown[]) => (value: unknown): boolean => allowedValues.includes(value),
  minLength: (min: number) => (value: unknown): boolean => typeof value === 'string' && value.length >= min,
  maxLength: (max: number) => (value: unknown): boolean => typeof value === 'string' && value.length <= max,
};

