// Enhanced localStorage service with intelligent caching and synchronization
// Note: Using lazy import to avoid circular dependency issues

import type { 
  StorageDataType, 
  StorageTableName, 
  SyncQueueItem,
  DataRightsRequest,
  PrivacyIncident,
  ConsentRecord,
  ComplianceObligation,
  UserPreferences
} from '../types/storage';

interface CacheMetadata {
  key: string;
  type: StorageTableName;
  dataHash: string;
  lastModified: number;
  expiresAt?: number;
  syncStatus: 'synced' | 'pending' | 'error' | 'offline';
  version: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxRetries: number;
  syncInterval: number; // Sync interval in milliseconds
  offlineMode: boolean;
}

const DEFAULT_CONFIG: CacheConfig = {
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  maxRetries: 3,
  syncInterval: 5 * 60 * 1000, // 5 minutes
  offlineMode: false
};

class EnhancedLocalStorageService {
  private config: CacheConfig;
  private syncQueue: SyncQueueItem[] = [];
  private syncTimer: NodeJS.Timeout | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeEventListeners();
    this.startSyncTimer();
  }

  private initializeEventListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.config.offlineMode = false;
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.config.offlineMode = true;
    });

    // Listen for beforeunload to save pending changes
    window.addEventListener('beforeunload', () => {
      this.savePendingChanges();
    });
  }

  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      if (this.isOnline && !this.config.offlineMode) {
        this.processSyncQueue();
      }
    }, this.config.syncInterval);
  }

  private generateDataHash(data: StorageDataType): string {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }

  private getCacheKey(type: string, userId?: string): string {
    const userPrefix = userId ? `user_${userId}_` : '';
    return `cc_${userPrefix}${type}`;
  }

  private getCacheMetadata(type: string, userId?: string): CacheMetadata | null {
    const key = this.getCacheKey(type, userId);
    const metadataKey = `${key}_metadata`;
    
    try {
      const metadata = localStorage.getItem(metadataKey);
      return metadata ? JSON.parse(metadata) : null;
    } catch (error) {
      console.error('Error reading cache metadata:', error);
      return null;
    }
  }

  private setCacheMetadata(type: string, metadata: CacheMetadata, userId?: string): void {
    const key = this.getCacheKey(type, userId);
    const metadataKey = `${key}_metadata`;
    
    try {
      localStorage.setItem(metadataKey, JSON.stringify(metadata));
    } catch (error) {
      console.error('Error saving cache metadata:', error);
    }
  }

  private isCacheValid(metadata: CacheMetadata): boolean {
    const now = Date.now();
    
    // Check if cache has expired
    if (metadata.expiresAt && now > metadata.expiresAt) {
      return false;
    }
    
    // Check if cache is too old (fallback TTL)
    if (now - metadata.lastModified > this.config.ttl) {
      return false;
    }
    
    return true;
  }

  private async syncToBackend(type: StorageTableName, data: StorageDataType, userId?: string): Promise<boolean> {
    if (!this.isOnline || this.config.offlineMode) {
      return false;
    }

    try {
      // Lazy import supabase to avoid circular dependency
      const { supabase } = await import('../lib/supabase');
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl === 'https://placeholder.supabase.co' || 
          supabaseAnonKey === 'placeholder-key') {
        return false; // Supabase not configured
      }

      const { error } = await supabase
        .from('cybercorrect.cache_metadata')
        .upsert({
          user_id: userId,
          cache_key: this.getCacheKey(type, userId),
          cache_type: type,
          data_hash: this.generateDataHash(data),
          last_modified: new Date().toISOString(),
          expires_at: new Date(Date.now() + this.config.ttl).toISOString(),
          sync_status: 'synced'
        });

      if (error) {
        console.error('Error syncing to backend:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error syncing to backend:', error);
      return false;
    }
  }

  private async loadFromBackend(type: string, userId?: string): Promise<unknown | null> {
    if (!this.isOnline || this.config.offlineMode) {
      return null;
    }

    try {
      // Lazy import supabase to avoid circular dependency
      const { supabase } = await import('../lib/supabase');
      
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey || 
          supabaseUrl === 'https://placeholder.supabase.co' || 
          supabaseAnonKey === 'placeholder-key') {
        return null; // Supabase not configured
      }

      const { data, error } = await supabase
        .from('cybercorrect.cache_metadata')
        .select('*')
        .eq('user_id', userId)
        .eq('cache_type', type)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if backend data is newer
      const localMetadata = this.getCacheMetadata(type, userId);
      if (localMetadata && new Date(data.last_modified) <= new Date(localMetadata.lastModified)) {
        return null; // Local data is newer or same
      }

      return data;
    } catch (error) {
      console.error('Error loading from backend:', error);
      return null;
    }
  }

  private addToSyncQueue(table: StorageTableName, operation: 'create' | 'update' | 'delete', data: StorageDataType): void {
    const queueItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      table,
      operation,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.syncQueue.push(queueItem);
    this.saveSyncQueue();
  }

  private saveSyncQueue(): void {
    try {
      localStorage.setItem('cc_sync_queue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  private loadSyncQueue(): void {
    try {
      const queue = localStorage.getItem('cc_sync_queue');
      this.syncQueue = queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }

  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.length === 0 || !this.isOnline || this.config.offlineMode) {
      return;
    }

    const itemsToProcess = [...this.syncQueue];
    this.syncQueue = [];

    for (const item of itemsToProcess) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error('Error syncing item:', error);
        
        // Retry logic
        if (item.retryCount < this.config.maxRetries) {
          item.retryCount++;
          this.syncQueue.push(item);
        }
      }
    }

    this.saveSyncQueue();
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    // This would contain the actual sync logic for each table
    // For now, we'll just simulate success
    console.log(`Syncing ${item.operation} operation for ${item.table}`);
  }

  private savePendingChanges(): void {
    // Save any pending changes before page unload
    this.saveSyncQueue();
  }

  // Public API methods
  async get<T>(type: string, defaultValue: T, userId?: string): Promise<T> {
    const cacheKey = this.getCacheKey(type, userId);
    const metadata = this.getCacheMetadata(type, userId);

    // Check if we have valid cached data
    if (metadata && this.isCacheValid(metadata)) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (error) {
        console.error('Error reading cached data:', error);
      }
    }

    // Try to load from backend
    const backendData = await this.loadFromBackend(type, userId);
    if (backendData) {
      this.set(type, backendData, userId);
      return backendData;
    }

    return defaultValue;
  }

  async set<T>(type: string, data: T, userId?: string): Promise<void> {
    const cacheKey = this.getCacheKey(type, userId);
    const dataHash = this.generateDataHash(data);
    const now = Date.now();

    // Save to localStorage
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return;
    }

    // Update metadata
    const metadata: CacheMetadata = {
      key: cacheKey,
      type: type as StorageTableName,
      dataHash,
      lastModified: now,
      expiresAt: now + this.config.ttl,
      syncStatus: this.isOnline ? 'pending' : 'offline',
      version: 1
    };

    this.setCacheMetadata(type, metadata, userId);

    // Add to sync queue
    this.addToSyncQueue(type, 'update', data);

    // Try to sync immediately if online
    if (this.isOnline && !this.config.offlineMode) {
      await this.syncToBackend(type, data, userId);
    }
  }

  async remove(type: string, userId?: string): Promise<void> {
    const cacheKey = this.getCacheKey(type, userId);
    
    try {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_metadata`);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }

    // Add to sync queue for deletion
    this.addToSyncQueue(type, 'delete', null);
  }

  async clear(userId?: string): Promise<void> {
    const keys = Object.keys(localStorage);
    const userPrefix = userId ? `user_${userId}_` : '';
    const ccKeys = keys.filter(key => key.startsWith(`cc_${userPrefix}`));
    
    ccKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error clearing localStorage key:', key, error);
      }
    });

    // Clear sync queue
    this.syncQueue = [];
    this.saveSyncQueue();
  }

  // Form-specific methods with enhanced caching
  async saveFormData<T>(formId: string, data: T, userId?: string): Promise<void> {
    const formKey = `form_${formId}`;
    const formData = {
      data,
      timestamp: Date.now(),
      version: 1
    };

    await this.set(formKey, formData, userId);
  }

  async getFormData<T>(formId: string, userId?: string): Promise<T | null> {
    const formKey = `form_${formId}`;
    const formData = await this.get(formKey, null, userId);
    
    if (formData && formData.timestamp) {
      // Check if form data is still valid (24 hours)
      if (Date.now() - formData.timestamp < 24 * 60 * 60 * 1000) {
        return formData.data;
      }
    }
    
    return null;
  }

  async clearFormData(formId: string, userId?: string): Promise<void> {
    const formKey = `form_${formId}`;
    await this.remove(formKey, userId);
  }

  // Data-specific methods with intelligent caching
  async saveDataRightsRequest(request: DataRightsRequest, userId?: string): Promise<void> {
    const requests = await this.getDataRightsRequests(userId);
    const existingIndex = requests.findIndex(r => r.id === request.id);
    
    if (existingIndex >= 0) {
      requests[existingIndex] = request;
    } else {
      requests.push(request);
    }
    
    await this.set('data_rights', requests, userId);
  }

  async getDataRightsRequests(userId?: string): Promise<DataRightsRequest[]> {
    return await this.get('data_rights', [], userId);
  }

  async savePrivacyIncident(incident: PrivacyIncident, userId?: string): Promise<void> {
    const incidents = await this.getPrivacyIncidents(userId);
    const existingIndex = incidents.findIndex(i => i.id === incident.id);
    
    if (existingIndex >= 0) {
      incidents[existingIndex] = incident;
    } else {
      incidents.push(incident);
    }
    
    await this.set('privacy_incidents', incidents, userId);
  }

  async getPrivacyIncidents(userId?: string): Promise<PrivacyIncident[]> {
    return await this.get('privacy_incidents', [], userId);
  }

  async saveConsentRecord(consent: ConsentRecord, userId?: string): Promise<void> {
    const consents = await this.getConsentRecords(userId);
    const existingIndex = consents.findIndex(c => c.id === consent.id);
    
    if (existingIndex >= 0) {
      consents[existingIndex] = consent;
    } else {
      consents.push(consent);
    }
    
    await this.set('consent_records', consents, userId);
  }

  async getConsentRecords(userId?: string): Promise<ConsentRecord[]> {
    return await this.get('consent_records', [], userId);
  }

  async saveComplianceObligation(obligation: ComplianceObligation, userId?: string): Promise<void> {
    const obligations = await this.getComplianceObligations(userId);
    const existingIndex = obligations.findIndex(o => o.id === obligation.id);
    
    if (existingIndex >= 0) {
      obligations[existingIndex] = obligation;
    } else {
      obligations.push(obligation);
    }
    
    await this.set('compliance', obligations, userId);
  }

  async getComplianceObligations(userId?: string): Promise<ComplianceObligation[]> {
    return await this.get('compliance', [], userId);
  }

  // User preferences with enhanced caching
  async saveUserPreferences(preferences: UserPreferences, userId?: string): Promise<void> {
    await this.set('preferences', preferences, userId);
  }

  async getUserPreferences(userId?: string): Promise<UserPreferences> {
    return await this.get('preferences', {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        digest: 'weekly'
      },
      privacy: {
        profileVisibility: 'institution',
        activityTracking: true
      }
    }, userId);
  }

  // Sync management
  async forceSync(): Promise<void> {
    if (this.isOnline && !this.config.offlineMode) {
      await this.processSyncQueue();
    }
  }

  getSyncStatus(): { pending: number; errors: number; offline: boolean } {
    const pending = this.syncQueue.length;
    const errors = this.syncQueue.filter(item => item.retryCount > 0).length;
    
    return {
      pending,
      errors,
      offline: this.config.offlineMode || !this.isOnline
    };
  }

  // Configuration management
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.startSyncTimer();
  }

  getConfig(): CacheConfig {
    return { ...this.config };
  }
}

// Create singleton instance
export const enhancedLocalStorageService = new EnhancedLocalStorageService();

// Export class for testing
export { EnhancedLocalStorageService };

// Export types for use in other modules
export type { CacheMetadata, SyncQueueItem, CacheConfig };