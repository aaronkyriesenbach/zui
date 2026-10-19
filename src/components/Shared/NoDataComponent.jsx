// react global
import React from 'react';

// components
import { Box, Stack, Typography } from '@mui/material';

//styling

import nodataImage from '../../assets/noData.svg';

const styles = {
  noDataContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataImage: {
    maxWidth: '233px',
    maxHeight: '240px'
  },
  noDataText: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: 'text.heading'
  }
};

function NoDataComponent({ text }) {
  return (
    <Stack sx={styles.noDataContainer}>
      <Box component="img" src={nodataImage} sx={styles.noDataImage} />
      <Typography sx={styles.noDataText}>{text ? text : 'No Data'}</Typography>
    </Stack>
  );
}

export default NoDataComponent;
