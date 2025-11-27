import { z } from 'zod';
import { securityService } from '../services/securityService';

// Custom validation functions
const sanitizeString = (value: string) => securityService.sanitizeInput(value) as string;
const sanitizeEmail = (value: string) => securityService.sanitizeEmail(value);
// const sanitizeUrl = (value: string) => securityService.sanitizeUrl(value);

export const dataSubjectRequestSchema = z.object({
  requesterName: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(sanitizeString),
  requesterEmail: z.string()
    .email()
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(sanitizeEmail),
  requesterRelationship: z.enum(['employee', 'job_applicant', 'former_employee', 'representative'], {
    errorMap: () => ({ message: 'Please select your relationship to the employee' })
  }),
  employeeIdentifier: z.string()
    .min(1, 'Employee identifier is required')
    .max(100, 'Identifier too long')
    .regex(/^[a-zA-Z0-9\-_]+$/, 'Identifier contains invalid characters')
    .transform(sanitizeString),
  requestDetails: z.string()
    .min(10, 'Please provide more details')
    .max(2000, 'Details too long')
    .transform(sanitizeString),
  requestType: z.enum(['access', 'rectification', 'erasure', 'portability', 'opt_out', 'directory_opt_out']).optional()
});

export const consentRecordSchema = z.object({
  employeeName: z.string()
    .min(1, 'Employee name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(sanitizeString),
  parentGuardianName: z.string()
    .min(1, 'Parent/guardian name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(sanitizeString),
  parentGuardianEmail: z.string()
    .email()
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(sanitizeEmail),
  consentType: z.string()
    .min(1, 'Consent type is required')
    .max(100, 'Type too long')
    .transform(sanitizeString),
  serviceProvider: z.string()
    .min(1, 'Service provider is required')
    .max(200, 'Provider name too long')
    .transform(sanitizeString),
  consentGiven: z.boolean(),
  purpose: z.enum(['employment_services', 'administrative', 'communications', 'research', 'marketing']),
  applicableRegulations: z.array(z.string().transform(sanitizeString))
    .min(1, 'At least one regulation must be specified')
    .max(10, 'Too many regulations specified')
});

export const privacyIncidentSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title too long')
    .transform(sanitizeString),
  description: z.string()
    .min(10, 'Please provide more details')
    .max(2000, 'Description too long')
    .transform(sanitizeString),
  incidentType: z.enum(['data_breach', 'unauthorized_access', 'data_loss', 'privacy_violation', 'consent_violation']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  affectedIndividualsCount: z.number()
    .min(0, 'Count cannot be negative')
    .max(1000000, 'Count too high'),
  discoveryDate: z.string()
    .min(1, 'Discovery date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  incidentDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  dataTypesAffected: z.array(z.string().transform(sanitizeString))
    .min(1, 'At least one data type must be specified')
    .max(20, 'Too many data types specified')
});

// Additional validation schemas
export const userProfileSchema = z.object({
  fullName: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(sanitizeString),
  email: z.string()
    .email()
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(sanitizeEmail),
  department: z.string()
    .max(100, 'Department name too long')
    .transform(sanitizeString)
    .optional(),
  phone: z.string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),
  address: z.string()
    .max(500, 'Address too long')
    .transform(sanitizeString)
    .optional()
});

export const contactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters')
    .transform(sanitizeString),
  email: z.string()
    .email()
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .transform(sanitizeEmail),
  company: z.string()
    .max(200, 'Company name too long')
    .transform(sanitizeString)
    .optional(),
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject too long')
    .transform(sanitizeString),
  message: z.string()
    .min(10, 'Message is required')
    .max(2000, 'Message too long')
    .transform(sanitizeString),
  phone: z.string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional()
});

export const searchQuerySchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Query too long')
    .transform(sanitizeString),
  filters: z.record(z.string(), z.unknown()).optional(),
  page: z.number().min(1).max(1000).optional(),
  limit: z.number().min(1).max(100).optional()
});

export const fileUploadSchema = z.object({
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Invalid file name characters')
    .transform(sanitizeString),
  fileSize: z.number()
    .min(1, 'File size must be greater than 0')
    .max(10 * 1024 * 1024, 'File size too large (max 10MB)'),
  fileType: z.string()
    .regex(/^[a-zA-Z0-9/-]+$/, 'Invalid file type'),
  content: z.string().optional()
});

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => err.message)
      };
    }
    return {
      success: false,
      errors: ['Validation failed']
    };
  }
}

export function sanitizeFormData<T>(data: Record<string, unknown>): T {
  return securityService.sanitizeInput(data) as T;
}

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s-'.]+$/,
  identifier: /^[a-zA-Z0-9-_]+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  safeString: /^[a-zA-Z0-9\s\-_.]+$/
};

export type DataSubjectRequest = z.infer<typeof dataSubjectRequestSchema>;
export type ConsentRecord = z.infer<typeof consentRecordSchema>;
export type PrivacyIncident = z.infer<typeof privacyIncidentSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
export type ContactForm = z.infer<typeof contactFormSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;