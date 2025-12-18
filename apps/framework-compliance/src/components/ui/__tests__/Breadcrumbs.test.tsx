import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Breadcrumbs from '../Breadcrumbs'

// Mock react-router-dom
const mockUseLocation = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: () => mockUseLocation(),
  }
})

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ChevronRight: () => <div data-testid="chevron-right-icon" />,
  Home: () => <div data-testid="home-icon" />,
}))

const renderBreadcrumbs = (props = {}) => {
  return render(
    <BrowserRouter>
      <Breadcrumbs {...props} />
    </BrowserRouter>
  )
}

describe('Breadcrumbs Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render breadcrumbs for root path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByTestId('home-icon')).toBeInTheDocument()
  })

  it('should render breadcrumbs for single level path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessment-hub' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('Assessment Hub')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
  })

  it('should render breadcrumbs for multi-level path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessments/privacy-assessment' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('Assessments')).toBeInTheDocument()
    expect(screen.getByText('Privacy Assessment')).toBeInTheDocument()
  })

  it('should map path segments to user-friendly names', () => {
    mockUseLocation.mockReturnValue({ pathname: '/toolkit/gdpr-mapper' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('GDPR Mapper')).toBeInTheDocument()
  })

  it('should handle unknown path segments', () => {
    mockUseLocation.mockReturnValue({ pathname: '/unknown/path' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.getByText('Path')).toBeInTheDocument()
  })

  it('should respect maxItems prop', () => {
    mockUseLocation.mockReturnValue({ pathname: '/a/b/c/d/e/f' })
    renderBreadcrumbs({ maxItems: 3 })
    
    // Should show Home + ellipsis + last 2 segments
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('...')).toBeInTheDocument()
    expect(screen.getByText('E')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
  })

  it('should show ellipsis when maxItems is exceeded', () => {
    mockUseLocation.mockReturnValue({ pathname: '/a/b/c/d/e' })
    renderBreadcrumbs({ maxItems: 3 })
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('...')).toBeInTheDocument()
  })

  it('should hide home when showHome is false', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessment-hub' })
    renderBreadcrumbs({ showHome: false })
    
    expect(screen.queryByTitle('Home')).not.toBeInTheDocument()
    expect(screen.getByText('Assessment Hub')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    mockUseLocation.mockReturnValue({ pathname: '/' })
    renderBreadcrumbs({ className: 'custom-breadcrumbs' })
    
    const breadcrumbs = screen.getByRole('navigation')
    expect(breadcrumbs).toHaveClass('custom-breadcrumbs')
  })

  it('should render links with correct hrefs', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessments/privacy-assessment' })
    renderBreadcrumbs()
    
    const homeLink = screen.getByTitle('Home')
    const assessmentsLink = screen.getByText('Assessments')
    
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
    expect(assessmentsLink.closest('a')).toHaveAttribute('href', '/assessments')
  })

  it('should render last item as span (not link)', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessments/privacy-assessment' })
    renderBreadcrumbs()
    
    const lastItem = screen.getByText('Privacy Assessment')
    expect(lastItem.tagName).toBe('SPAN')
    expect(lastItem.closest('a')).toBeNull()
  })

  it('should handle empty pathname', () => {
    mockUseLocation.mockReturnValue({ pathname: '' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
  })

  it('should handle pathname with trailing slash', () => {
    mockUseLocation.mockReturnValue({ pathname: '/assessment-hub/' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('Assessment Hub')).toBeInTheDocument()
  })

  it('should handle pathname with multiple slashes', () => {
    mockUseLocation.mockReturnValue({ pathname: '//assessment-hub//privacy-assessment' })
    renderBreadcrumbs()
    
    expect(screen.getByTitle('Home')).toBeInTheDocument()
    expect(screen.getByText('Assessment Hub')).toBeInTheDocument()
    expect(screen.getByText('Privacy Assessment')).toBeInTheDocument()
  })
})

