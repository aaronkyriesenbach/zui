import { createTheme } from '@mui/material/styles';

import { lightPalette } from './palette';

const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: { palette: lightPalette }
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
