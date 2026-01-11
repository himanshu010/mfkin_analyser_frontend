import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import AppPreloader from '../AppPreloader';
import { lightTheme } from '../../theme/theme';

const renderWithTheme = (ui) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
};

describe('AppPreloader', () => {
  it('renders with default message', () => {
    renderWithTheme(<AppPreloader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    renderWithTheme(<AppPreloader message="Loading sector data..." />);
    expect(screen.getByText('Loading sector data...')).toBeInTheDocument();
  });

  it('displays the app title', () => {
    renderWithTheme(<AppPreloader />);
    expect(screen.getByText('MFkin Analyser')).toBeInTheDocument();
  });

  it('renders the insights icon', () => {
    renderWithTheme(<AppPreloader />);
    expect(screen.getByTestId('InsightsIcon')).toBeInTheDocument();
  });

  it('renders the circular progress indicator', () => {
    renderWithTheme(<AppPreloader />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
