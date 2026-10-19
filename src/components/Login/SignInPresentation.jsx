import React from 'react';

import { Box, Stack, Typography } from '@mui/material';

import logoWhite from '../../assets/zotLogoWhiteHorizontal.svg';

const styles = {
  container: {
    backgroundColor: 'secondary.main',
    minHeight: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  contentContainer: {
    width: '51%',
    height: '22%'
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  logo: {
    width: '64%'
  },
  mainText: {
    color: 'text.onBrand',
    fontWeight: '700',
    width: '100%',
    fontSize: '2.5rem',
    lineHeight: '3rem'
  }
};

export default function SigninPresentation() {
  return (
    <Box sx={styles.container}>
      <Stack spacing={'3rem'} sx={styles.contentContainer} data-testid="presentation-container">
        <Box sx={styles.logoContainer}>
          <Box component="img" src={logoWhite} alt="zot logo" sx={styles.logo} />
        </Box>
        <Typography variant="h2" sx={styles.mainText}>
          OCI-native container image registry, simplified
        </Typography>
      </Stack>
    </Box>
  );
}
