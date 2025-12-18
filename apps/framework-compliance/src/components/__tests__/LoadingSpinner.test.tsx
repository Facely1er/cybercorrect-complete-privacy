import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner Component', () => {
  it('should render with default props', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByText('Loading...')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('text-sm', 'text-muted-foreground')
  })

  it('should render with custom size', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    const spinnerIcon = screen.getByRole('img', { hidden: true })
    expect(spinnerIcon).toHaveClass('h-4', 'w-4')

    rerender(<LoadingSpinner size="md" />)
    const spinnerIconMd = screen.getByRole('img', { hidden: true })
    expect(spinnerIconMd).toHaveClass('h-8', 'w-8')

    rerender(<LoadingSpinner size="lg" />)
    const spinnerIconLg = screen.getByRole('img', { hidden: true })
    expect(spinnerIconLg).toHaveClass('h-12', 'w-12')
  })

  it('should render with custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    
    const container = screen.getByText('Loading...').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('should have accessible label', () => {
    render(<LoadingSpinner />)
    
    const spinnerIcon = screen.getByRole('img', { hidden: true })
    expect(spinnerIcon).toHaveAttribute('aria-hidden', 'true')
  })
})
