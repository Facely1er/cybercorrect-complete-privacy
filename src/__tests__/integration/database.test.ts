import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [],
          error: null,
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            data: [],
            error: null,
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: null,
          error: null,
        })),
      })),
    })),
  },
  getAssets: vi.fn(),
  createAsset: vi.fn(),
  updateAsset: vi.fn(),
  deleteAsset: vi.fn(),
}))

// Mock error monitoring
vi.mock('../../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))

import { getAssets, createAsset, updateAsset, deleteAsset } from '../../lib/supabase'

describe('Supabase Database Operations Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAssets', () => {
    it('should fetch assets successfully', async () => {
      const mockGetAssets = vi.mocked(getAssets)
      const mockAssets = [
        { id: '1', name: 'Asset 1', type: 'document' },
        { id: '2', name: 'Asset 2', type: 'image' },
      ]
      
      mockGetAssets.mockResolvedValue({
        data: mockAssets,
        error: null,
      })

      const result = await getAssets()
      
      expect(mockGetAssets).toHaveBeenCalled()
      expect(result.data).toEqual(mockAssets)
      expect(result.error).toBeNull()
    })

    it('should handle database errors', async () => {
      const mockGetAssets = vi.mocked(getAssets)
      mockGetAssets.mockResolvedValue({
        data: null,
        error: { message: 'Database connection failed' },
      })

      const result = await getAssets()
      
      expect(result.data).toBeNull()
      expect(result.error?.message).toBe('Database connection failed')
    })

    it('should handle unexpected errors', async () => {
      const mockGetAssets = vi.mocked(getAssets)
      mockGetAssets.mockRejectedValue(new Error('Network error'))

      const result = await getAssets()
      
      expect(result.error?.message).toBe('Get assets failed')
    })
  })

  describe('createAsset', () => {
    it('should create asset successfully', async () => {
      const mockCreateAsset = vi.mocked(createAsset)
      const newAsset = { name: 'New Asset', type: 'document' }
      const createdAsset = { id: '1', ...newAsset, created_at: '2025-01-30T00:00:00Z' }
      
      mockCreateAsset.mockResolvedValue({
        data: [createdAsset],
        error: null,
      })

      const result = await createAsset(newAsset)
      
      expect(mockCreateAsset).toHaveBeenCalledWith(newAsset)
      expect(result.data?.[0]).toEqual(createdAsset)
      expect(result.error).toBeNull()
    })

    it('should handle creation errors', async () => {
      const mockCreateAsset = vi.mocked(createAsset)
      const newAsset = { name: 'New Asset', type: 'document' }
      
      mockCreateAsset.mockResolvedValue({
        data: null,
        error: { message: 'Validation failed' },
      })

      const result = await createAsset(newAsset)
      
      expect(result.data).toBeNull()
      expect(result.error?.message).toBe('Validation failed')
    })
  })

  describe('updateAsset', () => {
    it('should update asset successfully', async () => {
      const mockUpdateAsset = vi.mocked(updateAsset)
      const updates = { name: 'Updated Asset' }
      const updatedAsset = { id: '1', name: 'Updated Asset', type: 'document' }
      
      mockUpdateAsset.mockResolvedValue({
        data: [updatedAsset],
        error: null,
      })

      const result = await updateAsset('1', updates)
      
      expect(mockUpdateAsset).toHaveBeenCalledWith('1', updates)
      expect(result.data?.[0]).toEqual(updatedAsset)
      expect(result.error).toBeNull()
    })

    it('should handle update errors', async () => {
      const mockUpdateAsset = vi.mocked(updateAsset)
      const updates = { name: 'Updated Asset' }
      
      mockUpdateAsset.mockResolvedValue({
        data: null,
        error: { message: 'Asset not found' },
      })

      const result = await updateAsset('999', updates)
      
      expect(result.data).toBeNull()
      expect(result.error?.message).toBe('Asset not found')
    })
  })

  describe('deleteAsset', () => {
    it('should delete asset successfully', async () => {
      const mockDeleteAsset = vi.mocked(deleteAsset)
      
      mockDeleteAsset.mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await deleteAsset('1')
      
      expect(mockDeleteAsset).toHaveBeenCalledWith('1')
      expect(result.data).toBeNull()
      expect(result.error).toBeNull()
    })

    it('should handle deletion errors', async () => {
      const mockDeleteAsset = vi.mocked(deleteAsset)
      
      mockDeleteAsset.mockResolvedValue({
        data: null,
        error: { message: 'Permission denied' },
      })

      const result = await deleteAsset('1')
      
      expect(result.data).toBeNull()
      expect(result.error?.message).toBe('Permission denied')
    })
  })
})
