/**
 * Incident Service - Privacy Incident and Breach Management
 * 
 * This service handles CRUD operations, notification decision logic, and export
 * functionality for privacy incidents and data breaches.
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import { errorMonitoring } from '../lib/errorMonitoring';
import { secureStorage } from '../utils/storage';

export type IncidentType = 'data_breach' | 'unauthorized_access' | 'data_loss' | 'privacy_violation' | 'consent_violation' | 'vendor_incident';
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'investigating' | 'contained' | 'resolved' | 'closed';

export interface RegulatoryNotification {
  notified: boolean;
  date?: string;
  authority?: string;
  deadline?: string;
  required: boolean;
}

export interface DataSubjectNotification {
  required: boolean;
  sent: boolean;
  date?: string;
  method?: 'email' | 'post' | 'public_notice' | 'other';
  deadline?: string;
}

export interface PrivacyIncident {
  id?: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reportedDate: string; // ISO date string
  detectedDate: string; // ISO date string
  containedDate?: string;
  resolvedDate?: string;
  reportedBy: string;
  assignedTo: string;
  affectedDataSubjects: number;
  affectedDataTypes: string[];
  affectedSystems: string[];
  rootCause?: string;
  impact?: string;
  mitigation?: string[];
  regulatoryNotifications?: {
    gdpr?: RegulatoryNotification;
    ccpa?: RegulatoryNotification;
    hipaa?: RegulatoryNotification;
    other?: RegulatoryNotification;
  };
  dataSubjectNotifications?: DataSubjectNotification;
  lessonsLearned?: string[];
  preventiveMeasures?: string[];
  relatedIncidents?: string[];
  documents?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationDecision {
  notifyRegulator: boolean;
  notifyDataSubjects: boolean;
  regulatorDeadline?: string;
  dataSubjectDeadline?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reasoning: string[];
  applicableRegulations: string[];
}

/**
 * Determine if regulatory notification is required
 */
export function determineRegulatoryNotification(incident: PrivacyIncident): NotificationDecision {
  const reasoning: string[] = [];
  const applicableRegulations: string[] = [];
  let notifyRegulator = false;
  let notifyDataSubjects = false;
  let regulatorDeadline: string | undefined;
  let dataSubjectDeadline: string | undefined;
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const detectedDate = new Date(incident.detectedDate);
  const now = new Date();

  // GDPR Notification Requirements (Article 33 & 34)
  if (incident.type === 'data_breach' || incident.severity === 'high' || incident.severity === 'critical') {
    applicableRegulations.push('GDPR');
    
    // GDPR Article 33: Notify supervisory authority within 72 hours
    if (incident.affectedDataSubjects > 0) {
      notifyRegulator = true;
      const deadline = new Date(detectedDate);
      deadline.setHours(deadline.getHours() + 72);
      regulatorDeadline = deadline.toISOString();
      reasoning.push('GDPR Article 33: Data breach affecting personal data requires notification to supervisory authority within 72 hours');
      
      // Calculate urgency based on time remaining
      const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursRemaining < 24) {
        urgency = 'critical';
      } else if (hoursRemaining < 48) {
        urgency = 'high';
      } else {
        urgency = 'medium';
      }
    }

    // GDPR Article 34: Notify data subjects if high risk
    if (incident.severity === 'high' || incident.severity === 'critical' || incident.affectedDataSubjects > 100) {
      notifyDataSubjects = true;
      const deadline = new Date(detectedDate);
      deadline.setDate(deadline.getDate() + 1); // Without undue delay
      dataSubjectDeadline = deadline.toISOString();
      reasoning.push('GDPR Article 34: High-risk breach requires notification to data subjects without undue delay');
    }
  }

  // CCPA Notification Requirements
  if (incident.affectedDataSubjects > 0 && (incident.type === 'data_breach' || incident.severity === 'high' || incident.severity === 'critical')) {
    applicableRegulations.push('CCPA');
    
    if (!notifyRegulator) {
      notifyRegulator = true;
      const deadline = new Date(detectedDate);
      deadline.setDate(deadline.getDate() + 30); // CCPA allows more time
      regulatorDeadline = deadline.toISOString();
      reasoning.push('CCPA: Data breach requires notification to affected consumers within reasonable time');
    }
    
    if (!notifyDataSubjects) {
      notifyDataSubjects = true;
      const deadline = new Date(detectedDate);
      deadline.setDate(deadline.getDate() + 30);
      dataSubjectDeadline = deadline.toISOString();
      reasoning.push('CCPA: Affected consumers must be notified of data breach');
    }
  }

  // HIPAA Notification Requirements (if applicable)
  if (incident.affectedDataTypes.some(type => 
    type.toLowerCase().includes('health') || 
    type.toLowerCase().includes('medical') ||
    type.toLowerCase().includes('phi')
  )) {
    applicableRegulations.push('HIPAA');
    
    if (!notifyRegulator) {
      notifyRegulator = true;
      const deadline = new Date(detectedDate);
      deadline.setDate(deadline.getDate() + 60); // HIPAA: 60 days
      regulatorDeadline = deadline.toISOString();
      reasoning.push('HIPAA: Breach of PHI requires notification to HHS within 60 days');
    }
    
    if (incident.affectedDataSubjects > 500) {
      notifyRegulator = true;
      const deadline = new Date(detectedDate);
      deadline.setDate(deadline.getDate() + 60);
      regulatorDeadline = deadline.toISOString();
      reasoning.push('HIPAA: Breach affecting 500+ individuals requires immediate notification to HHS and media');
    }
  }

  // Default: If no specific regulation applies but it's a data breach
  if (applicableRegulations.length === 0 && incident.type === 'data_breach') {
    reasoning.push('Data breach detected - review applicable regulations for notification requirements');
  }

  return {
    notifyRegulator,
    notifyDataSubjects,
    regulatorDeadline,
    dataSubjectDeadline,
    urgency,
    reasoning,
    applicableRegulations,
  };
}

