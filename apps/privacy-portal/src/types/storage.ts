// Storage-related type definitions

export interface DataRightsRequest {
  id: string;
  userId: string;
  requestType: 'access' | 'portability' | 'deletion' | 'correction' | 'restriction';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requestDate: string;
  dueDate: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
  metadata?: Record<string, unknown>;
}

export interface PrivacyIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'contained' | 'resolved' | 'closed';
  reportedDate: string;
  discoveredDate: string;
  affectedIndividuals: number;
  dataTypes: string[];
  rootCause?: string;
  remediation?: string;
  lessonsLearned?: string;
  assignedTo?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface VendorAssessment {
  id: string;
  vendorName: string;
  assessmentType: 'initial' | 'periodic' | 'incident_based' | 'contract_renewal';
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  assessmentDate: string;
  dueDate: string;
  assessor: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  findings: AssessmentFinding[];
  recommendations: string[];
  nextAssessmentDate?: string;
  metadata?: Record<string, unknown>;
}

export interface AssessmentFinding {
  id: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  remediation?: string;
  dueDate?: string;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'marketing' | 'analytics' | 'functional' | 'necessary';
  status: 'granted' | 'withdrawn' | 'expired';
  grantedDate: string;
  expiryDate?: string;
  purpose: string;
  dataTypes: string[];
  legalBasis: string;
  withdrawalMethod?: string;
  metadata?: Record<string, unknown>;
}

export interface ComplianceObligation {
  id: string;
  title: string;
  description: string;
  regulation: string;
  requirement: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  evidence?: string[];
  notes?: string;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    dataRetention: number;
    analytics: boolean;
    marketing: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
    screenReader: boolean;
  };
  metadata?: Record<string, unknown>;
}

export interface SyncQueueItem {
  id: string;
  table: string;
  operation: 'create' | 'update' | 'delete';
  data: DataRightsRequest | PrivacyIncident | VendorAssessment | ConsentRecord | ComplianceObligation | UserPreferences;
  timestamp: number;
  retryCount: number;
}

export interface ExportData {
  dataRightsRequests: DataRightsRequest[];
  privacyIncidents: PrivacyIncident[];
  vendorAssessments: VendorAssessment[];
  consentRecords: ConsentRecord[];
  complianceObligations: ComplianceObligation[];
  userPreferences: UserPreferences;
  exportMetadata: {
    exportDate: string;
    version: string;
    dataTypes: string[];
  };
}

export type StorageDataType = 
  | DataRightsRequest 
  | PrivacyIncident 
  | VendorAssessment 
  | ConsentRecord 
  | ComplianceObligation 
  | UserPreferences;

export type StorageTableName = 
  | 'data_rights' 
  | 'privacy_incidents' 
  | 'consent_records' 
  | 'compliance' 
  | 'vendor_assessments' 
  | 'form_data' 
  | 'preferences';