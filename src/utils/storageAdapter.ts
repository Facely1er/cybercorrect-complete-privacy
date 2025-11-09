// Storage adapter to bridge privacyportal's localStorageService patterns with secureStorage
import { secureStorage } from './secureStorage';

/**
 * Storage adapter for privacy portal tools
 * Provides a bridge between privacyportal's localStorageService patterns
 * and the secureStorage utility used in cybercorrect-complete-privacy
 */
class StorageAdapter {
  // Consent Management
  getConsentRecords(): any[] {
    return secureStorage.getItem('consent_records', []) || [];
  }

  setConsentRecords(records: any[]): boolean {
    return secureStorage.setItem('consent_records', records);
  }

  // Vendor Assessments
  getVendorAssessments(): any[] {
    return secureStorage.getItem('vendor_assessments', []) || [];
  }

  setVendorAssessments(assessments: any[]): boolean {
    return secureStorage.setItem('vendor_assessments', assessments);
  }

  // DPIAs
  getDpias(): any[] {
    return secureStorage.getItem('dpias', []) || [];
  }

  setDpias(dpias: any[]): boolean {
    return secureStorage.setItem('dpias', dpias);
  }

  // Retention Policies
  getRetentionPolicies(): any[] {
    return secureStorage.getItem('retention_policies', []) || [];
  }

  setRetentionPolicies(policies: any[]): boolean {
    return secureStorage.setItem('retention_policies', policies);
  }

  getDataRecords(): any[] {
    return secureStorage.getItem('data_records', []) || [];
  }

  setDataRecords(records: any[]): boolean {
    return secureStorage.setItem('data_records', records);
  }

  // Privacy by Design Assessments
  getPrivacyByDesignAssessments(): any[] {
    return secureStorage.getItem('privacy_by_design_assessments', []) || [];
  }

  setPrivacyByDesignAssessments(assessments: any[]): boolean {
    return secureStorage.setItem('privacy_by_design_assessments', assessments);
  }

  // Service Providers
  getServiceProviders(): any[] {
    return secureStorage.getItem('service_providers', []) || [];
  }

  setServiceProviders(providers: any[]): boolean {
    return secureStorage.setItem('service_providers', providers);
  }

  // Privacy Incidents
  getPrivacyIncidents(): any[] {
    return secureStorage.getItem('privacy_incidents', []) || [];
  }

  setPrivacyIncidents(incidents: any[]): boolean {
    return secureStorage.setItem('privacy_incidents', incidents);
  }

  // Generic get/set for compatibility
  getItem<T>(key: string, defaultValue?: T): T | null {
    return secureStorage.getItem(key, defaultValue);
  }

  setItem<T>(key: string, value: T): boolean {
    return secureStorage.setItem(key, value);
  }
}

export const storageAdapter = new StorageAdapter();

