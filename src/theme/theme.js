import { createTheme } from '@mui/material';

// Light theme - Warm earthy palette with teal primary
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1F5460', dark: '#123B43', light: '#3E7883' },
    secondary: { main: '#F2B26C', dark: '#D9944A' },
    info: { main: '#7FB8C2' },
    success: { main: '#2E7D63' },
    warning: { main: '#E59C46' },
    error: { main: '#C62828' },
    background: { default: '#F6F1EC', paper: '#FFF7F0' },
  },
  typography: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    h1: { fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2.4rem' },
    h2: { fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.8rem' },
    h3: { fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: '1.2rem' },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F6F1EC' },
        '@keyframes floatIn': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 24, border: '1px solid rgba(31, 84, 96, 0.08)', boxShadow: '0 18px 45px rgba(23, 39, 43, 0.08)' },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 22 } } },
    MuiToggleButton: { styleOverrides: { root: { borderRadius: 999, textTransform: 'none', fontWeight: 600 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 999, backgroundColor: 'rgba(31, 84, 96, 0.12)' },
        bar: { borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #1F5460, #7FB8C2)' },
      },
    },
  },
});

// Dark theme - Sleek dark mode with cyan accents
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4DD0E1', dark: '#00ACC1', light: '#80DEEA' },
    secondary: { main: '#FFB74D', dark: '#FF9800' },
    info: { main: '#64B5F6' },
    success: { main: '#81C784' },
    warning: { main: '#FFD54F' },
    error: { main: '#E57373' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#E0E0E0', secondary: '#9E9E9E' },
  },
  typography: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    h1: { fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2.4rem' },
    h2: { fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.8rem' },
    h3: { fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: '1.2rem' },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#121212' },
        '@keyframes floatIn': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 24, border: '1px solid rgba(77, 208, 225, 0.15)', boxShadow: '0 18px 45px rgba(0, 0, 0, 0.4)', backgroundColor: '#1E1E1E' },
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 999, paddingInline: 22 } } },
    MuiToggleButton: { styleOverrides: { root: { borderRadius: 999, textTransform: 'none', fontWeight: 600 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 600 } } },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 999, backgroundColor: 'rgba(77, 208, 225, 0.2)' },
        bar: { borderRadius: 999, backgroundImage: 'linear-gradient(90deg, #4DD0E1, #64B5F6)' },
      },
    },
  },
});

