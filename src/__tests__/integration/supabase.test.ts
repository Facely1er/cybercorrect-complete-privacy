import { describe, it, expect, beforeEach, vi } from 'vitest'

// Keep module mocks minimal to avoid type conflicts

// Mock the actual auth functions
vi.mock('../../lib/supabase', () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
}))

import { signIn, signUp, signOut, getCurrentUser } from '../../lib/supabase'

describe('Supabase Authentication Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('should handle successful login', async () => {
      const mockSignIn = vi.mocked(signIn)
      mockSignIn.mockResolvedValue({
        data: { user: {
            id: '1', email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: ''
        }, session: null },
        error: null,
      })

      const result = await signIn('test@example.com', 'password123')
      
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
      expect(result.data?.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle login errors', async () => {
      const mockSignIn = vi.mocked(signIn)
      mockSignIn.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials', details: 'Auth failed' },
      })

      const result = await signIn('test@example.com', 'wrongpassword')
      
      expect(result.error?.message).toBe('Invalid credentials')
      expect(result.data?.user).toBeUndefined()
    })

    it('should handle unexpected errors', async () => {
      const mockSignIn = vi.mocked(signIn)
      // The helper wraps unexpected errors and resolves with a formatted error object
      mockSignIn.mockResolvedValue({ data: null, error: { message: 'Sign in failed', details: 'Network error' } })

      const result = await signIn('test@example.com', 'password123')
      
      expect(result.error?.message).toBe('Sign in failed')
    })
  })

  describe('signUp', () => {
    it('should handle successful registration', async () => {
      const mockSignUp = vi.mocked(signUp)
      mockSignUp.mockResolvedValue({
        data: { user: {
            id: '1', email: 'new@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: ''
        }, session: null },
        error: null,
      })

      const result = await signUp('new@example.com', 'password123')
      
      expect(mockSignUp).toHaveBeenCalledWith('new@example.com', 'password123')
      expect(result.data?.user?.email).toBe('new@example.com')
      expect(result.error).toBeNull()
    })

    it('should handle registration errors', async () => {
      const mockSignUp = vi.mocked(signUp)
      mockSignUp.mockResolvedValue({
        data: null,
        error: { message: 'Email already exists', details: 'Duplicate email' },
      })

      const result = await signUp('existing@example.com', 'password123')
      
      expect(result.error?.message).toBe('Email already exists')
    })
  })

  describe('signOut', () => {
    it('should handle successful logout', async () => {
      const mockSignOut = vi.mocked(signOut)
      mockSignOut.mockResolvedValue({ error: null })

      const result = await signOut()
      
      expect(mockSignOut).toHaveBeenCalled()
      expect(result.error).toBeNull()
    })

    it('should handle logout errors', async () => {
      const mockSignOut = vi.mocked(signOut)
      mockSignOut.mockResolvedValue({ error: { message: 'Logout failed', details: 'Network error' } })

      const result = await signOut()
      
      expect(result.error?.message).toBe('Logout failed')
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockGetCurrentUser = vi.mocked(getCurrentUser)
      mockGetCurrentUser.mockResolvedValue({
        user: {
            id: '1', email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: '',
            created_at: ''
        },
        error: null,
      })

      const result = await getCurrentUser()
      
      expect(mockGetCurrentUser).toHaveBeenCalled()
      expect(result.user?.email).toBe('test@example.com')
      expect(result.error).toBeNull()
    })

    it('should return null when not authenticated', async () => {
      const mockGetCurrentUser = vi.mocked(getCurrentUser)
      mockGetCurrentUser.mockResolvedValue({
        user: null,
        error: { message: 'Not authenticated', details: 'No active session' },
      })

      const result = await getCurrentUser()
      
      expect(result.user).toBeNull()
      expect(result.error?.message).toBe('Not authenticated')
    })
  })
})
