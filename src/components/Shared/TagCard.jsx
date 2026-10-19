import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, Collapse, Grid, Stack, Tooltip, Typography, Divider } from '@mui/material';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import transform from 'utilities/transform';
import { DateTime } from 'luxon';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import DeleteTag from 'components/Shared/DeleteTag';

const styles = {
  card: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'background.paper',
    boxShadow: 'none',
    border: '1px solid',
    borderColor: 'border.main',
    borderRadius: '0.75rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  content: {
    textAlign: 'left',
    color: 'text.subtle',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  clickCursor: {
    cursor: 'pointer'
  },
  dropdownToggle: {
    color: 'text.link',
    paddingTop: '1rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    color: 'text.link',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  },
  tagHeading: {
    color: 'text.faint',
    fontSize: '1rem',
    marginBottom: '0.5rem'
  },
  tagName: {
    color: 'text.link',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    textDecorationLine: 'underline',
    cursor: 'pointer'
  },
  cardDivider: {
    marginTop: '1rem',
    marginBottom: '1rem',
    border: '1px solid',
    borderColor: 'border.main'
  },
  manifsetsTable: {
    marginTop: '1rem'
  },
  tableHeaderText: {
    color: 'text.muted',
    fontSize: '1rem'
  }
};

export default function TagCard(props) {
  const { repoName, showRepoName = true, tag, lastUpdated, vendor, manifests, repo, onTagDelete, isDeletable } = props;
  const [open, setOpen] = useState(false);

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;
  const navigate = useNavigate();

  // Always navigate with the absolute, encoded path -- a relative navigate('tag/...')
  // here resolves against the current (already %2F-encoded) location and gets
  // re-escaped by the router into %252F. Every caller must supply repoName.
  const goToTags = (digest = null) => {
    navigate(`/image/${encodeURIComponent(repoName)}/tag/${tag}`, { state: { digest } });
  };

  return (
    <Card sx={styles.card} raised>
      <CardContent sx={styles.content}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Typography variant="body1" align="left" sx={styles.tagHeading}>
            Tag
          </Typography>
          {isDeletable && <DeleteTag repo={repo} tag={tag} onTagDelete={onTagDelete} />}
        </Stack>
        <Typography variant="body1" align="left" sx={styles.tagName} onClick={() => goToTags()}>
          {showRepoName && `${repoName}:`}
          {tag}
        </Typography>

        <Stack sx={{ display: 'inline' }} direction="row" spacing={0.5}>
          <Typography variant="caption" sx={{ fontWeight: '400', fontSize: '0.8125rem' }}>
            Created
          </Typography>
          <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
            <Typography variant="caption" sx={{ fontWeight: '600', fontSize: '0.8125rem' }}>
              {lastDate} by <Markdown options={{ forceInline: true }}>{vendor || 'Vendor not available'}</Markdown>
            </Typography>
          </Tooltip>
        </Stack>
        <Divider variant="fullWidth" sx={styles.cardDivider} />
        <Stack direction="row" onClick={() => setOpen(!open)}>
          {!open ? <KeyboardArrowRight sx={styles.dropdownText} /> : <KeyboardArrowDown sx={styles.dropdownText} />}
          <Typography sx={styles.dropdownToggle}>{!open ? `Show more` : `Show less`}</Typography>
        </Stack>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={styles.manifsetsTable}>
            <Grid container item xs={12} direction={'row'}>
              <Grid item xs={6} md={6}>
                <Typography variant="body1" sx={styles.tableHeaderText}>
                  DIGEST
                </Typography>
              </Grid>
              <Grid item xs={6} md={3} sx={styles.tableHeaderText}>
                <Typography variant="body1">OS/Arch</Typography>
              </Grid>
              <Grid
                item
                xs={0}
                md={3}
                className="hide-on-mobile"
                sx={[styles.tableHeaderText, { display: 'flex', justifyContent: 'flex-end' }]}
              >
                <Typography variant="body1"> COMPRESSED SIZE </Typography>
              </Grid>
            </Grid>

            {manifests.map((el) => (
              <Grid container item xs={12} key={el.digest} direction={'row'}>
                <Grid item xs={6} md={6}>
                  <Tooltip title={el.digest || ''} placement="top">
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.link', textDecorationLine: 'underline', cursor: 'pointer' }}
                      onClick={() => goToTags(el.digest)}
                    >
                      {el.digest?.substr(0, 12)}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="body1" color="primary">
                    {el.platform?.Os || '----'}/{el.platform?.Arch || '----'}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={0}
                  md={3}
                  className="hide-on-mobile"
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Typography sx={{ textAlign: 'right' }} variant="body1" color="primary">
                    {transform.formatBytes(el.size)}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
