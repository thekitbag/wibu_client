import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import PublicJourneyPage from './PublicJourneyPage'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn((error) => {
      return error && error.response !== undefined
    })
  }
}))

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  isAxiosError: ReturnType<typeof vi.fn>
}

// Helper function to render component with router
const renderWithRouter = (journeyId: string = 'test-journey-id') => {
  return render(
    <MemoryRouter initialEntries={[`/journeys/public/${journeyId}`]}>
      <Routes>
        <Route path="/journeys/public/:journeyId" element={<PublicJourneyPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('PublicJourneyPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state initially', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter()

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays home navigation button', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter()

    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('displays public journey when successfully loaded', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      journeyTitle: 'Test Journey',
      heroImageUrl: 'https://example.com/image.jpg',
      highlights: ['Stop 1', 'Stop 2', 'Stop 3']
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Shared Journey')).toBeInTheDocument()
      expect(screen.getByText('Someone special shared this beautiful journey with you')).toBeInTheDocument()
    })

    // Check for call to action buttons
    expect(screen.getByText('Create Your Own Journey')).toBeInTheDocument()
    expect(screen.getByText('Explore More Journeys')).toBeInTheDocument()
  })

  it('makes correct API call', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      journeyTitle: 'Test Journey',
      heroImageUrl: 'https://example.com/image.jpg',
      highlights: ['Stop 1']
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter('test-journey-id')

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/journeys/public/test-journey-id')
    })
  })

  it('shows error state when API call fails', async () => {
    const error = {
      response: { data: { error: 'Journey not found' }, status: 404 }
    }
    mockedAxios.isAxiosError.mockReturnValueOnce(true)
    mockedAxios.get.mockRejectedValueOnce(error)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Journey not found')).toBeInTheDocument()
    })

    expect(screen.getByText('Explore Other Journeys')).toBeInTheDocument()
  })

  it('shows error state when no journey ID provided', async () => {
    // Manually render at a route without an ID to test the component's internal error handling.
    render(
      <MemoryRouter initialEntries={['/journeys/public']}>
        <Routes>
          <Route path="/journeys/public/:journeyId?" element={<PublicJourneyPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No journey ID provided')).toBeInTheDocument();
    });
  });

  it('handles network error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const networkError = new Error('Network failed')
    mockedAxios.isAxiosError.mockReturnValueOnce(false)
    mockedAxios.get.mockRejectedValueOnce(networkError)

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred while loading the journey.')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  it('has correct navigation links', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      journeyTitle: 'Test Journey',
      heroImageUrl: 'https://example.com/image.jpg',
      highlights: ['Stop 1']
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter()

    await waitFor(() => {
      expect(screen.getByText('Shared Journey')).toBeInTheDocument()
    })

    const createLink = screen.getByRole('link', { name: 'Create Your Own Journey' })
    const exploreLink = screen.getByRole('link', { name: 'Explore More Journeys' })

    expect(createLink).toHaveAttribute('href', '/create')
    expect(exploreLink).toHaveAttribute('href', '/explore')
  })
})