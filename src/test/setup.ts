import '@testing-library/jest-dom'

// Mock axios globally
import { vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}))

// Mock window.location.assign
Object.defineProperty(window, 'location', {
  value: {
    assign: vi.fn(),
  },
  writable: true,
})