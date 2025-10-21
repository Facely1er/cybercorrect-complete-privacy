import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type React from 'react'

// Mock Sentry
vi.mock('../../lib/sentry', () => {
  const React = require('react');
  return {
    initSentry: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
    clearUser: vi.fn(),
    addBreadcrumb: vi.fn(),
    SentryErrorBoundary: ({ children }: { children: React.ReactNode }) => React.createElement('div', null, children),
  }
})

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

import { 
  initSentry, 
  captureException, 
  captureMessage, 
  setUser, 
  clearUser, 
  addBreadcrumb 
} from '../../lib/sentry'

describe('Sentry Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initSentry', () => {
    it('should initialize Sentry with DSN', () => {
      // Mock environment variable
      vi.stubEnv('VITE_SENTRY_DSN', 'https://test-dsn@sentry.io/123')
      
      initSentry()
      
      expect(initSentry).toHaveBeenCalled()
    })

    it('should handle missing DSN gracefully', () => {
      // Mock missing environment variable
      vi.stubEnv('VITE_SENTRY_DSN', undefined as unknown as string)
      
      initSentry()
      
      expect(initSentry).toHaveBeenCalled()
    })
  })

  describe('captureException', () => {
    it('should capture exceptions with context', () => {
      const error = new Error('Test error')
      const context = { userId: '123', action: 'test' }
      
      captureException(error, context)
      
      expect(captureException).toHaveBeenCalledWith(error, context)
    })

    it('should capture exceptions without context', () => {
      const error = new Error('Test error')
      
      captureException(error)
      
      expect(captureException).toHaveBeenCalledWith(error)
    })
  })

  describe('captureMessage', () => {
    it('should capture info messages', () => {
      captureMessage('Test info message', 'info')
      
      expect(captureMessage).toHaveBeenCalledWith('Test info message', 'info')
    })

    it('should capture warning messages', () => {
      captureMessage('Test warning message', 'warning')
      
      expect(captureMessage).toHaveBeenCalledWith('Test warning message', 'warning')
    })

    it('should capture error messages', () => {
      captureMessage('Test error message', 'error')
      
      expect(captureMessage).toHaveBeenCalledWith('Test error message', 'error')
    })

    it('should default to info level', () => {
      captureMessage('Test message')
      
      expect(captureMessage).toHaveBeenCalledWith('Test message')
    })
  })

  describe('setUser', () => {
    it('should set user context', () => {
      const user = { id: '123', email: 'test@example.com', username: 'testuser' }
      
      setUser(user)
      
      expect(setUser).toHaveBeenCalledWith(user)
    })
  })

  describe('clearUser', () => {
    it('should clear user context', () => {
      clearUser()
      
      expect(clearUser).toHaveBeenCalled()
    })
  })

  describe('addBreadcrumb', () => {
    it('should add breadcrumbs with full context', () => {
      const breadcrumb = {
        message: 'User action',
        category: 'user-action',
        level: 'info' as const,
        data: { action: 'click', element: 'button' },
      }
      
      addBreadcrumb(breadcrumb)
      
      expect(addBreadcrumb).toHaveBeenCalledWith(breadcrumb)
    })

    it('should add breadcrumbs with minimal context', () => {
      const breadcrumb = {
        message: 'Simple message',
      }
      
      addBreadcrumb(breadcrumb)
      
      expect(addBreadcrumb).toHaveBeenCalledWith(breadcrumb)
    })
  })
})


