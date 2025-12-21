import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import GdprPrivacyNoticeArtifact from '../GdprPrivacyNoticeArtifact'
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
  CheckCircle: () => <span data-testid="check-circle-icon">CheckCircle</span>,
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
      <GdprPrivacyNoticeArtifact />
    </BrowserRouter>
  )
}

describe('GdprPrivacyNoticeArtifact', () => {
  describe('Component Rendering', () => {
    it('should render the main container', () => {
      renderComponent()
      expect(screen.getByText('GDPR-Compliant Privacy Notice')).toBeInTheDocument()
    })

    it('should render the back and export buttons', () => {
      renderComponent()
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export pdf/i })).toBeInTheDocument()
    })
  })

  describe('Compliance Status', () => {
    it('should display compliance status', () => {
      renderComponent()
      expect(screen.getByText('Compliance Status')).toBeInTheDocument()
    })

    it('should display GDPR Article 13 compliance', () => {
      renderComponent()
      const complianceTexts = screen.getAllByText(/GDPR Article 13 Compliant/i)
      expect(complianceTexts.length).toBeGreaterThan(0)
    })
  })

  describe('Privacy Notice Sections', () => {
    it('should display controller identity section', () => {
      renderComponent()
      expect(screen.getByText(/1\. Identity and Contact Details/i)).toBeInTheDocument()
    })

    it('should display purposes and legal basis section', () => {
      renderComponent()
      expect(screen.getByText(/2\. Purposes and Legal Basis/i)).toBeInTheDocument()
    })

    it('should display data categories section', () => {
      renderComponent()
      expect(screen.getByText(/3\. Categories of Personal Data/i)).toBeInTheDocument()
    })

    it('should display data recipients section', () => {
      renderComponent()
      expect(screen.getByText(/4\. Recipients of Personal Data/i)).toBeInTheDocument()
    })

    it('should display international transfers section', () => {
      renderComponent()
      expect(screen.getByText(/5\. International Transfers/i)).toBeInTheDocument()
    })

    it('should display data retention section', () => {
      renderComponent()
      expect(screen.getByText(/6\. Data Retention/i)).toBeInTheDocument()
    })

    it('should display data subject rights section', () => {
      renderComponent()
      expect(screen.getByText(/7\. Your Rights/i)).toBeInTheDocument()
    })

    it('should display contact information section', () => {
      renderComponent()
      expect(screen.getByText(/8\. Contact Information/i)).toBeInTheDocument()
    })
  })

  describe('Data Subject Rights', () => {
    it('should display all GDPR rights', () => {
      renderComponent()
      expect(screen.getByText(/Right of Access \(Article 15\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Right to Rectification \(Article 16\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Right to Erasure \(Article 17\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Right to Restrict Processing \(Article 18\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Right to Data Portability \(Article 20\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Right to Object \(Article 21\)/i)).toBeInTheDocument()
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