/**
 * Get all privacy incidents for the current user
 */
export async function getPrivacyIncidents(): Promise<PrivacyIncident[]> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const localData = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
      return localData || [];
    }

    const { data, error } = await supabase
      .from('cc_privacy_privacy_incidents')
      .select('*')
      .eq('user_id', user.id)
      .order('reported_date', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(transformFromDb);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get privacy incidents'), {
      context: 'incident_get_incidents',
    });
    
    // Fallback to localStorage
    const localData = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
    return localData || [];
  }
}

/**
 * Get a single privacy incident by ID
 */
export async function getPrivacyIncident(id: string): Promise<PrivacyIncident | null> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
      return incidents.find(i => i.id === id) || null;
    }

    const { data, error } = await supabase
      .from('cc_privacy_privacy_incidents')
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
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to get privacy incident'), {
      context: 'incident_get_incident',
      incidentId: id,
    });
    
    // Fallback to localStorage
    const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
    return incidents.find(i => i.id === id) || null;
  }
}

/**
 * Create a new privacy incident
 */
export async function createPrivacyIncident(
  incident: Omit<PrivacyIncident, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<PrivacyIncident> {
  try {
    const { user } = await getCurrentUser();
    
    // Determine notification requirements
    const notificationDecision = determineRegulatoryNotification(incident);
    
    // Set notification flags based on decision
    const regulatoryNotifications = {
      gdpr: {
        required: notificationDecision.applicableRegulations.includes('GDPR') && notificationDecision.notifyRegulator,
        notified: false,
        deadline: notificationDecision.regulatorDeadline,
      },
      ccpa: {
        required: notificationDecision.applicableRegulations.includes('CCPA') && notificationDecision.notifyRegulator,
        notified: false,
        deadline: notificationDecision.regulatorDeadline,
      },
      hipaa: {
        required: notificationDecision.applicableRegulations.includes('HIPAA') && notificationDecision.notifyRegulator,
        notified: false,
        deadline: notificationDecision.regulatorDeadline,
      },
    };

    const dataSubjectNotifications: DataSubjectNotification = {
      required: notificationDecision.notifyDataSubjects,
      sent: false,
      deadline: notificationDecision.dataSubjectDeadline,
    };

    const newIncident: PrivacyIncident = {
      ...incident,
      regulatoryNotifications,
      dataSubjectNotifications,
      mitigation: incident.mitigation || [],
      lessonsLearned: incident.lessonsLearned || [],
      preventiveMeasures: incident.preventiveMeasures || [],
      relatedIncidents: incident.relatedIncidents || [],
      documents: incident.documents || [],
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
      incidents.push(newIncident);
      secureStorage.setItem('privacy_incidents', incidents);
      return newIncident;
    }

    // Transform to database format
    const dbRecord = transformToDb(newIncident, user.id);

    const { data, error } = await supabase
      .from('cc_privacy_privacy_incidents')
      .insert([dbRecord])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also save to localStorage as backup
    const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
    incidents.push(transformFromDb(data));
    secureStorage.setItem('privacy_incidents', incidents);

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to create privacy incident'), {
      context: 'incident_create_incident',
    });
    throw err;
  }
}

