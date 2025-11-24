import { enhancedLocalStorageService } from './enhancedLocalStorageService';

// interface StorageData {
//   [key: string]: unknown;
// }

interface DataRightsRequest {
  id: string;
  type: string;
  title: string;
  requesterName: string;
  requesterEmail: string;
  employeeName: string;
  submittedAt: string;
  status: string;
  dueDate: string;
  description: string;
}

interface PrivacyIncident {
  id: string;
  incidentNumber: string;
  title: string;
  type: string;
  severity: string;
  description: string;
  affectedCount: number;
  discoveryDate: string;
  status: string;
  assignedTo: string;
  regulations: string[];
}

interface VendorAssessment {
  id: string;
  vendorName: string;
  serviceDescription: string;
  assessmentScore: number;
  riskLevel: string;
  complianceStatus: string;
  lastAssessmentDate: string;
  nextAssessmentDue: string;
  regulations: string[];
}

interface ConsentRecord {
  id: string;
  employeeName: string;
  hrContactName: string;
  hrContactEmail: string;
  consentType: string;
  serviceProvider: string;
  consentGiven: boolean;
  consentDate: string | null;
  status: string;
  regulations: string[];
}

// Enhanced localStorage service with backward compatibility
export const localStorageService = {
  // Generic storage methods with enhanced caching
  setItem: async (key: string, data: unknown, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.set(key, data, userId);
  },

  getItem: async <T>(key: string, defaultValue: T, userId?: string): Promise<T> => {
    return await enhancedLocalStorageService.get(key, defaultValue, userId);
  },

  removeItem: async (key: string, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.remove(key, userId);
  },

  // Data Rights Requests with enhanced caching
  saveDataRightsRequest: async (request: DataRightsRequest, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.saveDataRightsRequest(request, userId);
  },

  getDataRightsRequests: async (userId?: string): Promise<DataRightsRequest[]> => {
    return await enhancedLocalStorageService.getDataRightsRequests(userId);
  },

  // Privacy Incidents with enhanced caching
  savePrivacyIncident: async (incident: PrivacyIncident, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.savePrivacyIncident(incident, userId);
  },

  getPrivacyIncidents: async (userId?: string): Promise<PrivacyIncident[]> => {
    return await enhancedLocalStorageService.getPrivacyIncidents(userId);
  },

  // Vendor Assessments with enhanced caching
  saveVendorAssessment: async (vendor: VendorAssessment, userId?: string): Promise<void> => {
    const vendors = await enhancedLocalStorageService.get('vendor_assessments', [], userId);
    const existingIndex = vendors.findIndex(v => v.id === vendor.id);
    
    if (existingIndex >= 0) {
      vendors[existingIndex] = vendor;
    } else {
      vendors.push(vendor);
    }
    
    await enhancedLocalStorageService.set('vendor_assessments', vendors, userId);
  },

  getVendorAssessments: async (userId?: string): Promise<VendorAssessment[]> => {
    return await enhancedLocalStorageService.get('vendor_assessments', [], userId);
  },

  // Consent Records with enhanced caching
  saveConsentRecord: async (consent: ConsentRecord, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.saveConsentRecord(consent, userId);
  },

  getConsentRecords: async (userId?: string): Promise<ConsentRecord[]> => {
    return await enhancedLocalStorageService.getConsentRecords(userId);
  },

  // Compliance Obligations with enhanced caching
  saveComplianceObligation: async (obligation: unknown, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.saveComplianceObligation(obligation, userId);
  },

  getComplianceObligations: async (userId?: string): Promise<unknown[]> => {
    return await enhancedLocalStorageService.getComplianceObligations(userId);
  },

  // Form autosave functionality with enhanced caching
  saveFormData: async (formId: string, data: unknown, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.saveFormData(formId, data, userId);
  },

  getFormData: async (formId: string, userId?: string): Promise<unknown> => {
    return await enhancedLocalStorageService.getFormData(formId, userId);
  },

  clearFormData: async (formId: string, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.clearFormData(formId, userId);
  },

  // Settings and preferences with enhanced caching
  saveUserPreferences: async (preferences: unknown, userId?: string): Promise<void> => {
    await enhancedLocalStorageService.saveUserPreferences(preferences, userId);
  },

  getUserPreferences: async (userId?: string): Promise<unknown> => {
    return await enhancedLocalStorageService.getUserPreferences(userId);
  },

  // Clear all data with enhanced service
  clearAllData: async (userId?: string): Promise<void> => {
    await enhancedLocalStorageService.clear(userId);
  },

  // Enhanced service methods
  forceSync: async (): Promise<void> => {
    await enhancedLocalStorageService.forceSync();
  },

  getSyncStatus: () => {
    return enhancedLocalStorageService.getSyncStatus();
  },

  updateConfig: (config: unknown): void => {
    enhancedLocalStorageService.updateConfig(config);
  },

  getConfig: () => {
    return enhancedLocalStorageService.getConfig();
  }
};