import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Explore } from '@mui/icons-material'
import PublicJourneyCard from '../components/PublicJourneyCard'
import HomeNavigation from '../components/HomeNavigation'

interface PublicJourney {
  id: string
  journeyTitle: string
  heroImageUrl: string
  highlights: string[]
}

const ExplorePage = () => {
  const [journeys, setJourneys] = useState<PublicJourney[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPublicJourneys = async () => {
      try {
        const response = await axios.get('/api/journeys/public')
        setJourneys(response.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load journeys.')
        } else {
          setError('An unknown error occurred while loading journeys.')
        }
        console.error('Error fetching public journeys:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPublicJourneys()
  }, [])

  if (isLoading) {
    return (
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
    )
  }

  if (error) {
    return (
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
            {error}
          </Alert>
          <Button
            component={Link}
            to="/"
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
            Back to Home
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <>
      <HomeNavigation />
      <Container maxWidth="xl">
        <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2
            }}
          >
            <Explore
              sx={{
                fontSize: { xs: 40, md: 48 },
                color: 'secondary.main',
                mr: 2
              }}
            />
          </Box>

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
            Explore Journeys
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
            Discover inspiration from beautiful journeys created by our community
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
              }
            }}
          >
            Create Your Own Journey
          </Button>
        </Box>

        {/* Journey Grid */}
        {journeys.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: { xs: 3, md: 4 }
            }}
          >
            {journeys.map((journey, index) => (
              <PublicJourneyCard journey={journey} index={index} key={journey.id} />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2
            }}
          >
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              No public journeys available yet
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: '400px', mx: 'auto' }}
            >
              Be the first to create an inspiring journey for others to discover!
            </Typography>
            <Button
              component={Link}
              to="/create"
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              Create New Journey
            </Button>
          </Box>
        )}
      </Box>
    </Container>
    </>
  )
}

export default ExplorePage