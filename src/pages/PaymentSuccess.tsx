import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, Card, CircularProgress, Alert, Button } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import ShareableLink from '../components/ShareableLink'

interface Journey {
  id: string
  title: string
  shareableToken?: string
}

const PaymentSuccess = () => {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [verificationStatus, setVerificationStatus] = useState('verifying') // 'verifying', 'complete', 'timeout', 'error'
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setError('Payment session ID not found in URL')
      setIsLoading(false)
      setVerificationStatus('error')
      return
    }

    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/checkout-session/${sessionId}`)

        if (response.data.status === 'complete') {
          // Payment is confirmed, get the journey data
          console.log('Payment complete - journey data:', response.data.journey)
          setJourney(response.data.journey)
          setVerificationStatus('complete')
          setIsLoading(false)

          // Clear polling and timeout
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
            pollingIntervalRef.current = null
          }
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
          }
        }
        // If status is not 'complete', continue polling
      } catch (err) {
        console.error('Error polling payment status:', err)
        // Continue polling on API errors, they might be temporary
      }
    }

    const startPolling = () => {
      // Immediate first poll
      pollPaymentStatus()

      // Set up polling every 2 seconds
      pollingIntervalRef.current = setInterval(pollPaymentStatus, 2000)

      // Set up timeout after 30 seconds
      timeoutRef.current = setTimeout(() => {
        setVerificationStatus('timeout')
        setIsLoading(false)
        setError('There was a slight delay confirming your payment. Please check back in a moment. If the issue persists, contact support.')

        // Clear polling
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
      }, 30000) // 30 seconds
    }

    startPolling()

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchParams])


  if (isLoading && verificationStatus === 'verifying') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            gap: 3,
            textAlign: 'center'
          }}
        >
          <CircularProgress size={60} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: 'primary.main'
            }}
          >
            Verifying payment, please wait...
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: '400px' }}
          >
            We're confirming your payment with our secure payment processor. This should only take a moment.
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error || verificationStatus === 'timeout' || verificationStatus === 'error') {
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
            severity="warning"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              maxWidth: '500px',
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            {error || 'There was a slight delay confirming your payment. Please check back in a moment. If the issue persists, contact support.'}
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            {id && (
              <Button
                component={Link}
                to={`/journeys/${id}`}
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
                Back to Journey
              </Button>
            )}
            <Button
              component={Link}
              to="/create"
              variant="outlined"
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
        </Box>
      </Container>
    )
  }

  // Only show success state when verification is complete and we have journey data
  if (verificationStatus === 'complete' && journey) {
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

        {/* Shareable Link */}
        {journey?.shareableToken ? (
          <Box sx={{ maxWidth: 600, width: '100%' }}>
            <ShareableLink shareableToken={journey.shareableToken} />
          </Box>
        ) : (
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
                color: 'warning.main'
              }}
            >
              Link Processing
            </Typography>
            <Typography
              variant="body1"
              sx={{ mb: 3 }}
            >
              Your shareable link is being generated. Please refresh this page in a moment, or check your journey details page.
            </Typography>
            <Button
              component={Link}
              to={`/journeys/${id}`}
              variant="outlined"
              fullWidth
              sx={{
                textTransform: 'none'
              }}
            >
              View Journey Details
            </Button>
          </Card>
        )}

        {/* View Journey Button */}
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
          View Journey Details
        </Button>

        </Box>
      </Container>
    )
  }

  // Fallback (should not reach here)
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

export default PaymentSuccess