import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isEmpty } from 'lodash';

import { getLoggedInUser } from 'utilities/authUtilities.js';

import { Container, Grid, Stack } from '@mui/material';

import Header from '../components/Header/Header.jsx';
import ApiKeys from '../components/User/ApiKeys/ApiKeys.jsx';

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

function UserManagementPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isEmpty(getLoggedInUser())) {
      navigate('/home');
    }
  }, []);

  return (
    <Stack sx={styles.pageWrapper} direction="column" data-testid="explore-container">
      <Header />
      <Container sx={styles.container}>
        <Grid container sx={styles.gridWrapper}>
          <Grid item sx={styles.tile}>
            <ApiKeys />
          </Grid>
        </Grid>
      </Container>
    </Stack>
  );
}

export default UserManagementPage;
