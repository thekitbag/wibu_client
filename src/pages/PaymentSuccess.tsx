import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, Card, CircularProgress, Alert, Button, Snackbar } from '@mui/material'
import { ContentCopy, CheckCircle } from '@mui/icons-material'

interface Journey {
  id: string
  title: string
  shareableToken?: string
}

const PaymentSuccess = () => {
  const { id } = useParams<{ id: string }>()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

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

  const handleCopyLink = async () => {
    if (!journey?.shareableToken) return

    const shareableLink = `${window.location.origin}/reveal/${journey.shareableToken}`

    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
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
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 4,
          px: 2,
          textAlign: 'center'
        }}
      >
        {/* Success Icon */}
        <CheckCircle
          sx={{
            fontSize: 80,
            color: 'success.main'
          }}
        />

        {/* Success Message */}
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              color: 'success.main',
              mb: 2
            }}
          >
            Payment Successful! 🎉
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: '600px',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Your journey "{journey?.title}" is now ready to share!
          </Typography>
        </Box>

        {/* Shareable Link Card */}
        {journey?.shareableToken && (
          <Card
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              boxShadow: 3,
              borderRadius: 2
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'primary.main'
              }}
            >
              Share Your Journey
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 3 }}
            >
              Send this link to your recipient to reveal their gift:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Shareable Link:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  wordBreak: 'break-all',
                  fontSize: '0.9rem',
                  textAlign: 'left'
                }}
              >
                {window.location.origin}/reveal/{journey.shareableToken}
              </Box>
              <Button
                onClick={handleCopyLink}
                variant="outlined"
                startIcon={<ContentCopy />}
                sx={{
                  mt: 2,
                  textTransform: 'none'
                }}
                fullWidth
              >
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </Button>
            </Box>
          </Card>
        )}

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <Button
            component={Link}
            to={`/journeys/${id}`}
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            View Journey
          </Button>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            Create Another Journey
          </Button>
        </Box>

        {/* Copy Success Snackbar */}
        <Snackbar
          open={copySuccess}
          autoHideDuration={3000}
          onClose={() => setCopySuccess(false)}
          message="Link copied to clipboard!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  )
}

export default PaymentSuccess