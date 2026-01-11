import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import sectorsReducer from '../features/sectors/sectorSlice';
import fundsReducer from '../features/funds/fundSlice';
import themeReducer from '../features/theme/themeSlice';
import { lightTheme } from '../theme/theme';

export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      sectors: sectorsReducer,
      funds: fundsReducer,
      theme: themeReducer,
    },
    preloadedState,
  });
};

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    theme = lightTheme,
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export const mockSectorRanking = {
  sector: 'Technology (IT)',
  generatedAt: '2024-01-01T00:00:00Z',
  totalFunds: 50,
  topFunds: {
    oneYear: [
      {
        schemeCode: '1001',
        schemeName: 'Test Fund 1Y Leader',
        returns: 25.5,
        metrics: { aum: 1000, expenseRatio: 0.5, peRatio: 20, pbRatio: 3 },
      },
    ],
    threeYear: [
      {
        schemeCode: '1002',
        schemeName: 'Test Fund 3Y Leader',
        returns: 18.3,
        metrics: { aum: 2000, expenseRatio: 0.6, peRatio: 22, pbRatio: 3.5 },
      },
    ],
    fiveYear: [
      {
        schemeCode: '1003',
        schemeName: 'Test Fund 5Y Leader',
        returns: 15.2,
        metrics: { aum: 3000, expenseRatio: 0.4, peRatio: 18, pbRatio: 2.5 },
      },
    ],
  },
  rankings: {
    oneYear: [
      {
        rank: 1,
        schemeCode: '1001',
        schemeName: 'Test Fund Direct Growth',
        returns: 25.5,
        isActive: true,
        metrics: {
          aum: 1000,
          expenseRatio: 0.5,
          peRatio: 20,
          pbRatio: 3,
          beta: 1.1,
          alpha: 2.5,
          sharpeRatio: 1.8,
          sortinoRatio: 2.1,
          standardDeviation: 15,
          treynorRatio: 0.15,
          dividendYield: 1.5,
          turnoverRatio: 50,
          riskLevel: 'Moderately High',
          category: 'Large Cap',
          fundManager: 'John Doe',
          inceptionDate: '2020-01-01',
        },
      },
      {
        rank: 2,
        schemeCode: '1004',
        schemeName: 'Test Fund Regular IDCW',
        returns: -5.2,
        isActive: false,
        metrics: {
          aum: 500,
          expenseRatio: 1.2,
          peRatio: 25,
          pbRatio: 4,
          beta: 1.3,
          alpha: -1.5,
          sharpeRatio: 0.8,
          sortinoRatio: 0.9,
          standardDeviation: 20,
          treynorRatio: 0.08,
          dividendYield: null,
          turnoverRatio: null,
          riskLevel: 'High',
          category: 'Mid Cap',
          fundManager: null,
          inceptionDate: null,
        },
      },
    ],
    threeYear: [],
    fiveYear: [],
  },
};

export const mockSectorList = ['Technology (IT)', 'Banking', 'Pharma', 'FMCG', 'Auto'];

export const mockFundDetails = {
  schemeCode: '1001',
  schemeName: 'Test Fund Details',
  latestNav: 150.25,
  returns: { year1: 25.5, year3: 18.3, year5: 15.2 },
  metrics: { aum: 1000, peRatio: 20 },
  meta: { fund_house: 'Test AMC' },
};
