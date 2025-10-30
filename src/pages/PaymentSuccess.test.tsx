import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import PaymentSuccess from './PaymentSuccess'

// Mock axios
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
  }
}))

// Mock @mui/icons-material
jest.mock('@mui/icons-material', () => ({
  CheckCircle: () => <div data-testid="check-circle">CheckCircle</div>,
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof jest.fn>
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
    jest.clearAllMocks()
    // Mock console.log and console.error to prevent test output noise
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('shows verification loading state initially', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    const { unmount } = renderWithRouter()

    expect(screen.getByText('Verifying payment, please wait...')).toBeInTheDocument()
    expect(screen.getByText(/We're confirming your payment/)).toBeInTheDocument()
    // Ensure cleanup to avoid open intervals/timeouts
    unmount()
  })

  it('displays home navigation button during verification', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    const { unmount } = renderWithRouter()

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
    unmount()
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