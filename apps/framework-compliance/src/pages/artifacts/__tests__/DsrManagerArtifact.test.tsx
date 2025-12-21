import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import DsrManagerArtifact from '../DsrManagerArtifact'

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
      <DsrManagerArtifact />
    </BrowserRouter>
  )
}

describe('DsrManagerArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('Data Subject Rights Request Manager')).toBeInTheDocument()
    })

    it('should render dashboard overview', () => {
      renderComponent()
      expect(screen.getByText('Request Dashboard Overview')).toBeInTheDocument()
    })

    it('should display request statistics', () => {
      renderComponent()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('Total Requests')).toBeInTheDocument()
      const inProgressTexts = screen.getAllByText('In Progress')
      expect(inProgressTexts.length).toBeGreaterThan(0)
      const completedTexts = screen.getAllByText('Completed')
      expect(completedTexts.length).toBeGreaterThan(0)
      const overdueTexts = screen.getAllByText('Overdue')
      expect(overdueTexts.length).toBeGreaterThan(0)
    })
  })

  describe('Request Management', () => {
    it('should display active requests table', () => {
      renderComponent()
      expect(screen.getByText('Active Requests')).toBeInTheDocument()
      expect(screen.getByText('DSR-2025-001')).toBeInTheDocument()
    })

    it('should display request types supported', () => {
      renderComponent()
      expect(screen.getByText('Request Types Supported')).toBeInTheDocument()
      expect(screen.getByText(/Article 15 - Right of Access/i)).toBeInTheDocument()
      expect(screen.getByText(/Article 17 - Right to Erasure/i)).toBeInTheDocument()
    })

    it('should display request workflow', () => {
      renderComponent()
      expect(screen.getByText('Request Workflow')).toBeInTheDocument()
      expect(screen.getByText(/Request Received/i)).toBeInTheDocument()
    })

    it('should display compliance metrics', () => {
      renderComponent()
      expect(screen.getByText('Compliance Metrics')).toBeInTheDocument()
      expect(screen.getByText('98%')).toBeInTheDocument()
      expect(screen.getByText(/On-Time Completion/i)).toBeInTheDocument()
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

