import { describe, it, expect, beforeEach } from 'vitest'
import { testPDFExport, testWordExport } from '../exportTest'

// Mock the dependencies
vi.mock('../generateSSPPdf', () => ({
  generateSSPPdf: vi.fn()
}))

vi.mock('../generateWord', () => ({
  generateSSPWordDocument: vi.fn()
}))

describe('exportTest utility', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('testPDFExport', () => {
    it('should return true when PDF export succeeds', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      vi.mocked(generateSSPPdf).mockImplementation(() => {})

      const result = testPDFExport()

      expect(result).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith('Testing PDF export...')
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ PDF export test completed successfully')
      expect(generateSSPPdf).toHaveBeenCalledTimes(1)
    })

    it('should return false when PDF export fails', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      const testError = new Error('PDF generation failed')
      vi.mocked(generateSSPPdf).mockImplementation(() => {
        throw testError
      })

      const result = testPDFExport()

      expect(result).toBe(false)
      expect(consoleLogSpy).toHaveBeenCalledWith('Testing PDF export...')
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ PDF export test failed:', testError)
      expect(generateSSPPdf).toHaveBeenCalledTimes(1)
    })

    it('should handle different types of errors', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      const testError = new TypeError('Invalid data type')
      vi.mocked(generateSSPPdf).mockImplementation(() => {
        throw testError
      })

      const result = testPDFExport()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ PDF export test failed:', testError)
    })
  })

  describe('testWordExport', () => {
    it('should return true when Word export succeeds', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      vi.mocked(generateSSPWordDocument).mockResolvedValue(undefined)

      const result = await testWordExport()

      expect(result).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith('Testing Word export...')
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Word export test completed successfully')
      expect(generateSSPWordDocument).toHaveBeenCalledTimes(1)
    })

    it('should return false when Word export fails', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      const testError = new Error('Word generation failed')
      vi.mocked(generateSSPWordDocument).mockRejectedValue(testError)

      const result = await testWordExport()

      expect(result).toBe(false)
      expect(consoleLogSpy).toHaveBeenCalledWith('Testing Word export...')
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Word export test failed:', testError)
      expect(generateSSPWordDocument).toHaveBeenCalledTimes(1)
    })

    it('should handle async errors', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      const testError = new Error('Network error')
      vi.mocked(generateSSPWordDocument).mockRejectedValue(testError)

      const result = await testWordExport()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Word export test failed:', testError)
    })

    it('should handle timeout errors', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      const testError = new Error('Request timeout')
      vi.mocked(generateSSPWordDocument).mockRejectedValue(testError)

      const result = await testWordExport()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Word export test failed:', testError)
    })
  })

  describe('test data validation', () => {
    it('should use valid test data structure', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      vi.mocked(generateSSPPdf).mockImplementation((data) => {
        // Verify the test data structure
        expect(data).toHaveProperty('metadata')
        expect(data).toHaveProperty('systemInfo')
        expect(data).toHaveProperty('sections')
        expect(data).toHaveProperty('controls')
        expect(data).toHaveProperty('metrics')
        
        expect(data.metadata).toHaveProperty('exportDate')
        expect(data.metadata).toHaveProperty('version')
        expect(data.metadata).toHaveProperty('organization')
        expect(data.metadata).toHaveProperty('systemName')
        expect(data.metadata).toHaveProperty('classification')
        
        expect(data.systemInfo).toHaveProperty('name')
        expect(data.systemInfo).toHaveProperty('owner')
        expect(data.systemInfo).toHaveProperty('identifier')
        expect(data.systemInfo).toHaveProperty('description')
        expect(data.systemInfo).toHaveProperty('classification')
        
        expect(Array.isArray(data.sections)).toBe(true)
        expect(Array.isArray(data.controls)).toBe(true)
        
        expect(data.metrics).toHaveProperty('totalControls')
        expect(data.metrics).toHaveProperty('implementedControls')
        expect(data.metrics).toHaveProperty('compliancePercentage')
      })

      testPDFExport()

      expect(generateSSPPdf).toHaveBeenCalledTimes(1)
    })
  })

  describe('console output', () => {
    it('should log appropriate messages for PDF export', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      vi.mocked(generateSSPPdf).mockImplementation(() => {})

      testPDFExport()

      expect(consoleLogSpy).toHaveBeenCalledWith('Testing PDF export...')
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ PDF export test completed successfully')
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })

    it('should log appropriate messages for Word export', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      vi.mocked(generateSSPWordDocument).mockResolvedValue(undefined)

      await testWordExport()

      expect(consoleLogSpy).toHaveBeenCalledWith('Testing Word export...')
      expect(consoleLogSpy).toHaveBeenCalledWith('✅ Word export test completed successfully')
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('should catch and handle synchronous errors in PDF export', async () => {
      const { generateSSPPdf } = await import('../generateSSPPdf')
      vi.mocked(generateSSPPdf).mockImplementation(() => {
        throw new Error('Synchronous error')
      })

      const result = testPDFExport()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ PDF export test failed:', expect.any(Error))
    })

    it('should catch and handle asynchronous errors in Word export', async () => {
      const { generateSSPWordDocument } = await import('../generateWord')
      vi.mocked(generateSSPWordDocument).mockRejectedValue(new Error('Asynchronous error'))

      const result = await testWordExport()

      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Word export test failed:', expect.any(Error))
    })
  })
})
