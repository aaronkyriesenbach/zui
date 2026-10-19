// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { isEmpty, isObject } from 'lodash';

// components
import { Card, CardContent, CssBaseline } from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Loading from '../Shared/Loading';

import { GoogleLoginButton, GithubLoginButton, GitlabLoginButton, OIDCLoginButton } from './ThirdPartyLoginComponents';

// styling
import { cardShadow } from 'theme/styles';

const styles = {
  cardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  loginCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    height: '60%',
    backgroundColor: 'background.paper',
    boxShadow: cardShadow,
    borderRadius: '0.75rem',
    minWidth: '30rem'
  },
  loginCardContent: {
    display: 'flex',
    flexDirection: 'column',
    border: '0.1875rem black',
    width: '100%',
    padding: '3rem'
  },
  text: {
    color: 'text.strong',
    width: '100%',
    fontSize: '1.5rem',
    lineHeight: '2.25rem',
    letterSpacing: '-0.01rem',
    marginBottom: '0.25rem'
  },
  subtext: {
    color: 'text.muted',
    width: '100%',
    fontSize: '1rem',
    marginBottom: '2.375rem'
  },
  textField: {
    borderRadius: '0.25rem',
    marginTop: 0,
    marginBottom: '1.5rem',
    '& .MuiInputBase-input': {
      color: 'text.fieldInput'
    }
  },
  labelColor: {
    color: 'text.fieldLabel'
  },
  continueButton: {
    textTransform: 'none',
    backgroundColor: '#F15527',
    color: 'common.white',
    fontSize: '1.438rem',
    fontWeight: '600',
    height: '3.125rem',
    borderRadius: '0.25rem',
    letterSpacing: '0.01rem',
    marginBottom: '1rem',
    padding: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#F15527',
      boxShadow: 'none'
    }
  },
  continueAsGuestButton: {
    textTransform: 'none',
    backgroundColor: 'background.paper',
    color: 'text.muted',
    fontSize: '1.438rem',
    fontWeight: '600',
    height: '3.125rem',
    borderRadius: '0.25rem',
    border: '1px solid',
    borderColor: 'border.strong',
    letterSpacing: '0.01rem',
    marginBottom: '1rem',
    padding: 0,
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'background.paper',
      boxShadow: 'none'
    }
  },
  divider: {
    color: 'text.soft',
    marginBottom: '2rem',
    width: '100%'
  },
  thirdPartyLoginContainer: {
    width: '100%',
    marginBottom: '2rem'
  }
};

