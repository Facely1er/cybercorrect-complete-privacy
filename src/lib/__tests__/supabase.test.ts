import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Mock @supabase/supabase-js
const mockSupabaseClient = {
  auth: {
    signIn: vi.fn(),
    signOut: vi.fn(),
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
  from: vi.fn(),
  rpc: vi.fn(),
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}))

// Mock error monitoring
vi.mock('../errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
  },
}))

// Mock environment variables
const originalEnv = import.meta.env

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
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

  it('should create Supabase client with valid environment variables', async () => {
    const { supabase } = await import('../supabase')
    
    // Access a property to trigger initialization
    expect(supabase.auth).toBeDefined()
    expect(createClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  })

  it('should throw error when Supabase URL is missing', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        VITE_SUPABASE_URL: '',
        VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      },
      writable: true,
    })

    // Clear module cache to force re-import
    vi.resetModules()

    const { supabase } = await import('../supabase')
    
    expect(() => {
      supabase.auth
    }).toThrow('Missing Supabase environment variables')
  })

  it('should throw error when Supabase anon key is missing', async () => {
    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        VITE_SUPABASE_URL: 'https://test.supabase.co',
        VITE_SUPABASE_ANON_KEY: '',
      },
      writable: true,
    })

    // Clear module cache to force re-import
    vi.resetModules()

    const { supabase } = await import('../supabase')
    
    expect(() => {
      supabase.auth
    }).toThrow('Missing Supabase environment variables')
  })

  it('should handle createClient errors gracefully', async () => {
    const mockError = new Error('Failed to create client')
    vi.mocked(createClient).mockImplementation(() => {
      throw mockError
    })

    // Clear module cache to force re-import
    vi.resetModules()

    const { supabase } = await import('../supabase')
    
    expect(() => {
      supabase.auth
    }).toThrow('Failed to create client')
  })

  it('should return same instance on multiple calls', async () => {
    const { supabase } = await import('../supabase')
    
    const auth1 = supabase.auth
    const auth2 = supabase.auth
    
    expect(auth1).toBe(auth2)
    expect(createClient).toHaveBeenCalledTimes(1)
  })

  it('should proxy all Supabase client methods', async () => {
    const { supabase } = await import('../supabase')
    
    // Test auth methods
    expect(supabase.auth).toBeDefined()
    expect(supabase.auth.signIn).toBeDefined()
    expect(supabase.auth.signOut).toBeDefined()
    expect(supabase.auth.getUser).toBeDefined()
    
    // Test database methods
    expect(supabase.from).toBeDefined()
    expect(supabase.rpc).toBeDefined()
  })

  it('should handle auth state changes', async () => {
    const { supabase } = await import('../supabase')
    
    const mockCallback = vi.fn()
    supabase.auth.onAuthStateChange(mockCallback)
    
    expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback)
  })

  it('should handle database queries', async () => {
    const { supabase } = await import('../supabase')
    
    const mockQuery = supabase.from('test_table')
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('test_table')
  })

  it('should handle RPC calls', async () => {
    const { supabase } = await import('../supabase')
    
    supabase.rpc('test_function', { param: 'value' })
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('test_function', { param: 'value' })
  })
})
