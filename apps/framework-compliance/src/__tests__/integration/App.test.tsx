import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

// Mock all external dependencies
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
}))

vi.mock('../../lib/sentry', () => ({
  initSentry: vi.fn(),
  SentryErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main application', async () => {
    render(<AppWrapper />)
    
    // Wait for the app to load and check for main navigation elements
    await waitFor(() => {
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    }, { timeout: 10000 })
  }, 15000)

  it('should handle navigation between pages', async () => {
    render(<AppWrapper />)
    
    // Test navigation (this would need actual navigation links)
    // This is a placeholder for actual navigation testing
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should handle errors gracefully', () => {
    // Test that the app renders without crashing
    // This is a basic smoke test for error handling
    expect(() => {
      render(<AppWrapper />)
    }).not.toThrow()
  })
})
