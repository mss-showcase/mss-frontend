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
      cognitoUser.getSession((err, session) => {
        if (!err && session && session.isValid()) {
          const idToken = session.getIdToken().getJwtToken();
          const accessToken = session.getAccessToken().getJwtToken();
          const isAdmin = isAdminFromToken(idToken);
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
          dispatch(setUserProfile({
            id: email,
            name: email,
            email: email,
            isAdmin: isAdmin,
            token: accessToken, // Use access token for API calls
            idToken: idToken,   // Optionally keep idToken for profile/claims
          }));
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
    <div className="login-screen welcome" style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>Login</h2>
      {!showGoogle ? (
        <>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16 }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16 }}
            />
            <button className="button" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {oauthAllowed && <>
            <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#888' }}>or</div>
            <button className="button" style={{ width: '100%' }} onClick={() => setShowGoogle(true)}>
              Login with Google
            </button>
          </>}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {oauthAllowed && <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => dispatch(setUserError('Google login failed'))} />}
          <button className="button" style={{ width: '100%' }} onClick={() => setShowGoogle(false)}>
            Back to Email Login
          </button>
        </div>
      )}
      {error && <div className="error-message" style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 8, marginTop: 16, textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

export default LoginScreen;
