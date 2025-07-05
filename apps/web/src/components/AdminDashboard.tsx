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

  if (!user?.isAdmin) return <div>Access denied. Admins only.</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <nav className="admin-menu">
        <ul>
          <li>Users</li>
          {/* Add more admin menu items here */}
        </ul>
      </nav>
      <section>
        <h3>User List</h3>
        {loading && <div>Loading users...</div>}
        {error && <div className="error-message">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
