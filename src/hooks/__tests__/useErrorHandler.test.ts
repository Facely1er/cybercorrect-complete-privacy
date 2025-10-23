import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useErrorHandler } from '../useErrorHandler'

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

// Mock toast
vi.mock('../../components/ui/Toaster', () => ({
  toast: {
    error: vi.fn(),
  },
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle errors and capture them', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const testError = new Error('Test error')

    // Test synchronous error handling
    handleError(testError)

    // Verify error monitoring was called
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(testError, {
      hook: 'useErrorHandler',
    })
  })

  it('should handle errors without context', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const testError = new Error('Test error without context')

    handleError(testError)

    // Verify error monitoring was called without context
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(testError, {
      hook: 'useErrorHandler',
    })
  })

  it('should handle string errors', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const stringError = 'String error message'

    handleError(stringError)

    // Verify error monitoring was called
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'String error message' }),
      { hook: 'useErrorHandler' }
    )
  })

  it('should handle different error types', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const stringError = 'String error message'
    const objectError = new Error('Object error')

    // Test string error
    handleError(stringError)
    
    // Test object error
    handleError(objectError)
    
    // Test null error (should be converted to Error)
    handleError('null error')

    // Verify error monitoring was called for each
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledTimes(3)
  })

  it('should clear errors', () => {
    const { result } = renderHook(() => useErrorHandler())
    
    const testError = new Error('Test error')
    
    act(() => {
      result.current.handleError(testError, false) // Don't show toast
    })

    expect(result.current.isError).toBe(true)

    act(() => {
      result.current.clearError()
    })

    expect(result.current.isError).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors with toast disabled', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const testError = new Error('Test error')

    handleError(testError, false) // Disable toast

    // Verify error monitoring was called
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(testError, {
      hook: 'useErrorHandler',
    })
  })

  it('should handle network errors specifically', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const networkError = new Error('Network request failed')
    networkError.name = 'NetworkError'

    handleError(networkError)

    // Verify network error was captured
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(networkError, {
      hook: 'useErrorHandler',
    })
  })

  it('should handle validation errors', async () => {
    const { result } = renderHook(() => useErrorHandler())
    const { handleError } = result.current
    
    const validationError = new Error('Validation failed')
    validationError.name = 'ValidationError'

    handleError(validationError)

    // Verify validation error was captured
    const { errorMonitoring } = await import('../../lib/errorMonitoring')
    expect(errorMonitoring.captureException).toHaveBeenCalledWith(validationError, {
      hook: 'useErrorHandler',
    })
  })
})
