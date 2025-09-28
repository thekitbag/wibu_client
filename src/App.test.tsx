import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// Mock the page components
vi.mock('./pages/CreateJourney', () => ({
  default: () => <div data-testid="create-journey-page">CreateJourney Component</div>
}))

vi.mock('./pages/JourneyDetails', () => ({
  default: () => <div data-testid="journey-details-page">JourneyDetails Component</div>
}))

// Helper function to render App with specific route
const renderWithRouter = (initialEntry = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>
  )
}

describe('App Component Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders home page at root path', () => {
    renderWithRouter('/')

    expect(screen.getByText('What I Bought You')).toBeInTheDocument()
    expect(screen.getByText('Create New Journey')).toBeInTheDocument()

    // Check that the button is actually a link
    const createButton = screen.getByText('Create New Journey').closest('a')
    expect(createButton).toHaveAttribute('href', '/create')
  })

  it('renders CreateJourney component at /create path', () => {
    renderWithRouter('/create')

    expect(screen.getByTestId('create-journey-page')).toBeInTheDocument()
    expect(screen.getByText('CreateJourney Component')).toBeInTheDocument()
  })

  it('renders JourneyDetails component at /journeys/:id path', () => {
    renderWithRouter('/journeys/test-journey-id')

    expect(screen.getByTestId('journey-details-page')).toBeInTheDocument()
    expect(screen.getByText('JourneyDetails Component')).toBeInTheDocument()
  })

  it('renders JourneyDetails component with different journey IDs', () => {
    const journeyIds = [
      'simple-id',
      'complex-id-123',
      'very-long-journey-id-with-dashes-and-numbers-12345'
    ]

    journeyIds.forEach(journeyId => {
      const { unmount } = renderWithRouter(`/journeys/${journeyId}`)

      expect(screen.getByTestId('journey-details-page')).toBeInTheDocument()

      // Clean up this render before the next iteration
      unmount()
      vi.clearAllMocks()
    })
  })

  it('home page button has correct styling and structure', () => {
    renderWithRouter('/')

    const homeContainer = screen.getByText('What I Bought You').closest('.MuiBox-root')
    expect(homeContainer).toHaveStyle({
      display: 'flex'
    })

    const createButton = screen.getByRole('link', { name: 'Create New Journey' })
    expect(createButton).toBeInTheDocument()
  })

  it('handles navigation to different routes correctly', () => {
    // Test multiple route navigations
    const routes = [
      { path: '/', expectedText: 'What I Bought You' },
      { path: '/create', expectedTestId: 'create-journey-page' },
      { path: '/journeys/abc123', expectedTestId: 'journey-details-page' }
    ]

    routes.forEach(({ path, expectedText, expectedTestId }) => {
      const { unmount } = renderWithRouter(path)

      if (expectedText) {
        expect(screen.getByText(expectedText)).toBeInTheDocument()
      }

      if (expectedTestId) {
        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument()
      }

      // Clean up for next iteration
      unmount()
      vi.clearAllMocks()
    })
  })

  it('App component has correct CSS class', () => {
    renderWithRouter('/')

    const appDiv = screen.getByText('What I Bought You').closest('.App')
    expect(appDiv).toBeInTheDocument()
  })

  describe('Route parameters', () => {
    it('passes journey ID parameter correctly to JourneyDetails component', () => {
      // This test verifies that the routing works correctly
      // The actual ID extraction is tested in JourneyDetails.test.tsx
      const journeyId = 'test-journey-123'
      renderWithRouter(`/journeys/${journeyId}`)

      expect(screen.getByTestId('journey-details-page')).toBeInTheDocument()
    })

    it('handles special characters in journey ID routes', () => {
      const specialIds = [
        'journey-with-dashes',
        'journey_with_underscores',
        'journey123with456numbers',
      ]

      specialIds.forEach(journeyId => {
        const { unmount } = renderWithRouter(`/journeys/${journeyId}`)
        expect(screen.getByTestId('journey-details-page')).toBeInTheDocument()
        unmount()
        vi.clearAllMocks()
      })
    })
  })

  describe('Home page layout', () => {
    it('renders main heading correctly', () => {
      renderWithRouter('/')

      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('What I Bought You')
    })

    it('has accessible button for navigation', () => {
      renderWithRouter('/')

      const createButton = screen.getByRole('link', { name: 'Create New Journey' })
      expect(createButton).toBeInTheDocument()
    })
  })
})