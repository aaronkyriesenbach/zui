import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import githubLogo from '../../assets/GhIcon.svg';

const styles = {
  githubButton: {
    textTransform: 'none',
    backgroundColor: '#161614',
    color: 'common.white',
    borderRadius: '0.25rem',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#161614',
      boxShadow: 'none'
    }
  },
  googleButton: {
    textTransform: 'none',
    backgroundColor: 'background.paper',
    color: 'text.muted',
    borderRadius: '0.25rem',
    border: '1px solid',
    borderColor: 'border.strong',
    padding: 0,
    height: '3.125rem',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'background.paper',
      boxShadow: 'none'
    }
  },
  buttonsText: {
    lineHeight: '2.125rem',
    height: '2.125rem',
    fontSize: '1.438rem',
    fontWeight: '600',
    letterSpacing: '0.01rem'
  }
};

function GithubLoginButton({ handleClick }) {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={styles.githubButton}
      endIcon={<SvgIcon fontSize="medium">{githubLogo}</SvgIcon>}
      onClick={(e) => handleClick(e, 'github')}
    >
      <Box component="span" sx={styles.buttonsText}>
        Continue with Github
      </Box>
    </Button>
  );
}

function GoogleLoginButton({ handleClick }) {
  return (
    <Button fullWidth variant="contained" sx={styles.googleButton} onClick={(e) => handleClick(e, 'google')}>
      <Box component="span" sx={styles.buttonsText}>
        Continue with Google
      </Box>
    </Button>
  );
}

function GitlabLoginButton({ handleClick }) {
  return (
    <Button fullWidth variant="contained" sx={styles.button} onClick={(e) => handleClick(e, 'gitlab')}>
      Sign in with Gitlab
    </Button>
  );
}

function OIDCLoginButton({ handleClick, oidcName }) {
  const loginWithName = oidcName || 'OIDC';

  return (
    <Button fullWidth variant="contained" sx={styles.button} onClick={(e) => handleClick(e, 'oidc')}>
      Sign in with {loginWithName}
    </Button>
  );
}

export { GithubLoginButton, GoogleLoginButton, GitlabLoginButton, OIDCLoginButton };
