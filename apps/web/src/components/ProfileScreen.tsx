import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserProfile, setUserError, setUserLoading } from '@mss-frontend/store/userSlice';
import type { RootState } from '@mss-frontend/store';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');

  useEffect(() => {
    setName(profile?.name || '');
    setEmail(profile?.email || '');
  }, [profile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setUserLoading(true));
    try {
      // Call /user/me PUT endpoint
      const res = await fetch('/user/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${profile?.token}` },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error('Update failed');
      const data = await res.json();
      dispatch(setUserProfile({ ...profile, ...data }));
    } catch (err: any) {
      dispatch(setUserError(err.message));
    } finally {
      dispatch(setUserLoading(false));
    }
  };

  if (!profile) return <div className="welcome" style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>Please log in to view your profile.</div>;

  return (
    <div className="profile-screen welcome" style={{ maxWidth: 400, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>My Profile</h2>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16 }}
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '0.75rem 1rem', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 16 }}
        />
        <button className="button" type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
      {error && <div className="error-message" style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 8, marginTop: 16, textAlign: 'center' }}>{error}</div>}
    </div>
  );
};

export default ProfileScreen;
