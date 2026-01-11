import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import TopFundsPanel from '../TopFundsPanel';
import { lightTheme } from '../../theme/theme';

const renderWithTheme = (ui) => {
  return render(<ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>);
};

const mockTopFunds = {
  oneYear: [
    {
      schemeCode: '1001',
      schemeName: 'Test Fund 1Y Leader',
      returns: 25.5,
      metrics: { aum: 1000, expenseRatio: 0.5, peRatio: 20, pbRatio: 3 },
    },
    {
      schemeCode: '1002',
      schemeName: 'Test Fund 1Y Second',
      returns: 25.5,
      metrics: { aum: 800, expenseRatio: 0.6, peRatio: 21, pbRatio: 3.1 },
    },
  ],
  threeYear: [
    {
      schemeCode: '1003',
      schemeName: 'Test Fund 3Y Leader',
      returns: 18.3,
      metrics: { aum: 2000, expenseRatio: 0.6, peRatio: 22, pbRatio: 3.5 },
    },
  ],
  fiveYear: [
    {
      schemeCode: '1004',
      schemeName: 'Test Fund 5Y Leader',
      returns: 15.2,
      metrics: { aum: 3000, expenseRatio: 0.4, peRatio: 18, pbRatio: 2.5 },
    },
  ],
};

describe('TopFundsPanel', () => {
  it('returns null when topFunds is not provided', () => {
    const { container } = renderWithTheme(<TopFundsPanel topFunds={null} activeTimeframe="oneYear" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all three timeframe cards', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('1Y Leaders')).toBeInTheDocument();
    expect(screen.getByText('3Y Leaders')).toBeInTheDocument();
    expect(screen.getByText('5Y Leaders')).toBeInTheDocument();
  });

  it('displays the leader fund name', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('Test Fund 1Y Leader')).toBeInTheDocument();
  });

  it('displays formatted return percentage', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('25.50%')).toBeInTheDocument();
  });

  it('displays AUM label', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getAllByText('AUM').length).toBeGreaterThan(0);
  });

  it('displays formatted AUM value', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('₹100 Cr')).toBeInTheDocument();
  });

  it('displays expense ratio', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('Expense: 0.5%')).toBeInTheDocument();
  });

  it('displays P/E ratio', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('P/E: 20')).toBeInTheDocument();
  });

  it('displays P/B ratio', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('P/B: 3')).toBeInTheDocument();
  });

  it('shows tied leaders when multiple funds have same return', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getByText('Tied leaders:')).toBeInTheDocument();
    expect(screen.getByText('Test Fund 1Y Second')).toBeInTheDocument();
  });

  it('shows message when no leaders for timeframe', () => {
    const emptyTopFunds = { oneYear: [], threeYear: [], fiveYear: [] };
    renderWithTheme(<TopFundsPanel topFunds={emptyTopFunds} activeTimeframe="oneYear" />);
    expect(screen.getAllByText('No leaders yet for this timeframe.').length).toBe(3);
  });

  it('handles null metrics gracefully', () => {
    const fundsWithNullMetrics = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: null }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithNullMetrics} activeTimeframe="oneYear" />);
    expect(screen.getByText('Expense: —')).toBeInTheDocument();
    expect(screen.getByText('P/E: —')).toBeInTheDocument();
    expect(screen.getByText('P/B: —')).toBeInTheDocument();
  });

  it('handles undefined expense ratio', () => {
    const fundsWithUndefinedExpense = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: 100, expenseRatio: undefined, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithUndefinedExpense} activeTimeframe="oneYear" />);
    expect(screen.getByText('Expense: —')).toBeInTheDocument();
  });

  it('handles null AUM', () => {
    const fundsWithNullAum = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: null, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithNullAum} activeTimeframe="oneYear" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('formats large AUM values correctly', () => {
    const fundsWithLargeAum = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: 15000, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithLargeAum} activeTimeframe="oneYear" />);
    expect(screen.getByText('₹1.5K Cr')).toBeInTheDocument();
  });

  it('formats medium AUM values correctly', () => {
    const fundsWithMediumAum = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: 5000, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithMediumAum} activeTimeframe="oneYear" />);
    expect(screen.getByText('₹500 Cr')).toBeInTheDocument();
  });

  it('applies active class to matching timeframe', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="threeYear" />);
    const cards = document.querySelectorAll('.top-funds-card');
    expect(cards[1]).toHaveClass('top-funds-card--active');
  });

  it('applies inactive class to non-matching timeframes', () => {
    renderWithTheme(<TopFundsPanel topFunds={mockTopFunds} activeTimeframe="oneYear" />);
    const cards = document.querySelectorAll('.top-funds-card');
    expect(cards[1]).toHaveClass('top-funds-card--inactive');
  });

  it('handles null returns', () => {
    const fundsWithNullReturns = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: null, metrics: { aum: 100, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithNullReturns} activeTimeframe="oneYear" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('handles undefined returns', () => {
    const fundsWithUndefinedReturns = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: undefined, metrics: { aum: 100, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithUndefinedReturns} activeTimeframe="oneYear" />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('handles NaN AUM value', () => {
    const fundsWithNaNAum = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: 'not a number', expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      threeYear: [],
      fiveYear: [],
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithNaNAum} activeTimeframe="oneYear" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('handles undefined timeframe key in topFunds', () => {
    const fundsWithMissingKey = {
      oneYear: [{ schemeCode: '1', schemeName: 'Test', returns: 10, metrics: { aum: 100, expenseRatio: 0.5, peRatio: 15, pbRatio: 2 } }],
      // threeYear and fiveYear are explicitly undefined (not present)
    };
    renderWithTheme(<TopFundsPanel topFunds={fundsWithMissingKey} activeTimeframe="oneYear" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getAllByText('No leaders yet for this timeframe.').length).toBe(2);
  });
});
