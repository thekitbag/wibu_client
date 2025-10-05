import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import ExplorePage from './ExplorePage'

interface PublicJourney {
  id: string
  journeyTitle: string
  heroImageUrl: string
  highlights: string[]
}

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
  Explore: () => null,
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  isAxiosError: ReturnType<typeof vi.fn>
}

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('ExplorePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state initially', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter(<ExplorePage />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays journey cards when successfully loaded', async () => {
    const mockJourneys = [
      {
        id: 'journey-1',
        journeyTitle: 'Paris Adventure',
        heroImageUrl: 'https://example.com/paris.jpg',
        highlights: ['Eiffel Tower', 'Louvre']
      },
      {
        id: 'journey-2',
        journeyTitle: 'Tokyo Experience',
        heroImageUrl: 'https://example.com/tokyo.jpg',
        highlights: ['Shibuya', 'Senso-ji Temple']
      }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourneys })

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('Paris Adventure')).toBeInTheDocument()
      expect(screen.getByText('Tokyo Experience')).toBeInTheDocument()
    })

    expect(screen.getByText('Explore Journeys')).toBeInTheDocument()
    expect(screen.getByText('Discover inspiration from beautiful journeys created by our community')).toBeInTheDocument()
  })

  it('makes correct API call', async () => {
    const mockJourneys: PublicJourney[] = []
    mockedAxios.get.mockResolvedValueOnce({ data: mockJourneys })

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/journeys/public')
    })
  })

  it('shows error message when API call fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Create a proper axios error with response
    const axiosError = new Error('Network error') as Error & {
      response: { data: { error: string }, status: number }
    }
    axiosError.response = { data: { error: 'Failed to load journeys' }, status: 500 }

    // Mock isAxiosError to return true for this error
    mockedAxios.isAxiosError.mockReturnValueOnce(true)
    mockedAxios.get.mockRejectedValueOnce(axiosError)

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('Failed to load journeys')).toBeInTheDocument()
    })

    expect(screen.getByText('Back to Home')).toBeInTheDocument()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching public journeys:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  it('shows empty state when no journeys available', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('No public journeys available yet')).toBeInTheDocument()
    })

    expect(screen.getByText('Be the first to create an inspiring journey for others to discover!')).toBeInTheDocument()
    expect(screen.getByText('Create New Journey')).toBeInTheDocument()
  })

  it('displays create journey button in header', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] })

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('Explore Journeys')).toBeInTheDocument()
    })

    const createButtons = screen.getAllByText('Create Your Own Journey')
    expect(createButtons.length).toBeGreaterThan(0)
  })

  it('handles network error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock a non-axios error
    const networkError = new Error('Network failed')
    mockedAxios.isAxiosError.mockReturnValueOnce(false)
    mockedAxios.get.mockRejectedValueOnce(networkError)

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('An unknown error occurred while loading journeys.')).toBeInTheDocument()
    })

    consoleErrorSpy.mockRestore()
  })

  it('renders journey cards in a grid layout', async () => {
    const mockJourneys = [
      {
        id: 'journey-1',
        journeyTitle: 'Journey 1',
        heroImageUrl: 'https://example.com/1.jpg',
        highlights: ['Stop 1']
      },
      {
        id: 'journey-2',
        journeyTitle: 'Journey 2',
        heroImageUrl: 'https://example.com/2.jpg',
        highlights: ['Stop 2']
      }
    ]

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourneys })

    renderWithRouter(<ExplorePage />)

    await waitFor(() => {
      expect(screen.getByText('Journey 1')).toBeInTheDocument()
      expect(screen.getByText('Journey 2')).toBeInTheDocument()
    })

    // Verify both journeys are rendered
    expect(screen.getByText('Journey 1')).toBeInTheDocument()
    expect(screen.getByText('Journey 2')).toBeInTheDocument()
  })

  it('displays home navigation button', async () => {
    // Mock successful API response so page renders fully
    const mockJourneys: PublicJourney[] = []
    mockedAxios.get.mockResolvedValueOnce({ data: mockJourneys })

    renderWithRouter(<ExplorePage />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Discover inspiration from beautiful journeys created by our community')).toBeInTheDocument()
    })

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
})