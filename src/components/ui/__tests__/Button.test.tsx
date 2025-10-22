import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

// Mock cn utility
vi.mock('../../utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

// Mock class-variance-authority
vi.mock('class-variance-authority', () => ({
  cva: vi.fn(() => vi.fn(() => 'button-classes'))
}))

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button data-testid="button">Click me</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
    expect(button.tagName).toBe('BUTTON')
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class" data-testid="button">Click me</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref} data-testid="button">Click me</Button>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} data-testid="button">Click me</Button>)
    
    const button = screen.getByTestId('button')
    fireEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled data-testid="button">Click me</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toBeDisabled()
  })

  it('should pass through additional props', () => {
    render(<Button data-testid="button" type="submit" aria-label="Submit form">Click me</Button>)
    
    const button = screen.getByTestId('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })

  it('should render with different variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'success', 'warning', 'premium']
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Button variant={variant as any} data-testid={`button-${variant}`}>
          {variant} button
        </Button>
      )
      
      const button = screen.getByTestId(`button-${variant}`)
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(`${variant} button`)
      
      unmount()
    })
  })

  it('should render with different sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'xl', 'icon']
    
    sizes.forEach(size => {
      const { unmount } = render(
        <Button size={size as any} data-testid={`button-${size}`}>
          {size} button
        </Button>
      )
      
      const button = screen.getByTestId(`button-${size}`)
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(`${size} button`)
      
      unmount()
    })
  })

  it('should render with different rounded variants', () => {
    const roundedVariants = ['default', 'full', 'none']
    
    roundedVariants.forEach(rounded => {
      const { unmount } = render(
        <Button rounded={rounded as any} data-testid={`button-${rounded}`}>
          {rounded} button
        </Button>
      )
      
      const button = screen.getByTestId(`button-${rounded}`)
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent(`${rounded} button`)
      
      unmount()
    })
  })

  it('should render as icon button', () => {
    render(
      <Button size="icon" data-testid="icon-button" aria-label="Close">
        ×
      </Button>
    )
    
    const button = screen.getByTestId('icon-button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Close')
    expect(button).toHaveTextContent('×')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<Button onKeyDown={handleKeyDown} data-testid="button">Click me</Button>)
    
    const button = screen.getByTestId('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should render with complex children', () => {
    render(
      <Button data-testid="button">
        <span>Icon</span>
        <span>Text</span>
      </Button>
    )
    
    const button = screen.getByTestId('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Icon')
    expect(button).toHaveTextContent('Text')
  })

  it('should maintain displayName', () => {
    expect(Button.displayName).toBe('Button')
  })
})
