import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomeNavigation from './HomeNavigation'

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  Home: () => <div data-testid="home-icon">Home</div>
}))

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('HomeNavigation Component', () => {
  it('renders home navigation link', () => {
    renderWithRouter(<HomeNavigation />)

    const homeLink = screen.getByRole('link')
    expect(homeLink).toBeInTheDocument()
  })

  it('has correct link to home page', () => {
    renderWithRouter(<HomeNavigation />)

    const homeLink = screen.getByRole('link')
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('displays home icon', () => {
    renderWithRouter(<HomeNavigation />)

    const homeIcon = screen.getByTestId('home-icon')
    expect(homeIcon).toBeInTheDocument()
  })

  it('has tooltip with correct aria-label', () => {
    renderWithRouter(<HomeNavigation />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('aria-label', 'Return to Home')
  })

  it('applies correct styling classes', () => {
    renderWithRouter(<HomeNavigation />)

    const homeLink = screen.getByRole('link')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveClass('MuiIconButton-root')
  })

  it('is accessible with proper ARIA attributes', () => {
    renderWithRouter(<HomeNavigation />)

    const homeLink = screen.getByRole('link')
    expect(homeLink).toHaveAttribute('href', '/')
    expect(homeLink).toHaveAttribute('aria-label', 'Return to Home')
    expect(homeLink).toHaveAttribute('tabindex', '0')
  })
})