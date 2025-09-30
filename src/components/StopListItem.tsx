import { Card, CardContent, CardMedia, Box, Typography, CardActionArea, Fade } from '@mui/material'

interface Stop {
  id: string
  title: string
  note?: string
  image_url: string
  order: number
}

interface StopListItemProps {
  stop: Stop
  index: number
}

const StopListItem = ({ stop, index }: StopListItemProps) => {
  return (
    <Fade in={true} timeout={600} style={{ transitionDelay: `${index * 150}ms` }}>
      <Card
        sx={{
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: 'linear-gradient(135deg, #ab47bc 0%, #ffa000 100%)',
            zIndex: 1
          }
        }}
      >
      <CardActionArea>
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
      </CardActionArea>
    </Card>
    </Fade>
  )
}

export default StopListItem