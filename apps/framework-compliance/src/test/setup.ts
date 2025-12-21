import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// CRITICAL: Only run mocks in test environment
// This prevents test mocks from leaking into production builds
if (
  typeof process !== 'undefined' &&
  process.env.NODE_ENV !== 'test' &&
  process.env.NODE_ENV !== 'development' &&
  import.meta.env?.MODE !== 'test' &&
  import.meta.env?.MODE !== 'development'
) {
  throw new Error(
    '❌ SECURITY: Test setup file should only be loaded in test/development environment! ' +
    'This file contains mocks that should never run in production.'
  )
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}

// Store original localStorage (for potential restoration if needed)
// const originalLocalStorage = window.localStorage

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Reset localStorage mock before each test
beforeEach(() => {
  localStorageMock._storage = {}
  
  localStorageMock.getItem.mockImplementation((key: string) => {
    return localStorageMock._storage?.[key] || null
  })
  
  localStorageMock.setItem.mockImplementation((key: string, value: string) => {
    localStorageMock._storage[key] = value
  })
  
  localStorageMock.removeItem.mockImplementation((key: string) => {
    delete localStorageMock._storage[key]
  })
  
  localStorageMock.clear.mockImplementation(() => {
    localStorageMock._storage = {}
  })
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock error monitoring
vi.mock('../lib/errorMonitoring', () => ({
  errorMonitoring: {
    captureException: vi.fn(),
    captureMessage: vi.fn(),
  },
}))
