import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import JourneyDetails from './JourneyDetails'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  }
}))

const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>
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
      title: 'My Amazing Journey'
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

    await waitFor(() => {
      expect(screen.getByText('Journey Created Successfully!')).toBeInTheDocument()
    })

    expect(screen.getByText('My Amazing Journey')).toBeInTheDocument()
    expect(screen.getByText('Journey ID: test-journey-id')).toBeInTheDocument()
    expect(screen.getByText('Create Another Journey')).toBeInTheDocument()
  })

  it('makes correct API call with journey ID from URL params', async () => {
    const mockJourney = {
      id: 'specific-journey-id',
      title: 'Test Journey'
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/specific-journey-id')

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/journeys/specific-journey-id')
    })
  })

  it('shows error message when API call fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

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
        title: `Journey ${journeyId}`
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

      const { unmount } = renderWithRouter(<JourneyDetails />, `/journeys/${journeyId}`)

      await waitFor(() => {
        expect(mockedAxios.get).toHaveBeenCalledWith(`/api/journeys/${journeyId}`)
      })

      await waitFor(() => {
        expect(screen.getByText(`Journey ${journeyId}`)).toBeInTheDocument()
        expect(screen.getByText(`Journey ID: ${journeyId}`)).toBeInTheDocument()
      })

      // Clean up for next iteration
      unmount()
      vi.clearAllMocks()
    }
  })

  it('has correct link to create another journey', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'Test Journey'
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
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'))

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
      expect(screen.getByText('Journey Created Successfully!')).toBeInTheDocument()
    })

    // Should not crash and still show the layout
    expect(screen.getByText('Create Another Journey')).toBeInTheDocument()
  })

  it('shows journey with special characters in title', async () => {
    const mockJourney = {
      id: 'test-journey-id',
      title: 'Journey with émojis 🚀 & special chars!'
    }

    mockedAxios.get.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<JourneyDetails />, '/journeys/test-journey-id')

    await waitFor(() => {
      expect(screen.getByText('Journey with émojis 🚀 & special chars!')).toBeInTheDocument()
    })
  })
})