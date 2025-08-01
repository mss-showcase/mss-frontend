import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading, setUserProfile, setUserError, logout } from '@mss-frontend/store/userSlice';
import { useUserPool } from '../auth/cognitoUserPool';
import { isAdminFromToken } from '../auth/auth.js';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { GoogleLogin } from '@react-oauth/google';
import type { RootState } from '@mss-frontend/store';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  // Restore session from cookie on mount
  React.useEffect(() => {
    const cookie = Cookies.get('mss_session');
    if (cookie) {
      try {
        const userObj = JSON.parse(cookie);
        // Defensive: check for required fields
        if (userObj && userObj.id && userObj.token) {
          dispatch(setUserProfile(userObj));
        }
      } catch (e) {
        // Invalid cookie, ignore
        Cookies.remove('mss_session');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dispatch = useDispatch();
  const { loading, error, profile } = useSelector((state: RootState) => state.user);

  // Redirect to welcome page after successful login
  const navigate = useNavigate();
  React.useEffect(() => {
    if (profile) {
      // Debug: log user roles/claims
      console.log('Logged-in user profile:', profile);
      if (profile.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [profile, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGoogle, setShowGoogle] = useState(false);
  // Hide OAuth logins if referer protocol is http (not https)
  const [oauthAllowed, setOauthAllowed] = useState(true);
  React.useEffect(() => {
    try {
      const ref = document.referrer || window.location.href;
      const url = new URL(ref);
      if (url.protocol === 'http:') {
        setOauthAllowed(false);
      }
    } catch (e) {
      // fallback: allow oauth
      setOauthAllowed(true);
    }
  }, []);
  const userPool = useUserPool();

  // --- Access token renewal and inactivity auto-logout ---
  React.useEffect(() => {
    let renewInterval: NodeJS.Timeout | null = null;
    let logoutTimeout: NodeJS.Timeout | null = null;
    let lastActivity = Date.now();

    function resetLogoutTimer() {
      lastActivity = Date.now();
      if (logoutTimeout) clearTimeout(logoutTimeout);
      logoutTimeout = setTimeout(() => {
        dispatch(logout());
      }, 30 * 60 * 1000); // 30 minutes inactivity
    }

    function renewAccessToken() {
      if (!profile || !profile.id) return;
      // Only renew if user is logged in
      const cognitoUser = new CognitoUser({ Username: profile.id, Pool: userPool });
    interface CognitoSession {
      isValid(): boolean;
      getIdToken(): { getJwtToken(): string };
      getAccessToken(): { getJwtToken(): string };
    }

    interface CognitoSessionError extends Error {
      message: string;
    }

    cognitoUser.getSession((err: CognitoSessionError | null, session: CognitoSession | null) => {
      if (!err && session && session.isValid()) {
        const idToken: string = session.getIdToken().getJwtToken();
        const accessToken: string = session.getAccessToken().getJwtToken();
        const isAdmin: boolean = isAdminFromToken(idToken);
        dispatch(setUserProfile({
        ...profile,
        isAdmin,
        token: accessToken,
        idToken,
        }));
      }
    });
    }

    // Listen for user activity
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetLogoutTimer));
    resetLogoutTimer();

    // Set up periodic token renewal (every 5 min)
    renewInterval = setInterval(() => {
      if (Date.now() - lastActivity < 30000) {
        renewAccessToken();
      }
    }, 5 * 60 * 1000);

    return () => {
      if (renewInterval) clearInterval(renewInterval);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetLogoutTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, userPool, dispatch]);



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUserLoading(true));
    try {
      // Debug log to verify config values
      // @ts-ignore
      console.log('CognitoUserPool config:', userPool?.userPoolId, userPool?.clientId);
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log('Cognito login success:', result);
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();
          // Defensive: check if token is a JWT
          if (typeof idToken !== 'string' || idToken.split('.').length !== 3 || typeof accessToken !== 'string' || accessToken.split('.').length !== 3) {
            console.error('Invalid JWT token(s) received:', idToken, accessToken);
            dispatch(setUserError('Login failed: Invalid token received.'));
            dispatch(setUserLoading(false));
            return;
          }
          const isAdmin = isAdminFromToken(idToken);
          const userObj = {
            id: email,
            name: email,
            email: email,
            isAdmin: isAdmin,
            token: accessToken, // Use access token for API calls
            idToken: idToken,   // Optionally keep idToken for profile/claims
          };
          dispatch(setUserProfile(userObj));
          Cookies.set('mss_session', JSON.stringify(userObj), { expires: 7, secure: true, sameSite: 'Lax' });
          dispatch(setUserLoading(false));
        },
        onFailure: (err) => {
          console.error('Cognito login failed:', err);
          dispatch(setUserError(err.message || 'Login failed'));
          dispatch(setUserLoading(false));
        },
        mfaRequired: (codeDeliveryDetails) => {
          console.warn('MFA required:', codeDeliveryDetails);
          dispatch(setUserError('MFA required, which is not yet supported in this UI.'));
          dispatch(setUserLoading(false));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.warn('New password required:', userAttributes, requiredAttributes);
          dispatch(setUserError('Password reset required. Please reset your password in the AWS Cognito console or contact support.'));
          dispatch(setUserLoading(false));
        },
      });
    } catch (err: any) {
      dispatch(setUserError(err.message || 'Login failed'));
      dispatch(setUserLoading(false));
    }
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    // Send credentialResponse.credential to backend for verification and session
    // For now, just set as logged in
    dispatch(setUserProfile({
      id: 'google',
      name: 'Google User',
      email: '',
      isAdmin: false,
      token: credentialResponse.credential,
    }));
  };

  return (
    <div className="login-screen ergonomic-card">
      <h2 className="ergonomic-title" style={{ marginBottom: 24 }}>Login</h2>
      {!showGoogle ? (
        <>
          <form onSubmit={handleLogin} className="ergonomic-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="ergonomic-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="ergonomic-input"
            />
            <button className="button ergonomic-btn" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {oauthAllowed && <>
            <div className="ergonomic-or">or</div>
            <button className="button ergonomic-btn" onClick={() => setShowGoogle(true)}>
              Login with Google
            </button>
          </>}
        </>
      ) : (
        <div className="ergonomic-google-flex">
          {oauthAllowed && <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => dispatch(setUserError('Google login failed'))} />}
          <button className="button ergonomic-btn" onClick={() => setShowGoogle(false)}>
            Back to Email Login
          </button>
        </div>
      )}
      {error && <div className="error-message ergonomic-error">{error}</div>}
    </div>
  );
};

export default LoginScreen;
