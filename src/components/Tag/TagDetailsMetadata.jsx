import React from 'react';

import transform from '../../utilities/transform';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';

import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import PullCommandButton from 'components/Shared/PullCommandButton';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    backgroundColor: 'background.paper',
    borderRadius: '0.5rem',
    borderColor: 'background.paper',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  cardContent: {
    padding: '0.5rem 1rem',
    '&:last-child': {
      paddingBottom: '0.5rem'
    }
  },
  metadataHeader: {
    color: 'text.muted'
  },
  metadataBody: {
    color: 'text.strong',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  },
  pullImageContent: {
    padding: '0',
    width: '100%',
    '&:last-child': {
      paddingBottom: '0'
    }
  }
};

function TagDetailsMetadata(props) {
  const { platform, lastUpdated, lastTagged, size, license, imageName, isArtifact } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  const lastTaggedDate = lastTagged
    ? DateTime.fromISO(lastTagged).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  return (
    <Grid container spacing={'1rem'} data-testid="tagDetailsMetadata-container">
      <Grid item xs={12} className="hide-on-mobile">
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={[styles.cardContent, styles.pullImageContent]}>
            <PullCommandButton imageName={imageName || ''} isArtifact={isArtifact} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="body2" align="left" sx={styles.metadataHeader}>
              OS/Arch
            </Typography>
            <Typography variant="body1" sx={styles.metadataBody}>
              {platform?.Os || `----`} / {platform?.Arch || `----`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="body2" align="left" sx={styles.metadataHeader}>
              Total Size
            </Typography>
            <Typography variant="body1" align="left" sx={styles.metadataBody}>
              {transform.formatBytes(size) || `----`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                Created
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" sx={styles.metadataBody}>
                  {lastDate}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                Last Tagged
              </Typography>
              <Tooltip title={lastTagged?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" sx={styles.metadataBody}>
                  {lastTaggedDate}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                License
              </Typography>
              <Tooltip title={license || ' '} placement="top">
                <Typography variant="body1" align="left" sx={styles.metadataBody}>
                  {license ? <Markdown>{license}</Markdown> : `License info not available`}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TagDetailsMetadata;
