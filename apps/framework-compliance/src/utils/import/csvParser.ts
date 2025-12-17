/**
 * CSV Parser Utility
 * Provides CSV parsing and validation for data imports
 */

export interface ParsedCSVData<T = any> {
  data: T[];
  errors: string[];
  warnings: string[];
  rowCount: number;
  validCount: number;
  invalidCount: number;
}

export interface CSVParseOptions {
  headers?: string[];
  delimiter?: string;
  skipEmptyLines?: boolean;
  trimFields?: boolean;
  validateHeaders?: boolean;
}

/**
 * Parse CSV string into structured data
 */
export function parseCSV<T = any>(
  csvContent: string,
  options: CSVParseOptions = {}
): ParsedCSVData<T> {
  const {
    headers,
    delimiter = ',',
    skipEmptyLines = true,
    trimFields = true,
    validateHeaders = true,
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  const data: T[] = [];

  try {
    // Split into lines
    const lines = csvContent.split(/\r?\n/);
    
    if (lines.length === 0) {
      errors.push('CSV file is empty');
      return { data: [], errors, warnings, rowCount: 0, validCount: 0, invalidCount: 0 };
    }

    // Extract headers from first line or use provided headers
    const headerLine = lines[0].trim();
    const csvHeaders = headerLine.split(delimiter).map(h => trimFields ? h.trim() : h);
    
    // Validate headers if expected headers are provided
    if (validateHeaders && headers && headers.length > 0) {
      const missingHeaders = headers.filter(h => !csvHeaders.includes(h));
      if (missingHeaders.length > 0) {
        errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
        return { data: [], errors, warnings, rowCount: 0, validCount: 0, invalidCount: 0 };
      }
    }

    // Parse data rows
    let validCount = 0;
    let invalidCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines if configured
      if (skipEmptyLines && !line) {
        continue;
      }

      try {
        const values = parseCSVLine(line, delimiter);
        
        // Skip if row doesn't have enough values
        if (values.length < csvHeaders.length) {
          warnings.push(`Row ${i + 1}: Incomplete data (${values.length}/${csvHeaders.length} columns)`);
          invalidCount++;
          continue;
        }

        // Create object from headers and values
        const row: any = {};
        csvHeaders.forEach((header, index) => {
          const value = values[index];
          row[header] = trimFields ? value.trim() : value;
        });

        data.push(row as T);
        validCount++;
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
        invalidCount++;
      }
    }

    return {
      data,
      errors,
      warnings,
      rowCount: lines.length - 1, // Exclude header
      validCount,
      invalidCount,
    };
  } catch (error) {
    errors.push(`CSV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return { data: [], errors, warnings, rowCount: 0, validCount: 0, invalidCount: 0 };
  }
}

/**
 * Parse a single CSV line, handling quoted fields with delimiters
 */
function parseCSVLine(line: string, delimiter: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote
        currentValue += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      // Field delimiter
      values.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Add last value
  values.push(currentValue);

  return values;
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
 * Validate CSV file
 */
export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
  const validExtensions = ['.csv', '.txt'];
  
  const hasValidType = validTypes.includes(file.type);
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a CSV file.',
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
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) {
    return '';
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create header row
  const headerRow = csvHeaders.map(h => escapeCSVField(h)).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return csvHeaders.map(header => {
      const value = row[header];
      return escapeCSVField(String(value ?? ''));
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

/**
 * Escape CSV field (handle quotes and delimiters)
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

