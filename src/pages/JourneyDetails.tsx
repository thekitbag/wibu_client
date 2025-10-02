import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import StopList from '../components/StopList'
import AddStopForm from '../components/AddStopForm'
import PaymentPrompt from '../components/PaymentPrompt'
import ShareableLink from '../components/ShareableLink'

interface Stop {
  id: string
  title: string
  note?: string
  image_url: string
  order: number
}

interface Journey {
  id: string
  title: string
  stops?: Stop[]
  paid?: boolean
  shareableToken?: string
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
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load journey.');
        } else {
          setError('An unknown error occurred while loading the journey.');
        }
        console.error('Error fetching journey:', err);
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [id])

  const handleStopAdded = (newStop: Stop) => {
    // Update journey state to include the new stop
    setJourney(prevJourney => {
      if (!prevJourney) return prevJourney
      const stops = prevJourney.stops || []
      return {
        ...prevJourney,
        stops: [...stops, newStop].sort((a, b) => a.order - b.order)
      }
    })
  }



  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 3,
            px: 2,
            textAlign: 'center'
          }}
        >
          <Alert
            severity="error"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              maxWidth: '400px',
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error}
          </Alert>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Create New Journey
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4, px: { xs: 2, md: 4 }, mx: 'auto', maxWidth: '1400px' }}>
        {/* Journey Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'primary.main',
              mb: 2
            }}
          >
            {journey?.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Build your journey by adding meaningful stops
          </Typography>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}>
          <StopList stops={journey?.stops} />

          {/* Right Sidebar - Conditional based on payment status */}
          <Box sx={{
            flex: { lg: '0 0 400px' },
            width: { xs: '100%', lg: '400px' },
            maxWidth: '400px',
            mx: { xs: 'auto', lg: 0 }
          }}>
            {journey?.paid ? (
              journey.shareableToken && (
                <ShareableLink shareableToken={journey.shareableToken} />
              )
            ) : (
              <Box sx={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {id && (
                  <AddStopForm
                    journeyId={id}
                    onStopAdded={handleStopAdded}
                  />
                )}
                {id && <PaymentPrompt journeyId={id} />}
                {/* Preview Button */}
                {id && journey?.stops && journey.stops.length > 0 && (
                  <Button
                    component={Link}
                    to={`/journeys/${id}/preview`}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 3,
                      width: '100%'
                    }}
                  >
                    Preview Your Journey
                  </Button>
                )}
                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to="/create"
                    variant="outlined"
                    sx={{
                      px: 3,
                      py: 1,
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none'
                    }}
                  >
                    Create Another Journey
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

    </Container>
  )
}

export default JourneyDetails