/**
 * Update an existing privacy incident
 */
export async function updatePrivacyIncident(
  id: string,
  updates: Partial<Omit<PrivacyIncident, 'id' | 'createdAt'>>,
): Promise<PrivacyIncident> {
  try {
    const { user } = await getCurrentUser();
    
    // Recalculate notification requirements if severity or type changed
    if (updates.severity || updates.type || updates.affectedDataSubjects) {
      const existing = await getPrivacyIncident(id);
      if (existing) {
        const updated = { ...existing, ...updates };
        const notificationDecision = determineRegulatoryNotification(updated);
        
        // Update notification flags
        updates.regulatoryNotifications = {
          ...existing.regulatoryNotifications,
          gdpr: {
            ...existing.regulatoryNotifications?.gdpr,
            required: notificationDecision.applicableRegulations.includes('GDPR') && notificationDecision.notifyRegulator,
            deadline: notificationDecision.regulatorDeadline,
          },
          ccpa: {
            ...existing.regulatoryNotifications?.ccpa,
            required: notificationDecision.applicableRegulations.includes('CCPA') && notificationDecision.notifyRegulator,
            deadline: notificationDecision.regulatorDeadline,
          },
          hipaa: {
            ...existing.regulatoryNotifications?.hipaa,
            required: notificationDecision.applicableRegulations.includes('HIPAA') && notificationDecision.notifyRegulator,
            deadline: notificationDecision.regulatorDeadline,
          },
        };
        
        updates.dataSubjectNotifications = {
          ...existing.dataSubjectNotifications,
          required: notificationDecision.notifyDataSubjects,
          deadline: notificationDecision.dataSubjectDeadline,
        };
      }
    }

    const updatedIncident: Partial<PrivacyIncident> = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!user) {
      // Fallback to localStorage
      const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
      const index = incidents.findIndex(i => i.id === id);
      if (index === -1) {
        throw new Error('Privacy incident not found');
      }
      incidents[index] = { ...incidents[index], ...updatedIncident };
      secureStorage.setItem('privacy_incidents', incidents);
      return incidents[index];
    }

    // Transform to database format
    const dbUpdates = transformToDb(updatedIncident as PrivacyIncident, user.id, true);

    const { data, error } = await supabase
      .from('cc_privacy_privacy_incidents')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Also update localStorage
    const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
    const index = incidents.findIndex(i => i.id === id);
    if (index !== -1) {
      incidents[index] = transformFromDb(data);
      secureStorage.setItem('privacy_incidents', incidents);
    }

    return transformFromDb(data);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to update privacy incident'), {
      context: 'incident_update_incident',
      incidentId: id,
    });
    throw err;
  }
}

/**
 * Delete a privacy incident
 */
