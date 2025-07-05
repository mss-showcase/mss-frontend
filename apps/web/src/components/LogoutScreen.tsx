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
    <div className="logout-screen">
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LogoutScreen;
