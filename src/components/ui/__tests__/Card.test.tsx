import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Card'

// Mock cn utility
vi.mock('../../utils/cn', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' ')
}))

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('Card content')
      expect(card).toHaveClass('rounded-xl', 'border', 'border-support-gray', 'bg-surface')
    })

    it('should apply custom className', () => {
      render(<Card className="custom-class" data-testid="card">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<Card ref={ref} data-testid="card">Card content</Card>)
      
      expect(ref).toHaveBeenCalled()
    })

    it('should pass through additional props', () => {
      render(<Card data-testid="card" role="article">Card content</Card>)
      
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('role', 'article')
    })
  })

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>)
      
      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header content')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('should apply custom className', () => {
      render(<CardHeader className="custom-header" data-testid="card-header">Header content</CardHeader>)
      
      const header = screen.getByTestId('card-header')
      expect(header).toHaveClass('custom-header')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CardHeader ref={ref} data-testid="card-header">Header content</CardHeader>)
      
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(<CardTitle data-testid="card-title">Title content</CardTitle>)
      
      const title = screen.getByTestId('card-title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Title content')
      expect(title).toHaveClass('text-xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })

    it('should apply custom className', () => {
      render(<CardTitle className="custom-title" data-testid="card-title">Title content</CardTitle>)
      
      const title = screen.getByTestId('card-title')
      expect(title).toHaveClass('custom-title')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CardTitle ref={ref} data-testid="card-title">Title content</CardTitle>)
      
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(<CardDescription data-testid="card-description">Description content</CardDescription>)
      
      const description = screen.getByTestId('card-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent('Description content')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('should apply custom className', () => {
      render(<CardDescription className="custom-description" data-testid="card-description">Description content</CardDescription>)
      
      const description = screen.getByTestId('card-description')
      expect(description).toHaveClass('custom-description')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CardDescription ref={ref} data-testid="card-description">Description content</CardDescription>)
      
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>)
      
      const content = screen.getByTestId('card-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Content')
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('should apply custom className', () => {
      render(<CardContent className="custom-content" data-testid="card-content">Content</CardContent>)
      
      const content = screen.getByTestId('card-content')
      expect(content).toHaveClass('custom-content')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(<CardContent ref={ref} data-testid="card-content">Content</CardContent>)
      
      expect(ref).toHaveBeenCalled()
    })
  })

  describe('Card Composition', () => {
    it('should render complete card structure', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
        </Card>
      )
      
      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should handle nested components correctly', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Nested Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div data-testid="nested-content">Nested content</div>
          </CardContent>
        </Card>
      )
      
      expect(screen.getByText('Nested Title')).toBeInTheDocument()
      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
    })
  })
})
