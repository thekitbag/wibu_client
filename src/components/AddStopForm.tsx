import { useState } from 'react'
import { Card, Box, Typography, TextField, Alert, Button, CircularProgress } from '@mui/material'
import axios from 'axios'

interface Stop {
  id: string
  title: string
  note?: string
  image_url: string
  order: number
}

interface AddStopFormProps {
  journeyId: string
  onStopAdded: (newStop: Stop) => void
}

const AddStopForm = ({ journeyId, onStopAdded }: AddStopFormProps) => {
  const [stopTitle, setStopTitle] = useState('')
  const [stopNote, setStopNote] = useState('')
  const [stopImageUrl, setStopImageUrl] = useState('')
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [addStopError, setAddStopError] = useState('')

  const handleAddStop = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stopTitle.trim() || !stopImageUrl.trim()) {
      setAddStopError('Title and image URL are required')
      return
    }

    setIsAddingStop(true)
    setAddStopError('')

    try {
      const response = await axios.post(`/api/journeys/${journeyId}/stops`, {
        title: stopTitle.trim(),
        note: stopNote.trim() || undefined,
        image_url: stopImageUrl.trim()
      })

      const newStop = response.data
      onStopAdded(newStop)

      // Clear form
      setStopTitle('')
      setStopNote('')
      setStopImageUrl('')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setAddStopError(err.response?.data?.error || 'Failed to add stop. Please try again.')
      } else {
        setAddStopError('An unknown error occurred while adding the stop.')
      }
      console.error('Error adding stop:', err)
    } finally {
      setIsAddingStop(false)
    }
  }

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 3,
        borderRadius: 2
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
          color="secondary"
          disabled={isAddingStop}
          size="large"
          startIcon={isAddingStop ? <CircularProgress size={20} color="inherit" /> : null}
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
  )
}

export default AddStopForm