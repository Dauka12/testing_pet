import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A2751',
      light: '#4c5a85',
      dark: '#0d152c',
    },
    secondary: {
      main: '#f5b207',
      light: '#ffc33a',
      dark: '#c48400',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#388e3c',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;