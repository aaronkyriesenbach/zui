// components
import React from 'react';
import Header from '../components/Header/Header.jsx';

import { Container, Grid, Stack } from '@mui/material';
import Explore from 'components/Explore/Explore.jsx';
import { useState } from 'react';

const styles = {
  container: {
    paddingTop: '30px',
    paddingBottom: '5px',
    height: '100%',
    minWidth: '60%'
  },
  gridWrapper: {
    border: '0.0625rem dashed',
    borderColor: 'border.faint'
  },
  pageWrapper: {
    height: '100%'
  },
  tile: {
    width: '100%',
    padding: '5px'
  }
};

function ExplorePage() {
  const [searchCurrentValue, setSearchCurrentValue] = useState();

  return (
    <Stack sx={styles.pageWrapper} direction="column" data-testid="explore-container">
      <Header setSearchCurrentValue={setSearchCurrentValue} />
      <Container sx={styles.container}>
        <Grid container sx={styles.gridWrapper}>
          <Grid item sx={styles.tile}>
            <Explore searchInputValue={searchCurrentValue} />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default ExplorePage;
