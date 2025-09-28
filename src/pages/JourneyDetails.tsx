import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, Card, CardContent, CircularProgress, Alert, Button } from '@mui/material'

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
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 4,
          px: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'success.main',
              mb: 2
            }}
          >
            Journey Created Successfully!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              maxWidth: '600px'
            }}
          >
            Your journey has been created and is ready to be shared
          </Typography>
        </Box>

        {journey && (
          <Card
            sx={{
              minWidth: 320,
              maxWidth: 550,
              width: '100%',
              boxShadow: 3,
              borderRadius: 2
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
                py: 4,
                px: 3
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  color: 'primary.main',
                  mb: 3,
                  lineHeight: 1.3
                }}
              >
                {journey.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  letterSpacing: 0.5
                }}
              >
                Journey ID: {journey.id}
              </Typography>
            </CardContent>
          </Card>
        )}

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
            textTransform: 'none',
            mt: 2
          }}
        >
          Create Another Journey
        </Button>
      </Box>
    </Container>
  )
}

export default JourneyDetails