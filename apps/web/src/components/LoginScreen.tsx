import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLoading, setUserProfile, setUserError } from '@mss-frontend/store/userSlice';
import userPool from '../auth/cognitoUserPool';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { GoogleLogin } from '@react-oauth/google';
import type { RootState } from '@mss-frontend/store';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUserLoading(true));
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
    <div className="login-screen">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      <div style={{ margin: '1rem 0' }}>or</div>
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => dispatch(setUserError('Google login failed'))} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginScreen;
