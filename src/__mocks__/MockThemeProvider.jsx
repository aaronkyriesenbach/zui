import React from 'react';
import { ThemeProvider } from '@mui/material/styles';

import theme from 'theme';
import { COLOR_MODE_STORAGE_KEY } from 'theme/colorMode';

function MockThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme} modeStorageKey={COLOR_MODE_STORAGE_KEY} noSsr>
      {children}
    </ThemeProvider>
  );
}

export default MockThemeProvider;
