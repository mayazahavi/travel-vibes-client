// src/components/Header.js
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  // פונקציה לקבלת שם העמוד הנוכחי
  const getCurrentPageName = () => {
    switch (location.pathname) {
      case "/":
        return "Home";
      case "/vibes":
        return "Vibes";
      default:
        return "Travel Vibes";
    }
  };

  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: 'rgba(173, 216, 230, 0.85)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(135, 206, 235, 0.4)'
      }}
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <span style={{
            fontFamily: 'serif',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000000'
          }}>
            🌍 TravelVibes
          </span>
        </Link>

        <button
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarMain"
          style={{ color: '#000000' }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarMain" className="navbar-menu">
        <div className="navbar-start">
          {/* ריק - רק הלוגו בצד שמאל */}
        </div>

        <div className="navbar-end">
          <Link to="/" className="navbar-item" style={{ color: '#000000', fontWeight: '500' }}>
            Home
          </Link>

          <span className="navbar-item" style={{
            color: '#000000',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {getCurrentPageName()}
          </span>

          <div className="navbar-item has-dropdown is-hoverable">
            <a href="#" className="navbar-link" style={{ color: '#000000' }}>
              More Pages
            </a>
            <div className="navbar-dropdown">
              <Link to="/explore" className="navbar-item" style={{ color: '#000000' }}>
                Explore Destinations
              </Link>
              <Link to="/create-trip" className="navbar-item" style={{ color: '#000000' }}>
                Create New Trip
              </Link>
              <Link to="/trip-planner" className="navbar-item" style={{ color: '#000000' }}>
                Trip Planner
              </Link>
              <hr className="navbar-divider" />
              <button className="navbar-item button is-text" style={{ color: '#000000', border: 'none', background: 'none', padding: '0.5rem 0.75rem' }}>
                About Us
              </button>
              <button className="navbar-item button is-text" style={{ color: '#000000', border: 'none', background: 'none', padding: '0.5rem 0.75rem' }}>
                Contact
              </button>
            </div>
          </div>

          <div className="navbar-item">
            <button className="button is-light" style={{ borderColor: '#000000', color: '#000000' }}>
              <strong>Logout</strong>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
