import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  const linkClass = ({ isActive }) => "navbar__link" + (isActive ? " is-active" : "");

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <svg className="navbar__brand-mark" viewBox="0 0 30 30" aria-hidden="true">
            <circle cx="15" cy="15" r="14" fill="#ef9d00" />
            <path d="M6 18 L8 12 Q10 9 14 9 L20 9 Q24 9 25 14 L25 18 Z" fill="#1a2e3f" />
            <circle cx="11" cy="19" r="3" fill="#1a2e3f" />
            <circle cx="21" cy="19" r="3" fill="#1a2e3f" />
          </svg>
          AutoSphere
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>

        <ul className={"navbar__links" + (open ? " is-open" : "")}>
          <li><NavLink to="/" className={linkClass} onClick={() => setOpen(false)} end>Home</NavLink></li>
          <li><NavLink to="/cars" className={linkClass} onClick={() => setOpen(false)}>Browse Cars</NavLink></li>
          {isAuthenticated && (
            <li><NavLink to="/cars/new" className={linkClass} onClick={() => setOpen(false)}>Sell Your Car</NavLink></li>
          )}

          {isAuthenticated ? (
            <li className="navbar__user">
              <Link to="/profile" className="navbar__avatar" onClick={() => setOpen(false)} title={user.name}>
                {user.name?.charAt(0).toUpperCase()}
              </Link>
              <button className="navbar__logout" onClick={handleLogout}>Log out</button>
            </li>
          ) : (
            <li className="navbar__user">
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Log in</NavLink>
              <NavLink to="/register" className="navbar__link navbar__cta" onClick={() => setOpen(false)}>Sign up</NavLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
