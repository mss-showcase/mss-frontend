import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading, setUserProfile, setUserError } from '@mss-frontend/store/userSlice';
import { useUserPool } from '../auth/cognitoUserPool';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { GoogleLogin } from '@react-oauth/google';
import type { RootState } from '@mss-frontend/store';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userPool = useUserPool();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUserLoading(true));
    try {
      const user = new CognitoUser({ Username: email, Pool: userPool });
      const authDetails = new AuthenticationDetails({ Username: email, Password: password });
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          dispatch(setUserProfile({
            id: email,
            name: email,
            email,
            isAdmin: false, // You may want to fetch this from /user/me
            token: result.getIdToken().getJwtToken(),
          }));
          dispatch(setUserLoading(false));
        },
        onFailure: (err) => {
          dispatch(setUserError(err.message || 'Login failed'));
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
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => dispatch(setUserError('Google login failed'))} />
      </div>
      {error && <div className="error-message" style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 8, marginTop: 16, textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

export default LoginScreen;
