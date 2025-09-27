import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CreateJourney = () => {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/journeys', { title })
      const journey = response.data
      navigate(`/journeys/${journey.id}`)
    } catch (err) {
      setError('Failed to create journey. Please try again.')
      console.error('Error creating journey:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem'
    }}>
      <h1>Create New Journey</h1>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        minWidth: '300px'
      }}>
        <div>
          <input
            type="text"
            placeholder="Enter journey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  )
}

export default CreateJourney