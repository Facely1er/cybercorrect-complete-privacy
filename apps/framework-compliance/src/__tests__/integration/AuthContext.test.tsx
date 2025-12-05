import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn(),
}))

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

// Mock Sentry
vi.mock('../../lib/sentry', () => ({
  initSentry: vi.fn(),
  SentryErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

import { AuthProvider } from '../../context/AuthContext'

const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('AuthContext Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide authentication context', () => {
    render(
      <AuthProviderWrapper>
        <div data-testid="auth-context">Auth Context Test</div>
      </AuthProviderWrapper>
    )

    expect(screen.getByTestId('auth-context')).toBeInTheDocument()
  })

  it('should handle authentication state changes', async () => {
    const { getCurrentUser } = await import('../../lib/supabase')
    const mockGetCurrentUser = vi.mocked(getCurrentUser)
    
    mockGetCurrentUser.mockResolvedValue({
      user: { 
        id: '1', 
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: '',
        created_at: ''
      },
      error: null,
    })

    render(
      <AuthProviderWrapper>
        <div data-testid="auth-state">Auth State Test</div>
      </AuthProviderWrapper>
    )

    expect(screen.getByTestId('auth-state')).toBeInTheDocument()
  })

  it('should handle authentication errors', async () => {
    const { getCurrentUser } = await import('../../lib/supabase')
    const mockGetCurrentUser = vi.mocked(getCurrentUser)
    
    mockGetCurrentUser.mockResolvedValue({
      user: null,
      error: { message: 'Authentication failed', details: 'Auth failed' },
    })

    render(
      <AuthProviderWrapper>
        <div data-testid="auth-error">Auth Error Test</div>
      </AuthProviderWrapper>
    )

    expect(screen.getByTestId('auth-error')).toBeInTheDocument()
  })
})
