import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Logo from '../Logo'

describe('Logo Component', () => {
  it('should render with default props', () => {
    render(<Logo data-testid="logo" />)
    
    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/cybercorrect.png')
    expect(image).toHaveClass('h-12', 'w-auto')
  })

  it('should render with text by default', () => {
    render(<Logo data-testid="logo" />)
    
    expect(screen.getByText('CyberCorrect™')).toBeInTheDocument()
    expect(screen.getByText('Privacy Platform')).toBeInTheDocument()
    expect(screen.getByText('by ERMITS')).toBeInTheDocument()
  })

  it('should hide text when showText is false', () => {
    render(<Logo showText={false} data-testid="logo" />)
    
    const logo = screen.getByTestId('logo')
    expect(logo).toBeInTheDocument()
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toBeInTheDocument()
    
    expect(screen.queryByText('CyberCorrect™')).not.toBeInTheDocument()
    expect(screen.queryByText('Privacy Platform')).not.toBeInTheDocument()
    expect(screen.queryByText('by ERMITS')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Logo className="custom-logo" data-testid="logo" />)
    
    const logo = screen.getByTestId('logo')
    expect(logo).toHaveClass('custom-logo')
  })

  it('should render with small size', () => {
    render(<Logo size="small" data-testid="logo" />)
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toHaveClass('h-6', 'w-auto')
  })

  it('should render with medium size (default)', () => {
    render(<Logo size="medium" data-testid="logo" />)
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toHaveClass('h-12', 'w-auto')
  })

  it('should render with large size', () => {
    render(<Logo size="large" data-testid="logo" />)
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toHaveClass('h-14', 'w-auto')
  })

  it('should render all size variants correctly', () => {
    const sizes = ['small', 'medium', 'large'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(<Logo size={size} data-testid={`logo-${size}`} />)
      
      const image = screen.getByAltText('CyberCorrect Privacy Platform')
      const expectedClasses = {
        small: ['h-6', 'w-auto'],
        medium: ['h-12', 'w-auto'],
        large: ['h-14', 'w-auto']
      }
      
      expectedClasses[size].forEach(className => {
        expect(image).toHaveClass(className)
      })
      
      unmount()
    })
  })

  it('should have proper text structure when showText is true', () => {
    render(<Logo showText={true} data-testid="logo" />)
    
    const cyberCorrectText = screen.getByText('CyberCorrect™')
    const privacyPlatformText = screen.getByText('Privacy Platform')
    const ermitsText = screen.getByText('by ERMITS')
    
    expect(cyberCorrectText).toBeInTheDocument()
    expect(privacyPlatformText).toBeInTheDocument()
    expect(ermitsText).toBeInTheDocument()
    
    // Check that text elements have proper classes
    expect(cyberCorrectText).toHaveClass('font-bold', 'text-foreground', 'dark:text-dark-text', 'leading-tight')
    expect(privacyPlatformText).toHaveClass('text-xs', 'text-foreground', 'dark:text-dark-text', 'leading-tight')
    expect(ermitsText).toHaveClass('text-xs', 'text-muted-foreground', 'leading-tight')
  })

  it('should render with combined props', () => {
    render(
      <Logo 
        size="large" 
        showText={false} 
        className="custom-class" 
        data-testid="logo" 
      />
    )
    
    const logo = screen.getByTestId('logo')
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    
    expect(logo).toHaveClass('custom-class')
    expect(image).toHaveClass('h-14', 'w-auto')
    expect(screen.queryByText('CyberCorrect™')).not.toBeInTheDocument()
  })

  it('should have proper accessibility attributes', () => {
    render(<Logo data-testid="logo" />)
    
    const image = screen.getByAltText('CyberCorrect Privacy Platform')
    expect(image).toHaveAttribute('alt', 'CyberCorrect Privacy Platform')
    expect(image).toHaveAttribute('src', '/cybercorrect.png')
  })
})
