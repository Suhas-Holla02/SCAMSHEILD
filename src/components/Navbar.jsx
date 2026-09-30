import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { path: '/analyze', label: 'Analyze' },
    { path: '/scan', label: 'Scan' },
    { path: '/url-check', label: 'URL Check' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/history', label: 'History' },
    { path: '/learn', label: 'Learn' },
    { path: '/simulator', label: 'Simulator' },
  ];

  if (location.pathname === '/') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="shield-icon">🛡️</span>
        <span>SCAMSHIELD</span>
      </Link>
      <button className="navbar-mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        {links.map(link => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
