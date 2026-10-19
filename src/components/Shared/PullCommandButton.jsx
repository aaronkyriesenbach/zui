import React, { useState, useEffect, useRef } from 'react';

import { Grid, Button, FormControl, Menu, MenuItem, Box, Tab, InputBase, IconButton, ButtonBase } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { dockerPull, podmanPull, podmanArtifactPull, skopeoPull, orasPull } from 'utilities/pullStrings';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const styles = {
  copyStringSelect: {
    '& fieldset': {
      border: ' 0.0625rem solid',
      borderColor: 'border.strong'
    },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    width: '100%',
    height: '100%',
    backgroundColor: 'secondary.main',
    borderRadius: '0.5rem',
    color: 'text.onBrand',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    fontWeight: 600,
    textAlign: 'left',
    textTransform: 'none'
  },
  copyStringSelectOpened: {
    color: 'text.secondary',
    backgroundColor: 'background.paper'
  },
  pullStringBox: {
    width: '19.365rem',
    border: '0.0625rem solid',
    borderColor: 'border.input',
    borderRadius: '0.5rem',
    padding: '0rem 0rem',
    fontSize: '1rem'
  },
  pullStringBoxCopied: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#2EAE4E',
    padding: '0rem 1rem 0rem 1rem',
    fontFamily: 'Roboto',
    fontSize: '1rem',
    color: 'common.white',
    border: '0.0625rem solid',
    borderColor: 'border.input',
    borderRadius: '0.5rem',
    height: '3.5rem',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#2EAE4E'
    }
  },
  selectedPullTab: {
    backgroundColor: '#D83C0E',
    borderRadius: '1.5rem'
  },
  tabContent: {
    height: '100%'
  },
  tabBox: {
    padding: '0.5rem'
  },
  tabPanel: (theme) => ({
    height: '100%',
    paddingLeft: '0rem!important',
    [theme.breakpoints.down('md')]: {
      padding: '1.5rem 0'
    }
  }),
  textEllipsis: {
    padding: '0rem 1rem',
    '& .MuiInputBase-input': {
      width: '14.5rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  },
  selectIcon: {
    color: 'text.onBrand'
  },
  selectIconOpened: {
    color: 'text.secondary'
  },
  popper: {
    width: '100%',
    overflow: 'hidden',
    padding: '0rem',
    '&:hover': { backgroundColor: 'background.paper' },
    '&:focus': { backgroundColor: 'background.paper' },
    '&.Mui-focusVisible': {
      backgroundColor: 'background.paper'
    }
  },
  copyButtonContainer: {
    borderLeft: '0.0625rem solid',
    borderColor: 'border.input',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  tabList: {
    '& button.Mui-selected': { color: 'text.strong', fontWeight: '600' }
  }
};

function PullCommandButton(props) {
  const { imageName, isArtifact } = props;
  const podmanCommand = isArtifact ? podmanArtifactPull(imageName) : podmanPull(imageName);

  const defaultPull = isArtifact ? orasPull(imageName) : dockerPull(imageName);
  const [anchor, setAnchor] = useState();
  const open = Boolean(anchor);
  const [pullString, setPullString] = useState(defaultPull);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedPullTab, setSelectedPullTab] = useState(defaultPull);

  useEffect(() => {
    setPullString(defaultPull);
    setSelectedPullTab(defaultPull);
  }, [defaultPull]);

  const mounted = useRef(false);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(pullString);
    setIsCopied(true);
    setAnchor(null);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const getButtonIcon = () => {
    if (open) {
      return <ExpandLessIcon sx={styles.selectIconOpened} />;
    }
    return <ExpandMoreIcon sx={styles.selectIcon} />;
  };

  const handlePullTabChange = (event, newValue) => {
    setSelectedPullTab(newValue);
    setPullString(newValue);
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  });

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        if (mounted.current) {
          setIsCopied(false);
        }
      }, 2000);
    }
  }, [isCopied]);

  return isCopied ? (
    <Button sx={styles.pullStringBoxCopied} data-testid="successPulled-buton">
      Copied Pull Command
      <CheckCircleIcon />
    </Button>
  ) : (
    <FormControl variant="outlined" sx={{ width: '100%', height: '3.5rem' }}>
      <ButtonBase
        onClick={handleClick}
        sx={[styles.copyStringSelect, open && styles.copyStringSelectOpened]}
        disableRipple
      >
        Pull {imageName}
        {getButtonIcon()}
      </ButtonBase>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { width: anchor?.offsetWidth || '24%' } }}
        disableScrollLock
        data-testid="pull-dropdown"
      >
        <MenuItem disableRipple sx={styles.popper} data-testid="pull-menuItem">
          <TabContext value={selectedPullTab}>
            <Box>
              <TabList
                onChange={handlePullTabChange}
                TabIndicatorProps={{ sx: styles.selectedPullTab }}
                sx={styles.tabList}
              >
                {isArtifact && <Tab value={orasPull(imageName)} label="ORAS" sx={styles.tabContent} />}
                {!isArtifact && <Tab value={dockerPull(imageName)} label="Docker" sx={styles.tabContent} />}
                <Tab value={podmanCommand} label="Podman" sx={styles.tabContent} />
                {!isArtifact && <Tab value={skopeoPull(imageName)} label="Skopeo" sx={styles.tabContent} />}
              </TabList>
              <Grid container>
                <Grid item xs={12}>
                  {isArtifact && (
                    <TabPanel value={orasPull(imageName)} sx={styles.tabPanel}>
                      <Box sx={styles.tabBox}>
                        <Grid container item xs={12} sx={styles.pullStringBox}>
                          <Grid item xs={10}>
                            <InputBase
                              onKeyDownCapture={(e) => e.preventDefault()}
                              sx={styles.textEllipsis}
                              defaultValue={orasPull(imageName)}
                              data-testid="oras-input"
                            />
                          </Grid>
                          <Grid item xs={2} onClick={handleCopyClick} sx={styles.copyButtonContainer}>
                            <IconButton aria-label="copy" data-testid="orasPullcopy-btn">
                              <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </TabPanel>
                  )}
                  {!isArtifact && (
                    <TabPanel value={dockerPull(imageName)} sx={styles.tabPanel}>
                      <Box sx={styles.tabBox}>
                        <Grid container item xs={12} sx={styles.pullStringBox}>
                          <Grid item xs={10}>
                            <InputBase
                              onKeyDownCapture={(e) => e.preventDefault()}
                              sx={styles.textEllipsis}
                              defaultValue={dockerPull(imageName)}
                            />
                          </Grid>
                          <Grid item xs={2} onClick={handleCopyClick} sx={styles.copyButtonContainer}>
                            <IconButton aria-label="copy" data-testid="pullcopy-btn">
                              <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </TabPanel>
                  )}
                  <TabPanel value={podmanCommand} sx={styles.tabPanel}>
                    <Box sx={styles.tabBox}>
                      <Grid container item xs={12} sx={styles.pullStringBox}>
                        <Grid item xs={10}>
                          <InputBase
                            onKeyDownCapture={(e) => e.preventDefault()}
                            sx={styles.textEllipsis}
                            defaultValue={podmanCommand}
                            data-testid="podman-input"
                          />
                        </Grid>
                        <Grid item xs={2} onClick={handleCopyClick} sx={styles.copyButtonContainer}>
                          <IconButton aria-label="copy" data-testid="podmanPullcopy-btn">
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </TabPanel>
                  {!isArtifact && (
                    <TabPanel value={skopeoPull(imageName)} sx={styles.tabPanel}>
                      <Box sx={styles.tabBox}>
                        <Grid container item xs={12} sx={styles.pullStringBox}>
                          <Grid item xs={10}>
                            <InputBase
                              onKeyDownCapture={(e) => e.preventDefault()}
                              sx={styles.textEllipsis}
                              defaultValue={skopeoPull(imageName)}
                            />
                          </Grid>
                          <Grid item xs={2} onClick={handleCopyClick} sx={styles.copyButtonContainer}>
                            <IconButton aria-label="copy" data-testid="skopeoPullcopy-btn">
                              <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </TabPanel>
                  )}
                </Grid>
              </Grid>
            </Box>
          </TabContext>
        </MenuItem>
      </Menu>
    </FormControl>
  );
}

export default PullCommandButton;
