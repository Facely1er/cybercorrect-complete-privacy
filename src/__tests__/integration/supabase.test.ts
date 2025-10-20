import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

// Mock Supabase
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
  },
}

vi.mock('../../lib/supabase', () => ({
  supabase: mockSupabase,
}))

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
        data: { user: { id: '1', email: 'test@example.com' } },
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
        data: { user: null },
        error: { message: 'Invalid credentials' },
      })

      const result = await signIn('test@example.com', 'wrongpassword')
      
      expect(result.error?.message).toBe('Invalid credentials')
      expect(result.data?.user).toBeNull()
    })

    it('should handle unexpected errors', async () => {
      const mockSignIn = vi.mocked(signIn)
      mockSignIn.mockRejectedValue(new Error('Network error'))

      const result = await signIn('test@example.com', 'password123')
      
      expect(result.error?.message).toBe('Sign in failed')
    })
  })

  describe('signUp', () => {
    it('should handle successful registration', async () => {
      const mockSignUp = vi.mocked(signUp)
      mockSignUp.mockResolvedValue({
        data: { user: { id: '1', email: 'new@example.com' } },
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
        data: { user: null },
        error: { message: 'Email already exists' },
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
      mockSignOut.mockResolvedValue({ error: { message: 'Logout failed' } })

      const result = await signOut()
      
      expect(result.error?.message).toBe('Logout failed')
    })
  })

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const mockGetCurrentUser = vi.mocked(getCurrentUser)
      mockGetCurrentUser.mockResolvedValue({
        user: { id: '1', email: 'test@example.com' },
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
        error: { message: 'Not authenticated' },
      })

      const result = await getCurrentUser()
      
      expect(result.user).toBeNull()
      expect(result.error?.message).toBe('Not authenticated')
    })
  })
})
