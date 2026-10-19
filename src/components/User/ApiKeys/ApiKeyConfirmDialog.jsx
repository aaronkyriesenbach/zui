import React from 'react';

import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Typography, Grid } from '@mui/material';

const styles = {
  gridWrapper: {
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  apiKeyDisplay: {
    boxSizing: 'border-box',
    color: 'text.muted',
    fontSize: '1rem',
    fontWeight: '400',
    padding: '0.75rem',
    backgroundColor: 'background.muted',
    borderRadius: '0.9rem',
    overflowWrap: 'break-word'
  }
};

function ApiKeyConfirmDialog(props) {
  const { open, setOpen, apiKey } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Api Key &quot;{apiKey?.label}&quot; Created</DialogTitle>
      <DialogContent>
        <Grid container sx={styles.gridWrapper}>
          <Grid item xs={12}>
            <Typography>Please copy the api key, you will not be able to see it once the page is refreshed</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={styles.apiKeyDisplay}>
              {apiKey?.apiKey}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApiKeyConfirmDialog;
