import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

interface Journey {
  id: string
  title: string
}

const JourneyDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchJourney = async () => {
      if (!id) {
        setError('No journey ID provided')
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(`/api/journeys/${id}`)
        setJourney(response.data)
      } catch (err) {
        setError('Failed to load journey')
        console.error('Error fetching journey:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [id])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem'
      }}>
        <div style={{ color: 'red' }}>{error}</div>
        <Link to="/create">Create New Journey</Link>
      </div>
    )
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
      <h1>Journey Created Successfully!</h1>

      {journey && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <h2>{journey.title}</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Journey ID: {journey.id}
          </p>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/create">Create Another Journey</Link>
      </div>
    </div>
  )
}

export default JourneyDetails