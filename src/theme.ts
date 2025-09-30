import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ab47bc', // Rich purple
      light: '#cd69c9',
      dark: '#790e8b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffa000', // Vibrant gold/amber for accents
      light: '#ffb74d',
      dark: '#f57400',
      contrastText: '#000000',
    },
    background: {
      default: '#121212', // Very dark grey
      paper: '#1E1E1E', // Slightly lighter dark grey for cards
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57400',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none' as const,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.4)',
    '0px 4px 8px rgba(0, 0, 0, 0.4)',
    '0px 8px 16px rgba(0, 0, 0, 0.4)',
    '0px 12px 24px rgba(0, 0, 0, 0.4)',
    '0px 16px 32px rgba(0, 0, 0, 0.4)',
    '0px 20px 40px rgba(0, 0, 0, 0.4)',
    '0px 24px 48px rgba(0, 0, 0, 0.4)',
    '0px 28px 56px rgba(0, 0, 0, 0.4)',
    '0px 32px 64px rgba(0, 0, 0, 0.4)',
    '0px 36px 72px rgba(0, 0, 0, 0.4)',
    '0px 40px 80px rgba(0, 0, 0, 0.4)',
    '0px 44px 88px rgba(0, 0, 0, 0.4)',
    '0px 48px 96px rgba(0, 0, 0, 0.4)',
    '0px 52px 104px rgba(0, 0, 0, 0.4)',
    '0px 56px 112px rgba(0, 0, 0, 0.4)',
    '0px 60px 120px rgba(0, 0, 0, 0.4)',
    '0px 64px 128px rgba(0, 0, 0, 0.4)',
    '0px 68px 136px rgba(0, 0, 0, 0.4)',
    '0px 72px 144px rgba(0, 0, 0, 0.4)',
    '0px 76px 152px rgba(0, 0, 0, 0.4)',
    '0px 80px 160px rgba(0, 0, 0, 0.4)',
    '0px 84px 168px rgba(0, 0, 0, 0.4)',
    '0px 88px 176px rgba(0, 0, 0, 0.4)',
    '0px 92px 184px rgba(0, 0, 0, 0.4)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #1E1E1E 0%, #2a2a2a 100%)',
          border: '1px solid rgba(171, 71, 188, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 24px rgba(171, 71, 188, 0.15)',
            border: '1px solid rgba(171, 71, 188, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #ab47bc 0%, #8e24aa 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ba68c8 0%, #ab47bc 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #ffa000 0%, #f57400 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffb74d 0%, #ffa000 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(171, 71, 188, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ab47bc',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#ab47bc',
            },
          },
        },
      },
    },
  },
})

export default theme