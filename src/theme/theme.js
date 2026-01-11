import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1F5460",
      dark: "#123B43",
      light: "#3E7883",
    },
    secondary: {
      main: "#F2B26C",
      dark: "#D9944A",
    },
    info: {
      main: "#7FB8C2",
    },
    success: {
      main: "#2E7D63",
    },
    warning: {
      main: "#E59C46",
    },
    background: {
      default: "#F6F1EC",
      paper: "#FFF7F0",
    },
  },
  typography: {
    fontFamily: "'Manrope', system-ui, sans-serif",
    h1: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontSize: "2.4rem",
    },
    h2: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      fontSize: "1.8rem",
    },
    h3: {
      fontFamily: "'Sora', sans-serif",
      fontWeight: 600,
      fontSize: "1.2rem",
    },
    subtitle1: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--surface-soft": "#FFF7F0",
          "--surface-quiet": "#F9F4EE",
          "--surface-accent": "#FDEBD6",
          "--surface-ice": "#EDF3F2",
          "--ink-primary": "#1D3D43",
          "--ink-muted": "#5D6A6F",
        },
        body: {
          backgroundColor: "#F6F1EC",
        },
        "@keyframes floatIn": {
          from: { opacity: 0, transform: "translateY(16px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes shimmer": {
          from: { backgroundPosition: "-200px 0" },
          to: { backgroundPosition: "200px 0" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          border: "1px solid rgba(31, 84, 96, 0.08)",
          boxShadow: "0 18px 45px rgba(23, 39, 43, 0.08)",
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
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 999,
          backgroundColor: "rgba(31, 84, 96, 0.12)",
        },
        bar: {
          borderRadius: 999,
          backgroundImage: "linear-gradient(90deg, #1F5460, #7FB8C2)",
        },
      },
    },
  },
});
