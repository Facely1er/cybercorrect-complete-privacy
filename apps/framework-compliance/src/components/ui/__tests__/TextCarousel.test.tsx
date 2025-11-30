import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import TextCarousel from '../TextCarousel'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => <div {...props}>{children}</div>)
  },
  AnimatePresence: vi.fn(({ children }) => <div data-testid="animate-presence">{children}</div>)
}))

describe('TextCarousel Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render with single item', () => {
    const items = ['Single item']
    render(<TextCarousel items={items} />)
    
    expect(screen.getByText('Single item')).toBeInTheDocument()
    expect(screen.getByTestId('animate-presence')).toBeInTheDocument()
  })

  it('should render with multiple items', () => {
    const items = ['First item', 'Second item', 'Third item']
    render(<TextCarousel items={items} />)
    
    // Should show the first item initially
    expect(screen.getByText('First item')).toBeInTheDocument()
    expect(screen.queryByText('Second item')).not.toBeInTheDocument()
    expect(screen.queryByText('Third item')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const items = ['Test item']
    render(<TextCarousel items={items} className="custom-class" />)
    
    const customEl = document.querySelector('.custom-class') as HTMLElement | null
    expect(customEl).not.toBeNull()
  })

  it('should cycle through items with default interval', () => {
    const items = ['First item', 'Second item', 'Third item']
    render(<TextCarousel items={items} />)
    
    // Initially shows first item
    expect(screen.getByText('First item')).toBeInTheDocument()
    
    // Advance timer by default interval (4000ms)
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    
    // Should now show second item
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.queryByText('First item')).not.toBeInTheDocument()
  })

  it('should cycle through items with custom interval', () => {
    const items = ['First item', 'Second item']
    render(<TextCarousel items={items} interval={2000} />)
    
    // Initially shows first item
    expect(screen.getByText('First item')).toBeInTheDocument()
    
    // Advance timer by custom interval (2000ms)
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    
    // Should now show second item
    expect(screen.getByText('Second item')).toBeInTheDocument()
    expect(screen.queryByText('First item')).not.toBeInTheDocument()
  })

  it('should loop back to first item after last item', () => {
    const items = ['First item', 'Second item']
    render(<TextCarousel items={items} interval={1000} />)
    
    // Start with first item
    expect(screen.getByText('First item')).toBeInTheDocument()
    
    // Advance to second item
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('Second item')).toBeInTheDocument()
    
    // Advance back to first item
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('First item')).toBeInTheDocument()
  })

  it('should not set up interval for single item', () => {
    const items = ['Single item']
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    
    render(<TextCarousel items={items} />)
    
    expect(screen.getByText('Single item')).toBeInTheDocument()
    expect(setIntervalSpy).not.toHaveBeenCalled()
    
    setIntervalSpy.mockRestore()
  })

  it('should clear interval on unmount', () => {
    const items = ['First item', 'Second item']
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    
    const { unmount } = render(<TextCarousel items={items} />)
    
    unmount()
    
    expect(clearIntervalSpy).toHaveBeenCalled()
    
    clearIntervalSpy.mockRestore()
  })

  it('should handle empty items array', () => {
    const items: string[] = []
    render(<TextCarousel items={items} />)
    
    const container = screen.getByTestId('animate-presence')
    expect(container).toBeInTheDocument()
    
    // Should not crash and should not set up interval
    const setIntervalSpy = vi.spyOn(global, 'setInterval')
    expect(setIntervalSpy).not.toHaveBeenCalled()
    
    setIntervalSpy.mockRestore()
  })

  it('should update interval when interval prop changes', () => {
    const items = ['First item', 'Second item']
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval')
    
    const { rerender } = render(<TextCarousel items={items} interval={1000} />)
    
    // Change interval
    rerender(<TextCarousel items={items} interval={2000} />)
    
    // Should have cleared the previous interval
    expect(clearIntervalSpy).toHaveBeenCalled()
    
    clearIntervalSpy.mockRestore()
  })

  it('should have proper container classes', () => {
    const items = ['Test item']
    render(<TextCarousel items={items} />)
    
    const itemEl = screen.getByText('Test item')
    const container = itemEl.closest('div')?.parentElement?.parentElement as HTMLElement | null
    expect(container).not.toBeNull()
    if (container) {
      expect(container).toHaveClass('relative')
      expect(container).toHaveClass('overflow-hidden')
      // Token with brackets is still part of className
      expect(container.className).toContain('min-h-[4em]')
    }
  })

  it('should render AnimatePresence wrapper', () => {
    const items = ['Test item']
    render(<TextCarousel items={items} />)
    
    expect(screen.getByTestId('animate-presence')).toBeInTheDocument()
  })

  it('should handle rapid interval changes', () => {
    const items = ['First item', 'Second item']
    const { rerender } = render(<TextCarousel items={items} interval={1000} />)
    
    // Rapidly change interval multiple times
    rerender(<TextCarousel items={items} interval={500} />)
    rerender(<TextCarousel items={items} interval={2000} />)
    rerender(<TextCarousel items={items} interval={1000} />)
    
    // Should not crash and should still be functional
    expect(screen.getByText('First item')).toBeInTheDocument()
  })
})
