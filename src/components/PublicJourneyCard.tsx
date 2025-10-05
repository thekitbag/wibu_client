import { Card, CardContent, CardMedia, Box, Typography, Chip, Fade } from '@mui/material'

interface PublicJourney {
  id: string
  journeyTitle: string
  heroImageUrl: string
  highlights: string[]
}

interface PublicJourneyCardProps {
  journey: PublicJourney
  index?: number
}

const PublicJourneyCard = ({ journey, index = 0 }: PublicJourneyCardProps) => {
  return (
    <Fade in={true} timeout={600} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 32px rgba(171, 71, 188, 0.15)',
          }
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            sx={{
              height: 240,
              objectFit: 'cover',
              animation: 'kenBurns 15s ease-in-out infinite alternate',
              '@keyframes kenBurns': {
                '0%': {
                  transform: 'scale(1) translate(0, 0)'
                },
                '100%': {
                  transform: 'scale(1.05) translate(-1%, 1%)'
                }
              }
            }}
            image={journey.heroImageUrl}
            alt={journey.journeyTitle}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
              height: '50%',
              pointerEvents: 'none'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography
            variant="h5"
            component="h3"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'primary.main',
              fontSize: '1.4rem',
              lineHeight: 1.3
            }}
          >
            {journey.journeyTitle}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 2,
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            Journey Highlights:
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {journey.highlights.map((highlight, index) => (
              <Chip
                key={index}
                label={highlight}
                size="small"
                sx={{
                  backgroundColor: 'rgba(171, 71, 188, 0.1)',
                  color: 'primary.main',
                  border: '1px solid',
                  borderColor: 'rgba(171, 71, 188, 0.2)',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(171, 71, 188, 0.15)',
                  }
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}

export default PublicJourneyCard