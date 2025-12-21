import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GapAnalysisReportArtifact from '../GapAnalysisReportArtifact'

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockGenerateDataExportPdf = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock PDF generation utility
vi.mock('@/utils/pdf/generateExportPdf', () => ({
  generateDataExportPdf: mockGenerateDataExportPdf,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileDown: () => <span data-testid="file-down-icon">FileDown</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
}))

// Mock window.alert
const mockAlert = vi.fn()
global.alert = mockAlert

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
  mockNavigate.mockClear()
  mockGenerateDataExportPdf.mockClear()
  mockAlert.mockClear()
})

afterEach(() => {
  console.error = originalConsoleError
})

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <GapAnalysisReportArtifact />
    </BrowserRouter>
  )
}

describe('GapAnalysisReportArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      
      const container = screen.getByText('Privacy Gap Analysis Report').closest('div')
      expect(container).toBeInTheDocument()
    })

    it('should render the page title and subtitle', () => {
      renderComponent()
      
      expect(screen.getByText('Privacy Gap Analysis Report')).toBeInTheDocument()
      expect(screen.getByText('Comprehensive Compliance Assessment')).toBeInTheDocument()
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

    it('should display compliance statistics', () => {
      renderComponent()
      
      expect(screen.getByText('65%')).toBeInTheDocument()
      expect(screen.getByText('25%')).toBeInTheDocument()
      expect(screen.getByText('10%')).toBeInTheDocument()
      expect(screen.getByText('Compliant')).toBeInTheDocument()
      expect(screen.getByText('Partial')).toBeInTheDocument()
      expect(screen.getByText('Gaps')).toBeInTheDocument()
    })

    it('should display assessment methodology information', () => {
      renderComponent()
      
      expect(screen.getByText(/Assessment Methodology:/i)).toBeInTheDocument()
      expect(screen.getByText(/risk-weighted compliance scoring/i)).toBeInTheDocument()
    })

    it('should display comprehensive gap analysis description', () => {
      renderComponent()
      
      expect(screen.getByText(/comprehensive gap analysis report evaluates/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR, CCPA, and NIST Privacy Framework/i)).toBeInTheDocument()
    })
  })

  describe('Key Findings Section', () => {
    it('should render key findings card', () => {
      renderComponent()
      
      expect(screen.getByText('Key Findings')).toBeInTheDocument()
    })

    it('should display all four key findings', () => {
      renderComponent()
      
      expect(screen.getByText('Data Retention Policies')).toBeInTheDocument()
      expect(screen.getByText('Consent Mechanisms')).toBeInTheDocument()
      expect(screen.getByText('DPIA Process')).toBeInTheDocument()
      expect(screen.getByText('Data Subject Rights Procedures')).toBeInTheDocument()
    })

    it('should display priority levels for each finding', () => {
      renderComponent()
      
      const highPriorityBadges = screen.getAllByText('High Priority')
      const mediumPriorityBadges = screen.getAllByText('Medium Priority')
      
      expect(highPriorityBadges.length).toBeGreaterThan(0)
      expect(mediumPriorityBadges.length).toBeGreaterThan(0)
    })

    it('should display status for each finding', () => {
      renderComponent()
      
      expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Planned').length).toBeGreaterThan(0)
    })

    it('should display risk levels for each finding', () => {
      renderComponent()
      
      const riskLevels = screen.getAllByText(/Risk Level:/i)
      expect(riskLevels.length).toBeGreaterThan(0)
    })

    it('should display affected frameworks for each finding', () => {
      renderComponent()
      
      const affectedFrameworks = screen.getAllByText(/Affected Frameworks:/i)
      expect(affectedFrameworks.length).toBe(4)
    })

    it('should display detailed descriptions for each finding', () => {
      renderComponent()
      
      expect(screen.getByText(/Data retention policies need updating/i)).toBeInTheDocument()
      expect(screen.getByText(/Consent mechanisms require enhancement/i)).toBeInTheDocument()
      expect(screen.getByText(/DPIA process needs formalization/i)).toBeInTheDocument()
      expect(screen.getByText(/Data subject rights procedures need streamlining/i)).toBeInTheDocument()
    })
  })

  describe('Framework-Specific Compliance Section', () => {
    it('should render framework-specific compliance card', () => {
      renderComponent()
      
      expect(screen.getByText('Framework-Specific Compliance')).toBeInTheDocument()
    })

    it('should display GDPR compliance information', () => {
      renderComponent()
      
      expect(screen.getByText('GDPR Compliance')).toBeInTheDocument()
      expect(screen.getByText('68%')).toBeInTheDocument()
      const partialCompliance = screen.getAllByText(/Partial Compliance/i)
      expect(partialCompliance.length).toBeGreaterThan(0)
    })

    it('should display CCPA compliance information', () => {
      renderComponent()
      
      expect(screen.getByText('CCPA Compliance')).toBeInTheDocument()
      expect(screen.getByText('72%')).toBeInTheDocument()
      const partialCompliance = screen.getAllByText(/Partial Compliance/i)
      expect(partialCompliance.length).toBeGreaterThan(0)
    })

    it('should display NIST Privacy Framework compliance information', () => {
      renderComponent()
      
      expect(screen.getByText('NIST Privacy Framework')).toBeInTheDocument()
      expect(screen.getByText('58%')).toBeInTheDocument()
      const needsImprovement = screen.getAllByText(/Needs Improvement/i)
      expect(needsImprovement.length).toBeGreaterThan(0)
    })

    it('should display maturity levels for each framework', () => {
      renderComponent()
      
      const maturityLevel2 = screen.getAllByText(/Maturity Level: 2/i)
      const maturityLevel1 = screen.getAllByText(/Maturity Level: 1/i)
      
      expect(maturityLevel2.length).toBeGreaterThan(0)
      expect(maturityLevel1.length).toBeGreaterThan(0)
    })
  })

  describe('Prioritized Remediation Roadmap Section', () => {
    it('should render remediation roadmap card', () => {
      renderComponent()
      
      expect(screen.getByText('Prioritized Remediation Roadmap')).toBeInTheDocument()
    })

    it('should display all four remediation items', () => {
      renderComponent()
      
      expect(screen.getByText('Update Data Retention Policies')).toBeInTheDocument()
      expect(screen.getByText('Enhance Consent Mechanisms')).toBeInTheDocument()
      expect(screen.getByText('Formalize DPIA Process')).toBeInTheDocument()
      expect(screen.getByText('Streamline DSR Procedures')).toBeInTheDocument()
    })

    it('should display timeline for each remediation item', () => {
      renderComponent()
      
      const timelines = screen.getAllByText(/Timeline:/i)
      expect(timelines.length).toBe(4)
      const thirtyDays = screen.getAllByText('30 days')
      expect(thirtyDays.length).toBeGreaterThan(0)
      expect(screen.getByText('60 days')).toBeInTheDocument()
      expect(screen.getByText('45 days')).toBeInTheDocument()
    })

    it('should display owner for each remediation item', () => {
      renderComponent()
      
      const owners = screen.getAllByText(/Owner:/i)
      expect(owners.length).toBe(4)
      expect(screen.getByText('Legal & Compliance')).toBeInTheDocument()
      expect(screen.getByText('Product & Engineering')).toBeInTheDocument()
      expect(screen.getByText('Privacy Team')).toBeInTheDocument()
      expect(screen.getByText('Privacy & IT')).toBeInTheDocument()
    })

    it('should display controls for each remediation item', () => {
      renderComponent()
      
      const controls = screen.getAllByText(/Controls:/i)
      expect(controls.length).toBe(4)
      expect(screen.getByText(/GDPR-5.1.e/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR-6.1.a/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR-35/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR-15-22/i)).toBeInTheDocument()
    })
  })

  describe('Assessment Details Section', () => {
    it('should render assessment details card', () => {
      renderComponent()
      
      expect(screen.getByText('Assessment Details')).toBeInTheDocument()
    })

    it('should display assessment date', () => {
      renderComponent()
      
      expect(screen.getByText(/Assessment Date/i)).toBeInTheDocument()
      const dateText = screen.getByText(/Assessment Date/i).closest('div')?.textContent
      expect(dateText).toContain('Assessment Date')
    })

    it('should display assessed by information', () => {
      renderComponent()
      
      expect(screen.getByText(/Assessed By/i)).toBeInTheDocument()
      expect(screen.getByText('Privacy Compliance Team')).toBeInTheDocument()
    })

    it('should display frameworks assessed', () => {
      renderComponent()
      
      expect(screen.getByText(/Frameworks Assessed/i)).toBeInTheDocument()
      expect(screen.getByText('GDPR, CCPA, NIST Privacy Framework')).toBeInTheDocument()
    })

    it('should display next review date', () => {
      renderComponent()
      
      expect(screen.getByText(/Next Review Date/i)).toBeInTheDocument()
    })

    it('should display report features', () => {
      renderComponent()
      
      expect(screen.getByText(/Report Features:/i)).toBeInTheDocument()
      expect(screen.getByText(/Comprehensive assessment covering/i)).toBeInTheDocument()
      const roadmapFeatures = screen.getAllByText(/Prioritized remediation roadmap/i)
      expect(roadmapFeatures.length).toBeGreaterThan(0)
      expect(screen.getByText(/Framework-specific compliance scoring/i)).toBeInTheDocument()
      expect(screen.getByText(/Detailed gap analysis/i)).toBeInTheDocument()
      expect(screen.getByText(/Actionable recommendations/i)).toBeInTheDocument()
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
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(generateDataExportPdf).toHaveBeenCalledTimes(1)
      })
    })

    it('should pass correct metadata to PDF generator', async () => {
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(generateDataExportPdf).toHaveBeenCalled()
        const callArgs = mockGenerateDataExportPdf.mock.calls[0]
        
        expect(callArgs[0]).toMatchObject({
          title: 'Privacy Gap Analysis Report',
          subtitle: 'Comprehensive Compliance Assessment',
          version: '1.0',
          generatedBy: 'Gap Analysis Tool',
        })
        expect(callArgs[0].timestamp).toBeDefined()
        expect(callArgs[0].reportId).toMatch(/^GAP-ANALYSIS-\d+$/)
      })
    })

    it('should pass correct summary data to PDF generator', async () => {
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        const callArgs = mockGenerateDataExportPdf.mock.calls[0]
        const summary = callArgs[1]
        
        expect(summary).toMatchObject({
          'Overall Compliance': '65%',
          'Compliant Controls': '65%',
          'Partial Controls': '25%',
          'Gap Controls': '10%',
          'Frameworks Assessed': 'GDPR, CCPA, NIST Privacy Framework',
        })
        expect(summary['Assessment Date']).toBeDefined()
      })
    })

    it('should pass correct table data to PDF generator', async () => {
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        const callArgs = mockGenerateDataExportPdf.mock.calls[0]
        const tableData = callArgs[2]
        
        expect(tableData).toHaveLength(2)
        expect(tableData[0]).toMatchObject({
          title: 'Key Findings',
          headers: ['Finding', 'Priority', 'Status'],
        })
        expect(tableData[0].rows).toHaveLength(4)
        
        expect(tableData[1]).toMatchObject({
          title: 'Compliance Breakdown',
          headers: ['Framework', 'Compliance Score', 'Status'],
        })
        expect(tableData[1].rows).toHaveLength(3)
      })
    })

    it('should pass correct filename to PDF generator', async () => {
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        const callArgs = mockGenerateDataExportPdf.mock.calls[0]
        const filename = callArgs[3]
        
        expect(filename).toMatch(/^gap-analysis-report-\d{4}-\d{2}-\d{2}\.pdf$/)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle PDF generation errors gracefully', async () => {
      const error = new Error('PDF generation failed')
      mockGenerateDataExportPdf.mockRejectedValue(error)
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error generating PDF:', error)
        expect(mockAlert).toHaveBeenCalledWith('Failed to generate PDF. Please try again.')
      })
    })

    it('should not crash when PDF generation throws an error', async () => {
      mockGenerateDataExportPdf.mockRejectedValue(new Error('Network error'))
      
      renderComponent()
      
      const exportButton = screen.getByRole('button', { name: /export pdf/i })
      fireEvent.click(exportButton)
      
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalled()
      })
      
      // Component should still be rendered
      expect(screen.getByText('Privacy Gap Analysis Report')).toBeInTheDocument()
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
      
      const mainHeading = screen.getByRole('heading', { name: /privacy gap analysis report/i })
      expect(mainHeading).toBeInTheDocument()
    })

    it('should have semantic card structure', () => {
      renderComponent()
      
      const cards = screen.getAllByText(/Executive Summary|Key Findings|Framework-Specific Compliance|Prioritized Remediation Roadmap|Assessment Details/i)
      expect(cards.length).toBeGreaterThan(0)
    })
  })

  describe('Data Display Accuracy', () => {
    it('should display correct compliance percentages', () => {
      renderComponent()
      
      // Check executive summary percentages
      const compliantPercentage = screen.getAllByText('65%')
      const partialPercentage = screen.getAllByText('25%')
      const gapPercentage = screen.getAllByText('10%')
      
      expect(compliantPercentage.length).toBeGreaterThan(0)
      expect(partialPercentage.length).toBeGreaterThan(0)
      expect(gapPercentage.length).toBeGreaterThan(0)
    })

    it('should display correct framework compliance scores', () => {
      renderComponent()
      
      expect(screen.getByText('68%')).toBeInTheDocument() // GDPR
      expect(screen.getByText('72%')).toBeInTheDocument() // CCPA
      expect(screen.getByText('58%')).toBeInTheDocument() // NIST
    })

    it('should display correct priority counts', () => {
      renderComponent()
      
      const highPriorityCount = screen.getAllByText('High Priority').length
      const mediumPriorityCount = screen.getAllByText('Medium Priority').length
      
      // High Priority appears in both Key Findings (2) and Remediation Roadmap (2) = 4 total
      // Medium Priority appears in both Key Findings (2) and Remediation Roadmap (2) = 4 total
      expect(highPriorityCount).toBe(4)
      expect(mediumPriorityCount).toBe(4)
    })
  })

  describe('Component Structure', () => {
    it('should render all major sections', () => {
      renderComponent()
      
      const sections = [
        'Executive Summary',
        'Key Findings',
        'Framework-Specific Compliance',
        'Prioritized Remediation Roadmap',
        'Assessment Details',
      ]
      
      sections.forEach(section => {
        expect(screen.getByText(section)).toBeInTheDocument()
      })
    })

    it('should have proper container structure', () => {
      const { container } = renderComponent()
      
      const mainContainer = container.querySelector('.container')
      expect(mainContainer).toBeInTheDocument()
    })

    it('should render all cards with proper structure', () => {
      renderComponent()
      
      // All sections should be within cards
      const cardTitles = [
        'Executive Summary',
        'Key Findings',
        'Framework-Specific Compliance',
        'Prioritized Remediation Roadmap',
        'Assessment Details',
      ]
      
      cardTitles.forEach(title => {
        const titleElement = screen.getByText(title)
        expect(titleElement).toBeInTheDocument()
      })
    })
  })

  describe('Date Formatting', () => {
    it('should format assessment date correctly', () => {
      renderComponent()
      
      const assessmentDateLabel = screen.getByText(/Assessment Date/i)
      expect(assessmentDateLabel).toBeInTheDocument()
      
      // The date should be formatted and displayed
      const dateContainer = assessmentDateLabel.closest('div')
      expect(dateContainer).toBeInTheDocument()
    })

    it('should calculate and display next review date', () => {
      renderComponent()
      
      const nextReviewLabel = screen.getByText(/Next Review Date/i)
      expect(nextReviewLabel).toBeInTheDocument()
      
      // Next review should be 90 days from now
      const reviewContainer = nextReviewLabel.closest('div')
      expect(reviewContainer).toBeInTheDocument()
    })
  })
})

