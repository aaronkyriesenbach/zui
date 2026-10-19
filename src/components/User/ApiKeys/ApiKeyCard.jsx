import React, { useState } from 'react';

import { DateTime } from 'luxon';
import { isNil } from 'lodash';

import { Card, CardContent, Typography, Grid, Divider, Stack, Collapse, Button } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { expandableCardStyles } from 'components/Shared/expandableCardStyles';
import ApiKeyRevokeDialog from './ApiKeyRevokeDialog';

const styles = {
  ...expandableCardStyles,
  label: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'left',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    cursor: 'pointer'
  },
  revokeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right'
  },
  dropdownText: { ...expandableCardStyles.dropdownText, paddingTop: 0 },
  dropdownButton: { ...expandableCardStyles.dropdownButton, paddingTop: 0 }
};

function ApiKeyCard(props) {
  const { apiKey, onRevoke } = props;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [apiKeyRevokeOpen, setApiKeyRevokeOpen] = useState(false);

  const getExpirationDisplay = () => {
    const expDateTime = DateTime.fromISO(apiKey.expirationDate);
    return `Expires on ${expDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  };

  const handleApiKeyRevokeDialogOpen = () => {
    setApiKeyRevokeOpen(true);
  };

  return (
    <Card variant="outlined" sx={styles.card}>
      <CardContent sx={styles.content}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={6}>
            <Typography variant="body1" sx={styles.label}>
              {apiKey.label}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" sx={styles.values}>
              {getExpirationDisplay()}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={styles.revokeButton}>
            <Button color="error" variant="contained" onClick={handleApiKeyRevokeDialogOpen}>
              Revoke
            </Button>
          </Grid>
          {!isNil(apiKey.apiKey) && (
            <>
              <Grid item xs={12}>
                <Divider sx={styles.divider} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" onClick={() => setOpenDropdown((prevOpenState) => !prevOpenState)}>
                  {!openDropdown ? (
                    <KeyboardArrowRight sx={styles.dropdownText} />
                  ) : (
                    <KeyboardArrowDown sx={styles.dropdownText} />
                  )}
                  <Typography sx={styles.dropdownButton}>KEY</Typography>
                </Stack>
                <Collapse in={openDropdown} timeout="auto" unmountOnExit sx={{ marginTop: '1rem' }}>
                  <Stack direction="column" spacing="1.2rem">
                    <Typography variant="body1" align="left" sx={styles.dropdownContentBox}>
                      {apiKey.apiKey}
                    </Typography>
                  </Stack>
                </Collapse>
              </Grid>
            </>
          )}
        </Grid>
        <ApiKeyRevokeDialog
          open={apiKeyRevokeOpen}
          setOpen={setApiKeyRevokeOpen}
          apiKey={apiKey}
          onConfirm={onRevoke}
        />
      </CardContent>
    </Card>
  );
}

export default ApiKeyCard;
