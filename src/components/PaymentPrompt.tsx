import { useState } from 'react'
import { Card, Typography, Alert, Button, CircularProgress } from '@mui/material'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'

interface PaymentPromptProps {
  journeyId: string
}

const PaymentPrompt = ({ journeyId }: PaymentPromptProps) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const handleProceedToPayment = async () => {
    setIsProcessingPayment(true)
    setPaymentError('')

    try {
      const response = await axios.post(`/api/journeys/${journeyId}/create-checkout-session`)

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

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)',
        border: '1px solid',
        borderColor: 'rgba(76, 175, 80, 0.3)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255, 160, 0, 0.1) 0%, rgba(171, 71, 188, 0.1) 100%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        },
        '&:hover::before': {
          opacity: 1
        }
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
        color="secondary"
        disabled={isProcessingPayment}
        size="large"
        startIcon={isProcessingPayment ? <CircularProgress size={20} color="inherit" /> : null}
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
  )
}

export default PaymentPrompt