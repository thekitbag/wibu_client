import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PublicJourneyCard from './PublicJourneyCard'

describe('PublicJourneyCard Component', () => {
  const mockJourney = {
    id: 'test-journey-1',
    journeyTitle: 'Amazing Paris Adventure',
    heroImageUrl: 'https://example.com/paris.jpg',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise']
  }

  it('renders journey title correctly', () => {
    render(<PublicJourneyCard journey={mockJourney} />)

    expect(screen.getByText('Amazing Paris Adventure')).toBeInTheDocument()
  })

  it('renders hero image with correct props', () => {
    render(<PublicJourneyCard journey={mockJourney} />)

    const image = screen.getByAltText('Amazing Paris Adventure')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/paris.jpg')
  })

  it('renders all highlight chips', () => {
    render(<PublicJourneyCard journey={mockJourney} />)

    expect(screen.getByText('Eiffel Tower')).toBeInTheDocument()
    expect(screen.getByText('Louvre Museum')).toBeInTheDocument()
    expect(screen.getByText('Seine River Cruise')).toBeInTheDocument()
  })

  it('displays "Journey Highlights:" label', () => {
    render(<PublicJourneyCard journey={mockJourney} />)

    expect(screen.getByText('Journey Highlights:')).toBeInTheDocument()
  })

  it('renders with empty highlights array', () => {
    const journeyWithNoHighlights = {
      ...mockJourney,
      highlights: []
    }

    render(<PublicJourneyCard journey={journeyWithNoHighlights} />)

    expect(screen.getByText('Amazing Paris Adventure')).toBeInTheDocument()
    expect(screen.getByText('Journey Highlights:')).toBeInTheDocument()
  })

  it('handles single highlight correctly', () => {
    const journeyWithOneHighlight = {
      ...mockJourney,
      highlights: ['Solo Adventure']
    }

    render(<PublicJourneyCard journey={journeyWithOneHighlight} />)

    expect(screen.getByText('Solo Adventure')).toBeInTheDocument()
  })

  it('renders with proper card structure', () => {
    const { container } = render(<PublicJourneyCard journey={mockJourney} />)

    // Check that it's wrapped in a card
    const card = container.querySelector('.MuiCard-root')
    expect(card).toBeInTheDocument()
  })
})