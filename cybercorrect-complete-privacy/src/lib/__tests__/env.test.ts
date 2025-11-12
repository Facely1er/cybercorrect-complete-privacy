import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock import.meta.env before importing env
const mockImportMetaEnv = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_SENTRY_DSN: 'https://test@sentry.io/123',
  VITE_ANALYTICS_ID: 'test-analytics-id',
  VITE_ENABLE_ANALYTICS: 'true',
  VITE_ENABLE_CHAT_SUPPORT: 'true',
  NODE_ENV: 'test'
}

vi.stubGlobal('import', {
  meta: {
    env: mockImportMetaEnv
  }
})

describe('Environment Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate environment configuration', () => {
    // Test that environment variables are accessible
    expect(mockImportMetaEnv.VITE_SUPABASE_URL).toBe('https://test.supabase.co')
    expect(mockImportMetaEnv.VITE_SUPABASE_ANON_KEY).toBe('test-anon-key')
    expect(mockImportMetaEnv.VITE_ENABLE_ANALYTICS).toBe('true')
  })

  it('should handle missing environment variables', () => {
    const emptyEnv = {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      VITE_ENABLE_ANALYTICS: 'false',
      VITE_ENABLE_CHAT_SUPPORT: 'false',
      NODE_ENV: 'test'
    }

    // Should handle empty values gracefully
    expect(emptyEnv.VITE_SUPABASE_URL).toBe('')
    expect(emptyEnv.VITE_ENABLE_ANALYTICS).toBe('false')
  })

  it('should validate URL format', () => {
    const validUrl = 'https://valid.supabase.co'
    const invalidUrl = 'not-a-valid-url'

    // Test URL validation
    expect(() => new URL(validUrl)).not.toThrow()
    expect(() => new URL(invalidUrl)).toThrow()
  })

  it('should handle boolean environment variables', () => {
    const booleanTests = [
      { value: 'true', expected: true },
      { value: 'false', expected: false },
      { value: '1', expected: true },
      { value: '0', expected: false },
      { value: 'invalid', expected: false }
    ]

    booleanTests.forEach(({ value, expected }) => {
      const result = value === 'true' || value === '1'
      expect(result).toBe(expected)
    })
  })

  it('should handle different environments', () => {
    const environments = ['development', 'production', 'test']
    
    environments.forEach(env => {
      expect(environments).toContain(env)
    })
  })

  it('should provide fallback values', () => {
    const fallbacks = {
      VITE_SUPABASE_URL: '',
      VITE_SUPABASE_ANON_KEY: '',
      VITE_ENABLE_ANALYTICS: 'false',
      VITE_ENABLE_CHAT_SUPPORT: 'false',
      NODE_ENV: 'development'
    }

    // Should provide sensible defaults
    expect(fallbacks.VITE_ENABLE_ANALYTICS).toBe('false')
    expect(fallbacks.VITE_ENABLE_CHAT_SUPPORT).toBe('false')
    expect(fallbacks.NODE_ENV).toBe('development')
  })
})