export default function SignIn({ isLoggedIn, setIsLoggedIn, wrapperSetLoading = () => {} }) {
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requestProcessing, setRequestProcessing] = useState(false);
  const requestProcessingRef = useRef(false);
  const [requestError, setRequestError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] = useState({});
  const [isGuestLoginEnabled, setIsGuestLoginEnabled] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    if (isLoggedIn) {
      setIsLoading(false);
      wrapperSetLoading(false);
      navigate('/home');
    } else {
      api
        .get(`${host()}${endpoints.authConfig}`, abortController.signal)
        .then((response) => {
          if (response.data?.http && isEmpty(response.data?.http?.auth)) {
            localStorage.setItem('authConfig', '{}');
            setIsLoggedIn(true);
            navigate('/home');
          } else if (response.data?.http?.auth) {
            setAuthMethods(response.data?.http?.auth);
            localStorage.setItem('authConfig', JSON.stringify(response.data?.http?.auth));
            setIsGuestLoginEnabled(response.data?.http?.auth?.allowAnonymousAccess === true);
            setIsLoading(false);
            wrapperSetLoading(false);
          }
          setIsLoading(false);
          wrapperSetLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setIsLoading(false);
          wrapperSetLoading(false);
        });
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const handleBasicAuth = () => {
    requestProcessingRef.current = true;
    setRequestProcessing(true);
    let cfg = {};
    const token = btoa(username + ':' + password);
    cfg = {
      headers: {
        Authorization: `Basic ${token}`
      },
      withCredentials: host() !== window?.location?.origin
    };
    api
      .get(`${host()}${endpoints.status}`, abortController.signal, cfg)
      .then((response) => {
        if (response.status === 200) {
          requestProcessingRef.current = false;
          setRequestProcessing(false);
          setRequestError(false);
          setIsLoggedIn(true);
          navigate('/home');
        }
      })
      .catch(() => {
        requestProcessingRef.current = false;
        setRequestError(true);
        setRequestProcessing(false);
      });
  };

  const handleBasicAuthSubmit = () => {
    if (requestProcessingRef.current) {
      return;
    }
    setRequestError(false);
    const isUsernameValid = handleUsernameValidation(username);
    const isPasswordValid = handlePasswordValidation(password);
    if (Object.keys(authMethods).includes('htpasswd') && isUsernameValid && isPasswordValid) {
      handleBasicAuth();
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleBasicAuthSubmit();
  };

  const handleGuestClick = () => {
    setRequestProcessing(false);
    setRequestError(false);
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleClickExternalLogin = (event, provider) => {
    event.preventDefault();
    window.location.replace(
      `${host()}${endpoints.openidAuth}?callback_ui=${encodeURIComponent(
        window?.location?.origin
      )}/home&provider=${provider}`
    );
  };

  const handleUsernameValidation = (username) => {
    let isValid = true;
    if (username === '') {
      setUsernameError('Please enter a username');
      isValid = false;
    } else {
      setUsernameError(null);
    }
    return isValid;
  };

  const handlePasswordValidation = (password) => {
    let isValid = true;
    if (password === '') {
      setPasswordError('Please enter a password');
      isValid = false;
    } else {
      setPasswordError(null);
    }
    return isValid;
  };

  const handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target?.value;

    switch (type) {
      case 'username':
        setUsername(val);
        handleUsernameValidation(val);
        break;
      case 'password':
        setPassword(val);
        handlePasswordValidation(val);
        break;
      default:
        break;
    }
  };

  const handleLoginInputFieldKeyDown = (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter') {
      handleBasicAuthSubmit();
    }
  };

  const renderThirdPartyLoginMethods = () => {
    let isGoogle = isObject(authMethods.openid?.providers?.google);
    let isGitlab = isObject(authMethods.openid?.providers?.gitlab);
    let isGithub = isObject(authMethods.openid?.providers?.github);
    let isOIDC = isObject(authMethods.openid?.providers?.oidc);
    let oidcName = authMethods.openid?.providers?.oidc?.name;

    return (
      <Stack direction="column" spacing="1rem" sx={styles.thirdPartyLoginContainer}>
        {isGithub && <GithubLoginButton handleClick={handleClickExternalLogin} />}
        {isGoogle && <GoogleLoginButton handleClick={handleClickExternalLogin} />}
        {isGitlab && <GitlabLoginButton handleClick={handleClickExternalLogin} />}
        {isOIDC && <OIDCLoginButton handleClick={handleClickExternalLogin} oidcName={oidcName} />}
      </Stack>
    );
  };

  return (
    <Box sx={styles.cardContainer} data-testid="signin-container">
      {isLoading ? (
        <Loading />
      ) : (
        <Card sx={styles.loginCard}>
          <CardContent sx={styles.loginCardContent}>
            <CssBaseline />
            <Typography align="left" sx={styles.text} component="h1" variant="h4">
              Sign In
            </Typography>
            <Typography align="left" sx={styles.subtext} variant="body1" gutterBottom>
              Welcome back! Please login.
            </Typography>
            {renderThirdPartyLoginMethods()}
            {Object.keys(authMethods).length > 1 &&
              Object.keys(authMethods).includes('openid') &&
              Object.keys(authMethods.openid.providers).length > 0 && (
                <Divider sx={styles.divider} data-testid="openid-divider">
                  or
                </Divider>
              )}
            {Object.keys(authMethods).includes('htpasswd') && (
              <Box component="form" onSubmit={null} noValidate autoComplete="off">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  sx={styles.textField}
                  InputLabelProps={{ sx: styles.labelColor }}
                  onInput={(e) => handleChange(e, 'username')}
                  error={usernameError != null}
                  helperText={usernameError}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Enter password"
                  type="password"
                  id="password"
                  sx={styles.textField}
                  InputLabelProps={{ sx: styles.labelColor }}
                  onInput={(e) => handleChange(e, 'password')}
                  error={passwordError != null}
                  helperText={passwordError}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                {requestProcessing && <CircularProgress style={{ marginTop: 20 }} color="secondary" />}
                {requestError && (
                  <Alert style={{ marginTop: 20 }} severity="error">
                    Authentication Failed. Please try again.
                  </Alert>
                )}
                <div>
                  <Button
                    fullWidth
                    type="button"
                    variant="contained"
                    sx={styles.continueButton}
                    onClick={handleClick}
                    disabled={requestProcessing}
                    data-testid="basic-auth-submit-btn"
                  >
                    Continue
                  </Button>
                </div>
              </Box>
            )}
            {isGuestLoginEnabled && (
              <Button
                fullWidth
                type="button"
                variant="contained"
                sx={styles.continueAsGuestButton}
                onClick={handleGuestClick}
              >
                Continue as guest
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
