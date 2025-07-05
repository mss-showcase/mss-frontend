import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@mss-frontend/store/userSlice';

const LogoutScreen = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // Optionally, call /auth/logout endpoint here
  };

  return (
    <div className="logout-screen welcome" style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>
      <h2 style={{ color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>Logout</h2>
      <button className="button" onClick={handleLogout} style={{ minWidth: 120 }}>Logout</button>
    </div>
  );
};

export default LogoutScreen;
