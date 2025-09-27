import '@testing-library/jest-dom'

// Mock window.location.assign
import { vi } from 'vitest'

Object.defineProperty(window, 'location', {
  value: {
    assign: vi.fn(),
  },
  writable: true,
})