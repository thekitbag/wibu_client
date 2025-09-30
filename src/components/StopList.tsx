import { Box, Typography, Card } from '@mui/material'
import StopListItem from './StopListItem'

interface Stop {
  id: string
  title: string
  note?: string
  image_url: string
  order: number
}

interface StopListProps {
  stops?: Stop[]
}

const StopList = ({ stops }: StopListProps) => {
  return (
    <Box sx={{
      flex: { lg: 1 },
      maxWidth: { lg: '800px' },
      width: '100%'
    }}>
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

      {stops && stops.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {stops
            .sort((a, b) => a.order - b.order)
            .map((stop, index) => (
              <StopListItem
                key={stop.id}
                stop={stop}
                index={index}
              />
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
  )
}

export default StopList