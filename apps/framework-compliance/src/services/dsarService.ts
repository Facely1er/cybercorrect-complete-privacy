/**
 * DSAR Service - Data Subject Access Requests
 * 
 * This service handles CRUD operations, SLA calculation, and export functionality
 * for Data Subject Access Requests (DSAR) / Privacy Rights Management.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';
import { secureStorage } from '../utils/storage';

export type DSARRequestType = 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection' | 'withdraw_consent';
export type DSARStatus = 'submitted' | 'acknowledged' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
export type DSARPriority = 'low' | 'medium' | 'high' | 'critical';
export type DSARVerificationStatus = 'pending' | 'verified' | 'failed' | 'not_required';
export type DSARResponseMethod = 'email' | 'post' | 'portal' | 'other';

export interface DataSubjectRequest {
  id?: string;
  requestId: string;
  requestType: DSARRequestType;
  status: DSARStatus;
  priority: DSARPriority;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  requesterAddress?: string;
  verificationStatus?: DSARVerificationStatus;
  description: string;
  applicableRegulations: string[];
  submittedDate: string; // ISO date string
  acknowledgedDate?: string;
  dueDate: string; // ISO date string (calculated based on regulation)
  completedDate?: string;
  assignedTo?: string;
  assignedToEmail?: string;
  responseMethod?: DSARResponseMethod;
  responseData?: Record<string, unknown>;
  notes?: string;
  internalNotes?: string;
  communicationLog?: Array<Record<string, unknown>>;
  relatedRequests?: string[];
  evidenceIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SLAInfo {
  regulation: string;
  deadlineDays: number;
  dueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Calculate SLA deadline based on applicable regulations
 */
export function calculateSLADeadline(
  submittedDate: string,
  applicableRegulations: string[],
): SLAInfo[] {
  const slaInfo: SLAInfo[] = [];

  // Regulation-specific deadlines (in days)
  const regulationDeadlines: Record<string, number> = {
    'GDPR': 30,
    'CCPA': 45,
    'PIPEDA': 30,
    'LGPD': 15, // Brazilian LGPD
    'PDPA': 30, // Singapore PDPA
    'PDPB': 30, // India PDPB
    'POPIA': 21, // South Africa POPIA
  };

  const submitted = new Date(submittedDate);
  const now = new Date();

  for (const regulation of applicableRegulations) {
    const deadlineDays = regulationDeadlines[regulation.toUpperCase()] || 30; // Default 30 days
    const dueDate = new Date(submitted);
    dueDate.setDate(dueDate.getDate() + deadlineDays);

    const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    // Determine urgency level
    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (isOverdue) {
      urgencyLevel = 'critical';
    } else if (daysRemaining <= 3) {
      urgencyLevel = 'critical';
    } else if (daysRemaining <= 7) {
      urgencyLevel = 'high';
    } else if (daysRemaining <= 14) {
      urgencyLevel = 'medium';
    }

    slaInfo.push({
      regulation,
      deadlineDays,
      dueDate: dueDate.toISOString().split('T')[0],
      daysRemaining,
      isOverdue,
      urgencyLevel,
    });
  }

  // If no regulations specified, use GDPR default
  if (slaInfo.length === 0) {
    const deadlineDays = 30;
    const dueDate = new Date(submitted);
    dueDate.setDate(dueDate.getDate() + deadlineDays);
    const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysRemaining < 0;

    slaInfo.push({
      regulation: 'GDPR',
      deadlineDays,
      dueDate: dueDate.toISOString().split('T')[0],
      daysRemaining,
      isOverdue,
      urgencyLevel: isOverdue || daysRemaining <= 3 ? 'critical' : daysRemaining <= 7 ? 'high' : daysRemaining <= 14 ? 'medium' : 'low',
    });
  }

  return slaInfo;
}

/**
 * Get the most urgent SLA (earliest deadline)
 */
export function getMostUrgentSLA(slaInfo: SLAInfo[]): SLAInfo | null {
  if (slaInfo.length === 0) return null;

  return slaInfo.reduce((mostUrgent, current) => {
    const currentDate = new Date(current.dueDate);
    const mostUrgentDate = new Date(mostUrgent.dueDate);
    return currentDate < mostUrgentDate ? current : mostUrgent;
  });
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `DSR-${timestamp}-${random}`;
}

/**
 * Get all data subject requests for the current user
 */
export async function getDataSubjectRequests(): Promise<DataSubjectRequest[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const localData = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
      return localData || [];
    }

    const { data, error } = await supabase
      .from('cc_privacy_data_subject_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('submitted_date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(transformFromDb);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get data subject requests'), {
      context: 'dsar_get_requests',
    });
    
    // Fallback to localStorage
    const localData = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
    return localData || [];
  }
}

/**
 * Get a single data subject request by ID
 */
