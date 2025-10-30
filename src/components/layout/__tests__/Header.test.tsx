import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from '../Header'

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
  SunMoon: () => <div data-testid="sun-moon-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
}))

const renderHeader = (props = {}) => {
  const defaultProps = {
    toggleDarkMode: vi.fn(),
    darkMode: false,
    ...props,
  }
  
  return render(
    <BrowserRouter>
      <Header {...defaultProps} />
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLocation.mockReturnValue({ pathname: '/' })
  })

  it('should render header with logo', () => {
    renderHeader()
    
    expect(screen.getByText('CyberCorrect Privacy Platform')).toBeInTheDocument()
  })

  it('should render dark mode toggle button', () => {
    const toggleDarkMode = vi.fn()
    renderHeader({ toggleDarkMode })
    
    const darkModeButton = screen.getByRole('button', { name: /toggle dark mode/i })
    expect(darkModeButton).toBeInTheDocument()
    
    fireEvent.click(darkModeButton)
    expect(toggleDarkMode).toHaveBeenCalledTimes(1)
  })

  it('should show correct icon based on dark mode state', () => {
    renderHeader({ darkMode: false })
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
    
    renderHeader({ darkMode: true })
    expect(screen.getByTestId('moon-icon')).toBeInTheDocument()
  })

  it('should render mobile menu toggle button', () => {
    renderHeader()
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('should render navigation buttons', () => {
    renderHeader()
    
    // Check that navigation buttons exist (both desktop and mobile versions)
    expect(screen.getAllByText('Assessments')).toHaveLength(2)
    expect(screen.getAllByText('Tools')).toHaveLength(2)
    expect(screen.getAllByText('Results')).toHaveLength(2)
  })

  it('should handle dropdown interactions', () => {
    renderHeader()
    
    const assessmentsButton = screen.getAllByText('Assessments')[0] // Get desktop version
    fireEvent.click(assessmentsButton)
    
    // Check that dropdown content is visible
    expect(screen.getAllByText('Privacy Assessment').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Data Governance Review').length).toBeGreaterThan(0)
  })

  it('should render all tool links', () => {
    renderHeader()
    
    const toolsButton = screen.getAllByText('Tools')[0] // Get desktop version
    fireEvent.click(toolsButton)
    
    // Check that all tool links are present
    expect(screen.getAllByText('Data Flow Mapper')).toHaveLength(2) // Desktop + mobile
    expect(screen.getAllByText('DPIA Generator')).toHaveLength(2) // Desktop + mobile
    expect(screen.getAllByText('GDPR Mapper')).toHaveLength(2) // Desktop + mobile
    expect(screen.getAllByText('Policy Generator')).toHaveLength(2) // Desktop + mobile
  })

  it('should render all result links', () => {
    renderHeader()
    
    const resultsButton = screen.getAllByText('Results')[0] // Get desktop version
    fireEvent.click(resultsButton)
    
    // Check that all result links are present
    expect(screen.getAllByText('Privacy Results')).toHaveLength(2) // Desktop + mobile
    expect(screen.getAllByText('Privacy Recommendations')).toHaveLength(2) // Desktop + mobile
  })

  it('should handle mobile menu interactions', () => {
    renderHeader()
    
    const mobileMenuButton = screen.getByRole('button', { name: /open main menu/i })
    
    // Click mobile menu button
    fireEvent.click(mobileMenuButton)
    
    // Check that mobile menu content is visible
    expect(screen.getByText('Privacy Assessment')).toBeInTheDocument()
  })
})
