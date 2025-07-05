
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@mss-frontend/store';
import '../theme/theme.css';

const AppMenu = () => {
  const [open, setOpen] = useState(false);

  const user = useSelector((state: RootState) => state.user.profile);
  return (
    <nav className="app-menu">
      <button
        className={`hamburger${open ? ' open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
      <ul className={`menu-list${open ? ' open' : ''}`}>
        <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
        <li><Link to="/what-to-buy" onClick={() => setOpen(false)}>What to Buy?</Link></li>
        <li><Link to="/news" onClick={() => setOpen(false)}>News</Link></li>
        <li><Link to="/weather" onClick={() => setOpen(false)}>Weather</Link></li>
        <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
        {user ? (
          <>
            {user.isAdmin && <li><Link to="/admin" onClick={() => setOpen(false)}>Admin</Link></li>}
            <li><Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link></li>
            <li><Link to="/logout" onClick={() => setOpen(false)}>Logout</Link></li>
          </>
        ) : (
          <li><Link to="/login" onClick={() => setOpen(false)}>Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default AppMenu;