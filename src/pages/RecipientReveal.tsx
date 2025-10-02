import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  Fade,
  Container
} from '@mui/material'

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

interface RecipientRevealProps {
  mode: 'preview' | 'final'
}

const RecipientReveal = ({ mode }: RecipientRevealProps) => {
  const { id, shareableToken } = useParams<{ id?: string; shareableToken?: string }>()
  const navigate = useNavigate()

  const [journey, setJourney] = useState<Journey | null>(null)
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        let response
        if (mode === 'preview' && id) {
          response = await axios.get(`/api/journeys/${id}`)
        } else if (mode === 'final' && shareableToken) {
          response = await axios.get(`/api/reveal/${shareableToken}`)
        } else {
          throw new Error('Invalid mode or missing parameters')
        }

        setJourney(response.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.error || 'Failed to load journey.')
        } else {
          setError('An unknown error occurred while loading the journey.')
        }
        console.error('Error fetching journey:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJourney()
  }, [mode, id, shareableToken])

  const handleProceedToPayment = async () => {
    if (!id) {
      setPaymentError('No journey ID available')
      return
    }

    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      const response = await axios.post(`/api/journeys/${id}/create-checkout-session`)

      // Handle different possible property names for the session ID
      const sessionId = response.data.sessionId ||
                       response.data.session_id ||
                       response.data.id ||
                       response.data.checkout_session_id ||
                       response.data.stripeSessionId

      if (!sessionId) {
        throw new Error(`No session ID found in server response`)
      }

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        throw new Error(error.message)
      }
    } catch (err) {
      console.error('Full error object:', err)
      let errorMessage = 'Failed to process payment. Please try again.'

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error('Error response:', err.response.data)
          console.error('Error status:', err.response.status)
          if (err.response.status === 404) {
            errorMessage = 'Payment endpoint not found. Please contact support.'
          } else if (err.response.status >= 500) {
            errorMessage = 'Server error. Please try again later.'
          } else {
            errorMessage = err.response.data?.error || errorMessage
          }
        } else {
          errorMessage = 'Network error. Please check your connection.'
        }
      } else if (err instanceof Error) {
        if (err.message === 'No session ID received from server') {
          errorMessage = 'Invalid payment session. Please try again.'
        } else {
          errorMessage = err.message
        }
      }
      setPaymentError(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleNext = () => {
    if (journey?.stops && currentStopIndex < journey.stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1)
    } else {
      setCurrentStopIndex(journey?.stops?.length || 0) // Show final screen
    }
  }

  const sortedStops = journey?.stops?.sort((a, b) => a.order - b.order) || []
  const currentStop = sortedStops[currentStopIndex]
  const isLastStop = currentStopIndex >= sortedStops.length

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh'
          }}
        >
          <CircularProgress size={60} />
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
          {mode === 'preview' && (
            <Button
              onClick={() => navigate(`/journeys/${id}`)}
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
        </Box>
      </Container>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background image if current stop exists */}
      {currentStop && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${currentStop.image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
            zIndex: 0
          }}
        />
      )}

      {/* Content overlay */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2
        }}
      >
        <Container maxWidth="md">
          {!isLastStop && currentStop ? (
            /* Current Stop Display */
            <Fade in={true} timeout={800}>
              <Card
                sx={{
                  background: 'rgba(30, 30, 30, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(171, 71, 188, 0.3)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'secondary.main',
                      fontWeight: 600,
                      mb: 2,
                      opacity: 0.8
                    }}
                  >
                    Stop {currentStopIndex + 1} of {sortedStops.length}
                  </Typography>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 700,
                      mb: 3,
                      background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {currentStop.title}
                  </Typography>

                  {currentStop.note && (
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        mb: 4,
                        lineHeight: 1.6,
                        maxWidth: '600px',
                        mx: 'auto'
                      }}
                    >
                      {currentStop.note}
                    </Typography>
                  )}

                  <Box sx={{ mb: 4 }}>
                    <CardMedia
                      component="img"
                      sx={{
                        maxHeight: 300,
                        objectFit: 'contain',
                        borderRadius: 2,
                        mx: 'auto',
                        display: 'block'
                      }}
                      image={currentStop.image_url}
                      alt={currentStop.title}
                    />
                  </Box>

                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(255, 160, 0, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(255, 160, 0, 0.4)',
                      }
                    }}
                  >
                    {currentStopIndex < sortedStops.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </Box>
              </Card>
            </Fade>
          ) : (
            /* Final Screen */
            <Fade in={true} timeout={800}>
              <Card
                sx={{
                  background: 'rgba(30, 30, 30, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(171, 71, 188, 0.3)',
                  borderRadius: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                  textAlign: 'center',
                  p: 6
                }}
              >
                {mode === 'preview' ? (
                  <>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      This is the end of your journey preview.
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 4, fontSize: '1.1rem' }}
                    >
                      Ready to share this experience with your recipient?
                    </Typography>

                    {paymentError && (
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          fontSize: '0.95rem',
                          '& .MuiAlert-message': {
                            fontWeight: 500
                          }
                        }}
                      >
                        {paymentError}
                      </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Button
                        onClick={handleProceedToPayment}
                        variant="contained"
                        color="secondary"
                        size="large"
                        disabled={isProcessingPayment}
                        startIcon={isProcessingPayment ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{
                          py: 2,
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          borderRadius: 3,
                          boxShadow: '0 8px 32px rgba(255, 160, 0, 0.3)',
                          '&:hover': {
                            boxShadow: '0 12px 40px rgba(255, 160, 0, 0.4)',
                          }
                        }}
                      >
                        {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
                      </Button>

                      <Button
                        onClick={() => navigate(`/journeys/${id}`)}
                        variant="outlined"
                        size="large"
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 500,
                          textTransform: 'none'
                        }}
                      >
                        Back to Edit Journey
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      We hope you enjoyed your gift!
                    </Typography>

                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: '1.1rem' }}
                    >
                      Thank you for experiencing this thoughtful journey.
                    </Typography>
                  </>
                )}
              </Card>
            </Fade>
          )}
        </Container>
      </Box>
    </Box>
  )
}

export default RecipientReveal