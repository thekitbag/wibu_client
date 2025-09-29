import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { Container, Box, Typography, Card, CardContent, CircularProgress, Alert, Button, TextField, CardMedia, Snackbar } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'
import { loadStripe } from '@stripe/stripe-js'

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

  // Add Stop form state
  const [stopTitle, setStopTitle] = useState('')
  const [stopNote, setStopNote] = useState('')
  const [stopImageUrl, setStopImageUrl] = useState('')
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [addStopError, setAddStopError] = useState('')

  // Payment state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')
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

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stopTitle.trim() || !stopImageUrl.trim()) {
      setAddStopError('Title and image URL are required')
      return
    }

    if (!id) {
      setAddStopError('No journey ID available')
      return
    }

    setIsAddingStop(true)
    setAddStopError('')

    try {
      const response = await axios.post(`/api/journeys/${id}/stops`, {
        title: stopTitle.trim(),
        note: stopNote.trim() || undefined,
        image_url: stopImageUrl.trim()
      })

      const newStop = response.data

      // Update journey state to include the new stop
      setJourney(prevJourney => {
        if (!prevJourney) return prevJourney
        const stops = prevJourney.stops || []
        return {
          ...prevJourney,
          stops: [...stops, newStop].sort((a, b) => a.order - b.order)
        }
      })

      // Clear form
      setStopTitle('')
      setStopNote('')
      setStopImageUrl('')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAddStopError(err.response?.data?.error || 'Failed to add stop. Please try again.');
      } else {
        setAddStopError('An unknown error occurred while adding the stop.');
      }
      console.error('Error adding stop:', err);
    } finally {
      setIsAddingStop(false)
    }
  }

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
        console.error('Error response:', err.response?.data)
        console.error('Error status:', err.response?.status)
        if (err.response?.status === 404) {
          errorMessage = 'Payment endpoint not found. Please contact support.'
        } else if (err.response?.status >= 500) {
          errorMessage = 'Server error. Please try again later.'
        } else {
          errorMessage = err.response?.data?.error || errorMessage
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

  const handleCopyLink = async () => {
    if (!journey?.shareableToken) return

    const shareableLink = `${window.location.origin}/reveal/${journey.shareableToken}`

    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy link:', err instanceof Error ? err.message : err)
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4, px: 2 }}>
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Existing Stops Section */}
          <Box sx={{ flex: { md: 2 } }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: 'primary.main'
              }}
            >
              Your Journey Stops
            </Typography>

            {journey?.stops && journey.stops.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {journey.stops
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => (
                    <Card
                      key={stop.id}
                      sx={{
                        boxShadow: 2,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                        <Box sx={{ width: { xs: '100%', sm: '33%' } }}>
                          <CardMedia
                            component="img"
                            sx={{
                              height: { xs: 200, sm: '100%' },
                              minHeight: { sm: 180 },
                              objectFit: 'cover'
                            }}
                            image={stop.image_url}
                            alt={stop.title}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: 'primary.main',
                                  mr: 2
                                }}
                              >
                                Stop {index + 1}
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  fontWeight: 600,
                                  flex: 1
                                }}
                              >
                                {stop.title}
                              </Typography>
                            </Box>
                            {stop.note && (
                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.6 }}
                              >
                                {stop.note}
                              </Typography>
                            )}
                          </CardContent>
                        </Box>
                      </Box>
                    </Card>
                  ))}
              </Box>
            ) : (
              <Card
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'grey.50',
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ mb: 2, fontWeight: 500 }}
                >
                  No stops yet
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                >
                  Add your first stop to start building your journey!
                </Typography>
              </Card>
            )}
          </Box>

          {/* Right Sidebar - Conditional based on payment status */}
          <Box sx={{ flex: 1, minWidth: { md: 350 } }}>
            {journey?.paid ? (
              /* Paid Journey - Show Shareable Link */
              <Card
                sx={{
                  p: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  position: 'sticky',
                  top: 24
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: 'success.main'
                  }}
                >
                  🎉 Journey Complete!
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ mb: 3 }}
                >
                  Your journey is ready to share! Send this link to your recipient:
                </Typography>

                {journey.shareableToken && (
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
                        fontSize: '0.9rem'
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
                )}

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    component={Link}
                    to="/create"
                    variant="contained"
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
              </Card>
            ) : (
              /* Unpaid Journey - Show Add Stop Form and Payment */
              <>
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    position: 'sticky',
                    top: 24
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
                    Add New Stop
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={handleAddStop}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Stop Title"
                      placeholder="Enter stop title"
                      value={stopTitle}
                      onChange={(e) => setStopTitle(e.target.value)}
                      disabled={isAddingStop}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 500
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Image URL"
                      placeholder="https://example.com/image.jpg"
                      value={stopImageUrl}
                      onChange={(e) => setStopImageUrl(e.target.value)}
                      disabled={isAddingStop}
                      required
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 500
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Note (Optional)"
                      placeholder="Add a note about this stop"
                      value={stopNote}
                      onChange={(e) => setStopNote(e.target.value)}
                      disabled={isAddingStop}
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{
                        '& .MuiInputLabel-root': {
                          fontSize: '1rem',
                          fontWeight: 500
                        }
                      }}
                    />

                    {addStopError && (
                      <Alert
                        severity="error"
                        sx={{
                          fontSize: '0.95rem',
                          '& .MuiAlert-message': {
                            fontWeight: 500
                          }
                        }}
                      >
                        {addStopError}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isAddingStop}
                      size="large"
                      startIcon={isAddingStop ? <CircularProgress size={20} /> : null}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      {isAddingStop ? 'Adding Stop...' : 'Add Stop'}
                    </Button>
                  </Box>
                </Card>

                {/* Payment Section */}
                <Card
                  sx={{
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 2,
                    mt: 3,
                    backgroundColor: 'success.50',
                    border: '2px solid',
                    borderColor: 'success.200'
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: 'success.main'
                    }}
                  >
                    Ready to Share?
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{ mb: 3 }}
                  >
                    Complete your payment to get a shareable link for your recipient.
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

                  <Button
                    onClick={handleProceedToPayment}
                    variant="contained"
                    color="success"
                    disabled={isProcessingPayment}
                    size="large"
                    startIcon={isProcessingPayment ? <CircularProgress size={20} /> : null}
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    {isProcessingPayment ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </Card>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
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
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  )
}

export default JourneyDetails