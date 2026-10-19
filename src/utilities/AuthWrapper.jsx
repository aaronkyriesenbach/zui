import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { Box } from '@mui/material';

const styles = {
  topMargin: {
    marginTop: '10vh',
    minHeight: '90vh',
    height: '100%'
  }
};

const AuthWrapper = ({ isLoggedIn, redirect, hasHeader = false }) => {
  return isLoggedIn ? (
    <Box sx={hasHeader ? styles.topMargin : undefined}>
      <Outlet />
    </Box>
  ) : (
    <Navigate to={redirect} replace={true} />
  );
};

export { AuthWrapper };
