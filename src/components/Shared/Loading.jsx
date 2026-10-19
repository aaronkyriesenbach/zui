import React from 'react';
import { Box } from '@mui/material';
import logo from '../../assets/Zot2.svg';

const styles = {
  wrapper: {
    position: 'relative',
    top: '10%',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  }
};

const Loading = () => {
  return (
    <Box sx={styles.wrapper}>
      <img src={logo} className="App-logo Loading" alt="logo" />
    </Box>
  );
};

export default Loading;
