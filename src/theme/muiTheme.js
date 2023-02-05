import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3454D1',
    },
    secondary: {
      main: '#1B998B',
    },
    error: {
      main: '#D1345B',
    },
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '14px',
        fontWeight: 'normal',
        padding: '0.5rem 1rem',
      },
    },
  },
});

export default theme;