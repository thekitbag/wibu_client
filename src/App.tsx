import { Routes, Route, Link } from 'react-router-dom'
import { CssBaseline, Container, Box, Typography, Button } from '@mui/material'
import CreateJourney from './pages/CreateJourney'
import JourneyDetails from './pages/JourneyDetails'

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Routes>
        <Route path="/" element={
          <Container maxWidth="md">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 4,
                textAlign: 'center'
              }}
            >
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
                What I Bought You
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
                Create meaningful journeys and share your thoughtful purchases
              </Typography>
              <Button
                component={Link}
                to="/create"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600
                }}
              >
                Create New Journey
              </Button>
            </Box>
          </Container>
        } />
        <Route path="/create" element={<CreateJourney />} />
        <Route path="/journeys/:id" element={<JourneyDetails />} />
      </Routes>
    </div>
  )
}

export default App