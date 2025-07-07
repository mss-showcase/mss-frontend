
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@mss-frontend/store';
import { getGatewayUrl } from '@mss-frontend/store/apiConfig';

const AdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user.profile);
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [prevTokens, setPrevTokens] = useState<string[]>([]); // for back navigation

  useEffect(() => {
    if (!user?.isAdmin) return;
    setLoading(true);
    const apiBase = getGatewayUrl().replace(/\/$/, '');
    const url = new URL(`${apiBase}/user/list`);
    if (nextToken) url.searchParams.set('nextToken', nextToken);
    fetch(url.toString(), {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setNextToken(data.nextToken || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, nextToken]);

  const handleNext = () => {
    if (nextToken) {
      setPrevTokens((prev) => [...prev, nextToken]);
      setNextToken(nextToken);
    }
  };

  const handlePrev = () => {
    setPrevTokens((prev) => {
      const copy = [...prev];
      const last = copy.pop();
      setNextToken(last || null);
      return copy;
    });
  };

  if (!user?.isAdmin) return <div className="welcome ergonomic-card" style={{ textAlign: 'center' }}>Access denied. Admins only.</div>;

  // Menu actions
  const handleSetAdmin = async (username: string, isAdmin: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const apiBase = getGatewayUrl().replace(/\/$/, '');
      const res = await fetch(`${apiBase}/user/setadmin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ username, isAdmin }),
      });
      if (!res.ok) throw new Error('Failed to update admin status');
      // Refresh user list
      setNextToken(null); // reload first page
    } catch (err: any) {
      setError(err.message || 'Failed to update admin status');
    } finally {
      setLoading(false);
    }
  };

  // Checkbox logic
  const allSelected = users.length > 0 && selected.length === users.length;
  const toggleAll = () => {
    setSelected(allSelected ? [] : users.map(u => u.id));
  };
  const toggleOne = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  return (
    <div className="admin-dashboard ergonomic-card">
      <h2 className="ergonomic-title" style={{ marginBottom: 24 }}>Admin Dashboard</h2>
      <nav className="admin-menu" style={{ marginBottom: 24 }}>
        <ul className="ergonomic-nav-list">
          <li className="ergonomic-nav-item">Users</li>
        </ul>
      </nav>
      <section>
        <h3 className="ergonomic-section-title">User List</h3>
        {loading && <div className="ergonomic-loading">Loading users...</div>}
        {error && <div className="error-message ergonomic-error">{error}</div>}
        <div className="ergonomic-table-wrapper">
          <table className="ergonomic-table">
            <thead>
              <tr>
                <th><input type="checkbox" checked={allSelected} onChange={toggleAll} /></th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleOne(u.id)} /></td>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="ergonomic-btn-group">
                      <button
                        className="button ergonomic-btn-sm"
                        disabled={u.isAdmin}
                        onClick={() => handleSetAdmin(u.name, true)}
                      >
                        Set Admin
                      </button>
                      <button
                        className="button ergonomic-btn-sm"
                        disabled={!u.isAdmin || u.name === user.name}
                        onClick={() => handleSetAdmin(u.name, false)}
                      >
                        Revoke Admin
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ergonomic-table-controls">
          <button className="button ergonomic-btn" onClick={handlePrev} disabled={prevTokens.length === 0}>
            Previous
          </button>
          <button className="button ergonomic-btn" onClick={handleNext} disabled={!nextToken}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
