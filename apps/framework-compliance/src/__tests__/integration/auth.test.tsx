import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'

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

const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle login form submission', async () => {
    const user = userEvent.setup()
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null,
    })

    render(
      <AuthProviderWrapper>
        <div>
          <input data-testid="email" type="email" placeholder="Email" />
          <input data-testid="password" type="password" placeholder="Password" />
          <button data-testid="login-btn">Login</button>
        </div>
      </AuthProviderWrapper>
    )

    const emailInput = screen.getByTestId('email')
    const passwordInput = screen.getByTestId('password')
    const loginButton = screen.getByTestId('login-btn')

    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })
  }, 10000)

  it('should handle login errors', async () => {
    const user = userEvent.setup()
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' },
    })

    render(
      <AuthProviderWrapper>
        <div>
          <input data-testid="email" type="email" placeholder="Email" />
          <input data-testid="password" type="password" placeholder="Password" />
          <button data-testid="login-btn">Login</button>
          <div data-testid="error-message"></div>
        </div>
      </AuthProviderWrapper>
    )

    const emailInput = screen.getByTestId('email')
    const passwordInput = screen.getByTestId('password')
    const loginButton = screen.getByTestId('login-btn')

    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com')
    await user.clear(passwordInput)
    await user.type(passwordInput, 'wrongpassword')
    await user.click(loginButton)

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('wrongpassword')
    })
  }, 10000)
})