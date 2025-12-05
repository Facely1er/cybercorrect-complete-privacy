/**
 * RoPA Service - Records of Processing Activities (GDPR Article 30)
 * 
 * This service handles CRUD operations, validation, and export functionality
 * for Records of Processing Activities (RoPA) / GDPR Article 30 compliance.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';
import { secureStorage } from '../utils/storage';
import { generateGdprMappingPdf } from '../utils/pdf';

export interface ProcessingActivity {
  id?: string;
  name: string;
  description?: string;
  purpose: string;
  legalBasis: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  dataTypes: string[];
  dataSubjects: string[];
  recipients: string[];
  thirdCountryTransfers?: string[];
  retentionPeriod: string;
  securityMeasures?: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dpiaRequired?: boolean;
  dpiaId?: string;
  applicableRegulations?: string[];
  dataController: string;
  dataProcessor?: string;
  processingLocation?: string;
  automatedDecisionMaking?: boolean;
  profiling?: boolean;
  status?: 'active' | 'inactive' | 'archived' | 'under_review';
  lastReviewedDate?: string;
  nextReviewDate?: string;
  createdBy: string;
  updatedBy?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoPAValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a processing activity
 */
export function validateProcessingActivity(activity: Partial<ProcessingActivity>): RoPAValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!activity.name || activity.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!activity.purpose || activity.purpose.trim().length === 0) {
    errors.push('Purpose is required');
  }

  if (!activity.legalBasis) {
    errors.push('Legal basis is required');
  }

  if (!activity.retentionPeriod || activity.retentionPeriod.trim().length === 0) {
    errors.push('Retention period is required');
  }

  if (!activity.dataController || activity.dataController.trim().length === 0) {
    errors.push('Data controller is required');
  }

  if (!activity.createdBy || activity.createdBy.trim().length === 0) {
    errors.push('Created by is required');
  }

  // Data types validation
  if (!activity.dataTypes || activity.dataTypes.length === 0) {
    warnings.push('No data types specified. Consider adding data types for better compliance tracking.');
  }

  // Data subjects validation
  if (!activity.dataSubjects || activity.dataSubjects.length === 0) {
    warnings.push('No data subjects specified. Consider adding data subjects for better compliance tracking.');
  }

  // Risk level validation
  if (activity.riskLevel === 'high' || activity.riskLevel === 'critical') {
    if (!activity.dpiaRequired) {
      warnings.push('High or critical risk activities typically require a DPIA. Consider creating a DPIA.');
    }
  }

  // Retention period validation (basic check)
  if (activity.retentionPeriod) {
    const retentionLower = activity.retentionPeriod.toLowerCase();
    if (retentionLower.includes('indefinite') || retentionLower.includes('permanent')) {
      warnings.push('Indefinite retention periods may not comply with GDPR data minimization principles.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get all processing activities for the current user
 */
export async function getProcessingActivities(): Promise<ProcessingActivity[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage if not authenticated
      const localData = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
      return localData || [];
    }

    const { data, error } = await supabase
      .from('cc_privacy_processing_activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform database format to application format
    return data.map(transformFromDb);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get processing activities'), {
      context: 'ropa_get_activities',
    });
    
    // Fallback to localStorage
    const localData = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
    return localData || [];
  }
}

/**
 * Get a single processing activity by ID
 */
export async function getProcessingActivity(id: string): Promise<ProcessingActivity | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
      return activities.find(a => a.id === id) || null;
    }

    const { data, error } = await supabase
      .from('cc_privacy_processing_activities')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get processing activity'), {
      context: 'ropa_get_activity',
      activityId: id,
    });
    
    // Fallback to localStorage
    const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
    return activities.find(a => a.id === id) || null;
  }
}

/**
 * Create a new processing activity
 */
