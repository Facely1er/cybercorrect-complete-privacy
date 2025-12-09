import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Mock @supabase/supabase-js
const mockSupabaseClient = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
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

// Mock environment variables using vi.stubEnv

describe('Supabase Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear module cache to ensure fresh imports
    vi.resetModules()
    // Reset createClient mock to default behavior
    vi.mocked(createClient).mockImplementation(() => mockSupabaseClient as unknown as ReturnType<typeof createClient>)
    // Set environment variables using vi.stubEnv
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
  })

  afterEach(() => {
    // Restore original environment
    vi.unstubAllEnvs()
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

  it('should return mock client when Supabase URL is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')

    vi.resetModules()
    const { supabase } = await import('../supabase')
    
    // Should not throw - returns mock client instead
    expect(supabase.auth).toBeDefined()
    expect(typeof supabase.auth.signInWithPassword).toBe('function')
  })

  it('should return mock client when Supabase anon key is missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')

    vi.resetModules()
    const { supabase } = await import('../supabase')
    
    // Should not throw - returns mock client instead
    expect(supabase.auth).toBeDefined()
    expect(typeof supabase.auth.signInWithPassword).toBe('function')
  })

  it('should handle createClient errors gracefully', async () => {
    const mockError = new Error('Failed to create client')
    vi.mocked(createClient).mockImplementation(() => {
      throw mockError
    })

    vi.resetModules()
    const { supabase } = await import('../supabase')
    
    // Should not throw - returns mock client instead
    expect(supabase.auth).toBeDefined()
    expect(typeof supabase.auth.signInWithPassword).toBe('function')
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
    expect(supabase.auth.signInWithPassword).toBeDefined()
    expect(supabase.auth.signUp).toBeDefined()
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
    void mockQuery
  })

  it('should handle RPC calls', async () => {
    const { supabase } = await import('../supabase')
    
    supabase.rpc('test_function', { param: 'value' })
    expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('test_function', { param: 'value' })
  })
})
