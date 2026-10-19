import { createTheme } from '@mui/material/styles';

import { darkPalette, lightPalette } from './palette';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: '[data-mui-color-scheme="%s"]' },
  colorSchemes: {
    light: { palette: lightPalette },
    dark: { palette: darkPalette }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme: paperTheme }) =>
          paperTheme.applyStyles('dark', {
            backgroundImage: 'none'
          })
      }
    }
  }
});

// A cssVariables theme re-merges MUI's variant defaults into every typography override, so the legacy
// "size only" h4 must now spell out the inherited values (and the UA bold of an h4) to keep rendering as it always has.
theme.typography.h4 = {
  fontFamily: 'inherit',
  fontWeight: 'bold',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  fontSize: '2.5rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem'
  }
};

export default theme;
