import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import React from 'react';
import transform from '../../utilities/transform';

const styles = {
  card: {
    marginBottom: '2px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    backgroundColor: 'background.paper',
    border: '0',
    borderRadius: '0.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  cardContent: {
    '&:last-child': {
      padding: '0.5rem 1rem'
    }
  },
  metadataHeader: {
    color: 'text.muted',
    fontSize: '0.75rem',
    lineHeight: '1.125rem'
  },
  metadataBody: {
    color: 'text.strong',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  }
};

function RepoDetailsMetadata(props) {
  const { repoURL, totalDownloads, lastUpdated, size, license, description } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="body2" align="left" sx={styles.metadataHeader}>
              Repository
            </Typography>
            <Typography variant="body1" align="left" sx={styles.metadataBody}>
              {repoURL || `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12}>
        <Card variant="outlined" sx={styles.card}>
          <CardContent sx={styles.cardContent}>
            <Typography variant="body2" align="left" sx={styles.metadataHeader}>
              Total downloads
            </Typography>
            <Typography variant="body1" align="left" sx={styles.metadataBody}>
              {!isNaN(totalDownloads) ? totalDownloads : `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                Last publish
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" sx={styles.metadataBody}>
                  {lastDate}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                Total size
              </Typography>
              <Typography variant="body1" align="left" sx={styles.metadataBody}>
                {transform.formatBytes(size) || `----`}
              </Typography>
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
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" sx={styles.card}>
            <CardContent sx={styles.cardContent}>
              <Typography variant="body2" align="left" sx={styles.metadataHeader}>
                Description
              </Typography>
              <Typography variant="body1" align="left" sx={styles.metadataBody}>
                {description ? <Markdown>{description}</Markdown> : `Description not available`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RepoDetailsMetadata;
