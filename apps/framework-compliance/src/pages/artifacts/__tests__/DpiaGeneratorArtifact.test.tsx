import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DpiaGeneratorArtifact from '../DpiaGeneratorArtifact'
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock PDF generation utility
vi.mock('@/utils/pdf/generateExportPdf', () => ({
  generateDataExportPdf: vi.fn(),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileDown: () => <span data-testid="file-down-icon">FileDown</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
}))

// Mock window.alert
const mockAlert = vi.fn()
global.alert = mockAlert

// Mock console.error
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
  mockNavigate.mockClear()
  vi.mocked(generateDataExportPdf).mockClear()
  mockAlert.mockClear()
})

afterEach(() => {
  console.error = originalConsoleError
})

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <DpiaGeneratorArtifact />
    </BrowserRouter>
  )
}

describe('DpiaGeneratorArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      
      expect(screen.getByText('Data Protection Impact Assessment (DPIA)')).toBeInTheDocument()
    })

    it('should render the page title', () => {
      renderComponent()
      
      expect(screen.getByText('Data Protection Impact Assessment (DPIA)')).toBeInTheDocument()
    })

    it('should render the back button with icon', () => {
      renderComponent()
      
      const backButton = screen.getByRole('button', { name: /back/i })
      expect(backButton).toBeInTheDocument()
      expect(screen.getByTestId('arrow-left-icon')).toBeInTheDocument()
    })

    it('should render the export PDF button with icon', () => {
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      expect(exportButton).toBeInTheDocument()
      expect(screen.getByTestId('file-down-icon')).toBeInTheDocument()
    })
  })

  describe('Executive Summary Section', () => {
    it('should render executive summary card', () => {
      renderComponent()
      
      expect(screen.getByText('Executive Summary')).toBeInTheDocument()
    })

    it('should display DPIA description', () => {
      renderComponent()
      
      expect(screen.getByText(/This Data Protection Impact Assessment/i)).toBeInTheDocument()
    })

    it('should display assessment metadata', () => {
      renderComponent()
      
      expect(screen.getByText(/Assessment Date:/i)).toBeInTheDocument()
      expect(screen.getByText(/Assessment Version:/i)).toBeInTheDocument()
      expect(screen.getByText(/Next Review Date:/i)).toBeInTheDocument()
      expect(screen.getByText(/Assessed By:/i)).toBeInTheDocument()
    })
  })

  describe('Processing Activity Section', () => {
    it('should display processing activity details', () => {
      renderComponent()
      
      expect(screen.getByText(/1\. Description of Processing Activity/i)).toBeInTheDocument()
      expect(screen.getByText(/Processing Activity Name:/i)).toBeInTheDocument()
      expect(screen.getByText(/Purpose of Processing:/i)).toBeInTheDocument()
      expect(screen.getByText(/Legal Basis:/i)).toBeInTheDocument()
    })

    it('should display processing activity name', () => {
      renderComponent()
      
      expect(screen.getByText(/Customer Data Collection and Storage/i)).toBeInTheDocument()
    })
  })

  describe('Data Categories Section', () => {
    it('should display data categories section', () => {
      renderComponent()
      
      expect(screen.getByText(/2\. Categories of Personal Data/i)).toBeInTheDocument()
    })

    it('should display identity data category', () => {
      renderComponent()
      
      expect(screen.getByText('Identity Data:')).toBeInTheDocument()
      expect(screen.getByText('Full name')).toBeInTheDocument()
      expect(screen.getByText('Email address')).toBeInTheDocument()
    })

    it('should display financial data category', () => {
      renderComponent()
      
      expect(screen.getByText('Financial Data:')).toBeInTheDocument()
      expect(screen.getByText(/Payment card information/i)).toBeInTheDocument()
    })

    it('should display technical data category', () => {
      renderComponent()
      
      expect(screen.getByText('Technical Data:')).toBeInTheDocument()
      expect(screen.getByText('IP address')).toBeInTheDocument()
    })

    it('should display profile data category', () => {
      renderComponent()
      
      expect(screen.getByText('Profile Data:')).toBeInTheDocument()
      expect(screen.getByText(/Preferences and interests/i)).toBeInTheDocument()
    })
  })

  describe('Data Subjects Section', () => {
    it('should display data subjects section', () => {
      renderComponent()
      
      expect(screen.getByText(/3\. Data Subjects/i)).toBeInTheDocument()
    })

    it('should display data subject categories', () => {
      renderComponent()
      
      expect(screen.getByText(/customers, prospective customers/i)).toBeInTheDocument()
    })
  })

  describe('Data Recipients Section', () => {
    it('should display data recipients section', () => {
      renderComponent()
      
      expect(screen.getByText(/4\. Data Recipients and Transfers/i)).toBeInTheDocument()
    })

    it('should display internal and external recipients', () => {
      renderComponent()
      
      expect(screen.getByText(/Internal Recipients:/i)).toBeInTheDocument()
      expect(screen.getByText(/External Recipients:/i)).toBeInTheDocument()
      expect(screen.getByText(/International Transfers:/i)).toBeInTheDocument()
    })
  })

  describe('Risk Assessment Section', () => {
    it('should display risk assessment section', () => {
      renderComponent()
      
      expect(screen.getByText(/5\. Risk Assessment/i)).toBeInTheDocument()
    })

    it('should display overall risk level', () => {
      renderComponent()
      
      expect(screen.getByText(/Overall Risk Level: MEDIUM/i)).toBeInTheDocument()
      expect(screen.getByText('Medium Risk')).toBeInTheDocument()
    })

    it('should display identified risks', () => {
      renderComponent()
      
      expect(screen.getByText(/Risk 1: Unauthorized Access/i)).toBeInTheDocument()
      expect(screen.getByText(/Risk 2: Data Breach/i)).toBeInTheDocument()
      expect(screen.getByText(/Risk 3: Inadequate Data Retention/i)).toBeInTheDocument()
      expect(screen.getByText(/Risk 4: Insufficient Transparency/i)).toBeInTheDocument()
    })
  })

  describe('Mitigation Measures Section', () => {
    it('should display mitigation measures section', () => {
      renderComponent()
      
      expect(screen.getByText(/6\. Mitigation Measures/i)).toBeInTheDocument()
    })

    it('should display security measures', () => {
      renderComponent()
      
      expect(screen.getByText('Security Measures:')).toBeInTheDocument()
      const encryptionTexts = screen.getAllByText(/Encryption at rest/i)
      expect(encryptionTexts.length).toBeGreaterThan(0)
      const mfaTexts = screen.getAllByText(/Multi-factor authentication/i)
      expect(mfaTexts.length).toBeGreaterThan(0)
    })

    it('should display organizational measures', () => {
      renderComponent()
      
      expect(screen.getByText('Organizational Measures:')).toBeInTheDocument()
      expect(screen.getByText(/Privacy training/i)).toBeInTheDocument()
    })

    it('should display technical measures', () => {
      renderComponent()
      
      expect(screen.getByText('Technical Measures:')).toBeInTheDocument()
      const retentionTexts = screen.getAllByText(/Automated data retention policies/i)
      expect(retentionTexts.length).toBeGreaterThan(0)
    })
  })

  describe('Consultation and Approval Section', () => {
    it('should display consultation section', () => {
      renderComponent()
      
      expect(screen.getByText(/7\. Consultation and Approval/i)).toBeInTheDocument()
    })

    it('should display review information', () => {
      renderComponent()
      
      expect(screen.getByText(/DPO Review:/i)).toBeInTheDocument()
      expect(screen.getByText(/IT Security Review:/i)).toBeInTheDocument()
      expect(screen.getByText(/Legal Review:/i)).toBeInTheDocument()
      expect(screen.getByText(/Management Approval:/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should navigate back when back button is clicked', () => {
      renderComponent()
      
      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)
      
      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it('should call generateDataExportPdf when export button is clicked', async () => {
      vi.mocked(generateDataExportPdf).mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(generateDataExportPdf).toHaveBeenCalledTimes(1)
      })
    })

    it('should pass correct metadata to PDF generator', async () => {
      vi.mocked(generateDataExportPdf).mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(generateDataExportPdf).toHaveBeenCalled()
        const callArgs = vi.mocked(generateDataExportPdf).mock.calls[0]
        
        expect(callArgs[0]).toMatchObject({
          title: 'Data Protection Impact Assessment (DPIA)',
          subtitle: 'Comprehensive Privacy Risk Assessment',
          version: '1.0',
          generatedBy: 'DPIA Generator Tool',
        })
        expect(callArgs[0].reportId).toMatch(/^DPIA-\d+$/)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle PDF generation errors gracefully', async () => {
      const error = new Error('PDF generation failed')
      vi.mocked(generateDataExportPdf).mockRejectedValue(error)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error generating PDF:', error)
        expect(mockAlert).toHaveBeenCalledWith('Failed to generate PDF. Please try again.')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button elements', () => {
      renderComponent()
      
      const backButton = screen.getByRole('button', { name: /back/i })
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      
      expect(backButton).toBeInTheDocument()
      expect(exportButton).toBeInTheDocument()
    })

    it('should have proper heading structure', () => {
      renderComponent()
      
      const mainHeading = screen.getByRole('heading', { name: /data protection impact assessment/i })
      expect(mainHeading).toBeInTheDocument()
    })
  })

  describe('Compliance Indicators', () => {
    it('should display GDPR Article 35 compliance indicator', () => {
      renderComponent()
      
      expect(screen.getByText(/GDPR Article 35 Compliant/i)).toBeInTheDocument()
    })

    it('should display compliance features', () => {
      renderComponent()
      
      expect(screen.getByText(/Comprehensive risk assessment/i)).toBeInTheDocument()
      expect(screen.getByText(/Detailed mitigation measures/i)).toBeInTheDocument()
    })
  })
})

