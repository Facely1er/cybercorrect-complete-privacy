import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AssessmentStartScreen, { SectionInfo } from '../AssessmentStartScreen'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Clock: () => <div data-testid="clock-icon" />,
  BarChart2: () => <div data-testid="bar-chart-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  ArrowRight: () => <div data-testid="arrow-right-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Info: () => <div data-testid="info-icon" />,
}))

const mockSections: SectionInfo[] = [
  {
    title: 'Data Collection',
    description: 'Assess data collection practices',
    estimatedTime: '10 minutes',
    complexity: 'Basic',
    questionCount: 5,
  },
  {
    title: 'Data Processing',
    description: 'Review data processing activities',
    estimatedTime: '15 minutes',
    complexity: 'Intermediate',
    questionCount: 8,
  },
  {
    title: 'Data Security',
    description: 'Evaluate security measures',
    estimatedTime: '20 minutes',
    complexity: 'Advanced',
    questionCount: 12,
  },
]

const defaultProps = {
  title: 'Privacy Assessment',
  description: 'Comprehensive privacy assessment tool',
  frameworkName: 'GDPR',
  sections: mockSections,
  onStart: vi.fn(),
}

const renderAssessmentStartScreen = (props = {}) => {
  return render(<AssessmentStartScreen {...defaultProps} {...props} />)
}

describe('AssessmentStartScreen Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with all required props', () => {
    renderAssessmentStartScreen()
    
    expect(screen.getByText('Privacy Assessment')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive privacy assessment tool')).toBeInTheDocument()
    expect(screen.getByText('GDPR')).toBeInTheDocument()
  })

  it('should render all sections', () => {
    renderAssessmentStartScreen()
    
    expect(screen.getByText('Data Collection')).toBeInTheDocument()
    expect(screen.getByText('Data Processing')).toBeInTheDocument()
    expect(screen.getByText('Data Security')).toBeInTheDocument()
  })

  it('should display section details correctly', () => {
    renderAssessmentStartScreen()
    
    // Check first section details
    expect(screen.getByText('Assess data collection practices')).toBeInTheDocument()
    expect(screen.getByText('10 minutes')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    // Combined text format (may appear in multiple places)
    expect(screen.getAllByText('5 questions')[0]).toBeInTheDocument()
  })

  it('should calculate and display total time', () => {
    renderAssessmentStartScreen()
    
    // Total time should be calculated from sections
    expect(screen.getByText(/45 minutes/)).toBeInTheDocument()
  })

  it('should calculate and display total questions', () => {
    renderAssessmentStartScreen()
    
    // Total questions should be calculated from sections
    expect(screen.getByText('25 questions')).toBeInTheDocument()
  })

  it('should render complexity indicators', () => {
    renderAssessmentStartScreen()
    
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('should call onStart when start button is clicked', () => {
    const onStart = vi.fn()
    renderAssessmentStartScreen({ onStart })
    
    const startButton = screen.getByRole('button', { name: /start assessment/i })
    fireEvent.click(startButton)
    
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('should render start button with correct text', () => {
    renderAssessmentStartScreen()
    
    const startButton = screen.getByRole('button', { name: /start assessment/i })
    expect(startButton).toBeInTheDocument()
  })

  it('should render framework information', () => {
    renderAssessmentStartScreen()
    // Badge text present
    expect(screen.getByText('GDPR')).toBeInTheDocument()
  })

  it('should render assessment sections header', () => {
    renderAssessmentStartScreen()
    
    expect(screen.getByText('Assessment Sections')).toBeInTheDocument()
  })

  it('should render icons correctly', () => {
    renderAssessmentStartScreen()
    
    expect(screen.getAllByTestId('clock-icon').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('bar-chart-icon').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('check-circle-icon').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('shield-icon').length).toBeGreaterThan(0)
    expect(screen.getAllByTestId('info-icon').length).toBeGreaterThan(0)
  })

  it('should handle empty sections array', () => {
    renderAssessmentStartScreen({ sections: [] })
    
    expect(screen.getByText('Privacy Assessment')).toBeInTheDocument()
    expect(screen.getByText('0 minutes')).toBeInTheDocument()
    expect(screen.getByText('0 questions')).toBeInTheDocument()
  })

  it('should handle single section', () => {
    const singleSection = [mockSections[0]]
    renderAssessmentStartScreen({ sections: singleSection })
    
    expect(screen.getByText('Data Collection')).toBeInTheDocument()
    expect(screen.getAllByText('10 minutes')[0]).toBeInTheDocument()
    expect(screen.getAllByText('5 questions')[0]).toBeInTheDocument()
  })

  it('should render section complexity badges with correct classes', () => {
    renderAssessmentStartScreen()
    
    const basicBadge = screen.getByText('Basic')
    const intermediateBadge = screen.getByText('Intermediate')
    const advancedBadge = screen.getByText('Advanced')
    
    // Check that badges have the correct CSS classes
    expect(basicBadge).toHaveClass('bg-success/10', 'text-success')
    expect(intermediateBadge).toHaveClass('bg-warning/10', 'text-warning')
    expect(advancedBadge).toHaveClass('bg-destructive/10', 'text-destructive')
  })

  it('should render assessment instructions', () => {
    renderAssessmentStartScreen()
    
    // Check for the "Before You Begin" section
    expect(screen.getByText('Before You Begin')).toBeInTheDocument()
    expect(screen.getByText('You can save your progress and return later to complete the assessment.')).toBeInTheDocument()
  })

  it('should render preparation tips', () => {
    renderAssessmentStartScreen()
    
    // Check for preparation tips in the "Before You Begin" section
    expect(screen.getByText('Have relevant documentation and information readily available to answer questions accurately.')).toBeInTheDocument()
    expect(screen.getByText('For the most accurate results, involve relevant stakeholders in completing the assessment.')).toBeInTheDocument()
  })
})