export async function getDataSubjectRequest(id: string): Promise<DataSubjectRequest | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
      return requests.find(r => r.id === id) || null;
    }

    const { data, error } = await supabase
      .from('cc_privacy_data_subject_requests')
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
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get data subject request'), {
      context: 'dsar_get_request',
      requestId: id,
    });
    
    // Fallback to localStorage
    const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
    return requests.find(r => r.id === id) || null;
  }
}

/**
 * Create a new data subject request
 */
export async function createDataSubjectRequest(
  request: Omit<DataSubjectRequest, 'id' | 'requestId' | 'dueDate' | 'createdAt' | 'updatedAt'>,
): Promise<DataSubjectRequest> {
  try {
    const { user } = await getCurrentUser();
    
    // Calculate SLA and due date
    const slaInfo = calculateSLADeadline(
      request.submittedDate,
      request.applicableRegulations.length > 0 ? request.applicableRegulations : ['GDPR'],
    );
    const mostUrgentSLA = getMostUrgentSLA(slaInfo);
    const dueDate = mostUrgentSLA?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newRequest: DataSubjectRequest = {
      ...request,
      requestId: generateRequestId(),
      dueDate,
      applicableRegulations: request.applicableRegulations.length > 0 ? request.applicableRegulations : ['GDPR'],
      status: request.status || 'submitted',
      priority: request.priority || 'medium',
      verificationStatus: request.verificationStatus || 'pending',
      communicationLog: request.communicationLog || [],
      relatedRequests: request.relatedRequests || [],
      evidenceIds: request.evidenceIds || [],
      responseData: request.responseData || {},
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
      requests.push(newRequest);
      secureStorage.setItem('privacy_rights_requests', requests);
      return newRequest;
    }

    // Transform to database format
    const dbRecord = transformToDb(newRequest, user.id);

    const { data, error } = await supabase
      .from('cc_privacy_data_subject_requests')
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also save to localStorage as backup
    const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
    requests.push(transformFromDb(data));
    secureStorage.setItem('privacy_rights_requests', requests);

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to create data subject request'), {
      context: 'dsar_create_request',
    });
    throw err;
  }
}

/**
 * Update an existing data subject request
 */
export async function updateDataSubjectRequest(
  id: string,
  updates: Partial<Omit<DataSubjectRequest, 'id' | 'requestId' | 'createdAt'>>,
): Promise<DataSubjectRequest> {
  try {
    const { user } = await getCurrentUser();
    
    const updatedRequest: Partial<DataSubjectRequest> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate due date if regulations or submitted date changed
    if (updates.applicableRegulations || updates.submittedDate) {
      const existing = await getDataSubjectRequest(id);
      if (existing) {
        const submittedDate = updates.submittedDate || existing.submittedDate;
        const regulations = updates.applicableRegulations || existing.applicableRegulations;
        const slaInfo = calculateSLADeadline(submittedDate, regulations);
        const mostUrgentSLA = getMostUrgentSLA(slaInfo);
        if (mostUrgentSLA) {
          updatedRequest.dueDate = mostUrgentSLA.dueDate;
        }
      }
    }

    if (!user) {
      // Fallback to localStorage
      const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
      const index = requests.findIndex(r => r.id === id);
      if (index === -1) {
        throw new Error('Data subject request not found');
      }
      requests[index] = { ...requests[index], ...updatedRequest };
      secureStorage.setItem('privacy_rights_requests', requests);
      return requests[index];
    }

    // Transform to database format
    const dbUpdates = transformToDb(updatedRequest as DataSubjectRequest, user.id, true);

    const { data, error } = await supabase
      .from('cc_privacy_data_subject_requests')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also update localStorage
    const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index] = transformFromDb(data);
      secureStorage.setItem('privacy_rights_requests', requests);
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to update data subject request'), {
      context: 'dsar_update_request',
      requestId: id,
    });
    throw err;
  }
}

/**
 * Delete a data subject request
 */
export async function deleteDataSubjectRequest(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
      const filtered = requests.filter(r => r.id !== id);
      secureStorage.setItem('privacy_rights_requests', filtered);
      return;
    }

    const { error } = await supabase
      .from('cc_privacy_data_subject_requests')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Also remove from localStorage
    const requests = secureStorage.getItem<DataSubjectRequest[]>('privacy_rights_requests', []);
    const filtered = requests.filter(r => r.id !== id);
    secureStorage.setItem('privacy_rights_requests', filtered);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to delete data subject request'), {
      context: 'dsar_delete_request',
      requestId: id,
    });
    throw err;
  }
}

/**
 * Add a communication log entry
 */
