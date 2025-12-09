import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateResultsPdf, generateRecommendationsPdf } from '../pdf/generatePdf'

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

describe('generateResultsPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPdf.splitTextToSize.mockReturnValue(['Test text'])
  })

  it('should generate a PDF with basic information', () => {
    const title = 'Test Assessment'
    const overallScore = 85
    const sectionScores = [
      { title: 'Section 1', percentage: 90 },
      { title: 'Section 2', percentage: 80 },
    ]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    // Verify PDF creation calls
    expect(mockPdf.setFontSize).toHaveBeenCalled()
    expect(mockPdf.setTextColor).toHaveBeenCalled()
    expect(mockPdf.text).toHaveBeenCalledWith(title, 105, 20, { align: 'center' })
    expect(mockPdf.text).toHaveBeenCalledWith(`Overall Compliance Score: ${overallScore}%`, 20, expect.any(Number))
    expect(mockPdf.autoTable).toHaveBeenCalled()
    expect(mockPdf.save).toHaveBeenCalledWith('assessment-results.pdf')
  })

  it('should determine correct risk level for high scores', () => {
    const title = 'Test Assessment'
    const overallScore = 85
    const sectionScores = [{ title: 'Section 1', percentage: 90 }]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    // Should call setTextColor with green color for low risk
    expect(mockPdf.setTextColor).toHaveBeenCalledWith(0, 150, 0)
  })

  it('should determine correct risk level for moderate scores', () => {
    const title = 'Test Assessment'
    const overallScore = 70
    const sectionScores = [{ title: 'Section 1', percentage: 70 }]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    // Should call setTextColor with blue color for moderate risk
    expect(mockPdf.setTextColor).toHaveBeenCalledWith(0, 100, 200)
  })

  it('should determine correct risk level for high risk scores', () => {
    const title = 'Test Assessment'
    const overallScore = 50
    const sectionScores = [{ title: 'Section 1', percentage: 50 }]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    // Should call setTextColor with orange color for high risk
    expect(mockPdf.setTextColor).toHaveBeenCalledWith(255, 150, 0)
  })

  it('should determine correct risk level for critical scores', () => {
    const title = 'Test Assessment'
    const overallScore = 30
    const sectionScores = [{ title: 'Section 1', percentage: 30 }]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    // Should call setTextColor with red color for critical risk
    expect(mockPdf.setTextColor).toHaveBeenCalledWith(200, 0, 0)
  })

  it('should use custom filename when provided', () => {
    const title = 'Test Assessment'
    const overallScore = 85
    const sectionScores = [{ title: 'Section 1', percentage: 90 }]
    const date = '2025-01-30'
    const customFilename = 'custom-results.pdf'

    generateResultsPdf(title, overallScore, sectionScores, date, customFilename)

    expect(mockPdf.save).toHaveBeenCalledWith(customFilename)
  })

  it('should create section scores table with correct data', () => {
    const title = 'Test Assessment'
    const overallScore = 85
    const sectionScores = [
      { title: 'Section 1', percentage: 90 },
      { title: 'Section 2', percentage: 80 },
    ]
    const date = '2025-01-30'

    generateResultsPdf(title, overallScore, sectionScores, date)

    expect(mockPdf.autoTable).toHaveBeenCalledWith({
      head: [['Section', 'Score']],
      body: [['Section 1', '90%'], ['Section 2', '80%']],
      startY: expect.any(Number),
      headStyles: { fillColor: [60, 100, 240] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    })
  })
})

describe('generateRecommendationsPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPdf.splitTextToSize.mockReturnValue(['Test text'])
  })

  it('should generate a PDF with recommendations', () => {
    const title = 'Test Recommendations'
    const recommendations = [
      {
        id: '1',
        title: 'Test Recommendation',
        description: 'Test description',
        priority: 'high',
        category: 'Security',
        effort: 'medium',
        timeframe: '1-3 months',
        steps: ['Step 1', 'Step 2']
      }
    ]
    const date = '2025-01-30'

    generateRecommendationsPdf(title, recommendations, date)

    expect(mockPdf.setFontSize).toHaveBeenCalled()
    expect(mockPdf.setTextColor).toHaveBeenCalled()
    expect(mockPdf.text).toHaveBeenCalledWith(title, 105, 20, { align: 'center' })
    expect(mockPdf.text).toHaveBeenCalledWith('Total Recommendations: 1', 20, expect.any(Number))
    expect(mockPdf.save).toHaveBeenCalledWith('recommendations.pdf')
  })

  it('should group recommendations by priority', () => {
    const title = 'Test Recommendations'
    const recommendations = [
      {
        id: '1',
        title: 'Critical Rec',
        description: 'Critical description',
        priority: 'critical',
        category: 'Security',
        effort: 'high',
        timeframe: 'immediate',
        steps: []
      },
      {
        id: '2',
        title: 'High Rec',
        description: 'High description',
        priority: 'high',
        category: 'Compliance',
        effort: 'medium',
        timeframe: '1-3 months',
        steps: []
      },
      {
        id: '3',
        title: 'Low Rec',
        description: 'Low description',
        priority: 'low',
        category: 'Process',
        effort: 'low',
        timeframe: '6+ months',
        steps: []
      }
    ]
    const date = '2025-01-30'

    generateRecommendationsPdf(title, recommendations, date)

    // Should show correct counts
    expect(mockPdf.text).toHaveBeenCalledWith('Total Recommendations: 3', 20, expect.any(Number))
    expect(mockPdf.text).toHaveBeenCalledWith('Critical: 1', 20, expect.any(Number))
    expect(mockPdf.text).toHaveBeenCalledWith('High: 1', 20, expect.any(Number))
    expect(mockPdf.text).toHaveBeenCalledWith('Low: 1', 20, expect.any(Number))
  })

  it('should handle recommendations with implementation steps', () => {
    const title = 'Test Recommendations'
    const recommendations = [
      {
        id: '1',
        title: 'Test Recommendation',
        description: 'Test description',
        priority: 'high',
        category: 'Security',
        effort: 'medium',
        timeframe: '1-3 months',
        steps: ['Step 1: Do this', 'Step 2: Do that']
      }
    ]
    const date = '2025-01-30'

    generateRecommendationsPdf(title, recommendations, date)

    expect(mockPdf.text).toHaveBeenCalledWith('Implementation Steps:', 20, expect.any(Number))
  })

  it('should use custom filename when provided', () => {
    const title = 'Test Recommendations'
    const recommendations: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      category: string;
      effort: string;
      timeframe: string;
      steps: string[];
    }> = []
    const date = '2025-01-30'
    const customFilename = 'custom-recommendations.pdf'

    generateRecommendationsPdf(title, recommendations, date, customFilename)

    expect(mockPdf.save).toHaveBeenCalledWith(customFilename)
  })

  it('should handle empty recommendations list', () => {
    const title = 'Test Recommendations'
    const recommendations: Array<{
      id: string;
      title: string;
      description: string;
      priority: string;
      category: string;
      effort: string;
      timeframe: string;
      steps: string[];
    }> = []
    const date = '2025-01-30'

    generateRecommendationsPdf(title, recommendations, date)

    expect(mockPdf.text).toHaveBeenCalledWith('Total Recommendations: 0', 20, expect.any(Number))
    expect(mockPdf.save).toHaveBeenCalledWith('recommendations.pdf')
  })
})