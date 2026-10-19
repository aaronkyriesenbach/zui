// react global
import React from 'react';

// components
import SignIn from '../components/Login/SignIn';

import { Grid } from '@mui/material';
import SigninPresentation from 'components/Login/SignInPresentation';
import { useState } from 'react';
import Loading from 'components/Shared/Loading';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'background.default'
  },
  signinContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingHidden: {
    display: 'none'
  }
};

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Grid container spacing={0} sx={styles.container} data-testid="login-container">
      {isLoading && <Loading />}
      <Grid item xs={1} md={6} className="hide-on-small" sx={isLoading ? styles.loadingHidden : undefined}>
        <SigninPresentation />
      </Grid>
      <Grid item xs={12} sm={12} md={6} sx={[styles.signinContainer, isLoading && styles.loadingHidden]}>
        <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wrapperSetLoading={setIsLoading} />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
