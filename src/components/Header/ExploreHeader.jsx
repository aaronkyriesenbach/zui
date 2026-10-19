// react global
import { Link, useNavigate, useParams } from 'react-router';

// components
import { Box, Typography, Breadcrumbs } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import React from 'react';
import { decodeRouteParam } from '../../utilities/urlUtilities';

const styles = {
  exploreHeader: (theme) => ({
    backgroundColor: 'transparent',
    minHeight: '50px',
    padding: '2.75rem 0 1.25rem 0',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
      padding: '1rem'
    }
  }),
  explore: (theme) => ({
    color: 'text.muted',
    fontSize: '0.813rem',
    fontWeight: '600',
    letterSpacing: '0.009375rem',
    [theme.breakpoints.down('md')]: {
      fontSize: '0.8rem'
    }
  }),
  arrowIcon: {
    color: 'text.muted',
    marginRight: '1.75rem',
    cursor: 'pointer'
  }
};

function ExploreHeader() {
  const navigate = useNavigate();
  const { name, reponame, tag } = useParams();
  const repoName = decodeRouteParam(reponame || name);
  const pathHeader = tag ? `${repoName} / ${decodeRouteParam(tag)}` : repoName;
  // rebuild the link from the decoded name instead of slicing location.pathname,
  // which may still carry an extra %25-encoding layer added by the router history
  const repoLink = repoName ? `/image/${encodeURIComponent(repoName)}` : '/';

  return (
    <Box sx={styles.exploreHeader}>
      <ArrowBackIcon sx={styles.arrowIcon} onClick={() => navigate(-1)} />
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <Link to="/">
          <Typography variant="body1" sx={styles.explore}>
            Home
          </Typography>
        </Link>
        <Link to={repoLink}>
          {repoName && (
            <Typography sx={styles.explore} variant="body1">
              {pathHeader}
            </Typography>
          )}
        </Link>
      </Breadcrumbs>
      <div></div>
    </Box>
  );
}

export default ExploreHeader;
