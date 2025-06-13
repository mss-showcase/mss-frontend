import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../theme/theme.css';

const AppMenu = () => {
  const [open, setOpen] = useState(false);

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
        <li><Link to="/news" onClick={() => setOpen(false)}>News</Link></li>
        <li><Link to="/weather" onClick={() => setOpen(false)}>Weather</Link></li>
        <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
      </ul>
    </nav>
  );
};

export default AppMenu;