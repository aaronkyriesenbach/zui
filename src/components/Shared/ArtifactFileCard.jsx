import React, { useState } from 'react';

import transform from 'utilities/transform';

import { Card, CardContent, Typography, Grid, Divider, Stack, Collapse, Tooltip, ButtonBase } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

import { expandableCardStyles } from './expandableCardStyles';

const styles = {
  ...expandableCardStyles,
  fileName: {
    fontSize: '1rem',
    fontWeight: '400',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textAlign: 'left',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

function ArtifactFileCard(props) {
  const { layer } = props;
  const [open, setOpen] = useState(false);

  const title = layer?.digest || '';
  const detailsId = `artifact-file-details-${(layer?.digest || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-')}`;

  return (
    <Card variant="outlined" sx={styles.card} data-testid="artifact-file-card">
      <CardContent sx={styles.content}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={10}>
            <Tooltip title={title} placement="top">
              <Typography variant="body1" sx={styles.fileName}>
                {title}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" sx={styles.values}>
              {transform.formatBytes(layer?.size)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={styles.divider} />
          </Grid>
          <Grid item xs={12}>
            <ButtonBase onClick={() => setOpen((prev) => !prev)} aria-expanded={open} aria-controls={detailsId}>
              <Stack direction="row">
                {!open ? (
                  <KeyboardArrowRight sx={styles.dropdownText} />
                ) : (
                  <KeyboardArrowDown sx={styles.dropdownText} />
                )}
                <Typography sx={styles.dropdownButton}>DETAILS</Typography>
              </Stack>
            </ButtonBase>
            <Collapse id={detailsId} in={open} timeout="auto" unmountOnExit sx={{ marginTop: '1rem' }}>
              <Stack direction="column" spacing="1.2rem">
                <Typography variant="body1">DIGEST</Typography>
                <Typography variant="body1" align="left" sx={styles.dropdownContentBox}>
                  {layer?.digest}
                </Typography>
              </Stack>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ArtifactFileCard;