export async function createProcessingActivity(activity: Omit<ProcessingActivity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProcessingActivity> {
  // Validate
  const validation = validateProcessingActivity(activity);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  try {
    const { user } = await getCurrentUser();
    
    const newActivity: ProcessingActivity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
      activities.push(newActivity);
      secureStorage.setItem('gdpr_activities', activities);
      return newActivity;
    }

    // Transform to database format
    const dbRecord = transformToDb(newActivity, user.id);

    const { data, error } = await supabase
      .from('cc_privacy_processing_activities')
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also save to localStorage as backup
    const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
    activities.push(transformFromDb(data));
    secureStorage.setItem('gdpr_activities', activities);

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to create processing activity'), {
      context: 'ropa_create_activity',
    });
    throw err;
  }
}

/**
 * Update an existing processing activity
 */
export async function updateProcessingActivity(
  id: string,
  updates: Partial<Omit<ProcessingActivity, 'id' | 'createdAt'>>,
): Promise<ProcessingActivity> {
  // Validate if we have enough data
  if (updates.name || updates.purpose || updates.legalBasis) {
    const existing = await getProcessingActivity(id);
    if (existing) {
      const validation = validateProcessingActivity({ ...existing, ...updates });
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }
  }

  try {
    const { user } = await getCurrentUser();
    
    const updatedActivity: Partial<ProcessingActivity> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
      const index = activities.findIndex(a => a.id === id);
      if (index === -1) {
        throw new Error('Processing activity not found');
      }
      activities[index] = { ...activities[index], ...updatedActivity };
      secureStorage.setItem('gdpr_activities', activities);
      return activities[index];
    }

    // Transform to database format
    const dbUpdates = transformToDb(updatedActivity as ProcessingActivity, user.id, true);

    const { data, error } = await supabase
      .from('cc_privacy_processing_activities')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also update localStorage
    const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) {
      activities[index] = transformFromDb(data);
      secureStorage.setItem('gdpr_activities', activities);
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to update processing activity'), {
      context: 'ropa_update_activity',
      activityId: id,
    });
    throw err;
  }
}

/**
 * Delete a processing activity
 */
export async function deleteProcessingActivity(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
      const filtered = activities.filter(a => a.id !== id);
      secureStorage.setItem('gdpr_activities', filtered);
      return;
    }

    const { error } = await supabase
      .from('cc_privacy_processing_activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Also remove from localStorage
    const activities = secureStorage.getItem<ProcessingActivity[]>('gdpr_activities', []);
    const filtered = activities.filter(a => a.id !== id);
    secureStorage.setItem('gdpr_activities', filtered);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to delete processing activity'), {
      context: 'ropa_delete_activity',
      activityId: id,
    });
    throw err;
  }
}

/**
 * Export processing activities to CSV
 */
