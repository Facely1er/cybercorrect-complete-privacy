import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedLocalStorageService } from './enhancedLocalStorageService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('EnhancedLocalStorageService', () => {
  let service: EnhancedLocalStorageService;

  beforeEach(() => {
    service = new EnhancedLocalStorageService({ offlineMode: true });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  describe('get and set methods', () => {
    it('should store and retrieve data', async () => {
      const testData = { name: 'Test User', email: 'test@example.com' };

      await service.set('user_profile', testData);
      const retrieved = await service.get('user_profile', {});

      expect(retrieved).toEqual(testData);
    });

    it('should return default value when key does not exist', async () => {
      const defaultValue = { name: 'Default' };
      const result = await service.get('nonexistent_key', defaultValue);

      expect(result).toEqual(defaultValue);
    });

    it('should handle complex data structures', async () => {
      const complexData = {
        users: [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }],
        settings: { theme: 'dark', language: 'en' },
        nested: { level1: { level2: { value: 'deep' } } }
      };

      await service.set('complex_data', complexData);
      const retrieved = await service.get('complex_data', {});

      expect(retrieved).toEqual(complexData);
    });
  });

  describe('remove method', () => {
    it('should remove stored data', async () => {
      const testData = { test: 'data' };

      await service.set('test_key', testData);
      await service.remove('test_key');

      const result = await service.get('test_key', null);
      expect(result).toBeNull();
    });
  });

  describe('clear method', () => {
    it('should clear all user data', async () => {
      await service.set('key1', { data: 'value1' });
      await service.set('key2', { data: 'value2' });
      await service.set('key3', { data: 'value3' });

      await service.clear();

      const result1 = await service.get('key1', null);
      const result2 = await service.get('key2', null);
      const result3 = await service.get('key3', null);

      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
    });
  });

  describe('specialized data methods', () => {
    it('should save and retrieve form data', async () => {
      const formData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      };

      await service.saveFormData('contact-form', formData);
      const retrieved = await service.getFormData('contact-form');

      expect(retrieved).toEqual(formData);
    });

    it('should save and retrieve data rights requests', async () => {
      const request = {
        id: 'req-123',
        request_type: 'access' as const,
        requester_name: 'Jane Doe',
        requester_email: 'jane@example.com',
        status: 'submitted' as const,
        submitted_at: new Date(),
        organization_id: 'org-1',
        user_id: 'user-1',
        request_details: {},
        applicable_regulations: ['GDPR'],
        due_date: new Date(),
        response_data: {},
        communication_log: []
      };

      await service.saveDataRightsRequest(request);
      const requests = await service.getDataRightsRequests();

      expect(requests).toHaveLength(1);
      expect(requests[0].id).toBe('req-123');
    });

    it('should save and retrieve privacy incidents', async () => {
      const incident = {
        id: 'inc-123',
        organization_id: 'org-1',
        incident_type: 'data_breach' as const,
        severity: 'high' as const,
        status: 'open' as const,
        title: 'Test Incident',
        description: 'Test description',
        affected_data_types: ['email'],
        affected_individuals_count: 100,
        discovery_date: new Date(),
        reported_date: new Date(),
        containment_actions: [],
        notification_required: true
      };

      await service.savePrivacyIncident(incident);
      const incidents = await service.getPrivacyIncidents();

      expect(incidents).toHaveLength(1);
      expect(incidents[0].title).toBe('Test Incident');
    });

    it('should save and retrieve consent records', async () => {
      const consent = {
        id: 'consent-123',
        organization_id: 'org-1',
        data_subject_id: 'user-1',
        purpose: 'marketing',
        consent_given: true,
        consent_date: new Date(),
        consent_method: 'web_form' as const,
        data_categories: ['email']
      };

      await service.saveConsentRecord(consent);
      const records = await service.getConsentRecords();

      expect(records).toHaveLength(1);
      expect(records[0].purpose).toBe('marketing');
    });

    it('should save and retrieve user preferences', async () => {
      const preferences = {
        theme: 'dark' as const,
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        privacy: {
          analytics: true,
          marketing: false
        }
      };

      await service.saveUserPreferences(preferences);
      const retrieved = await service.getUserPreferences();

      expect(retrieved.theme).toBe('dark');
      expect(retrieved.notifications.email).toBe(true);
    });
  });

  describe('sync status', () => {
    it('should return sync status', () => {
      const status = service.getSyncStatus();

      expect(status).toHaveProperty('pending');
      expect(status).toHaveProperty('errors');
      expect(status).toHaveProperty('offline');
      expect(typeof status.pending).toBe('number');
      expect(typeof status.errors).toBe('number');
      expect(typeof status.offline).toBe('boolean');
    });
  });

  describe('configuration', () => {
    it('should update configuration', () => {
      const newConfig = {
        ttl: 3600000, // 1 hour
        offlineMode: false
      };

      service.updateConfig(newConfig);
      const config = service.getConfig();

      expect(config.ttl).toBe(3600000);
      expect(config.offlineMode).toBe(false);
    });

    it('should return current configuration', () => {
      const config = service.getConfig();

      expect(config).toHaveProperty('ttl');
      expect(config).toHaveProperty('maxRetries');
      expect(config).toHaveProperty('syncInterval');
      expect(config).toHaveProperty('offlineMode');
    });
  });
});
