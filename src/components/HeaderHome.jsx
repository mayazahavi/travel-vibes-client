// src/components/HeaderHome.jsx
import { Link } from "react-router-dom";

function HeaderHome() {
  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        position: 'absolute',
        width: '100%',
        zIndex: 1000,
        borderBottom: 'none',
        boxShadow: 'none'
      }}
    >
      <div className="container" style={{ maxWidth: '100%', padding: '0 40px' }}>
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <span style={{
              fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#000000',
              letterSpacing: '-0.5px'
            }}>
              🌍 TravelVibes
            </span>
          </Link>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMain"
            style={{ color: '#000000' }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarMain" className="navbar-menu" style={{ background: 'transparent' }}>
          <div className="navbar-end" style={{ alignItems: 'center' }}>
            <Link to="/" className="navbar-item" style={{ 
              color: '#000000', 
              fontWeight: '500',
              fontSize: '17px',
              padding: '0.5rem 0.75rem'
            }}>
              Home
            </Link>
            
            <Link to="/vibes" className="navbar-item" style={{ 
              color: '#000000', 
              fontWeight: '500',
              fontSize: '17px',
              padding: '0.5rem 0.75rem'
            }}>
              About
            </Link>

            <Link to="/explore" className="navbar-item" style={{ 
              color: '#000000', 
              fontWeight: '500',
              fontSize: '17px',
              padding: '0.5rem 0.75rem'
            }}>
              Contact
            </Link>

            <div className="navbar-item" style={{ padding: '0.5rem 0.75rem' }}>
              <Link 
                to="/signin" 
                className="button is-light" 
                style={{ 
                  background: 'white',
                  borderColor: 'transparent',
                  color: '#000000',
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '0.5rem 1.5rem',
                  fontSize: '17px'
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderHome;
