
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

  if (!user?.isAdmin) return <div className="welcome" style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff', textAlign: 'center' }}>Access denied. Admins only.</div>;

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
    <div className="admin-dashboard welcome" style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.07)', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', fontWeight: 300, marginBottom: 24 }}>Admin Dashboard</h2>
      <nav className="admin-menu" style={{ marginBottom: 24 }}>
        <ul style={{ display: 'flex', gap: 24, listStyle: 'none', padding: 0, margin: 0, justifyContent: 'center' }}>
          <li style={{ fontWeight: 600, color: '#007bff' }}>Users</li>
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
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>ID</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Name</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Email</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Admin</th>
                <th style={{ padding: 12, borderBottom: '1.5px solid #e5e7eb', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: 10 }}>
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleOne(u.id)} />
                  </td>
                  <td style={{ padding: 10 }}>{u.id}</td>
                  <td style={{ padding: 10 }}>{u.name}</td>
                  <td style={{ padding: 10 }}>{u.email}</td>
                  <td style={{ padding: 10 }}>{u.isAdmin ? 'Yes' : 'No'}</td>
                  <td style={{ padding: 10 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="button"
                        style={{ fontSize: 13, padding: '4px 10px' }}
                        disabled={u.isAdmin}
                        onClick={() => handleSetAdmin(u.name, true)}
                      >
                        Set Admin
                      </button>
                      <button
                        className="button"
                        style={{ fontSize: 13, padding: '4px 10px' }}
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
          <button className="button" onClick={handlePrev} disabled={prevTokens.length === 0}>
            Previous
          </button>
          <button className="button" onClick={handleNext} disabled={!nextToken}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
