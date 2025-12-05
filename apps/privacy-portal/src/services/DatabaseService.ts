// src/services/DatabaseService.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface DatabaseStatus {
  isConnected: boolean;
  isConfigured: boolean;
  mode: 'production' | 'demo' | 'offline';
  lastSync?: Date;
  error?: string;
}

export interface DataSubjectRequest {
  id: string;
  organization_id: string;
  user_id?: string;
  request_type: string;
  requester_name: string;
  requester_email: string;
  requester_relationship?: string;
  student_identifier?: string;
  request_details: Record<string, unknown>;
  applicable_regulations: string[];
  status: string;
  submitted_at: Date;
  due_date: Date;
  completed_at?: Date;
  assigned_to?: string;
  notes?: string;
  response_data: Record<string, unknown>;
  verification_status?: string;
  communication_log: Array<Record<string, unknown>>;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: string;
  organization_id?: string;
  role: string;
  full_name?: string;
  email?: string;
  department?: string;
  avatar_url?: string;
  settings: Record<string, unknown>;
  preferences: Record<string, unknown>;
  last_login?: Date;
  login_count: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  private status: DatabaseStatus = {
    isConnected: false,
    isConfigured: false,
    mode: 'demo'
  };

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables not configured. Running in demo mode.');
      this.status = {
        isConnected: false,
        isConfigured: false,
        mode: 'demo'
      };
      return;
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        },
        db: {
          schema: 'cybercorrect' // Use differentiated schema
        }
      });

      this.status = {
        isConnected: true,
        isConfigured: true,
        mode: 'production'
      };

      this.testConnection();
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      this.status = {
        isConnected: false,
        isConfigured: true,
        mode: 'demo',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async testConnection() {
    if (!this.supabase) return;

    try {
      // Test connection by trying to access a simple query
      const { error } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        console.warn('Database connection test failed:', error.message);
        this.status.mode = 'demo';
        this.status.isConnected = false;
        this.status.error = error.message;
      } else {
        this.status.isConnected = true;
        this.status.lastSync = new Date();
      }
    } catch (error) {
      console.warn('Database connection test error:', error);
      this.status.mode = 'demo';
      this.status.isConnected = false;
      this.status.error = error instanceof Error ? error.message : 'Connection test failed';
    }
  }

  public getStatus(): DatabaseStatus {
    return { ...this.status };
  }

  public isOnline(): boolean {
    return this.status.isConnected && this.status.mode === 'production';
  }

  public isDemoMode(): boolean {
    return this.status.mode === 'demo';
  }

  // Data Subject Requests
  public async createDataSubjectRequest(request: Omit<DataSubjectRequest, 'id' | 'created_at' | 'updated_at'>): Promise<DataSubjectRequest> {
    const newRequest: DataSubjectRequest = {
      ...request,
      id: this.generateId(),
      created_at: new Date(),
      updated_at: new Date()
    };

    if (this.isOnline() && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('data_subject_requests')
          .insert(newRequest)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to save to database, storing locally:', error);
        this.storeLocally('data_subject_requests', newRequest);
        return newRequest;
      }
    } else {
      this.storeLocally('data_subject_requests', newRequest);
      return newRequest;
    }
  }

  public async getDataSubjectRequests(userId?: string): Promise<DataSubjectRequest[]> {
    if (this.isOnline() && this.supabase) {
      try {
        let query = this.supabase
          .from('data_subject_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.warn('Failed to fetch from database, using local data:', error);
        return this.getLocalData('data_subject_requests');
      }
    } else {
      return this.getLocalData('data_subject_requests');
    }
  }

  public async updateDataSubjectRequest(id: string, updates: Partial<DataSubjectRequest>): Promise<DataSubjectRequest> {
    const updatedRequest = {
      ...updates,
      updated_at: new Date()
    };

    if (this.isOnline() && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('data_subject_requests')
          .update(updatedRequest)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to update in database, updating locally:', error);
        this.updateLocalData('data_subject_requests', id, updatedRequest);
        return this.getLocalData('data_subject_requests').find(r => r.id === id)!;
      }
    } else {
      this.updateLocalData('data_subject_requests', id, updatedRequest);
      return this.getLocalData('data_subject_requests').find(r => r.id === id)!;
    }
  }

  // Profiles
  public async createProfile(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> {
    const newProfile: Profile = {
      ...profile,
      id: this.generateId(),
      created_at: new Date(),
      updated_at: new Date()
    };

    if (this.isOnline() && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to save profile to database, storing locally:', error);
        this.storeLocally('profiles', newProfile);
        return newProfile;
      }
    } else {
      this.storeLocally('profiles', newProfile);
      return newProfile;
    }
  }

  public async getProfile(userId: string): Promise<Profile | null> {
    if (this.isOnline() && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Failed to fetch profile from database, using local data:', error);
        return this.getLocalData('profiles').find(p => p.id === userId) || null;
      }
    } else {
      return this.getLocalData('profiles').find(p => p.id === userId) || null;
    }
  }

  // Local Storage Management
  private storeLocally(tableName: string, data: DataSubjectRequest | Profile) {
    try {
      const key = `cc_${tableName}`;
      const existing = this.getLocalData(tableName);
      const updated = [...existing, data];
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to store data locally:', error);
    }
  }

  private getLocalData(tableName: string): Array<DataSubjectRequest | Profile> {
    try {
      const key = `cc_${tableName}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get local data:', error);
      return [];
    }
  }

  private updateLocalData(tableName: string, id: string, updates: Partial<DataSubjectRequest | Profile>) {
    try {
      const key = `cc_${tableName}`;
      const existing = this.getLocalData(tableName);
      const updated = existing.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update local data:', error);
    }
  }

  private generateId(): string {
    return 'cc-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Sync Management
  public async syncPendingData(): Promise<void> {
    if (!this.isOnline() || !this.supabase) {
      console.log('Cannot sync: database not available');
      return;
    }

    console.log('Syncing pending data...');
    
    // Sync data subject requests
    const localRequests = this.getLocalData('data_subject_requests');
    for (const request of localRequests) {
      try {
        await this.supabase
          .from('data_subject_requests')
          .upsert(request);
      } catch (error) {
        console.error('Failed to sync request:', error);
      }
    }

    // Sync profiles
    const localProfiles = this.getLocalData('profiles');
    for (const profile of localProfiles) {
      try {
        await this.supabase
          .from('profiles')
          .upsert(profile);
      } catch (error) {
        console.error('Failed to sync profile:', error);
      }
    }

    this.status.lastSync = new Date();
    console.log('Sync completed');
  }

  // Demo Data
  public generateDemoData(): void {
    if (this.isDemoMode()) {
      const demoRequests: DataSubjectRequest[] = [
        {
          id: 'demo-1',
          organization_id: 'demo-org',
          user_id: 'demo-user',
          request_type: 'access',
          requester_name: 'John Doe',
          requester_email: 'john.doe@example.com',
          requester_relationship: 'self',
          student_identifier: 'STU001',
          request_details: { reason: 'Personal data access request' },
          applicable_regulations: ['FERPA', 'COPPA'],
          status: 'submitted',
          submitted_at: new Date(),
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          response_data: {},
          communication_log: [],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 'demo-2',
          organization_id: 'demo-org',
          user_id: 'demo-user',
          request_type: 'erasure',
          requester_name: 'Jane Smith',
          requester_email: 'jane.smith@example.com',
          requester_relationship: 'parent',
          student_identifier: 'STU002',
          request_details: { reason: 'Data deletion request' },
          applicable_regulations: ['FERPA'],
          status: 'in_progress',
          submitted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          due_date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
          response_data: {},
          communication_log: [],
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          updated_at: new Date()
        }
      ];

      localStorage.setItem('cc_data_subject_requests', JSON.stringify(demoRequests));

      const demoProfile: Profile = {
        id: 'demo-user',
        organization_id: 'demo-org',
        role: 'student',
        full_name: 'Demo User',
        email: 'demo@example.com',
        department: 'Computer Science',
        settings: {},
        preferences: {},
        login_count: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };

      localStorage.setItem('cc_profiles', JSON.stringify([demoProfile]));
    }
  }
}

export const databaseService = new DatabaseService();
