import { Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, Container, Box, Typography, Button, ThemeProvider } from '@mui/material'
import { AddCircleOutline, CardGiftcard, Celebration } from '@mui/icons-material'
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
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #121212 100%)',
              position: 'relative',
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
                  py: { xs: 6, md: 8 },
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Hero Content */}
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2,
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
                    maxWidth: '600px',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    fontWeight: 300,
                    lineHeight: 1.4,
                    opacity: 0.9
                  }}
                >
                  Create meaningful journeys and share your thoughtful story
                </Typography>

                {/* How It Works - Compact Version */}
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                    fontWeight: 700,
                    mb: 4,
                    background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  How It Works
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 4, md: 6 },
                    mb: 6,
                    maxWidth: '900px'
                  }}
                >
                  {/* Step 1 */}
                  <Box
                    sx={{
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <AddCircleOutline
                        sx={{
                          fontSize: { xs: 48, md: 56 },
                          color: 'secondary.main'
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                      }}
                    >
                      Build the Surprise
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.5,
                        maxWidth: '240px',
                        mx: 'auto'
                      }}
                    >
                      Create a personalized, step-by-step journey with notes and photos.
                    </Typography>
                  </Box>

                  {/* Step 2 */}
                  <Box
                    sx={{
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <CardGiftcard
                        sx={{
                          fontSize: { xs: 48, md: 56 },
                          color: 'secondary.main'
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                      }}
                    >
                      Share the Magic
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.5,
                        maxWidth: '240px',
                        mx: 'auto'
                      }}
                    >
                      Activate your journey to receive a unique link for the recipient.
                    </Typography>
                  </Box>

                  {/* Step 3 */}
                  <Box
                    sx={{
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    <Box
                      sx={{
                        mb: 2,
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Celebration
                        sx={{
                          fontSize: { xs: 48, md: 56 },
                          color: 'secondary.main'
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        color: 'text.primary',
                        fontSize: { xs: '1.2rem', md: '1.4rem' }
                      }}
                    >
                      Watch Them Unwrap
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        lineHeight: 1.5,
                        maxWidth: '240px',
                        mx: 'auto'
                      }}
                    >
                      Your recipient unwraps their gift, one delightful stop at a time.
                    </Typography>
                  </Box>
                </Box>

                {/* CTAs */}
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
                  <Button
                    component={Link}
                    to="/reveal/demo-journey-paris"
                    variant="outlined"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                      '&:hover': {
                        borderColor: 'secondary.light',
                        backgroundColor: 'rgba(255, 160, 0, 0.1)',
                      }
                    }}
                  >
                    See a Demo
                  </Button>
                </Box>
              </Box>
            </Container>
          </Box>
        } />
        <Route path="/create" element={<CreateJourney />} />
        <Route path="/journeys/:id" element={<JourneyDetails />} />
        <Route path="/journeys/:id/success" element={<PaymentSuccess />} />
        <Route path="/journeys/:id/preview" element={<RecipientReveal mode="preview" />} />
        <Route path="/reveal/:shareableToken" element={<RecipientReveal mode="final" />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App