import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DataMappingArtifact from '../DataMappingArtifact'

const mockNavigate = vi.fn()
const mockGenerateDataExportPdf = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('@/utils/pdf/generateExportPdf', () => ({
  generateDataExportPdf: mockGenerateDataExportPdf,
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
  mockGenerateDataExportPdf.mockClear()
  mockAlert.mockClear()
})

afterEach(() => {
  console.error = originalConsoleError
})

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <DataMappingArtifact />
    </BrowserRouter>
  )
}

describe('DataMappingArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('Data Flow Mapping Tool')).toBeInTheDocument()
    })

    it('should render the back and export buttons', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument()
    })
  })

  describe('Data Flow Overview', () => {
    it('should display data flow overview', () => {
      renderComponent()
      expect(screen.getByText('Data Flow Overview')).toBeInTheDocument()
    })

    it('should display sample data flow stages', () => {
      renderComponent()
      expect(screen.getByText(/Sample Data Flow: Customer Registration/i)).toBeInTheDocument()
      expect(screen.getByText('1. Collection')).toBeInTheDocument()
      expect(screen.getByText('2. Validation')).toBeInTheDocument()
      expect(screen.getByText('3. Processing')).toBeInTheDocument()
      expect(screen.getByText('4. Storage')).toBeInTheDocument()
    })
  })

  describe('Data Flow Details', () => {
    it('should display data flow details table', () => {
      renderComponent()
      expect(screen.getByText('Data Flow Details')).toBeInTheDocument()
    })

    it('should display flow stages in table', () => {
      renderComponent()
      expect(screen.getByText('Collection')).toBeInTheDocument()
      expect(screen.getByText('Processing')).toBeInTheDocument()
      expect(screen.getByText('Storage')).toBeInTheDocument()
    })
  })

  describe('Third-Party Data Sharing', () => {
    it('should display third-party sharing section', () => {
      renderComponent()
      expect(screen.getByText('Third-Party Data Sharing')).toBeInTheDocument()
    })

    it('should display vendor information', () => {
      renderComponent()
      expect(screen.getByText(/Payment Processor:/i)).toBeInTheDocument()
      expect(screen.getByText(/Email Service:/i)).toBeInTheDocument()
      expect(screen.getByText(/Analytics:/i)).toBeInTheDocument()
    })
  })

  describe('Compliance Mapping', () => {
    it('should display compliance mapping section', () => {
      renderComponent()
      expect(screen.getByText('Compliance Mapping')).toBeInTheDocument()
    })

    it('should display framework mappings', () => {
      renderComponent()
      expect(screen.getByText('GDPR:')).toBeInTheDocument()
      expect(screen.getByText('CCPA:')).toBeInTheDocument()
      expect(screen.getByText('NIST:')).toBeInTheDocument()
    })
  })

  describe('Features', () => {
    it('should display features section', () => {
      renderComponent()
      expect(screen.getByText('Features')).toBeInTheDocument()
    })

    it('should display feature descriptions', () => {
      renderComponent()
      expect(screen.getByText(/Visual Data Flow Mapping:/i)).toBeInTheDocument()
      expect(screen.getByText(/Export Capabilities:/i)).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should navigate back when back button is clicked', () => {
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    it('should call generateDataExportPdf when export button is clicked', async () => {
      mockGenerateDataExportPdf.mockResolvedValue(undefined)
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /export pdf/i }))
      await waitFor(() => {
        expect(mockGenerateDataExportPdf).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle PDF generation errors', async () => {
      mockGenerateDataExportPdf.mockRejectedValue(new Error('PDF failed'))
      renderComponent()
      fireEvent.click(screen.getByRole('button', { name: /export pdf/i }))
      await waitFor(() => {
        expect(mockAlert).toHaveBeenCalled()
      })
    })
  })
})

