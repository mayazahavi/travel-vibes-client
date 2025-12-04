// src/components/HeaderHome.jsx
import { Link } from "react-router-dom";

function HeaderHome() {
  const handleAboutClick = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="navbar-item" 
              style={{ 
                color: '#000000', 
                fontWeight: '700',
                fontSize: '17px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              Home
            </a>
            
            <a 
              href="#" 
              onClick={handleAboutClick}
              className="navbar-item" 
              style={{ 
                color: '#000000', 
                fontWeight: '500',
                fontSize: '17px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              About
            </a>

            <a 
              href="#" 
              onClick={handleContactClick}
              className="navbar-item" 
              style={{ 
                color: '#000000', 
                fontWeight: '500',
                fontSize: '17px',
                padding: '0.5rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              Contact
            </a>

            <div className="navbar-item" style={{ padding: '0.5rem 0.75rem' }}>
              <Link 
                to="/vibes" 
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
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderHome;
