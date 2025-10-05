import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import JourneyDetails from './JourneyDetails'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn((error) => {
      return error && error.response !== undefined
    })
  }
}))

// Mock @stripe/stripe-js
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve({
    redirectToCheckout: vi.fn()
  }))
}))

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  ContentCopy: () => null,
  FlightTakeoff: () => null,
  Hotel: () => null,
  Restaurant: () => null,
  CardGiftcard: () => null,
  Favorite: () => null,
  Edit: () => null,
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  isAxiosError: ReturnType<typeof vi.fn>
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
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('shows loading state initially', () => {
    // Mock axios to return a pending promise
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))

    renderWithRouter(<JourneyDetails />, '/journeys/test-id')

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays journey details when successfully loaded', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'My Amazing Journey',
      stops: [],
      paid: false
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
      paid: false
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/specific-journey-id')

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/journeys/specific-journey-id')
    })
  })

  it('shows error message when API call fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Create a proper axios error with response
    const axiosError = new Error('Network error') as Error & {
      response: { data: { error: string }, status: number }
    }
    axiosError.response = { data: { error: 'Failed to load journey' }, status: 500 }

    // Mock isAxiosError to return true for this error
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
    // Render without a journey ID in the route
    renderWithRouter(<JourneyDetails />, '/journeys/')

    await waitFor(() => {
      expect(screen.getByText('No journey ID provided')).toBeInTheDocument()
    })

    expect(screen.getByText('Create New Journey')).toBeInTheDocument()
    expect(mockedAxios.get).not.toHaveBeenCalled()
  })

  it('handles different journey IDs correctly', async () => {
    const journeyIds = ['journey-1', 'journey-2', 'very-long-journey-id-12345']

    for (const journeyId of journeyIds) {
      const mockJourney = {
        id: journeyId,
        title: `Journey ${journeyId}`,
        stops: [],
        paid: false
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

      const { unmount } = renderWithRouter(<JourneyDetails />, `/journeys/${journeyId}`)

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(`/api/journeys/${journeyId}`)
      })

      await waitFor(() => {
        expect(screen.getByText(`Journey ${journeyId}`)).toBeInTheDocument()
      })

      // Clean up for next iteration
      unmount()
      vi.clearAllMocks()
    }
  })

  it('has correct link to create another journey', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'Test Journey',
      stops: [],
      paid: false
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

    await waitFor(() => {
      expect(screen.getByText('Create Another Journey')).toBeInTheDocument()
    })

    const createLink = screen.getByText('Create Another Journey').closest('a')
    expect(createLink).toHaveAttribute('href', '/create')
  })

  it('has correct link in error state', async () => {
    // Create a proper axios error with response
    const axiosError = new Error('Network error') as Error & {
      response: { data: { error: string }, status: number }
    }
    axiosError.response = { data: { error: 'Failed to load journey' }, status: 500 }

    // Mock isAxiosError to return true for this error
    mockedAxios.isAxiosError.mockReturnValueOnce(true)
    mockedAxios.get.mockRejectedValueOnce(axiosError)

    renderWithRouter(<JourneyDetails />, '/journeys/test-id')

    await waitFor(() => {
      expect(screen.getByText('Create New Journey')).toBeInTheDocument()
    })

    const createLink = screen.getByText('Create New Journey').closest('a')
    expect(createLink).toHaveAttribute('href', '/create')
  })

  it('handles API response with unexpected structure gracefully', async () => {
    // Mock API response without expected fields
    mockedAxios.get.mockResolvedValueOnce({ data: {} })

    renderWithRouter(<JourneyDetails />, '/journeys/test-id')

    await waitFor(() => {
      expect(screen.getByText('Add New Stop')).toBeInTheDocument()
    })

    // Should not crash and still show the layout
    expect(screen.getByText('Create Another Journey')).toBeInTheDocument()
  })

  it('shows journey with special characters in title', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'Journey with émojis 🚀 & special chars!',
      stops: [],
      paid: false
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

    await waitFor(() => {
      expect(screen.getByText('Journey with émojis 🚀 & special chars!')).toBeInTheDocument()
    })
  })

  describe('Stops functionality', () => {
    it('displays existing stops when journey has stops', async () => {
      const mockJourney = {
        id: 'test-journey-id',
        title: 'Test Journey',
        paid: false,
        stops: [
          {
            id: 'stop-1',
            title: 'First Stop',
            note: 'This is the first stop',
            image_url: 'https://example.com/image1.jpg',
            order: 1
          },
          {
            id: 'stop-2',
            title: 'Second Stop',
            image_url: 'https://example.com/image2.jpg',
            order: 2
          }
        ]
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

      renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

      await waitFor(() => {
        expect(screen.getByText('First Stop')).toBeInTheDocument()
        expect(screen.getByText('Second Stop')).toBeInTheDocument()
        expect(screen.getByText('This is the first stop')).toBeInTheDocument()
        expect(screen.getByText('Stop 1')).toBeInTheDocument()
        expect(screen.getByText('Stop 2')).toBeInTheDocument()
      })
    })

    it('shows add stop form fields', async () => {
      const mockJourney = {
        id: 'test-journey-id',
        title: 'Test Journey',
        stops: [],
        paid: false
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

      renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

      await waitFor(() => {
        expect(screen.getByLabelText(/Stop Title/)).toBeInTheDocument()
        expect(screen.getByLabelText(/Image URL/)).toBeInTheDocument()
        expect(screen.getByLabelText(/Note \(Optional\)/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Add Stop' })).toBeInTheDocument()
      })
    })

    it('shows validation error when submitting empty form', async () => {
      const mockJourney = {
        id: 'test-journey-id',
        title: 'Test Journey',
        stops: [],
        paid: false
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

      renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Add Stop' })).toBeInTheDocument()
      })

      // Find the form and submit it directly
      const form = screen.getByRole('button', { name: 'Add Stop' }).closest('form')
      expect(form).toBeInTheDocument()

      fireEvent.submit(form!)

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument()
      })
    })
  })

  it('displays home navigation button', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'Test Journey',
      stops: [],
      paid: false
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

    await waitFor(() => {
      expect(screen.getByText('Test Journey')).toBeInTheDocument()
    })

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
})