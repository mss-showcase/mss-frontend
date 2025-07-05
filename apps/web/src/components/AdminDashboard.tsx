import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@mss-frontend/store';

const AdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user.profile);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.isAdmin) return;
    setLoading(true);
    fetch('/user/list', {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => setUsers(data.users || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user?.isAdmin) return <div className="welcome" style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>Access denied. Admins only.</div>;

  return (
    <div className="admin-dashboard welcome" style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>Admin Dashboard</h2>
      <nav className="admin-menu" style={{ marginBottom: 24 }}>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', padding: 0, margin: 0, justifyContent: 'center' }}>
          <li style={{ fontWeight: 600, color: '#007bff' }}>Users</li>
          {/* Add more admin menu items here */}
        </ul>
      </nav>
      <section>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b', marginBottom: 16 }}>User List</h3>
        {loading && <div style={{ color: '#6b7280', marginBottom: 12 }}>Loading users...</div>}
        {error && <div className="error-message" style={{ color: '#ef4444', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 8, marginBottom: 16, textAlign: 'center' }}>{error}</div>}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>ID</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Name</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Email</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: 10 }}>{u.id}</td>
                  <td style={{ padding: 10 }}>{u.name}</td>
                  <td style={{ padding: 10 }}>{u.email}</td>
                  <td style={{ padding: 10 }}>{u.isAdmin ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
