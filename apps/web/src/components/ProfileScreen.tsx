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

  if (!profile) return <div>Please log in to view your profile.</div>;

  return (
    <div className="profile-screen">
      <h2>My Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit" disabled={loading}>Update</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ProfileScreen;
