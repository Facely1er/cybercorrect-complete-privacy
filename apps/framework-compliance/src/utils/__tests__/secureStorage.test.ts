import { describe, it, expect, beforeEach, vi } from 'vitest'
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from '../storage/secureStorage'

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
    it('should handle localStorage errors gracefully on setItem', () => {
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

    it('should handle localStorage errors gracefully on getItem', () => {
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })
      
      const value = secureStorage.getItem('error-key')
      expect(value).toBe(null)
      
      localStorage.getItem = originalGetItem
    })

    it('should handle parse errors gracefully', () => {
      localStorage.setItem('invalid-key', 'invalid-json-{')
      const value = secureStorage.getItem('invalid-key', 'default')
      expect(value).toBe('default')
    })

    it('should handle legacy format items', () => {
      // Set a legacy format item (raw JSON string)
      localStorage.setItem('legacy-key', JSON.stringify('legacy-value'))
      const value = secureStorage.getItem('legacy-key')
      expect(value).toBe('legacy-value')
    })

    it('should handle items with null/undefined values', () => {
      localStorage.setItem('null-key', 'null')
      const value = secureStorage.getItem('null-key')
      expect(value).toBe(null)
    })

    it('should handle unavailable localStorage', () => {
      const originalLocalStorage = window.localStorage
      // TypeScript workaround for deleting window.localStorage in tests
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).localStorage
      
      const result = secureStorage.setItem('test-key', 'test-value')
      expect(result).toBe(false)
      
      const value = secureStorage.getItem('test-key', 'default')
      expect(value).toBe('default')
      
      window.localStorage = originalLocalStorage
    })

    it('should handle errors on removeItem', () => {
      const originalRemoveItem = localStorage.removeItem
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Remove error')
      })
      
      const result = secureStorage.removeItem('error-key')
      expect(result).toBe(false)
      
      localStorage.removeItem = originalRemoveItem
    })

    it('should handle errors on clear', () => {
      const originalClear = localStorage.clear
      localStorage.clear = vi.fn(() => {
        throw new Error('Clear error')
      })
      
      const result = secureStorage.clear()
      expect(result).toBe(false)
      
      localStorage.clear = originalClear
    })

    it('should handle decryption errors gracefully', () => {
      // Set an invalid encrypted item
      localStorage.setItem('bad-encrypted-key', JSON.stringify({
        data: 'invalid-base64-!@#$',
        encrypted: true,
      }))
      
      const value = secureStorage.getItem('bad-encrypted-key', 'default')
      expect(value).toBe('default')
    })

    it('should handle decompression errors gracefully', () => {
      // Set an invalid compressed item
      localStorage.setItem('bad-compressed-key', JSON.stringify({
        data: 'invalid-base64-!@#$',
        compressed: true,
      }))
      
      const value = secureStorage.getItem('bad-compressed-key', 'default')
      expect(value).toBe('default')
    })

    it('should handle item with missing data field', () => {
      localStorage.setItem('missing-data-key', JSON.stringify({
        encrypted: false,
        compressed: false,
      }))
      
      const value = secureStorage.getItem('missing-data-key', 'default')
      expect(value).toBe('default')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      secureStorage.setItem('empty-key', '')
      const value = secureStorage.getItem('empty-key')
      expect(value).toBe('')
    })

    it('should handle zero value', () => {
      secureStorage.setItem('zero-key', 0)
      const value = secureStorage.getItem('zero-key')
      expect(value).toBe(0)
    })

    it('should handle false value', () => {
      secureStorage.setItem('false-key', false)
      const value = secureStorage.getItem('false-key')
      expect(value).toBe(false)
    })

    it('should handle array values', () => {
      const arrayValue = [1, 2, 3, 'test']
      secureStorage.setItem('array-key', arrayValue)
      const value = secureStorage.getItem('array-key')
      expect(value).toEqual(arrayValue)
    })

    it('should handle nested objects with multiple levels', () => {
      const nestedObject = {
        level1: {
          level2: {
            level3: {
              value: 'deep'
            }
          }
        }
      }
      secureStorage.setItem('nested-key', nestedObject)
      const value = secureStorage.getItem('nested-key')
      expect(value).toEqual(nestedObject)
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
