import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F4C5C",
      dark: "#073642",
      light: "#1F6F8B",
    },
    secondary: {
      main: "#FFB563",
    },
    background: {
      default: "#F5F0E6",
      paper: "#FFF9F0",
    },
  },
  typography: {
    fontFamily: "'Source Sans 3', system-ui, sans-serif",
    h1: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: "'Syne', sans-serif",
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 22,
        },
      },
    },
  },
});
