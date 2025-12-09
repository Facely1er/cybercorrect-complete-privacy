import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateSSPPdf } from '../pdf/generateSSPPdf'

// Mock jsPDF
const mockPdf = {
  setFontSize: vi.fn(),
  setTextColor: vi.fn(),
  text: vi.fn(),
  autoTable: vi.fn(),
  splitTextToSize: vi.fn(),
  addPage: vi.fn(),
  setPage: vi.fn(),
  save: vi.fn(),
  internal: {
    getNumberOfPages: vi.fn(() => 1),
  },
  lastAutoTable: {
    finalY: 100,
  },
}

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(() => mockPdf),
}))

describe('generateSSPPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPdf.splitTextToSize.mockReturnValue(['Test text'])
  })

  it('should generate SSP PDF with basic information', () => {
    const sspData = {
      metadata: {
        exportDate: '2025-01-30',
        version: '1.0',
        organization: 'Test Org',
        systemName: 'Test System',
        classification: 'Confidential'
      },
      systemInfo: {
        name: 'Test System',
        owner: 'John Doe',
        identifier: 'SYS-001',
        description: 'A test system for demonstration',
        classification: 'Confidential'
      },
      metrics: {
        totalControls: 10,
        implementedControls: 8,
        complianceScore: 80
      },
      controls: [
        {
          id: 'CTRL-001',
          title: 'Access Control',
          status: 'Implemented',
          description: 'User access control measures'
        },
        {
          id: 'CTRL-002',
          title: 'Data Encryption',
          status: 'Implemented',
          description: 'Data encryption at rest and in transit'
        }
      ],
      sections: [
        {
          title: 'System Overview',
          content: 'System description and purpose'
        }
      ]
    }

    generateSSPPdf(sspData)

    // Verify PDF creation calls
    expect(mockPdf.setFontSize).toHaveBeenCalled()
    expect(mockPdf.setTextColor).toHaveBeenCalled()
    expect(mockPdf.text).toHaveBeenCalledWith('System Security Plan (SSP)', 105, 20, { align: 'center' })
    expect(mockPdf.text).toHaveBeenCalledWith('Test System', 105, expect.any(Number), { align: 'center' })
    expect(mockPdf.save).toHaveBeenCalledWith(expect.stringMatching(/^SSP-.*\.pdf$/))
  })

  it('should handle empty or missing data gracefully', () => {
    const emptyData = {
      metadata: {
        exportDate: '',
        version: '',
        organization: '',
        systemName: '',
        classification: ''
      },
      systemInfo: {
        name: '',
        owner: '',
        identifier: '',
        description: '',
        classification: ''
      },
      metrics: {
        totalControls: 0,
        implementedControls: 0,
        complianceScore: 0
      },
      controls: [],
      sections: []
    }

    expect(() => {
      generateSSPPdf(emptyData)
    }).not.toThrow()

    expect(mockPdf.save).toHaveBeenCalledWith(expect.stringMatching(/^SSP-.*\.pdf$/))
  })

  it('should create sections for different SSP categories', () => {
    const sspData = {
      metadata: {
        exportDate: '2025-01-30',
        version: '1.0',
        organization: 'Test Org',
        systemName: 'Test System',
        classification: 'Confidential'
      },
      systemInfo: {
        name: 'Test System',
        owner: 'Test Owner',
        identifier: 'SYS-001',
        description: 'Test description',
        classification: 'Confidential'
      },
      metrics: {
        totalControls: 5,
        implementedControls: 4,
        complianceScore: 80
      },
      controls: [
        {
          id: 'CTRL-001',
          title: 'Access Control',
          status: 'Implemented',
          description: 'User access control measures'
        }
      ],
      sections: [
        {
          title: 'System Overview',
          content: 'System description and purpose'
        },
        {
          title: 'Security Controls',
          content: 'Security measures implemented'
        }
      ]
    }

    generateSSPPdf(sspData)

    // Should create tables for different sections
    expect(mockPdf.autoTable).toHaveBeenCalled()
  })

  it('should generate PDF with proper filename format', () => {
    const sspData = {
      metadata: {
        exportDate: '2025-01-30',
        version: '1.0',
        organization: 'Test Org',
        systemName: 'Test System',
        classification: 'Confidential'
      },
      systemInfo: {
        name: 'Test System',
        owner: 'Test Owner',
        identifier: 'SYS-001',
        description: 'Test description',
        classification: 'Confidential'
      },
      metrics: {
        totalControls: 3,
        implementedControls: 2,
        complianceScore: 67
      },
      controls: [
        {
          id: 'CTRL-001',
          title: 'Access Control',
          status: 'Implemented',
          description: 'User access control measures'
        }
      ],
      sections: [
        {
          title: 'System Overview',
          content: 'System description and purpose'
        }
      ]
    }

    generateSSPPdf(sspData)

    expect(mockPdf.save).toHaveBeenCalledWith(expect.stringMatching(/^SSP-.*\.pdf$/))
  })
})
