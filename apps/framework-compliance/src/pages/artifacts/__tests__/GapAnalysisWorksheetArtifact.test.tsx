import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GapAnalysisWorksheetArtifact from '../GapAnalysisWorksheetArtifact'
import { generateDataExportPdf } from '@/utils/pdf/generateExportPdf'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/utils/pdf/generateExportPdf', () => ({
  generateDataExportPdf: vi.fn(),
}))

vi.mock('lucide-react', () => ({
  FileDown: () => <span data-testid="file-down-icon">FileDown</span>,
  ArrowLeft: () => <span data-testid="arrow-left-icon">ArrowLeft</span>,
}))

const mockAlert = vi.fn()
global.alert = mockAlert

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
      <GapAnalysisWorksheetArtifact />
    </BrowserRouter>
  )
}

describe('GapAnalysisWorksheetArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('NIST Privacy Framework Gap Analysis')).toBeInTheDocument()
    })

    it('should render the back and export buttons', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument()
    })
  })

  describe('Framework Overview', () => {
    it('should display framework overview', () => {
      renderComponent()
      expect(screen.getByText('Framework Overview')).toBeInTheDocument()
    })

    it('should display framework descriptions', () => {
      renderComponent()
      const frameworkTexts = screen.getAllByText(/Comprehensive worksheets for NIST/i)
      expect(frameworkTexts.length).toBeGreaterThan(0)
    })

    it('should display framework badges', () => {
      renderComponent()
      expect(screen.getByText('NIST')).toBeInTheDocument()
      expect(screen.getByText('ISO')).toBeInTheDocument()
      expect(screen.getByText('SOC 2')).toBeInTheDocument()
      expect(screen.getByText('GDPR')).toBeInTheDocument()
    })
  })

  describe('Control Assessment', () => {
    it('should display control assessment table', () => {
      renderComponent()
      expect(screen.getByText('Control Assessment')).toBeInTheDocument()
    })

    it('should display control IDs and names', () => {
      renderComponent()
      expect(screen.getByText('ID.AM-1')).toBeInTheDocument()
      expect(screen.getByText('Asset Inventory')).toBeInTheDocument()
      expect(screen.getByText('PR.AC-3')).toBeInTheDocument()
    })
  })

  describe('Framework-Specific Worksheets', () => {
    it('should display framework-specific worksheets section', () => {
      renderComponent()
      expect(screen.getByText('Framework-Specific Worksheets')).toBeInTheDocument()
    })

    it('should display framework descriptions', () => {
      renderComponent()
      expect(screen.getByText(/NIST Privacy Framework:/i)).toBeInTheDocument()
      expect(screen.getByText(/ISO 27001:/i)).toBeInTheDocument()
      expect(screen.getByText(/SOC 2:/i)).toBeInTheDocument()
    })
  })

  describe('Worksheet Features', () => {
    it('should display worksheet features', () => {
      renderComponent()
      expect(screen.getByText('Worksheet Features')).toBeInTheDocument()
    })

    it('should display feature descriptions', () => {
      renderComponent()
      expect(screen.getByText(/Pre-Mapped Controls:/i)).toBeInTheDocument()
      expect(screen.getByText(/Control Mapping Matrix:/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should navigate back when back button is clicked', () => {
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it('should call generateDataExportPdf when export button is clicked', async () => {
      vi.mocked(generateDataExportPdf).mockResolvedValue(undefined)
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /export pdf/i }))
      await waitFor(() => {
        expect(generateDataExportPdf).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle PDF generation errors', async () => {
      vi.mocked(generateDataExportPdf).mockRejectedValue(new Error('PDF failed'))
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /export pdf/i }))
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalled()
      })
    })
  })
})

