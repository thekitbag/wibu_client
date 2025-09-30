import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Box, Typography, Button, Snackbar } from '@mui/material'
import { ContentCopy } from '@mui/icons-material'

interface ShareableLinkProps {
  shareableToken: string
}

const ShareableLink = ({ shareableToken }: ShareableLinkProps) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyLink = async () => {
    const shareableLink = `${window.location.origin}/reveal/${shareableToken}`

    try {
      await navigator.clipboard.writeText(shareableLink)
      setCopySuccess(true)
    } catch (err) {
      console.error('Failed to copy link:', err instanceof Error ? err.message : err)
    }
  }

  return (
    <>
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
            color: 'success.main'
          }}
        >
          🎉 Journey Complete!
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 3 }}
        >
          Your journey is ready to share! Send this link to your recipient:
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Shareable Link:
          </Typography>
          <Box
            sx={{
              p: 2,
              backgroundColor: 'grey.100',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              wordBreak: 'break-all',
              fontSize: '0.9rem'
            }}
          >
            {window.location.origin}/reveal/{shareableToken}
          </Box>
          <Button
            onClick={handleCopyLink}
            variant="outlined"
            startIcon={<ContentCopy />}
            sx={{
              mt: 2,
              textTransform: 'none'
            }}
            fullWidth
          >
            {copySuccess ? 'Copied!' : 'Copy Link'}
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={Link}
            to="/create"
            variant="contained"
            sx={{
              px: 3,
              py: 1,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none'
            }}
          >
            Create Another Journey
          </Button>
        </Box>
      </Card>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}

export default ShareableLink