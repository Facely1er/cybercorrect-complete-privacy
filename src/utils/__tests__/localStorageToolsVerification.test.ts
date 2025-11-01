import { describe, it, expect, beforeEach, vi } from 'vitest'
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from '../secureStorage'

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureMessage: vi.fn(),
    captureException: vi.fn(),
  },
}))

describe('localStorage Tools Verification', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Core localStorage functionality', () => {
    it('should handle basic localStorage operations', () => {
      // Test basic set/get
      localStorage.setItem('test-key', 'test-value')
      expect(localStorage.getItem('test-key')).toBe('test-value')
      
      // Test remove
      localStorage.removeItem('test-key')
      expect(localStorage.getItem('test-key')).toBeNull()
      
      // Test clear
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')
      localStorage.clear()
      expect(localStorage.getItem('key1')).toBeNull()
      expect(localStorage.getItem('key2')).toBeNull()
    })

    it('should handle JSON serialization/deserialization', () => {
      const testObject = {
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        nested: { key: 'value' }
      }

      localStorage.setItem('test-object', JSON.stringify(testObject))
      const retrieved = JSON.parse(localStorage.getItem('test-object') || '{}')
      expect(retrieved).toEqual(testObject)
    })

    it('should handle error cases gracefully', () => {
      // Test with invalid JSON
      localStorage.setItem('invalid-json', '{"invalid": json}')
      expect(() => JSON.parse(localStorage.getItem('invalid-json') || '{}')).toThrow()
      
      // Test with null values
      expect(localStorage.getItem('non-existent-key')).toBeNull()
    })
  })

  describe('SecureStorage wrapper functionality', () => {
    it('should provide all core methods', () => {
      expect(typeof secureStorage.setItem).toBe('function')
      expect(typeof secureStorage.getItem).toBe('function')
      expect(typeof secureStorage.removeItem).toBe('function')
      expect(typeof secureStorage.clear).toBe('function')
    })

    it('should handle basic operations with default options', () => {
      const testData = { key: 'value', number: 42 }
      
      expect(secureStorage.setItem('test', testData)).toBe(true)
      expect(secureStorage.getItem('test')).toEqual(testData)
      
      expect(secureStorage.removeItem('test')).toBe(true)
      expect(secureStorage.getItem('test')).toBeNull()
    })

    it('should handle encryption and compression', () => {
      const testData = { sensitive: 'data', large: 'x'.repeat(1000) }
      
      // Test with encryption
      expect(secureStorage.setItem('encrypted', testData, { encrypt: true })).toBe(true)
      expect(secureStorage.getItem('encrypted')).toEqual(testData)
      
      // Test with compression
      expect(secureStorage.setItem('compressed', testData, { compress: true })).toBe(true)
      expect(secureStorage.getItem('compressed')).toEqual(testData)
      
      // Test with both
      expect(secureStorage.setItem('both', testData, { encrypt: true, compress: true })).toBe(true)
      expect(secureStorage.getItem('both')).toEqual(testData)
    })

    it('should handle TTL expiration', () => {
      const testData = { key: 'value' }
      
      // Set with short TTL
      expect(secureStorage.setItem('ttl-test', testData, { ttl: 100 })).toBe(true)
      expect(secureStorage.getItem('ttl-test')).toEqual(testData)
      
      // Wait for expiration
      return new Promise(resolve => {
        setTimeout(() => {
          expect(secureStorage.getItem('ttl-test', 'default')).toBe('default')
          resolve(undefined)
        }, 150)
      })
    })
  })

  describe('Context-specific localStorage usage', () => {
    it('should work with ProjectContext data', () => {
      const projectData = {
        projectId: 'proj-123',
        phases: [
          { id: 'phase-1', name: 'Assessment', status: 'completed' }
        ],
        teamMembers: [
          { id: 'user-1', name: 'John Doe', role: 'dpo' }
        ],
        overallProgress: 75
      }

      // Test project data storage
      expect(setProjectData('privacyProjects', { 'proj-123': projectData })).toBe(true)
      expect(setProjectData('currentProject', 'proj-123')).toBe(true)

      // Test project data retrieval
      const loadedProjects = getProjectData('privacyProjects', {})
      const loadedCurrentProject = getProjectData('currentProject')

      expect(loadedProjects).toEqual({ 'proj-123': projectData })
      expect(loadedCurrentProject).toBe('proj-123')
    })

    it('should work with AuthContext data', () => {
      const userData = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
      }

      // Test user data storage
      expect(setUserData('profile', userData)).toBe(true)
      expect(setUserData('id', userData.id)).toBe(true)

      // Test user data retrieval
      const loadedProfile = getUserData('profile')
      const loadedUserId = getUserData('id')

      expect(loadedProfile).toEqual(userData)
      expect(loadedUserId).toBe(userData.id)
    })

    it('should work with app settings', () => {
      const settings = {
        theme: 'dark',
        notifications: true,
        autoSave: true,
        userMode: 'team'
      }

      // Test app settings storage
      expect(setAppSetting('theme', settings.theme)).toBe(true)
      expect(setAppSetting('notifications', settings.notifications)).toBe(true)
      expect(setAppSetting('autoSave', settings.autoSave)).toBe(true)
      expect(setAppSetting('userMode', settings.userMode)).toBe(true)

      // Test app settings retrieval
      expect(getAppSetting('theme')).toBe(settings.theme)
      expect(getAppSetting('notifications')).toBe(settings.notifications)
      expect(getAppSetting('autoSave')).toBe(settings.autoSave)
      expect(getAppSetting('userMode')).toBe(settings.userMode)
    })
  })

  describe('Tool-specific localStorage patterns', () => {
    it('should handle SspGenerator localStorage pattern', () => {
      // Simulate the loadFromStorage function from SspGenerator
      const loadFromStorage = (key: string, defaultValue: unknown) => {
        try {
          const stored = localStorage.getItem(key)
          return stored ? JSON.parse(stored) : defaultValue
        } catch {
          return defaultValue
        }
      }

      // Simulate the saveToStorage pattern from SspGenerator
      const saveToStorage = (key: string, value: unknown) => {
        try {
          localStorage.setItem(key, JSON.stringify(value))
          return true
        } catch {
          return false
        }
      }

      // Test data
      const testData = {
        sections: [
          { id: '1', title: 'Test Section', status: 'not-started' }
        ],
        systemInfo: {
          name: 'Test System',
          identifier: 'TEST-001'
        },
        controls: [
          { id: 'AC-1', title: 'Access Control', status: 'planned' }
        ]
      }

      // Test saving and loading
      expect(saveToStorage('ssp_sections', testData.sections)).toBe(true)
      expect(saveToStorage('ssp_system_info', testData.systemInfo)).toBe(true)
      expect(saveToStorage('ssp_controls', testData.controls)).toBe(true)

      // Test loading
      const loadedSections = loadFromStorage('ssp_sections', [])
      const loadedSystemInfo = loadFromStorage('ssp_system_info', {})
      const loadedControls = loadFromStorage('ssp_controls', [])

      expect(loadedSections).toEqual(testData.sections)
      expect(loadedSystemInfo).toEqual(testData.systemInfo)
      expect(loadedControls).toEqual(testData.controls)
    })

    it('should handle GuideContext localStorage pattern', () => {
      // Simulate the GuideContext localStorage usage
      const loadGuideProgress = () => {
        try {
          const saved = localStorage.getItem('guideProgress')
          return saved ? JSON.parse(saved) : {}
        } catch {
          return {}
        }
      }

      const saveGuideProgress = (progress: Record<string, unknown>) => {
        try {
          localStorage.setItem('guideProgress', JSON.stringify(progress))
          return true
        } catch {
          return false
        }
      }

      const testProgress = {
        'guide-1': { completed: true, currentStep: 3 },
        'guide-2': { completed: false, currentStep: 1 }
      }

      expect(saveGuideProgress(testProgress)).toBe(true)
      const loadedProgress = loadGuideProgress()
      expect(loadedProgress).toEqual(testProgress)
    })

    it('should handle error monitoring localStorage pattern', () => {
      // Simulate the error monitoring localStorage usage
      const setErrorMonitoringUser = (userId: string) => {
        try {
          localStorage.setItem('errorMonitoringUser', JSON.stringify({ userId, timestamp: Date.now() }))
          return true
        } catch {
          return false
        }
      }

      const getErrorMonitoringUser = () => {
        try {
          const saved = localStorage.getItem('errorMonitoringUser')
          return saved ? JSON.parse(saved) : null
        } catch {
          return null
        }
      }

      const testUserId = 'user-123'
      expect(setErrorMonitoringUser(testUserId)).toBe(true)
      
      const loadedUser = getErrorMonitoringUser()
      expect(loadedUser).toHaveProperty('userId', testUserId)
      expect(loadedUser).toHaveProperty('timestamp')
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle localStorage quota exceeded', () => {
      // Mock localStorage to throw quota exceeded error
      const originalSetItem = localStorage.setItem
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError')
      })

      // Test that secureStorage handles the error gracefully
      const result = secureStorage.setItem('test-key', 'test-value')
      expect(result).toBe(false)

      // Test that direct localStorage usage handles the error
      const saveToStorage = (key: string, value: unknown) => {
        try {
          localStorage.setItem(key, JSON.stringify(value))
          return true
        } catch {
          return false
        }
      }

      expect(saveToStorage('test-key', 'test-value')).toBe(false)

      // Restore original method
      localStorage.setItem = originalSetItem
    })

    it('should handle localStorage unavailable', () => {
      // Mock localStorage to be unavailable
      const originalLocalStorage = window.localStorage
      Object.defineProperty(window, 'localStorage', {
        value: undefined,
        writable: true
      })

      // Test that secureStorage handles unavailable localStorage
      const result = secureStorage.setItem('test-key', 'test-value')
      expect(result).toBe(false)

      const getResult = secureStorage.getItem('test-key', 'default')
      expect(getResult).toBe('default')

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', {
        value: originalLocalStorage,
        writable: true
      })
    })

    it('should handle corrupted data in localStorage', () => {
      // Set corrupted data directly in localStorage
      localStorage.setItem('corrupted-key', 'invalid-json{')

      // Test that secureStorage handles corrupted data
      const result = secureStorage.getItem('corrupted-key', 'default')
      expect(result).toBe('default')

      // Test that direct localStorage usage handles corrupted data
      const loadFromStorage = (key: string, defaultValue: unknown) => {
        try {
          const stored = localStorage.getItem(key)
          return stored ? JSON.parse(stored) : defaultValue
        } catch {
          return defaultValue
        }
      }

      expect(loadFromStorage('corrupted-key', 'default')).toBe('default')
    })
  })

  describe('Data persistence and consistency', () => {
    it('should maintain data consistency across multiple operations', () => {
      // Simulate a complete tool workflow
      const workflow = [
        () => setUserData('profile', { name: 'John', role: 'admin' }),
        () => setProjectData('currentProject', 'proj-123'),
        () => setAppSetting('theme', 'dark'),
        () => secureStorage.setItem('tool-data', { tool: 'ssp-generator', data: 'test' }),
        () => {
          localStorage.setItem('guideProgress', JSON.stringify({ 'guide-1': { completed: true } }))
          return true
        }
      ]

      // Execute all operations
      workflow.forEach(op => {
        const result = op()
        expect(result).toBe(true)
      })

      // Verify all data is persisted and consistent
      expect(getUserData('profile')).toEqual({ name: 'John', role: 'admin' })
      expect(getProjectData('currentProject')).toBe('proj-123')
      expect(getAppSetting('theme')).toBe('dark')
      expect(secureStorage.getItem('tool-data')).toEqual({ tool: 'ssp-generator', data: 'test' })
      expect(JSON.parse(localStorage.getItem('guideProgress') || '{}')).toEqual({ 'guide-1': { completed: true } })
    })

    it('should handle mixed data types correctly', () => {
      const testData = {
        string: 'test string',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
        null: null
      }

      // Test each data type with secureStorage
      Object.entries(testData).forEach(([key, value]) => {
        if (value !== null) { // Skip null values
          expect(secureStorage.setItem(`test-${key}`, value)).toBe(true)
          expect(secureStorage.getItem(`test-${key}`)).toEqual(value)
        }
      })

      // Test with direct localStorage
      Object.entries(testData).forEach(([key, value]) => {
        if (value !== null) { // Skip null values
          localStorage.setItem(`direct-${key}`, JSON.stringify(value))
          expect(JSON.parse(localStorage.getItem(`direct-${key}`) || '{}')).toEqual(value)
        }
      })
    })
  })
})