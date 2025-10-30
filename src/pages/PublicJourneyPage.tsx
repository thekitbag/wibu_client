import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, CircularProgress, Alert, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import PublicJourneyCard from '../components/PublicJourneyCard'
import HomeNavigation from '../components/HomeNavigation'

interface PublicJourney {
  id: string
  journeyTitle: string
  heroImageUrl: string
  highlights: string[]
}

const PublicJourneyPage = () => {
  const { journeyId } = useParams<{ journeyId: string }>()
  const [journey, setJourney] = useState<PublicJourney | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPublicJourney = async () => {
      if (!journeyId) {
        setError('No journey ID provided')
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get(`/api/journeys/public/${journeyId}`)
        setJourney(response.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load journey.')
        } else {
          setError('An unknown error occurred while loading the journey.')
        }
        console.error('Error fetching public journey:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicJourney()
  }, [journeyId])

  if (isLoading) {
    return (
      <>
        <HomeNavigation />
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh'
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </>
    )
  }

  if (error || !journey) {
    return (
      <>
        <HomeNavigation />
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
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
                maxWidth: '500px',
                '& .MuiAlert-message': {
                  fontSize: '1rem'
                }
              }}
            >
              {error || 'Journey not found'}
            </Alert>
            <Button
              component={Link}
              to="/explore"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Explore Other Journeys
            </Button>
          </Box>
        </Container>
      </>
    )
  }

  return (
    <>
      <HomeNavigation />
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                letterSpacing: '-0.02em'
              }}
            >
              Shared Journey
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 300,
                lineHeight: 1.5
              }}
            >
              Someone special shared this beautiful journey with you
            </Typography>
          </Box>

          {/* Journey Card */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: { xs: 4, md: 6 }
            }}
          >
            <Box sx={{ maxWidth: '400px', width: '100%' }}>
              <PublicJourneyCard journey={journey} />
            </Box>
          </Box>

          {/* Call to Action */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Inspired to create your own journey?
            </Typography>
            <Button
              component={Link}
              to="/create"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(255, 160, 0, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 32px rgba(255, 160, 0, 0.4)',
                },
                mr: 2
              }}
            >
              Create Your Own Journey
            </Button>
            <Button
              component={Link}
              to="/explore"
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Explore More Journeys
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default PublicJourneyPage