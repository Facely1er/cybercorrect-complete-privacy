import { describe, it, expect, beforeEach, vi } from 'vitest'
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from '../storage/secureStorage'

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureMessage: vi.fn(),
    captureException: vi.fn(),
  },
}))

describe('localStorage Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Direct localStorage usage in tools', () => {
    it('should handle localStorage operations in SspGenerator pattern', () => {
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

    it('should handle localStorage operations in GuideContext pattern', () => {
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

    it('should handle localStorage operations in AuthContext pattern', () => {
      // Simulate the AuthContext localStorage usage
      const loadUserId = () => {
        try {
          return localStorage.getItem('userId')
        } catch {
          return null
        }
      }

      const saveUserId = (userId: string) => {
        try {
          localStorage.setItem('userId', userId)
          return true
        } catch {
          return false
        }
      }

      const testUserId = 'user-123'

      expect(saveUserId(testUserId)).toBe(true)
      expect(loadUserId()).toBe(testUserId)
    })
  })

  describe('SecureStorage integration with tools', () => {
    it('should work with ProjectContext data persistence', () => {
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

    it('should work with user authentication data', () => {
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
      const loadFromStorage = (key: string, defaultValue: unknown) => {
        try {
          const stored = localStorage.getItem(key)
          return stored ? JSON.parse(stored) : defaultValue
        } catch {
          return defaultValue
        }
      }

      const saveToStorage = (key: string, value: unknown) => {
        try {
          localStorage.setItem(key, JSON.stringify(value))
          return true
        } catch {
          return false
        }
      }

      expect(saveToStorage('test-key', 'test-value')).toBe(false)
      expect(loadFromStorage('test-key', 'default')).toBe('default')

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

    it('should handle very large data objects', () => {
      // Create a large data object
      const largeData = {
        sections: Array(1000).fill(0).map((_, i) => ({
          id: `section-${i}`,
          title: `Section ${i}`,
          content: 'x'.repeat(1000) // 1KB per section
        }))
      }

      // Test with compression enabled
      const result = secureStorage.setItem('large-data', largeData, { compress: true })
      expect(result).toBe(true)

      const loadedData = secureStorage.getItem('large-data')
      expect(loadedData).toEqual(largeData)
    })

    it('should handle TTL expiration', () => {
      // Set item with very short TTL
      const result = secureStorage.setItem('ttl-test', 'test-value', { ttl: -1000 }) // Already expired
      expect(result).toBe(true)

      // Should return default value due to expiration
      const value = secureStorage.getItem('ttl-test', 'default')
      expect(value).toBe('default')
    })
  })

  describe('Data persistence across sessions', () => {
    it('should persist data across multiple operations', () => {
      // Simulate multiple tool operations
      const operations = [
        () => setUserData('profile', { name: 'John', role: 'admin' }),
        () => setProjectData('currentProject', 'proj-123'),
        () => setAppSetting('theme', 'dark'),
        () => secureStorage.setItem('tool-data', { tool: 'ssp-generator', data: 'test' })
      ]

      // Execute all operations
      operations.forEach(op => expect(op()).toBe(true))

      // Verify all data is persisted
      expect(getUserData('profile')).toEqual({ name: 'John', role: 'admin' })
      expect(getProjectData('currentProject')).toBe('proj-123')
      expect(getAppSetting('theme')).toBe('dark')
      expect(secureStorage.getItem('tool-data')).toEqual({ tool: 'ssp-generator', data: 'test' })
    })

    it('should handle mixed data types correctly', () => {
      const testData = {
        string: 'test string',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
        null: null,
        undefined: undefined
      }

      // Test each data type
      Object.entries(testData).forEach(([key, value]) => {
        if (value !== undefined) { // Skip undefined values
          expect(secureStorage.setItem(`test-${key}`, value)).toBe(true)
          expect(secureStorage.getItem(`test-${key}`)).toEqual(value)
        }
      })
    })
  })
})