// Funky theme - Full Neon Cyberpunk with glow effects on all components
export const funkyTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00F5D4', dark: '#00BBB4', light: '#72EFDD' },
    secondary: { main: '#F72585', dark: '#B5179E', light: '#FF69B4' },
    info: { main: '#4CC9F0' },
    success: { main: '#06D6A0' },
    warning: { main: '#FFD166' },
    error: { main: '#EF476F' },
    background: { default: '#0A0A12', paper: '#12122A' },
    text: { primary: '#FFFFFF', secondary: '#D0D0D0' },
    divider: 'rgba(0, 245, 212, 0.2)',
  },
  typography: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    h1: { fontFamily: "'Sora', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2.4rem', textShadow: '0 0 20px rgba(0, 245, 212, 0.5)' },
    h2: { fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: '-0.01em', fontSize: '1.8rem', textShadow: '0 0 15px rgba(0, 245, 212, 0.4)' },
    h3: { fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: '1.2rem', textShadow: '0 0 10px rgba(0, 245, 212, 0.3)' },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { 
          backgroundColor: '#0A0A12', 
          backgroundImage: 'radial-gradient(ellipse at top, #1A1A35 0%, #0A0A12 60%), radial-gradient(circle at 80% 80%, rgba(247, 37, 133, 0.1) 0%, transparent 50%)',
        },
        '@keyframes floatIn': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        '@keyframes neonPulse': { '0%, 100%': { filter: 'brightness(1)' }, '50%': { filter: 'brightness(1.15)' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid rgba(0, 245, 212, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 245, 212, 0.15), inset 0 1px 0 rgba(0, 245, 212, 0.1)',
          backgroundColor: 'rgba(18, 18, 42, 0.95)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 22, transition: 'all 0.3s ease' },
        contained: {
          background: 'linear-gradient(135deg, #F72585 0%, #7B2CBF 50%, #4CC9F0 100%)',
          color: '#FFFFFF',
          fontWeight: 700,
          textShadow: '0 0 10px rgba(255, 255, 255, 0.6)',
          boxShadow: '0 4px 20px rgba(247, 37, 133, 0.5), 0 0 30px rgba(0, 245, 212, 0.3)',
          '&:hover': { 
            boxShadow: '0 6px 35px rgba(247, 37, 133, 0.8), 0 0 50px rgba(0, 245, 212, 0.5)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#00F5D4',
          borderWidth: 2,
          color: '#00F5D4',
          boxShadow: '0 0 15px rgba(0, 245, 212, 0.2)',
          '&:hover': { 
            borderColor: '#F72585', 
            color: '#F72585', 
            backgroundColor: 'rgba(247, 37, 133, 0.1)',
            boxShadow: '0 0 25px rgba(247, 37, 133, 0.4)',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(0, 245, 212, 0.3)',
          boxShadow: '0 0 15px rgba(0, 245, 212, 0.1)',
          backgroundColor: 'rgba(10, 10, 18, 0.8)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 600,
          color: '#C0C0C0',
          borderColor: 'transparent',
          '&.Mui-selected': { 
            backgroundColor: 'rgba(0, 245, 212, 0.25)', 
            borderColor: '#00F5D4', 
            color: '#00F5D4',
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.4), inset 0 0 10px rgba(0, 245, 212, 0.1)',
            textShadow: '0 0 10px rgba(0, 245, 212, 0.8)',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 245, 212, 0.1)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { 
          borderRadius: 999, 
          fontWeight: 600, 
          backgroundColor: 'rgba(0, 245, 212, 0.12)', 
          border: '1px solid rgba(0, 245, 212, 0.4)',
          boxShadow: '0 0 10px rgba(0, 245, 212, 0.15)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)',
            borderColor: '#00F5D4',
          },
        },
        filled: {
          backgroundColor: 'rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 15px rgba(0, 245, 212, 0.25)',
        },
        outlined: {
          borderColor: 'rgba(247, 37, 133, 0.5)',
          '&:hover': {
            borderColor: '#F72585',
            boxShadow: '0 0 20px rgba(247, 37, 133, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(10, 10, 18, 0.8)',
            '& fieldset': {
              borderColor: 'rgba(0, 245, 212, 0.3)',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 245, 212, 0.5)',
              boxShadow: '0 0 10px rgba(0, 245, 212, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00F5D4',
              borderWidth: 2,
              boxShadow: '0 0 20px rgba(0, 245, 212, 0.3)',
            },
          },
          '& .MuiInputBase-input': {
            color: '#FFFFFF',
          },
          '& .MuiInputAdornment-root': {
            color: '#00F5D4',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { 
          height: 10, 
          borderRadius: 999, 
          backgroundColor: 'rgba(0, 245, 212, 0.1)',
          boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)',
        },
        bar: { 
          borderRadius: 999, 
          backgroundImage: 'linear-gradient(90deg, #F72585, #7B2CBF, #4CC9F0, #00F5D4)',
          boxShadow: '0 0 20px rgba(0, 245, 212, 0.5)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 20px rgba(0, 245, 212, 0.4), 0 0 40px rgba(247, 37, 133, 0.2)',
          border: '2px solid rgba(0, 245, 212, 0.5)',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 245, 212, 0.2)',
          boxShadow: '0 0 5px rgba(0, 245, 212, 0.1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 245, 212, 0.15)',
        },
        head: {
          color: '#00F5D4',
          textShadow: '0 0 10px rgba(0, 245, 212, 0.5)',
          fontWeight: 700,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 245, 212, 0.08) !important',
            boxShadow: '0 0 20px rgba(0, 245, 212, 0.1)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#00F5D4',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 245, 212, 0.1)',
            boxShadow: '0 0 15px rgba(0, 245, 212, 0.3)',
          },
        },
      },
    },
  },
});

// Theme map for easy access
export const themes = {
  light: lightTheme,
  dark: darkTheme,
  funky: funkyTheme,
};

// Default export for backward compatibility
export const theme = lightTheme;
