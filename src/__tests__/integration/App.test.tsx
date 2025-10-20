import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'

// Mock all external dependencies
vi.mock('../lib/supabase', () => ({
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

vi.mock('../lib/sentry', () => ({
  initSentry: vi.fn(),
  SentryErrorBoundary: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

vi.mock('../lib/errorMonitoring', () => ({
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

  it('should render the main application', () => {
    render(<AppWrapper />)
    
    // Check for main navigation elements
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should handle navigation between pages', async () => {
    const user = userEvent.setup()
    render(<AppWrapper />)
    
    // Test navigation (this would need actual navigation links)
    // This is a placeholder for actual navigation testing
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should handle errors gracefully', () => {
    // Test error boundary functionality
    const ThrowError = () => {
      throw new Error('Test error')
    }
    
    render(
      <BrowserRouter>
        <ThrowError />
      </BrowserRouter>
    )
    
    // Error boundary should catch the error
    // In a real implementation, this would show an error page
  })
})
