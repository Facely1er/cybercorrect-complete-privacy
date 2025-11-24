// Backend service for managing all database operations with cybercorrect schema
import { supabase } from '../lib/supabase';
import type { 
  Profile, 
  DataSubjectRequest, 
  ConsentRecord, 
  PrivacyIncident, 
  ComplianceTracking 
} from '../lib/supabase';

export interface BackendServiceConfig {
  enableOfflineMode: boolean;
  retryAttempts: number;
  syncInterval: number;
}

const defaultConfig: BackendServiceConfig = {
  enableOfflineMode: true,
  retryAttempts: 3,
  syncInterval: 30000 // 30 seconds
};

export class BackendService {
  private config: BackendServiceConfig;
  private isOnline: boolean = navigator.onLine;

  constructor(config: Partial<BackendServiceConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.setupOnlineStatusListener();
  }

  private setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async syncPendingChanges() {
    if (!this.isOnline) return;

    try {
      // Get pending changes from localStorage
      const pendingChanges = this.getPendingChanges();
      
      for (const change of pendingChanges) {
        await this.processPendingChange(change);
      }
    } catch (error) {
      console.error('Error syncing pending changes:', error);
    }
  }

  private getPendingChanges() {
    // Implementation to get pending changes from localStorage
    // This would integrate with your existing localStorage service
    return [];
  }

  private async processPendingChange(change: unknown) {
    // Use change parameter to avoid unused variable warning
    console.log('Processing change:', change);
    // Implementation to process individual pending changes
    // This would handle retry logic and error handling
  }

  // Profile operations
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  }

  // Data Subject Requests operations
  async createDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'created_at' | 'updated_at'>): Promise<DataSubjectRequest | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.data_subject_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating data subject request:', error);
      return null;
    }
  }

  async getDataSubjectRequests(userId: string, organizationId?: string): Promise<DataSubjectRequest[]> {
    try {
      let query = supabase
        .from('cybercorrect.data_subject_requests')
        .select('*')
        .eq('user_id', userId);

      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching data subject requests:', error);
      return [];
    }
  }

  async updateDataSubjectRequest(requestId: string, updates: Partial<DataSubjectRequest>): Promise<DataSubjectRequest | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.data_subject_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating data subject request:', error);
      return null;
    }
  }

  // Consent Records operations
  async createConsentRecord(consent: Omit<ConsentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ConsentRecord | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.consent_records')
        .insert([consent])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating consent record:', error);
      return null;
    }
  }

  async getConsentRecords(organizationId: string, studentId?: string): Promise<ConsentRecord[]> {
    try {
      let query = supabase
        .from('cybercorrect.consent_records')
        .select('*')
        .eq('organization_id', organizationId);

      if (studentId) {
        query = query.eq('student_id', studentId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching consent records:', error);
      return [];
    }
  }

  async updateConsentRecord(consentId: string, updates: Partial<ConsentRecord>): Promise<ConsentRecord | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.consent_records')
        .update(updates)
        .eq('id', consentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating consent record:', error);
      return null;
    }
  }

  // Privacy Incidents operations
  async createPrivacyIncident(incident: Omit<PrivacyIncident, 'id' | 'created_at' | 'updated_at'>): Promise<PrivacyIncident | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.privacy_incidents')
        .insert([incident])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating privacy incident:', error);
      return null;
    }
  }

  async getPrivacyIncidents(organizationId: string): Promise<PrivacyIncident[]> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.privacy_incidents')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching privacy incidents:', error);
      return [];
    }
  }

  async updatePrivacyIncident(incidentId: string, updates: Partial<PrivacyIncident>): Promise<PrivacyIncident | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.privacy_incidents')
        .update(updates)
        .eq('id', incidentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating privacy incident:', error);
      return null;
    }
  }

  // Compliance Tracking operations
  async createComplianceTracking(compliance: Omit<ComplianceTracking, 'id' | 'created_at' | 'updated_at'>): Promise<ComplianceTracking | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.compliance_tracking')
        .insert([compliance])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating compliance tracking:', error);
      return null;
    }
  }

  async getComplianceTracking(organizationId: string, assignedTo?: string): Promise<ComplianceTracking[]> {
    try {
      let query = supabase
        .from('cybercorrect.compliance_tracking')
        .select('*')
        .eq('organization_id', organizationId);

      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching compliance tracking:', error);
      return [];
    }
  }

  async updateComplianceTracking(complianceId: string, updates: Partial<ComplianceTracking>): Promise<ComplianceTracking | null> {
    try {
      const { data, error } = await supabase
        .from('cybercorrect.compliance_tracking')
        .update(updates)
        .eq('id', complianceId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating compliance tracking:', error);
      return null;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string }> {
    try {
      const { error } = await supabase
        .from('cybercorrect.application_metadata')
        .select('application_name')
        .limit(1);

      if (error) throw error;

      return {
        status: 'healthy',
        message: 'Database connection successful'
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Database connection failed: ${error}`
      };
    }
  }

  // Sync status
  getSyncStatus(): { isOnline: boolean; lastSync?: Date } {
    return {
      isOnline: this.isOnline,
      lastSync: this.isOnline ? new Date() : undefined
    };
  }
}

// Export singleton instance
export const backendService = new BackendService();