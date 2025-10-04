import { Card, CardContent, CardMedia, Box, Typography, CardActionArea, Fade } from '@mui/material'
import { FlightTakeoff, Hotel, Restaurant, CardGiftcard, Favorite } from '@mui/icons-material'

interface Stop {
  id: string
  title: string
  note?: string
  image_url?: string
  icon_name?: string
  external_url?: string
  order: number
}

interface StopListItemProps {
  stop: Stop
  index: number
}

const getIconComponent = (iconName: string) => {
  if (!iconName) return null;
  const iconMap: { [key: string]: React.ComponentType<{ sx?: object }> } = {
    plane: FlightTakeoff,
    hotel: Hotel,
    restaurant: Restaurant,
    gift: CardGiftcard,
    heart: Favorite,
  }
  return iconMap[iconName.toLowerCase()]
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
          {stop.image_url ? (
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
          ) : stop.icon_name ? (
            <Box
              sx={{
                height: { xs: 200, sm: '100%' },
                minHeight: { sm: 180 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(171, 71, 188, 0.1) 0%, rgba(255, 160, 0, 0.1) 100%)',
              }}
            >
              {(() => {
                const IconComponent = getIconComponent(stop.icon_name)
                return IconComponent ? <IconComponent sx={{ fontSize: 64, color: 'secondary.main' }} /> : null
              })()}
            </Box>
          ) : null}
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