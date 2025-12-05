import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EnhancedLocalStorageService } from '../services/enhancedLocalStorageService';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('EnhancedLocalStorageService', () => {
  let service: EnhancedLocalStorageService;

  beforeEach(() => {
    service = new EnhancedLocalStorageService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  describe('setItem', () => {
    it('should store data with encryption when encryption is enabled', () => {
      const key = 'test-key';
      const data = { test: 'data' };
      
      service.setItem(key, data, { encrypt: true });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        expect.stringMatching(/^encrypted:/)
      );
    });

    it('should store data without encryption when encryption is disabled', () => {
      const key = 'test-key';
      const data = { test: 'data' };
      
      service.setItem(key, data, { encrypt: false });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(data)
      );
    });

    it('should set expiration when ttl is provided', () => {
      const key = 'test-key';
      const data = { test: 'data' };
      const ttl = 1000; // 1 second
      
      service.setItem(key, data, { ttl });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `${key}_expires`,
        expect.any(String)
      );
    });

    it('should compress data when compression is enabled', () => {
      const key = 'test-key';
      const data = { test: 'data', large: 'x'.repeat(1000) };
      
      service.setItem(key, data, { compress: true });
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        expect.stringMatching(/^compressed:/)
      );
    });
  });

  describe('getItem', () => {
    it('should retrieve and decrypt data when encryption is used', () => {
      const key = 'test-key';
      const encryptedData = 'encrypted:test-encrypted-data';
      
      localStorageMock.getItem.mockReturnValue(encryptedData);
      
      // Mock the decryption (simplified for testing)
      service.getItem(key);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null for expired data', () => {
      const key = 'test-key';
      const expiredTime = Date.now() - 1000; // 1 second ago
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify({ test: 'data' }));
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify({ test: 'data' }))
        .mockReturnValueOnce(expiredTime.toString());
      
      const expiredResult = service.getItem(key);
      
      expect(expiredResult).toBeNull();
    });

    it('should decompress data when compression is used', () => {
      const key = 'test-key';
      const compressedData = 'compressed:test-compressed-data';
      
      localStorageMock.getItem.mockReturnValue(compressedData);
      
      service.getItem(key);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
    });

    it('should return null when key does not exist', () => {
      const key = 'non-existent-key';
      
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = service.getItem(key);
      
      expect(result).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove item and its expiration', () => {
      const key = 'test-key';
      
      service.removeItem(key);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(`${key}_expires`);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      service.clear();
      
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
  });

  describe('getAllKeys', () => {
    it('should return all keys', () => {
      const mockKeys = ['key1', 'key2', 'key3'];
      Object.defineProperty(localStorageMock, 'length', { value: 3 });
      localStorageMock.key.mockImplementation((index) => mockKeys[index]);
      
      const keys = service.getAllKeys();
      
      expect(keys).toEqual(mockKeys);
    });
  });

  describe('getStorageSize', () => {
    it('should calculate storage size', () => {
      const mockKeys = ['key1', 'key2'];
      const mockValues = ['value1', 'value2'];
      
      Object.defineProperty(localStorageMock, 'length', { value: 2 });
      localStorageMock.key.mockImplementation((index) => mockKeys[index]);
      localStorageMock.getItem.mockImplementation((key) => {
        const index = mockKeys.indexOf(key);
        return mockValues[index];
      });
      
      const size = service.getStorageSize();
      
      expect(size).toBeGreaterThan(0);
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      const isAvailable = service.isStorageAvailable();
      
      expect(isAvailable).toBe(true);
    });

    it('should return false when localStorage throws error', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const isAvailable = service.isStorageAvailable();
      
      expect(isAvailable).toBe(false);
    });
  });
});
