import { useParams } from 'react-router-dom'
import { Container, Box, Typography, Card } from '@mui/material'
import { CardGiftcard } from '@mui/icons-material'

const RecipientReveal = () => {
  const { shareableToken } = useParams<{ shareableToken: string }>()

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
        {/* Gift Icon */}
        <CardGiftcard
          sx={{
            fontSize: 120,
            color: 'primary.main'
          }}
        />

        {/* Main Message */}
        <Box>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              color: 'primary.main',
              mb: 2
            }}
          >
            A gift is waiting for you...
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
            Someone special has created a thoughtful journey just for you!
          </Typography>
        </Box>

        {/* Placeholder Card */}
        <Card
          sx={{
            p: 4,
            maxWidth: 600,
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: 'primary.50',
            border: '2px solid',
            borderColor: 'primary.200'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'primary.main'
            }}
          >
            Gift Journey Coming Soon
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            This page will soon display your personalized gift journey with all the meaningful stops and surprises prepared for you.
          </Typography>

          {shareableToken && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                opacity: 0.7
              }}
            >
              Token: {shareableToken}
            </Typography>
          )}
        </Card>

        {/* Footer Message */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: '500px' }}
        >
          Stay tuned! Your gift journey will be revealed here once the feature is complete.
        </Typography>
      </Box>
    </Container>
  )
}

export default RecipientReveal