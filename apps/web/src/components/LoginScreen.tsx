import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading, setUserProfile, setUserError } from '@mss-frontend/store/userSlice';
import { useUserPool } from '../auth/cognitoUserPool';
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
  const userPool = useUserPool();

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
          dispatch(setUserProfile({
            id: email,
            name: email,
            email: email,
            isAdmin: false, // You may want to fetch this from /user/me
            token: result.getIdToken().getJwtToken(),
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
          <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#888' }}>or</div>
          <button className="button" style={{ width: '100%' }} onClick={() => setShowGoogle(true)}>
            Login with Google
          </button>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => dispatch(setUserError('Google login failed'))} />
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
