import { useState, useEffect } from 'react'
import { Card, Box, Typography, TextField, Alert, Button, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { FlightTakeoff, Hotel, Restaurant, CardGiftcard, Favorite } from '@mui/icons-material'
import axios from 'axios'

interface Stop {
  id: string
  title: string
  note?: string
  image_url?: string
  icon_name?: string
  external_url?: string
  order: number
}

interface AddStopFormProps {
  journeyId: string
  onStopAdded: (newStop: Stop) => void
  editingStop?: Stop | null
  onStopUpdated?: (updatedStop: Stop) => void
  onCancelEdit?: () => void
}

const AddStopForm = ({ journeyId, onStopAdded, editingStop, onStopUpdated, onCancelEdit }: AddStopFormProps) => {
  const [stopTitle, setStopTitle] = useState('')
  const [stopNote, setStopNote] = useState('')
  const [stopImageUrl, setStopImageUrl] = useState('')
  const [stopExternalUrl, setStopExternalUrl] = useState('')
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [addStopError, setAddStopError] = useState('')

  // Icon mapping
  const iconOptions = [
    { name: 'Plane', value: 'plane', icon: FlightTakeoff },
    { name: 'Hotel', value: 'hotel', icon: Hotel },
    { name: 'Restaurant', value: 'restaurant', icon: Restaurant },
    { name: 'Gift', value: 'gift', icon: CardGiftcard },
    { name: 'Heart', value: 'heart', icon: Favorite },
  ]

  // Populate form when editing a stop
  useEffect(() => {
    if (editingStop) {
      setStopTitle(editingStop.title)
      setStopNote(editingStop.note || '')
      setStopImageUrl(editingStop.image_url || '')
      setStopExternalUrl(editingStop.external_url || '')
      setSelectedIcon(editingStop.icon_name || null)
    } else {
      // Clear form when not editing
      setStopTitle('')
      setStopNote('')
      setStopImageUrl('')
      setStopExternalUrl('')
      setSelectedIcon(null)
    }
    setAddStopError('')
  }, [editingStop])

  const handleIconSelect = (iconValue: string) => {
    setSelectedIcon(iconValue)
    setStopImageUrl('') // Clear image URL when icon is selected
  }

  const handleImageUrlChange = (value: string) => {
    setStopImageUrl(value)
    if (value.trim()) {
      setSelectedIcon(null) // Clear icon when image URL is entered
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stopTitle.trim()) {
      setAddStopError('Title is required')
      return
    }

    if (!stopImageUrl.trim() && !selectedIcon) {
      setAddStopError('Either an image URL or an icon must be selected')
      return
    }

    setIsAddingStop(true)
    setAddStopError('')

    try {
      const hasImageUrl = stopImageUrl.trim()
      const hasIcon = selectedIcon

      const stopData = {
        title: stopTitle.trim(),
        note: stopNote.trim() || undefined,
        image_url: hasImageUrl || null,
        icon_name: hasIcon || null,
        external_url: stopExternalUrl.trim() || undefined
      }

      // Ensure mutual exclusivity - if one is set, the other should be null
      if (hasImageUrl) {
        stopData.icon_name = null
      } else if (hasIcon) {
        stopData.image_url = null
      }

      if (editingStop) {
        // Update existing stop
        const response = await axios.patch(`/api/stops/${editingStop.id}`, stopData)
        const updatedStop = response.data
        onStopUpdated?.(updatedStop)
      } else {
        // Create new stop
        const response = await axios.post(`/api/journeys/${journeyId}/stops`, stopData)
        const newStop = response.data
        onStopAdded(newStop)

        // Clear form only when adding (editing is cleared by useEffect)
        setStopTitle('')
        setStopNote('')
        setStopImageUrl('')
        setStopExternalUrl('')
        setSelectedIcon(null)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const action = editingStop ? 'update' : 'add'
        setAddStopError(err.response?.data?.error || `Failed to ${action} stop. Please try again.`)
      } else {
        const action = editingStop ? 'updating' : 'adding'
        setAddStopError(`An unknown error occurred while ${action} the stop.`)
      }
      console.error(`Error ${editingStop ? 'updating' : 'adding'} stop:`, err)
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
        {editingStop ? 'Edit Stop' : 'Add New Stop'}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
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
          label="Image URL (Optional)"
          placeholder="https://example.com/image.jpg"
          value={stopImageUrl}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          onFocus={() => {
            if (selectedIcon) {
              setSelectedIcon(null)
            }
          }}
          disabled={isAddingStop}
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        />

        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              mb: 2,
              color: 'text.primary'
            }}
          >
            Or choose an icon:
          </Typography>
          <ToggleButtonGroup
            value={selectedIcon}
            exclusive
            onChange={(_, value) => value && handleIconSelect(value)}
            disabled={isAddingStop || stopImageUrl.trim() !== ''}
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                border: '2px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                minWidth: 80,
                minHeight: 80,
                flexDirection: 'column',
                gap: 1,
                '&:hover': {
                  borderColor: 'secondary.main',
                  backgroundColor: 'rgba(255, 160, 0, 0.1)',
                },
                '&.Mui-selected': {
                  borderColor: 'secondary.main',
                  backgroundColor: 'rgba(255, 160, 0, 0.2)',
                  color: 'secondary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 160, 0, 0.3)',
                  }
                }
              }
            }}
          >
            {iconOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <ToggleButton key={option.value} value={option.value}>
                  <IconComponent sx={{ fontSize: 32 }} />
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                    {option.name}
                  </Typography>
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </Box>

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

        <TextField
          fullWidth
          label="Website Link (Optional)"
          placeholder="https://example.com"
          value={stopExternalUrl}
          onChange={(e) => setStopExternalUrl(e.target.value)}
          disabled={isAddingStop}
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

        <Box sx={{ display: 'flex', gap: 2, flexDirection: editingStop ? 'row' : 'column' }}>
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
              textTransform: 'none',
              flex: editingStop ? 1 : undefined
            }}
          >
            {isAddingStop ? (editingStop ? 'Updating Stop...' : 'Adding Stop...') : (editingStop ? 'Update Stop' : 'Add Stop')}
          </Button>

          {editingStop && onCancelEdit && (
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              disabled={isAddingStop}
              size="large"
              onClick={onCancelEdit}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                flex: 1
              }}
            >
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default AddStopForm