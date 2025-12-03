// src/components/HeaderHome.jsx
import { Link } from "react-router-dom";

function HeaderHome() {
  return (
    <nav
      className="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: 'rgba(255, 255, 255, 0.1)', // More transparent white/light
        backdropFilter: 'blur(10px)',
        position: 'absolute', // Ensures it sits on top of the hero image
        width: '100%',
        zIndex: 1000,
        borderBottom: 'none' // No border for seamless look
      }}
    >
      <div className="navbar-brand">
        <Link to="/" className="navbar-item">
          <span style={{
            fontFamily: 'serif',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ffffff', // White text for contrast against hero image if needed, or black if light image
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🌍 TravelVibes
          </span>
        </Link>

        <button
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarMain"
          style={{ color: '#ffffff' }}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarMain" className="navbar-menu" style={{ background: 'transparent' }}>
        <div className="navbar-end">
          <Link to="/vibes" className="navbar-item" style={{ color: '#ffffff', fontWeight: '500' }}>
            Choose Vibe
          </Link>
          
          <Link to="/explore" className="navbar-item" style={{ color: '#ffffff', fontWeight: '500' }}>
            Explore
          </Link>

          <div className="navbar-item">
            <div className="buttons">
              <Link to="/signin" className="button is-primary" style={{ fontWeight: 'bold' }}>
                Sign Up
              </Link>
              <Link to="/login" className="button is-light" style={{ borderColor: 'transparent', color: '#000000' }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderHome;
