// react global
import React from 'react';

// components

import { Container, Grid, Stack } from '@mui/material';
import Header from 'components/Header/Header';
import RepoDetails from 'components/Repo/RepoDetails';
import ExploreHeader from 'components/Header/ExploreHeader';

const styles = {
  pageWrapper: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
  container: {
    paddingTop: '5px',
    paddingBottom: '5px',
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  },
  gridWrapper: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    height: '100%'
  }
};

function RepoPage() {
  return (
    <Stack direction="column" sx={styles.pageWrapper} data-testid="repo-container">
      <Header />
      <Container sx={styles.container}>
        <ExploreHeader />
        <Grid container sx={styles.gridWrapper}>
          <Grid item xs={12}>
            <RepoDetails />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default RepoPage;
