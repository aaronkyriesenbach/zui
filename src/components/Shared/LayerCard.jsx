import React, { useState } from 'react';

import transform from 'utilities/transform';

import { Card, CardContent, Typography, Grid, Divider, Stack, Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';

import { expandableCardStyles } from './expandableCardStyles';

const styles = {
  ...expandableCardStyles,
  layer: {
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
  }
};

function LayerCard(props) {
  const { layer, historyDescription } = props;
  const [open, setOpen] = useState(false);

  const getLayerSize = () => {
    if (historyDescription.EmptyLayer) return 0;
    else return layer.Size;
  };

  return (
    <Card variant="outlined" sx={styles.card}>
      <CardContent sx={styles.content}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={10}>
            <Typography variant="body1" sx={styles.layer}>
              {historyDescription.CreatedBy}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1" sx={styles.values}>
              {transform.formatBytes(getLayerSize())}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={styles.divider} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" onClick={() => setOpen((prevOpenState) => !prevOpenState)}>
              {!open ? <KeyboardArrowRight sx={styles.dropdownText} /> : <KeyboardArrowDown sx={styles.dropdownText} />}
              <Typography sx={styles.dropdownButton}>DETAILS</Typography>
            </Stack>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ marginTop: '1rem' }}>
              <Stack direction="column" spacing="1.2rem">
                <Typography variant="body1">Command</Typography>
                <Typography variant="body1" align="left" sx={styles.dropdownContentBox}>
                  {historyDescription.CreatedBy}
                </Typography>
                {!historyDescription.EmptyLayer && (
                  <>
                    <Typography variant="body1">DIGEST</Typography>
                    <Typography variant="body1" align="left" sx={styles.dropdownContentBox}>
                      {layer.Digest}
                    </Typography>
                  </>
                )}
              </Stack>
            </Collapse>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default LayerCard;
