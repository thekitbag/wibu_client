import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import JourneyDetails from './JourneyDetails'

// Mock axios
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    isAxiosError: jest.fn((error) => error && error.isAxiosError),
  },
}))

// Mock @stripe/stripe-js
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(),
  })),
}))

// Mock @mui/icons-material
jest.mock('@mui/icons-material', () => {
  const iconProxy = new Proxy({ __esModule: true }, {
    get: (_target, prop) => {
      return () => <div data-testid={`${String(prop)}-icon`} />;
    },
  });
  return iconProxy;
});

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof jest.fn>;
  post: ReturnType<typeof jest.fn>;
  isAxiosError: ReturnType<typeof jest.fn>;
}

// Helper function to render component with router and specific route
const renderWithRouter = (component: React.ReactElement, initialEntry = '/journeys/test-id') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/journeys/:id" element={component} />
        <Route path="/journeys/" element={component} />
      </Routes>
    </MemoryRouter>
  )
}

describe('JourneyDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))
    const { unmount } = renderWithRouter(<JourneyDetails />, '/journeys/test-id')
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    unmount()
  })

  it('displays journey details when successfully loaded', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'My Amazing Journey',
      stops: [],
      paid: false,
    }
    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })
    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')
    await waitFor(() => {
      expect(screen.getByText('My Amazing Journey')).toBeInTheDocument()
    })
    expect(screen.getByText('Your Journey Stops')).toBeInTheDocument()
    expect(screen.getByText('No stops yet')).toBeInTheDocument()
    expect(screen.getByText('Add New Stop')).toBeInTheDocument()
    expect(screen.getByText('Create Another Journey')).toBeInTheDocument()
  })

  it('makes correct API call with journey ID from URL params', async () => {
    const mockJourney = {
      id: 'specific-journey-id',
      title: 'Test Journey',
      stops: [],
      paid: false,
    }
    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })
    renderWithRouter(<JourneyDetails />, '/journeys/specific-journey-id')
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/journeys/specific-journey-id')
    })
  })

  it('shows error message when API call fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const axiosError: any = new Error('Network error')
    axiosError.response = { data: { error: 'Failed to load journey' }, status: 500 }
    mockedAxios.isAxiosError.mockReturnValueOnce(true)
    mockedAxios.get.mockRejectedValueOnce(axiosError)
    renderWithRouter(<JourneyDetails />, '/journeys/test-id')
    await waitFor(() => {
      expect(screen.getByText('Failed to load journey')).toBeInTheDocument()
    })
    expect(screen.getByText('Create New Journey')).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching journey:', expect.any(Error))
    consoleErrorSpy.mockRestore()
  })

  it('shows error when no journey ID is provided in URL', async () => {
    renderWithRouter(<JourneyDetails />, '/journeys/')
    await waitFor(() => {
      expect(screen.getByText('No journey ID provided')).toBeInTheDocument()
    })
    expect(screen.getByText('Create New Journey')).toBeInTheDocument()
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  // ... (rest of the tests would be migrated similarly)
})