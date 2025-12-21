import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BreachNotificationArtifact from '../BreachNotificationArtifact'

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
      <BreachNotificationArtifact />
    </BrowserRouter>
  )
}

describe('BreachNotificationArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('Data Breach Notification Template')).toBeInTheDocument()
    })

    it('should render the back and export buttons', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument()
    })
  })

  describe('Incident Overview Section', () => {
    it('should display incident overview', () => {
      renderComponent()
      expect(screen.getByText(/1\. Incident Overview/i)).toBeInTheDocument()
    })

    it('should display incident details', () => {
      renderComponent()
      expect(screen.getByText(/Incident ID:/i)).toBeInTheDocument()
      expect(screen.getByText(/Date Detected:/i)).toBeInTheDocument()
      expect(screen.getByText(/Severity Level:/i)).toBeInTheDocument()
    })
  })

  describe('Breach Sections', () => {
    it('should display nature of breach section', () => {
      renderComponent()
      expect(screen.getByText(/2\. Nature of the Breach/i)).toBeInTheDocument()
    })

    it('should display immediate response actions', () => {
      renderComponent()
      expect(screen.getByText(/3\. Immediate Response Actions/i)).toBeInTheDocument()
    })

    it('should display risk assessment section', () => {
      renderComponent()
      expect(screen.getByText(/4\. Assessment of Risk to Data Subjects/i)).toBeInTheDocument()
    })

    it('should display notification details', () => {
      renderComponent()
      expect(screen.getByText(/5\. Notification Details/i)).toBeInTheDocument()
    })

    it('should display remediation measures', () => {
      renderComponent()
      expect(screen.getByText(/6\. Remediation Measures/i)).toBeInTheDocument()
    })

    it('should display compliance checklist', () => {
      renderComponent()
      expect(screen.getByText(/7\. Compliance Checklist/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR Article 33:/i)).toBeInTheDocument()
      expect(screen.getByText(/GDPR Article 34:/i)).toBeInTheDocument()
    })

    it('should display contact information', () => {
      renderComponent()
      expect(screen.getByText(/8\. Contact Information/i)).toBeInTheDocument()
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

