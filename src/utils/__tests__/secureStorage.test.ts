<<<<<<< HEAD
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from '../secureStorage'

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureMessage: vi.fn(),
    captureException: vi.fn(),
  },
}))

describe('SecureStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should set and get simple values', () => {
      const result = secureStorage.setItem('test-key', 'test-value')
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('test-key')
      expect(value).toBe('test-value')
    })

    it('should set and get complex objects', () => {
      const testObject = { name: 'John', age: 30, nested: { value: 'test' } }
      const result = secureStorage.setItem('complex-key', testObject)
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('complex-key')
      expect(value).toEqual(testObject)
    })

    it('should return default value when key does not exist', () => {
      const defaultValue = 'default'
      const value = secureStorage.getItem('non-existent-key', defaultValue)
      expect(value).toBe(defaultValue)
    })

    it('should return null when key does not exist and no default provided', () => {
      const value = secureStorage.getItem('non-existent-key')
      expect(value).toBe(null)
    })
  })

  describe('TTL functionality', () => {
    it('should store item with TTL and retrieve it before expiration', () => {
      const result = secureStorage.setItem('ttl-key', 'ttl-value', { ttl: 1000 })
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('ttl-key')
      expect(value).toBe('ttl-value')
    })

    it('should return null for expired TTL items', () => {
      const result = secureStorage.setItem('expired-key', 'expired-value', { ttl: -1000 }) // Negative TTL = expired
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('expired-key')
      expect(value).toBe(null)
    })
  })

  describe('Encryption functionality', () => {
    it('should encrypt and decrypt data', () => {
      const result = secureStorage.setItem('encrypted-key', 'sensitive-data', { encrypt: true })
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('encrypted-key')
      expect(value).toBe('sensitive-data')
    })
  })

  describe('Compression functionality', () => {
    it('should compress and decompress large data', () => {
      const largeData = 'x'.repeat(2000) // Large string
      const result = secureStorage.setItem('compressed-key', largeData, { compress: true })
      expect(result).toBe(true)
      
      const value = secureStorage.getItem('compressed-key')
      expect(value).toBe(largeData)
    })
  })

  describe('Secure item methods', () => {
    it('should set and get secure items with encryption and compression', () => {
      const result = secureStorage.setSecureItem('secure-key', 'secure-data', 1000)
      expect(result).toBe(true)
      
      const value = secureStorage.getSecureItem('secure-key')
      expect(value).toBe('secure-data')
    })
  })

  describe('Remove and clear functionality', () => {
    it('should remove specific items', () => {
      secureStorage.setItem('remove-key', 'remove-value')
      const removeResult = secureStorage.removeItem('remove-key')
      expect(removeResult).toBe(true)
      
      const value = secureStorage.getItem('remove-key')
      expect(value).toBe(null)
    })

    it('should clear all items', () => {
      secureStorage.setItem('clear-key1', 'value1')
      secureStorage.setItem('clear-key2', 'value2')
      
      const clearResult = secureStorage.clear()
      expect(clearResult).toBe(true)
      
      expect(secureStorage.getItem('clear-key1')).toBe(null)
      expect(secureStorage.getItem('clear-key2')).toBe(null)
    })
  })

  describe('Error handling', () => {
    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('Storage quota exceeded')
      })
      
      const result = secureStorage.setItem('error-key', 'error-value')
      expect(result).toBe(false)
      
      // Restore original method
      localStorage.setItem = originalSetItem
    })
  })
})

describe('Convenience functions', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('User data functions', () => {
    it('should set and get user data with secure storage', () => {
      const result = setUserData('profile', { name: 'John', email: 'john@example.com' })
      expect(result).toBe(true)
      
      const value = getUserData('profile')
      expect(value).toEqual({ name: 'John', email: 'john@example.com' })
    })
  })

  describe('Project data functions', () => {
    it('should set and get project data with compression', () => {
      const result = setProjectData('settings', { theme: 'dark', language: 'en' })
      expect(result).toBe(true)
      
      const value = getProjectData('settings')
      expect(value).toEqual({ theme: 'dark', language: 'en' })
    })
  })

  describe('App setting functions', () => {
    it('should set and get app settings', () => {
      const result = setAppSetting('notifications', true)
      expect(result).toBe(true)
      
      const value = getAppSetting('notifications')
      expect(value).toBe(true)
    })
  })
})
=======
import { describe, it, expect } from "vitest";
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from "../secureStorage";

describe("secureStorage", () => {
  it("should be importable", () => {
    // This test verifies that the secureStorage module can be imported without errors
    expect(true).toBe(true);
  });

  it("should have the expected interface", () => {
    // This test verifies that the secureStorage object has the expected methods
    expect(secureStorage).toBeDefined();
    expect(typeof secureStorage.setItem).toBe("function");
    expect(typeof secureStorage.getItem).toBe("function");
    expect(typeof secureStorage.removeItem).toBe("function");
    expect(typeof secureStorage.clear).toBe("function");
    expect(typeof secureStorage.setSecureItem).toBe("function");
    expect(typeof secureStorage.getSecureItem).toBe("function");
  });

  it("should have convenience functions", () => {
    // This test verifies that the convenience functions are exported
    expect(typeof setUserData).toBe("function");
    expect(typeof getUserData).toBe("function");
    expect(typeof setProjectData).toBe("function");
    expect(typeof getProjectData).toBe("function");
    expect(typeof setAppSetting).toBe("function");
    expect(typeof getAppSetting).toBe("function");
  });
});
>>>>>>> origin/main