export async function deletePrivacyIncident(id: string): Promise<void> {
  try {
    const { user } = await getCurrentUser();
    
    if (!user) {
      // Fallback to localStorage
      const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
      const filtered = incidents.filter(i => i.id !== id);
      secureStorage.setItem('privacy_incidents', filtered);
      return;
    }

    const { error } = await supabase
      .from('cc_privacy_privacy_incidents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Also remove from localStorage
    const incidents = secureStorage.getItem<PrivacyIncident[]>('privacy_incidents', []);
    const filtered = incidents.filter(i => i.id !== id);
    secureStorage.setItem('privacy_incidents', filtered);
  } catch (err) {
    errorMonitoring.captureException(err instanceof Error ? err : new Error('Failed to delete privacy incident'), {
      context: 'incident_delete_incident',
      incidentId: id,
    });
    throw err;
  }
}

/**
 * Export privacy incidents to CSV
 */
export function exportToCSV(incidents: PrivacyIncident[]): string {
  const headers = [
    'ID',
    'Title',
    'Type',
    'Severity',
    'Status',
    'Reported Date',
    'Detected Date',
    'Contained Date',
    'Resolved Date',
    'Reported By',
    'Assigned To',
    'Affected Data Subjects',
    'Affected Data Types',
    'Root Cause',
    'Impact',
  ];

  const rows = incidents.map(incident => [
    incident.id || '',
    incident.title || '',
    incident.type || '',
    incident.severity || '',
    incident.status || '',
    incident.reportedDate || '',
    incident.detectedDate || '',
    incident.containedDate || '',
    incident.resolvedDate || '',
    incident.reportedBy || '',
    incident.assignedTo || '',
    incident.affectedDataSubjects?.toString() || '0',
    incident.affectedDataTypes?.join('; ') || '',
    incident.rootCause || '',
    incident.impact || '',
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
function transformFromDb(dbRecord: any): PrivacyIncident {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    description: dbRecord.description,
    type: dbRecord.type,
    severity: dbRecord.severity,
    status: dbRecord.status,
    reportedDate: dbRecord.reported_date,
    detectedDate: dbRecord.detected_date,
    containedDate: dbRecord.contained_date,
    resolvedDate: dbRecord.resolved_date,
    reportedBy: dbRecord.reported_by,
    assignedTo: dbRecord.assigned_to,
    affectedDataSubjects: dbRecord.affected_data_subjects || 0,
    affectedDataTypes: dbRecord.affected_data_types || [],
    affectedSystems: dbRecord.affected_systems || [],
    rootCause: dbRecord.root_cause,
    impact: dbRecord.impact,
    mitigation: dbRecord.mitigation || [],
    regulatoryNotifications: dbRecord.regulatory_notifications || {},
    dataSubjectNotifications: dbRecord.data_subject_notifications || {},
    lessonsLearned: dbRecord.lessons_learned || [],
    preventiveMeasures: dbRecord.preventive_measures || [],
    relatedIncidents: dbRecord.related_incidents || [],
    documents: dbRecord.documents || [],
    notes: dbRecord.notes,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  };
}

/**
 * Transform application format to database format
 */
function transformToDb(incident: Partial<PrivacyIncident>, userId: string, isUpdate = false): any {
  const dbRecord: any = {
    user_id: userId,
  };

  if (incident.title !== undefined) dbRecord.title = incident.title;
  if (incident.description !== undefined) dbRecord.description = incident.description;
  if (incident.type !== undefined) dbRecord.type = incident.type;
  if (incident.severity !== undefined) dbRecord.severity = incident.severity;
  if (incident.status !== undefined) dbRecord.status = incident.status;
  if (incident.reportedDate !== undefined) dbRecord.reported_date = incident.reportedDate;
  if (incident.detectedDate !== undefined) dbRecord.detected_date = incident.detectedDate;
  if (incident.containedDate !== undefined) dbRecord.contained_date = incident.containedDate;
  if (incident.resolvedDate !== undefined) dbRecord.resolved_date = incident.resolvedDate;
  if (incident.reportedBy !== undefined) dbRecord.reported_by = incident.reportedBy;
  if (incident.assignedTo !== undefined) dbRecord.assigned_to = incident.assignedTo;
  if (incident.affectedDataSubjects !== undefined) dbRecord.affected_data_subjects = incident.affectedDataSubjects;
  if (incident.affectedDataTypes !== undefined) dbRecord.affected_data_types = incident.affectedDataTypes;
  if (incident.affectedSystems !== undefined) dbRecord.affected_systems = incident.affectedSystems;
  if (incident.rootCause !== undefined) dbRecord.root_cause = incident.rootCause;
  if (incident.impact !== undefined) dbRecord.impact = incident.impact;
  if (incident.mitigation !== undefined) dbRecord.mitigation = incident.mitigation;
  if (incident.regulatoryNotifications !== undefined) dbRecord.regulatory_notifications = incident.regulatoryNotifications;
  if (incident.dataSubjectNotifications !== undefined) dbRecord.data_subject_notifications = incident.dataSubjectNotifications;
  if (incident.lessonsLearned !== undefined) dbRecord.lessons_learned = incident.lessonsLearned;
  if (incident.preventiveMeasures !== undefined) dbRecord.preventive_measures = incident.preventiveMeasures;
  if (incident.relatedIncidents !== undefined) dbRecord.related_incidents = incident.relatedIncidents;
  if (incident.documents !== undefined) dbRecord.documents = incident.documents;
  if (incident.notes !== undefined) dbRecord.notes = incident.notes;

  return dbRecord;
}


