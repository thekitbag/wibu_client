import { IconButton, Tooltip } from '@mui/material'
import { Home } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const HomeNavigation = () => {
  return (
    <Tooltip title="Return to Home" arrow>
      <IconButton
        component={Link}
        to="/"
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: 'rgba(171, 71, 188, 0.2)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderColor: 'primary.main',
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 20px rgba(171, 71, 188, 0.3)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <Home
          sx={{
            color: 'primary.main',
            fontSize: 24
          }}
        />
      </IconButton>
    </Tooltip>
  )
}

export default HomeNavigation