export async function addCommunicationLog(
  requestId: string,
  entry: { type: string; message: string; timestamp?: string; author?: string },
): Promise<DataSubjectRequest> {
  const request = await getDataSubjectRequest(requestId);
  if (!request) {
    throw new Error('Data subject request not found');
  }

  const logEntry = {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString(),
    id: crypto.randomUUID(),
  };

  const updatedLog = [...(request.communicationLog || []), logEntry];

  return updateDataSubjectRequest(requestId, {
    communicationLog: updatedLog,
  });
}

/**
 * Export data subject requests to CSV
 */
export function exportToCSV(requests: DataSubjectRequest[]): string {
  const headers = [
    'Request ID',
    'Type',
    'Status',
    'Priority',
    'Requester Name',
    'Requester Email',
    'Submitted Date',
    'Due Date',
    'Completed Date',
    'Assigned To',
    'Regulations',
    'Verification Status',
  ];

  const rows = requests.map(request => [
    request.requestId || '',
    request.requestType || '',
    request.status || '',
    request.priority || '',
    request.requesterName || '',
    request.requesterEmail || '',
    request.submittedDate || '',
    request.dueDate || '',
    request.completedDate || '',
    request.assignedTo || '',
    request.applicableRegulations?.join('; ') || '',
    request.verificationStatus || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Transform database record to application format
 */
function transformFromDb(dbRecord: any): DataSubjectRequest {
  return {
    id: dbRecord.id,
    requestId: dbRecord.request_id,
    requestType: dbRecord.request_type,
    status: dbRecord.status,
    priority: dbRecord.priority,
    requesterName: dbRecord.requester_name,
    requesterEmail: dbRecord.requester_email,
    requesterPhone: dbRecord.requester_phone,
    requesterAddress: dbRecord.requester_address,
    verificationStatus: dbRecord.verification_status,
    description: dbRecord.description,
    applicableRegulations: dbRecord.applicable_regulations || [],
    submittedDate: dbRecord.submitted_date,
    acknowledgedDate: dbRecord.acknowledged_date,
    dueDate: dbRecord.due_date,
    completedDate: dbRecord.completed_date,
    assignedTo: dbRecord.assigned_to,
    assignedToEmail: dbRecord.assigned_to_email,
    responseMethod: dbRecord.response_method,
    responseData: dbRecord.response_data || {},
    notes: dbRecord.notes,
    internalNotes: dbRecord.internal_notes,
    communicationLog: dbRecord.communication_log || [],
    relatedRequests: dbRecord.related_requests || [],
    evidenceIds: dbRecord.evidence_ids || [],
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
}

/**
 * Transform application format to database format
 */
function transformToDb(request: Partial<DataSubjectRequest>, userId: string, isUpdate = false): any {
  const dbRecord: any = {
    user_id: userId,
  };

  if (request.requestId !== undefined) dbRecord.request_id = request.requestId;
  if (request.requestType !== undefined) dbRecord.request_type = request.requestType;
  if (request.status !== undefined) dbRecord.status = request.status;
  if (request.priority !== undefined) dbRecord.priority = request.priority;
  if (request.requesterName !== undefined) dbRecord.requester_name = request.requesterName;
  if (request.requesterEmail !== undefined) dbRecord.requester_email = request.requesterEmail;
  if (request.requesterPhone !== undefined) dbRecord.requester_phone = request.requesterPhone;
  if (request.requesterAddress !== undefined) dbRecord.requester_address = request.requesterAddress;
  if (request.verificationStatus !== undefined) dbRecord.verification_status = request.verificationStatus;
  if (request.description !== undefined) dbRecord.description = request.description;
  if (request.applicableRegulations !== undefined) dbRecord.applicable_regulations = request.applicableRegulations;
  if (request.submittedDate !== undefined) dbRecord.submitted_date = request.submittedDate;
  if (request.acknowledgedDate !== undefined) dbRecord.acknowledged_date = request.acknowledgedDate;
  if (request.dueDate !== undefined) dbRecord.due_date = request.dueDate;
  if (request.completedDate !== undefined) dbRecord.completed_date = request.completedDate;
  if (request.assignedTo !== undefined) dbRecord.assigned_to = request.assignedTo;
  if (request.assignedToEmail !== undefined) dbRecord.assigned_to_email = request.assignedToEmail;
  if (request.responseMethod !== undefined) dbRecord.response_method = request.responseMethod;
  if (request.responseData !== undefined) dbRecord.response_data = request.responseData;
  if (request.notes !== undefined) dbRecord.notes = request.notes;
  if (request.internalNotes !== undefined) dbRecord.internal_notes = request.internalNotes;
  if (request.communicationLog !== undefined) dbRecord.communication_log = request.communicationLog;
  if (request.relatedRequests !== undefined) dbRecord.related_requests = request.relatedRequests;
  if (request.evidenceIds !== undefined) dbRecord.evidence_ids = request.evidenceIds;

  return dbRecord;
}


