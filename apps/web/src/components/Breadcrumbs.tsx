import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" style={{ margin: '1.2rem 0', fontSize: 15, background: '#f8fafc', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '0.5rem 2rem', display: 'flex', alignItems: 'center', minHeight: 40 }}>
      <ol style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, gap: 0, width: '100%' }}>
        <li style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="#"
            onClick={e => { e.preventDefault(); navigate('/'); }}
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: 6,
              transition: 'background 0.15s',
              background: 'none',
              cursor: 'pointer',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#e0e7ef')}
            onMouseOut={e => (e.currentTarget.style.background = 'none')}
          >
            Home
          </a>
        </li>
        {pathnames.map((name, idx) => {
          const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          return (
            <li key={routeTo} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ margin: '0 8px', color: '#cbd5e1', fontSize: 18 }}>&#8250;</span>
              {isLast ? (
                <span style={{ color: '#64748b', fontWeight: 500, padding: '4px 10px', borderRadius: 6, background: '#e0e7ef' }}>{capitalize(decodeURIComponent(name))}</span>
              ) : (
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); navigate(routeTo); }}
                  style={{
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    padding: '4px 10px',
                    borderRadius: 6,
                    transition: 'background 0.15s',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseOver={e => (e.currentTarget.style.background = '#e0e7ef')}
                  onMouseOut={e => (e.currentTarget.style.background = 'none')}
                >
                  {capitalize(decodeURIComponent(name))}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
