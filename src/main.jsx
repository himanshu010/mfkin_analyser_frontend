// Application entry point with Redux and MUI providers
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App.jsx';
import { store } from './app/store.js';
import { themes } from './theme/theme.js';
import { selectTheme } from './features/theme/themeSlice.js';
import './styles/main.scss';

// Wrapper component that provides dynamic theme based on Redux state
const ThemedApp = () => {
  const currentTheme = useSelector(selectTheme);
  const theme = themes[currentTheme] || themes.light;

  // Set data-theme attribute on document for CSS selectors
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedApp />
    </Provider>
  </React.StrictMode>
);