export function exportToCSV(activities: ProcessingActivity[]): string {
  const headers = [
    'Name',
    'Purpose',
    'Legal Basis',
    'Data Types',
    'Data Subjects',
    'Recipients',
    'Retention Period',
    'Risk Level',
    'Data Controller',
    'Data Processor',
    'Status',
    'DPIA Required',
    'Created Date',
  ];

  const rows = activities.map(activity => [
    activity.name || '',
    activity.purpose || '',
    activity.legalBasis || '',
    activity.dataTypes?.join('; ') || '',
    activity.dataSubjects?.join('; ') || '',
    activity.recipients?.join('; ') || '',
    activity.retentionPeriod || '',
    activity.riskLevel || '',
    activity.dataController || '',
    activity.dataProcessor || '',
    activity.status || 'active',
    activity.dpiaRequired ? 'Yes' : 'No',
    activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Export processing activities to PDF
 */
export async function exportToPDF(activities: ProcessingActivity[]): Promise<void> {
  const mappingData = {
    metadata: {
      title: 'GDPR Data Processing Mapping',
      created: new Date().toISOString(),
      version: '1.0',
      organization: '',
    },
    processingActivities: activities.map(activity => ({
      id: activity.id || '',
      name: activity.name,
      purpose: activity.purpose,
      legalBasis: activity.legalBasis,
      dataTypes: activity.dataTypes || [],
      dataSubjects: activity.dataSubjects || [],
      recipients: activity.recipients || [],
      retentionPeriod: activity.retentionPeriod,
      riskLevel: activity.riskLevel,
    })),
    compliance: {
      framework: 'GDPR',
      articles: ['Article 6', 'Article 30', 'Article 32'],
      dpiaRequired: activities.some(a => a.dpiaRequired || a.riskLevel === 'high' || a.riskLevel === 'critical'),
    },
  };

  await generateGdprMappingPdf(mappingData);
}

/**
 * Transform database record to application format
 */
function transformFromDb(dbRecord: any): ProcessingActivity {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    description: dbRecord.description,
    purpose: dbRecord.purpose,
    legalBasis: dbRecord.legal_basis,
    dataTypes: dbRecord.data_types || [],
    dataSubjects: dbRecord.data_subjects || [],
    recipients: dbRecord.recipients || [],
    thirdCountryTransfers: dbRecord.third_country_transfers || [],
    retentionPeriod: dbRecord.retention_period,
    securityMeasures: dbRecord.security_measures || [],
    riskLevel: dbRecord.risk_level,
    dpiaRequired: dbRecord.dpia_required || false,
    dpiaId: dbRecord.dpia_id,
    applicableRegulations: dbRecord.applicable_regulations || [],
    dataController: dbRecord.data_controller,
    dataProcessor: dbRecord.data_processor,
    processingLocation: dbRecord.processing_location,
    automatedDecisionMaking: dbRecord.automated_decision_making || false,
    profiling: dbRecord.profiling || false,
    status: dbRecord.status || 'active',
    lastReviewedDate: dbRecord.last_reviewed_date,
    nextReviewDate: dbRecord.next_review_date,
    createdBy: dbRecord.created_by,
    updatedBy: dbRecord.updated_by,
    notes: dbRecord.notes,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
}

/**
 * Transform application format to database format
 */
function transformToDb(activity: Partial<ProcessingActivity>, userId: string, isUpdate = false): any {
  const dbRecord: any = {
    user_id: userId,
  };

  if (activity.name !== undefined) dbRecord.name = activity.name;
  if (activity.description !== undefined) dbRecord.description = activity.description;
  if (activity.purpose !== undefined) dbRecord.purpose = activity.purpose;
  if (activity.legalBasis !== undefined) dbRecord.legal_basis = activity.legalBasis;
  if (activity.dataTypes !== undefined) dbRecord.data_types = activity.dataTypes;
  if (activity.dataSubjects !== undefined) dbRecord.data_subjects = activity.dataSubjects;
  if (activity.recipients !== undefined) dbRecord.recipients = activity.recipients;
  if (activity.thirdCountryTransfers !== undefined) dbRecord.third_country_transfers = activity.thirdCountryTransfers;
  if (activity.retentionPeriod !== undefined) dbRecord.retention_period = activity.retentionPeriod;
  if (activity.securityMeasures !== undefined) dbRecord.security_measures = activity.securityMeasures;
  if (activity.riskLevel !== undefined) dbRecord.risk_level = activity.riskLevel;
  if (activity.dpiaRequired !== undefined) dbRecord.dpia_required = activity.dpiaRequired;
  if (activity.dpiaId !== undefined) dbRecord.dpia_id = activity.dpiaId;
  if (activity.applicableRegulations !== undefined) dbRecord.applicable_regulations = activity.applicableRegulations;
  if (activity.dataController !== undefined) dbRecord.data_controller = activity.dataController;
  if (activity.dataProcessor !== undefined) dbRecord.data_processor = activity.dataProcessor;
  if (activity.processingLocation !== undefined) dbRecord.processing_location = activity.processingLocation;
  if (activity.automatedDecisionMaking !== undefined) dbRecord.automated_decision_making = activity.automatedDecisionMaking;
  if (activity.profiling !== undefined) dbRecord.profiling = activity.profiling;
  if (activity.status !== undefined) dbRecord.status = activity.status;
  if (activity.lastReviewedDate !== undefined) dbRecord.last_reviewed_date = activity.lastReviewedDate;
  if (activity.nextReviewDate !== undefined) dbRecord.next_review_date = activity.nextReviewDate;
  if (activity.createdBy !== undefined) dbRecord.created_by = activity.createdBy;
  if (activity.updatedBy !== undefined) dbRecord.updated_by = activity.updatedBy;
  if (activity.notes !== undefined) dbRecord.notes = activity.notes;

  return dbRecord;
}


