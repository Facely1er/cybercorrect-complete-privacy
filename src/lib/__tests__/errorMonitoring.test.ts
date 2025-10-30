import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock environment variables
const originalEnv = import.meta.env

describe('Error Monitoring Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.unmock('../errorMonitoring')
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        PROD: false,
        DEV: true,
        VITE_ERROR_MONITORING_ENDPOINT: 'https://test-monitoring.com/api/errors',
      },
      writable: true,
    })
  })

  afterEach(() => {
    // Reset to original environment
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
    })
  })

  it('should initialize with correct settings', async () => {
    const { errorMonitoring } = await import('../errorMonitoring')
    
    expect(errorMonitoring).toBeDefined()
    expect(typeof errorMonitoring.captureException).toBe('function')
    expect(typeof errorMonitoring.captureMessage).toBe('function')
  })

  it('should log errors in development mode', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    vi.resetModules()
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    const context = { component: 'TestComponent' }
    
    errorMonitoring.captureException(testError, context)
    
    expect(consoleSpy).toHaveBeenCalledWith('Error (development):', testError, context)
    
    consoleSpy.mockRestore()
  })

  it('should not log errors in production mode when disabled', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        PROD: true,
        DEV: false,
      },
      writable: true,
    })

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Clear module cache to force re-import
    vi.resetModules()
    
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    
    errorMonitoring.captureException(testError)
    
    expect(consoleSpy).not.toHaveBeenCalled()
    
    consoleSpy.mockRestore()
  })

  it('should capture messages with proper format', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    vi.resetModules()
    const { errorMonitoring } = await import('../errorMonitoring')
    const message = 'Test message'
    const context = { level: 'info' }
    
    errorMonitoring.captureMessage(message, context)
    
    expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test message', context)
    
    consoleSpy.mockRestore()
  })

  it('should handle errors without context', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    vi.resetModules()
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    
    errorMonitoring.captureException(testError)
    
    expect(consoleSpy).toHaveBeenCalledWith('Error (development):', testError, undefined)
    
    consoleSpy.mockRestore()
  })

  it('should handle non-Error objects', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    vi.resetModules()
    const { errorMonitoring } = await import('../errorMonitoring')
    const notAnError = 'This is not an Error object'
    
    errorMonitoring.captureException(notAnError as unknown)
    
    expect(consoleSpy).toHaveBeenCalledWith('Error (development):', notAnError, undefined)
    
    consoleSpy.mockRestore()
  })

  it('should handle network errors when endpoint is configured', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        PROD: true,
        DEV: false,
        VITE_ERROR_MONITORING_ENDPOINT: 'https://test-monitoring.com/api/errors',
      },
      writable: true,
    })

    // Mock fetch
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
    global.fetch = mockFetch

    // Clear module cache to force re-import
    vi.resetModules()
    
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    const context = { userId: '123' }
    
    await errorMonitoring.captureException(testError, context)
    
    expect(mockFetch).toHaveBeenCalledWith(
      'https://test-monitoring.com/api/errors',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('Test error'),
      })
    )
    
    mockFetch.mockRestore()
  })

  it('should handle fetch errors gracefully', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        PROD: true,
        DEV: false,
        VITE_ERROR_MONITORING_ENDPOINT: 'https://test-monitoring.com/api/errors',
      },
      writable: true,
    })

    // Mock fetch to throw error
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
    global.fetch = mockFetch

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Clear module cache to force re-import
    vi.resetModules()
    
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    
    await errorMonitoring.captureException(testError)
    
    // Should not throw, but might log the fetch error
    expect(mockFetch).toHaveBeenCalled()
    
    mockFetch.mockRestore()
    consoleSpy.mockRestore()
  })

  it('should format error information correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const { errorMonitoring } = await import('../errorMonitoring')
    const testError = new Error('Test error')
    testError.stack = 'Error stack trace'
    
    const context = {
      userId: '123',
      sessionId: 'session-456',
      component: 'TestComponent',
    }
    
    errorMonitoring.captureException(testError, context)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error (development):',
      testError,
      context
    )
    
    consoleSpy.mockRestore()
  })
})
