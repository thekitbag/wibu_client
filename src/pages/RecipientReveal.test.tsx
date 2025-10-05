import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import RecipientReveal from './RecipientReveal'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    isAxiosError: vi.fn((error) => error && error.isAxiosError),
  },
}))

// Mock MUI Icons
vi.mock('@mui/icons-material', () => {
  // Create a proxy to catch all named export requests
  const iconProxy = new Proxy({ __esModule: true }, {
    get: (_target, prop) => {
      // For any icon (e.g., 'FlightTakeoff'), return a dummy component
      return () => <div data-testid={`${String(prop)}-icon`} />;
    }
  });
  return iconProxy;
});

// Mock PublicJourneyCard
vi.mock('../components/PublicJourneyCard', () => ({
  default: ({ journey }: { journey: any }) => (
    <div data-testid="public-journey-card">
      <span>{journey.journeyTitle}</span>
    </div>
  ),
}))

const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> }

// Mock journey data
const mockJourney = {
  id: 'test-journey-id',
  title: 'A Grand Adventure',
  stops: [
    { id: 'stop-1', title: 'First Stop', order: 1, image_url: 'img1.jpg' },
    { id: 'stop-2', title: 'Second Stop', order: 2, image_url: 'img2.jpg' },
  ],
}

// Mock window.location.origin
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://whatiboughtyou.com',
  },
  writable: true,
})

describe('RecipientReveal Component - Sharing Functionality', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue({ data: mockJourney })
    render(
      <MemoryRouter initialEntries={['/reveal/test-token']}>
        <Routes>
          <Route path="/reveal/:shareableToken" element={<RecipientReveal mode="final" />} />
        </Routes>
      </MemoryRouter>
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const completeTheJourney = async () => {
    // Start on welcome screen
    const beginButton = await screen.findByRole('button', { name: /Begin the Reveal/i })
    fireEvent.click(beginButton)

    // Go through stops
    for (let i = 0; i < mockJourney.stops.length; i++) {
      const nextButton = await screen.findByRole('button', { name: /Next/i })
      fireEvent.click(nextButton)
    }

    // Arrive at summary screen
    await screen.findByText('Enjoy your gift!')
  }

  it('shows the Share button after completing the journey', async () => {
    await completeTheJourney()
    const shareButton = await screen.findByRole('button', { name: /Share Your Gift/i })
    expect(shareButton).toBeInTheDocument()
  })

  it('opens the sharing modal when the Share button is clicked', async () => {
    await completeTheJourney()
    const shareButton = await screen.findByRole('button', { name: /Share Your Gift/i })
    fireEvent.click(shareButton)

    const modalTitle = await screen.findByText('Share Your Journey')
    expect(modalTitle).toBeInTheDocument()

    // Verify the preview card is in the modal
    const previewCard = await screen.findByTestId('public-journey-card')
    expect(previewCard).toBeInTheDocument()
    expect(screen.getByText(mockJourney.title)).toBeInTheDocument()
  })

  it('has correctly formatted social media links in the modal', async () => {
    await completeTheJourney()
    const shareButton = await screen.findByRole('button', { name: /Share Your Gift/i })
    fireEvent.click(shareButton)

    const twitterLink = await screen.findByRole('link', { name: /Share on X/i })
    const facebookLink = await screen.findByRole('link', { name: /Share on Facebook/i })

    const publicUrl = encodeURIComponent(`https://whatiboughtyou.com/journeys/public/${mockJourney.id}`)
    const shareText = encodeURIComponent('Check out the amazing gift I just received!')

    expect(twitterLink).toHaveAttribute('href', `https://twitter.com/intent/tweet?url=${publicUrl}&text=${shareText}`)
    expect(facebookLink).toHaveAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${publicUrl}`)
    expect(twitterLink).toHaveAttribute('target', '_blank')
    expect(facebookLink).toHaveAttribute('target', '_blank')
  })

  it('closes the modal when the close button is clicked', async () => {
    await completeTheJourney()
    const shareButton = await screen.findByRole('button', { name: /Share Your Gift/i })
    fireEvent.click(shareButton)

    // Modal is open
    const modalTitle = await screen.findByText('Share Your Journey')
    expect(modalTitle).toBeInTheDocument()

    // Click the close button
    const closeButton = screen.getByLabelText(/close/i)
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Share Your Journey')).not.toBeInTheDocument()
    })
  })
})
