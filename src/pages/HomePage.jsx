// components
import React from 'react';
import Header from '../components/Header/Header.jsx';

import { Container, Grid, Stack } from '@mui/material';
import Home from 'components/Home/Home.jsx';

const styles = {
  container: {
    paddingTop: '30px',
    paddingBottom: '5px',
    height: '100%',
    minWidth: '60%'
  },
  gridWrapper: {
    border: '0.0625em dashed',
    borderColor: 'border.faint'
  },
  pageWrapper: {
    height: '100%'
  },
  tile: {
    width: '100%'
  }
};

function HomePage() {
  return (
    <Stack sx={styles.pageWrapper} direction="column" data-testid="homepage-container">
      <Header />
      <Container sx={styles.container}>
        <Grid container sx={styles.gridWrapper}>
          <Grid item sx={styles.tile}>
            <Home />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default HomePage;
