import React, { useState } from 'react';

// Simple SVG icons for menu items (blue lines)
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 8, verticalAlign: 'middle' }}><circle cx="10" cy="7" r="4" stroke="#007bff" strokeWidth="1.5"/><path d="M3 17c0-2.7614 3.134-5 7-5s7 2.2386 7 5" stroke="#007bff" strokeWidth="1.5"/></svg>
);
const AdminIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 8, verticalAlign: 'middle' }}><rect x="3" y="7" width="14" height="10" rx="2" stroke="#007bff" strokeWidth="1.5"/><path d="M7 7V5a3 3 0 1 1 6 0v2" stroke="#007bff" strokeWidth="1.5"/></svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ marginRight: 8, verticalAlign: 'middle' }}><path d="M13 16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v1" stroke="#007bff" strokeWidth="1.5"/><path d="M17 10h-8m0 0l3-3m-3 3l3 3" stroke="#007bff" strokeWidth="1.5"/></svg>
);
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@mss-frontend/store/userSlice';
import type { RootState } from '@mss-frontend/store';

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=007bff&color=fff&size=48';

const HeaderUserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profile = useSelector((state: RootState) => state.user.profile);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!profile) {
    return (
      <Link to="/login" title="Login">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px #0001', background: '#007bff', display: 'block' }}>
          <circle cx="18" cy="18" r="18" fill="#007bff" />
          <path d="M18 10a5 5 0 1 1 0 10a5 5 0 0 1 0-10z" fill="#fff" />
          <path d="M8 27c0-3.866 4.477-7 10-7s10 3.134 10 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Link>
    );
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/logout');
  };

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
      <img
        src={defaultAvatar}
        alt="User Avatar"
        style={{ width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}
        onClick={() => setMenuOpen((open) => !open)}
        title={profile.name || profile.email}
      />
      {menuOpen && (
        <div style={{
          position: 'absolute',
          top: 44,
          right: 0,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          boxShadow: '0 4px 16px #0002',
          minWidth: 180,
          zIndex: 1000,
        }}>
          <div style={{ padding: 12, borderBottom: '1px solid #eee', fontWeight: 500, color: '#1d3557', fontSize: 15, letterSpacing: 0.2 }}>
            {profile.name || <span style={{ color: '#1d3557', fontWeight: 600 }}>{profile.email}</span>}
            {!profile.name && <span style={{ color: '#1d3557', fontWeight: 600 }}>{profile.email}</span>}
          </div>
          <Link to="/profile" style={{ padding: 12, color: '#007bff', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center' }} onClick={() => setMenuOpen(false)}>
            <ProfileIcon /> My Profile
          </Link>
          {profile.isAdmin && (
            <Link to="/admin" style={{ padding: 12, color: '#007bff', fontWeight: 500, fontSize: 16, display: 'flex', alignItems: 'center' }} onClick={() => setMenuOpen(false)}>
              <AdminIcon /> Admin Dashboard
            </Link>
          )}
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: 12,
              background: 'none',
              border: 'none',
              color: '#007bff',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: 16,
              borderTop: '1px solid #eee',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderUserMenu;
