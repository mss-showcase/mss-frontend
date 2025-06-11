import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../theme/theme.css';

const AppMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="app-menu">
      <button
        className="hamburger"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>
      <ul className={`menu-list${open ? ' open' : ''}`}>
        <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
        <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
        <li><Link to="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default AppMenu;