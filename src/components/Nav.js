import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import './Nav.css';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleTheme, isDarkMode } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  
  const links = [
    { path: "/home", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/posts", label: "Posts" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>🎨 ArtVision</h1>
        </div>
        <nav className="navbar">
          
          <ul>
            {links.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {!isAuthenticated ? (
              <li>
                <Link
                  to="/register"
                  className={location.pathname === '/register' ? 'active' : ''}
                >
                  Register
                </Link>
              </li>
            ) : null}
            {isAuthenticated ? (
              <li>
                <Link
                  to="/profile"
                  className={location.pathname === '/profile' ? 'active' : ''}
                >
                  Profile
                </Link>
              </li>
            ) : null}
            {isAdmin ? (
              <li>
                <Link
                  to="/admin"
                  className={location.pathname === '/admin' ? 'active' : ''}
                >
                  Admin
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
        <div className="header-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-menu">
            {user ? (
              <div className="user-info">
                <div className="user-avatar">
                  <img src={user.avatar || '/assets/hero-art.jpg'} alt="User Avatar" />
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <button onClick={handleLogin} className="login-btn">Login</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
