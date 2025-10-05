import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import PaymentSuccess from './PaymentSuccess'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  }
}))

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
}

// Helper function to render component with router and session_id
const renderWithRouter = (sessionId: string = 'test-session-id') => {
  return render(
    <MemoryRouter initialEntries={[`/payment/success/test-id?session_id=${sessionId}`]}>
      <Routes>
        <Route path="/payment/success/:id" element={<PaymentSuccess />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PaymentSuccess Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.log and console.error to prevent test output noise
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.resetAllMocks()
    vi.restoreAllMocks()
  })

  it('shows verification loading state initially', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter()

    expect(screen.getByText('Verifying payment, please wait...')).toBeInTheDocument()
    expect(screen.getByText(/We're confirming your payment/)).toBeInTheDocument()
  })

  it('displays home navigation button during verification', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter()

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('shows error state when session_id is missing', () => {
    render(
      <MemoryRouter initialEntries={['/payment/success/test-id']}>
        <Routes>
          <Route path="/payment/success/:id" element={<PaymentSuccess />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Payment session ID not found in URL')).toBeInTheDocument()
  })

  it('displays home navigation button in error state', () => {
    render(
      <MemoryRouter initialEntries={['/payment/success/test-id']}>
        <Routes>
          <Route path="/payment/success/:id" element={<PaymentSuccess />} />
        </Routes>
      </MemoryRouter>
    )

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  // Note: Success state tests are complex due to async polling logic
  // The main navigation functionality (HomeNavigation) is tested in simpler states above
})