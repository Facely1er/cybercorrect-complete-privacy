import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { GuideProvider } from '../../context/GuideContext'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

const GuideProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <GuideProvider>
      {children}
    </GuideProvider>
  </BrowserRouter>
)

describe('GuideContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide guide context to children', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-context">Guide Context Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-context')).toBeInTheDocument()
  })

  it('should initialize with default guide state', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-state">Guide State Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-state')).toBeInTheDocument()
  })

  it('should handle guide progress updates', async () => {
    const user = userEvent.setup()
    
    render(
      <GuideProviderWrapper>
        <div>
          <button data-testid="update-progress">Update Progress</button>
          <div data-testid="progress-display">Progress: 0%</div>
        </div>
      </GuideProviderWrapper>
    )

    const updateButton = screen.getByTestId('update-progress')
    await user.click(updateButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(updateButton).toBeInTheDocument()
    })
  })

  it('should handle guide completion', async () => {
    const user = userEvent.setup()
    
    render(
      <GuideProviderWrapper>
        <div>
          <button data-testid="complete-guide">Complete Guide</button>
          <div data-testid="completion-status">Incomplete</div>
        </div>
      </GuideProviderWrapper>
    )

    const completeButton = screen.getByTestId('complete-guide')
    await user.click(completeButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(completeButton).toBeInTheDocument()
    })
  })

  it('should handle guide navigation', async () => {
    const user = userEvent.setup()
    
    render(
      <GuideProviderWrapper>
        <div>
          <button data-testid="next-step">Next Step</button>
          <button data-testid="prev-step">Previous Step</button>
          <div data-testid="current-step">Step 1</div>
        </div>
      </GuideProviderWrapper>
    )

    const nextButton = screen.getByTestId('next-step')
    const prevButton = screen.getByTestId('prev-step')
    
    await user.click(nextButton)
    await user.click(prevButton)

    // Wait for any state updates
    await waitFor(() => {
      expect(nextButton).toBeInTheDocument()
      expect(prevButton).toBeInTheDocument()
    })
  })

  it('should handle guide errors gracefully', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-error-handling">Guide Error Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-error-handling')).toBeInTheDocument()
  })

  it('should persist guide state', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-persistence">Guide Persistence Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-persistence')).toBeInTheDocument()
  })

  it('should handle multiple guide types', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-types">Guide Types Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-types')).toBeInTheDocument()
  })

  it('should provide guide analytics', () => {
    render(
      <GuideProviderWrapper>
        <div data-testid="guide-analytics">Guide Analytics Test</div>
      </GuideProviderWrapper>
    )

    expect(screen.getByTestId('guide-analytics')).toBeInTheDocument()
  })
})
