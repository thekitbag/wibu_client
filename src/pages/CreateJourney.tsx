import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material'
import HomeNavigation from '../components/HomeNavigation'

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
    <>
      <HomeNavigation />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)',
          position: 'relative',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4
          }}
        >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              textAlign: 'center'
            }}
          >
            Create New Journey
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: '1.1rem',
              maxWidth: '500px'
            }}
          >
            Start a new journey by giving it a meaningful title
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
            maxWidth: 450
          }}
        >
          <TextField
            fullWidth
            label="Journey Title"
            placeholder="Enter journey title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            variant="outlined"
            sx={{
              '& .MuiInputLabel-root': {
                fontSize: '1.1rem',
                fontWeight: 500
              },
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
                '& input': {
                  py: 1.5
                }
              }
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                fontSize: '0.95rem',
                '& .MuiAlert-message': {
                  fontWeight: 500
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isLoading}
            size="large"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(255, 160, 0, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 40px rgba(255, 160, 0, 0.4)',
              }
            }}
          >
            {isLoading ? 'Creating...' : 'Create Journey'}
          </Button>
        </Box>
        </Box>
      </Container>
    </Box>
    </>
  )
}

export default CreateJourney