// react global
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import { isAuthenticated, isAuthenticationEnabled, logoutUser } from '../../utilities/authUtilities';

// components
import { AppBar, Toolbar, Grid, Button, Box } from '@mui/material';
import SearchSuggestion from './SearchSuggestion';
import UserAccountMenu from './UserAccountMenu';
import ThemeModeMenu from './ThemeModeMenu';
// styling
import logo from '../../assets/zotLogoWhite.svg';
import logoxs from '../../assets/zotLogoWhiteSmall.svg';
import githubLogo from '../../assets/Git.png';
import { cardShadow } from 'theme/styles';

const styles = {
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'header.background',
    height: '100%',
    width: '100%',
    borderBottom: '0.0625rem solid',
    borderBottomColor: 'header.border',
    boxShadow: cardShadow
  },
  logo: {
    maxWidth: '130px',
    maxHeight: '30px'
  },
  headerLinkContainer: (theme) => ({
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }),
  link: {
    color: 'text.onBrand',
    fontSize: '1rem',
    fontWeight: 600
  },
  grid: (theme) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '2.875rem',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between'
    }
  }),
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInBtn: {
    border: '1px solid',
    borderColor: 'text.onBrand',
    borderRadius: '0.625rem',
    backgroundColor: 'transparent',
    color: 'text.onBrand',
    fontSize: '1rem',
    textTransform: 'none',
    fontWeight: 600
  }
};

function setNavShow() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(null);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY < lastScrollY) {
        setShow(true);
      } else {
        setShow(false);
      }

      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  return show;
}

function Header({ setSearchCurrentValue = () => {} }) {
  const show = setNavShow();
  const path = useLocation().pathname;

  const handleSignInClick = () => {
    logoutUser();
  };

  return (
    <AppBar position={show ? 'fixed' : 'absolute'} sx={{ height: '5rem' }}>
      <Toolbar disableGutters sx={styles.header}>
        <Grid container sx={styles.grid}>
          <Grid item container xs={3} md={4} spacing="1.5rem" sx={styles.gridItem}>
            <Grid item>
              <Link to="/home">
                <picture>
                  <source media="(min-width:600px)" srcSet={logo} />
                  <Box component="img" alt="zot" src={logoxs} sx={styles.logo} />
                </picture>
              </Link>
            </Grid>
            <Grid item sx={styles.headerLinkContainer}>
              <Box component="a" sx={styles.link} href="https://zotregistry.dev" target="_blank" rel="noreferrer">
                Product
              </Box>
            </Grid>
            <Grid item sx={styles.headerLinkContainer}>
              <Box
                component="a"
                sx={styles.link}
                href="https://zotregistry.dev/v2.0.0/general/concepts/"
                target="_blank"
                rel="noreferrer"
              >
                Docs
              </Box>
            </Grid>
          </Grid>
          <Grid item xs={6} md={4} sx={styles.gridItem}>
            {path !== '/' && <SearchSuggestion setSearchCurrentValue={setSearchCurrentValue} />}
          </Grid>
          <Grid item container xs={2} md={3} spacing="1.5rem" sx={styles.gridItem}>
            <Grid item sx={styles.headerLinkContainer}>
              <Box
                component="a"
                sx={styles.link}
                href="https://github.com/project-zot/zot"
                target="_blank"
                rel="noreferrer"
              >
                <Box component="img" alt="github repository" src={githubLogo} sx={styles.logo} />
              </Box>
            </Grid>
            <Grid item>
              <ThemeModeMenu sx={{ color: 'text.onBrand' }} />
            </Grid>
            {isAuthenticated() && isAuthenticationEnabled() && (
              <Grid item>
                <UserAccountMenu />
              </Grid>
            )}
            {!isAuthenticated() && isAuthenticationEnabled() && (
              <Grid item>
                <Button sx={styles.signInBtn} onClick={handleSignInClick}>
                  Sign in
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
