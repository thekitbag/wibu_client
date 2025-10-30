import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import CreateJourney from './CreateJourney'

const mockNavigate = vi.fn()

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  }
}))

// Mock @mui/icons-material
vi.mock('@mui/icons-material', () => ({
  Home: () => null
}))

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>
}

// Helper function to render component with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('CreateJourney Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('renders create journey form with title input and create button', () => {
    renderWithRouter(<CreateJourney />)

    expect(screen.getByText('Create New Journey')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter journey title')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Journey' })).toBeInTheDocument()
  })

  it('updates input value when user types', async () => {
    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')

    fireEvent.change(titleInput, { target: { value: 'My Test Journey' } })

    expect(titleInput).toHaveValue('My Test Journey')
  })

  it('shows error when submitting empty title', async () => {
    renderWithRouter(<CreateJourney />)

    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('shows error when submitting whitespace-only title', async () => {
    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: '   ' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument()
    })
  })

  it('successfully creates journey and navigates to journey page', async () => {
    const mockJourney = { id: 'test-journey-id', title: 'Test Journey' }
    mockedAxios.post.mockResolvedValueOnce({ data: mockJourney })

    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: 'Test Journey' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/journeys', {
        title: 'Test Journey'
      })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/journeys/test-journey-id')
    })
  })

  it('shows loading state while creating journey', async () => {
    // Mock axios to return a promise that doesn't resolve immediately
    const mockPromise = new Promise(resolve => setTimeout(resolve, 100))
    mockedAxios.post.mockReturnValueOnce(mockPromise)

    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: 'Test Journey' } })
    fireEvent.click(createButton)

    // Should show loading state
    expect(screen.getByText('Creating...')).toBeInTheDocument()
    expect(createButton).toBeDisabled()
    expect(titleInput).toBeDisabled()
  })

  it('handles API error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: 'Test Journey' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to create journey. Please try again.')).toBeInTheDocument()
    })

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled()

    // Should log the error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating journey:', expect.any(Error))

    consoleErrorSpy.mockRestore()
  })

  it('clears error message when successfully submitting after previous error', async () => {
    // First, trigger an error
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: 'Test Journey' } })
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to create journey. Please try again.')).toBeInTheDocument()
    })

    // Now mock a successful response
    const mockJourney = { id: 'test-journey-id', title: 'Test Journey' }
    mockedAxios.post.mockResolvedValueOnce({ data: mockJourney })

    // Submit again
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(screen.queryByText('Failed to create journey. Please try again.')).not.toBeInTheDocument()
    })
  })

  it('prevents form submission when already loading', async () => {
    const mockPromise = new Promise(resolve => setTimeout(resolve, 100))
    mockedAxios.post.mockReturnValueOnce(mockPromise)

    renderWithRouter(<CreateJourney />)

    const titleInput = screen.getByPlaceholderText('Enter journey title')
    const createButton = screen.getByRole('button', { name: 'Create Journey' })

    fireEvent.change(titleInput, { target: { value: 'Test Journey' } })
    fireEvent.click(createButton)

    // Try to click again while loading
    fireEvent.click(createButton)

    // Should only be called once
    expect(mockedAxios.post).toHaveBeenCalledTimes(1)
  })

  it('displays home navigation button', () => {
    renderWithRouter(<CreateJourney />)

    // Should have a link that goes to home
    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })
})