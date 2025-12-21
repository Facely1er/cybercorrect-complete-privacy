import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ComplianceRoadmapArtifact from '../ComplianceRoadmapArtifact'
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
      <ComplianceRoadmapArtifact />
    </BrowserRouter>
  )
}

describe('ComplianceRoadmapArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('Compliance Roadmap')).toBeInTheDocument()
    })

    it('should render roadmap overview', () => {
      renderComponent()
      expect(screen.getByText('Roadmap Overview')).toBeInTheDocument()
    })

    it('should display priority statistics', () => {
      renderComponent()
      expect(screen.getByText('12')).toBeInTheDocument()
      expect(screen.getByText('Total Items')).toBeInTheDocument()
      expect(screen.getByText('High Priority')).toBeInTheDocument()
      expect(screen.getByText('Medium Priority')).toBeInTheDocument()
      expect(screen.getByText('Low Priority')).toBeInTheDocument()
    })
  })

  describe('Action Items', () => {
    it('should display action items table', () => {
      renderComponent()
      expect(screen.getByText('Action Items')).toBeInTheDocument()
      expect(screen.getByText(/Update data retention policies/i)).toBeInTheDocument()
    })

    it('should display timeline view', () => {
      renderComponent()
      expect(screen.getByText('Timeline View')).toBeInTheDocument()
    })

    it('should display roadmap features', () => {
      renderComponent()
      expect(screen.getByText('Roadmap Features')).toBeInTheDocument()
      expect(screen.getByText(/Risk-Based Prioritization/i)).toBeInTheDocument()
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

