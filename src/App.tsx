import { Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, Container, Box, Typography, Button, ThemeProvider } from '@mui/material'
import theme from './theme'
import CreateJourney from './pages/CreateJourney'
import JourneyDetails from './pages/JourneyDetails'
import PaymentSuccess from './pages/PaymentSuccess'
import RecipientReveal from './pages/RecipientReveal'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={
          <Box
            sx={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 50%, rgba(171, 71, 188, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 160, 0, 0.05) 0%, transparent 50%)',
                pointerEvents: 'none',
              }
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  py: 8,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3,
                    letterSpacing: '-0.02em'
                  }}
                >
                  The gift is the journey.
                </Typography>

                <Typography
                  variant="h4"
                  color="text.secondary"
                  sx={{
                    mb: 6,
                    maxWidth: '700px',
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    fontWeight: 300,
                    lineHeight: 1.4,
                    opacity: 0.9
                  }}
                >
                  Create meaningful journeys and share your thoughtful story
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Button
                    component={Link}
                    to="/create"
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 8px 32px rgba(255, 160, 0, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 40px rgba(255, 160, 0, 0.4)',
                      }
                    }}
                  >
                    Create New Journey
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        } />
        <Route path="/create" element={<CreateJourney />} />
        <Route path="/journeys/:id" element={<JourneyDetails />} />
        <Route path="/journeys/:id/success" element={<PaymentSuccess />} />
        <Route path="/reveal/:shareableToken" element={<RecipientReveal />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App