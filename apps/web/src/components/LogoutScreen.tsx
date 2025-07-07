
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@mss-frontend/store/userSlice';
import { useNavigate } from 'react-router-dom';
import { getCognitoClientId, getCognitoDomain } from '../auth/appConfig';


const LogoutScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    const clientId = getCognitoClientId();
    const cognitoDomain = getCognitoDomain();
    const logoutRedirect = window.location.origin + '/index.html';
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutRedirect)}`;
  };

  return (
    <div className="logout-screen welcome" style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>
      <h2 style={{ color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>Logout</h2>
      <button className="button" onClick={handleLogout} style={{ minWidth: 120 }}>Logout</button>
    </div>
  );
};

export default LogoutScreen;
