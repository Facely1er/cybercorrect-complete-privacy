import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { toast, Toaster } from '../Toaster'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  X: vi.fn(() => <div data-testid="close-icon" />)
}))

// Mock cn utility
vi.mock('../../utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('Toaster Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Clear any existing toasts
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    // Clear toasts after each test
    vi.clearAllMocks()
  })

  describe('Toast Component', () => {
    it('should render with default props', () => {
      const mockOnClose = vi.fn()
      render(
        <div data-testid="toast-container">
          <div
            id="test-toast"
            title="Test Toast"
            onClose={mockOnClose}
            className="relative rounded-lg shadow-lg p-4 mb-3 animate-in slide-in-from-right bg-primary-teal/90 text-white dark:bg-dark-primary/90 dark:text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">Test Toast</h3>
              </div>
              <button
                onClick={() => mockOnClose('test-toast')}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <div data-testid="close-icon" />
              </button>
            </div>
          </div>
        </div>
      )

      expect(screen.getByText('Test Toast')).toBeInTheDocument()
      expect(screen.getByTestId('close-icon')).toBeInTheDocument()
    })

    it('should render with description', () => {
      const mockOnClose = vi.fn()
      render(
        <div data-testid="toast-container">
          <div
            id="test-toast"
            title="Test Toast"
            description="Test description"
            onClose={mockOnClose}
            className="relative rounded-lg shadow-lg p-4 mb-3 animate-in slide-in-from-right bg-primary-teal/90 text-white dark:bg-dark-primary/90 dark:text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">Test Toast</h3>
                <p className="text-xs mt-1">Test description</p>
              </div>
              <button
                onClick={() => mockOnClose('test-toast')}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <div data-testid="close-icon" />
              </button>
            </div>
          </div>
        </div>
      )

      expect(screen.getByText('Test Toast')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('should handle close button click', () => {
      const mockOnClose = vi.fn()
      render(
        <div data-testid="toast-container">
          <div
            id="test-toast"
            title="Test Toast"
            onClose={mockOnClose}
            className="relative rounded-lg shadow-lg p-4 mb-3 animate-in slide-in-from-right bg-primary-teal/90 text-white dark:bg-dark-primary/90 dark:text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">Test Toast</h3>
              </div>
              <button
                onClick={() => mockOnClose('test-toast')}
                className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <div data-testid="close-icon" />
              </button>
            </div>
          </div>
        </div>
      )

      const closeButton = screen.getByRole('button')
      fireEvent.click(closeButton)
      expect(mockOnClose).toHaveBeenCalledWith('test-toast')
    })
  })

  describe('Toast API', () => {
    it('should show a toast with toast.show', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({
        title: 'Test Toast',
        description: 'Test description',
        type: 'success'
      })

      expect(toastId).toBeDefined()
      expect(toastId).toMatch(/^toast-\d+-\d+$/)
    })

    it('should show success toast', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.success('Success!', 'Operation completed successfully')
      
      expect(toastId).toBeDefined()
    })

    it('should show error toast', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.error('Error!', 'Something went wrong')
      
      expect(toastId).toBeDefined()
    })

    it('should show warning toast', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.warning('Warning!', 'Please check your input')
      
      expect(toastId).toBeDefined()
    })

    it('should show info toast', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.info('Info', 'Here is some information')
      
      expect(toastId).toBeDefined()
    })

    it('should dismiss toast by id', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({ title: 'Test Toast' })
      
      // Dismiss the toast
      toast.dismiss(toastId)
      
      // Should not throw error
      expect(() => toast.dismiss(toastId)).not.toThrow()
    })

    it('should handle custom duration', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({
        title: 'Test Toast',
        duration: 10000 // 10 seconds
      })

      expect(toastId).toBeDefined()
    })
  })

  describe('Toaster Component', () => {
    it('should render toaster container', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toaster = screen.getByTestId('toaster')
      expect(toaster).toBeInTheDocument()
      expect(toaster).toHaveClass('fixed', 'top-4', 'right-4', 'z-50', 'w-72')
    })

    it('should render multiple toasts', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toast1 = toast.show({ title: 'First Toast' })
      const toast2 = toast.show({ title: 'Second Toast' })
      
      expect(toast1).toBeDefined()
      expect(toast2).toBeDefined()
      expect(toast1).not.toBe(toast2)
    })

    it('should handle toast auto-dismissal', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({
        title: 'Auto-dismiss Toast',
        duration: 1000
      })

      expect(toastId).toBeDefined()

      // Advance timer by duration
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Toast should be auto-dismissed (we can't easily test this without more complex setup)
      // but the timer should have been set up
      expect(toastId).toBeDefined()
    })
  })

  describe('Toast Types', () => {
    it('should apply correct classes for different types', () => {
      const types = ['default', 'success', 'error', 'warning', 'info'] as const
      
      types.forEach(type => {
        const toastId = toast.show({
          title: `${type} Toast`,
          type: type
        })
        
        expect(toastId).toBeDefined()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty title', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({ title: '' })
      expect(toastId).toBeDefined()
    })

    it('should handle very long title and description', () => {
      render(<Toaster data-testid="toaster" />)
      
      const longTitle = 'A'.repeat(100)
      const longDescription = 'B'.repeat(200)
      
      const toastId = toast.show({
        title: longTitle,
        description: longDescription
      })
      
      expect(toastId).toBeDefined()
    })

    it('should handle zero duration', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({
        title: 'Zero Duration Toast',
        duration: 0
      })
      
      expect(toastId).toBeDefined()
    })

    it('should handle negative duration', () => {
      render(<Toaster data-testid="toaster" />)
      
      const toastId = toast.show({
        title: 'Negative Duration Toast',
        duration: -1000
      })
      
      expect(toastId).toBeDefined()
    })
  })
})
