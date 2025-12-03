// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Header() {
  const location = useLocation();
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  // Get current page name
  const getCurrentPageName = () => {
    switch (location.pathname) {
      case "/vibes":
        return "Vibes";
      case "/explore":
        return "Explore";
      case "/create-trip":
        return "Create Trip";
      default:
        return "Dashboard";
    }
  };

  // Get other pages for dropdown (excluding current page)
  const getOtherPages = () => {
    const allPages = [
      { path: "/vibes", name: "Vibes" },
      { path: "/explore", name: "Explore" },
      { path: "/create-trip", name: "Create Trip" }
    ];
    return allPages.filter(page => page.path !== location.pathname);
  };

  const currentPage = getCurrentPageName();
  const otherPages = getOtherPages();

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const closeDropdown = () => {
    setIsDropdownActive(false);
  };

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: 'rgba(240, 249, 255, 0.95)', // Very light blue, slightly transparent
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        borderBottom: '1px solid rgba(14, 165, 233, 0.1)'
      }}
    >
      <div className="container" style={{ maxWidth: '100%', padding: '0 40px' }}>
        <div className="navbar-brand">
          <Link to="/" className="navbar-item" style={{ padding: '0.5rem 0.75rem' }}>
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

        <div id="navbarMain" className="navbar-menu">
          <div className="navbar-end" style={{ alignItems: 'center' }}>
            <Link 
              to="/" 
              className="navbar-item" 
              style={{ 
                color: '#000000', 
                fontWeight: '500',
                fontSize: '17px',
                padding: '0.5rem 0.75rem'
              }}
            >
              Home
            </Link>

            <div 
              className={`navbar-item has-dropdown ${isDropdownActive ? 'is-active' : ''}`} 
              style={{ padding: '0.5rem 0.75rem', position: 'relative' }}
            >
              <a 
                className="navbar-link" 
                onClick={toggleDropdown}
                style={{ 
                  color: '#000000', 
                  fontWeight: '700',
                  fontSize: '17px',
                  background: 'transparent',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  paddingRight: '2rem',
                  border: 'none'
                }}
              >
                {currentPage}
              </a>

              <div className="navbar-dropdown" style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                marginTop: '8px'
              }}>
                {otherPages.map(page => (
                  <Link 
                    key={page.path}
                    to={page.path} 
                    className="navbar-item" 
                    onClick={closeDropdown}
                    style={{ 
                      color: '#000000',
                      fontWeight: '500',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      padding: '0.5rem 1rem'
                    }}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="navbar-item" style={{ padding: '0.5rem 0.75rem' }}>
              <Link 
                to="/" 
                className="button is-light" 
                style={{ 
                  borderColor: '#e2e8f0', 
                  color: '#000000',
                  fontWeight: '600',
                  borderRadius: '12px',
                  padding: '0.5rem 1.5rem',
                  transition: 'all 0.2s ease',
                  background: 'white',
                  fontSize: '17px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#0ea5e9';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#0ea5e9';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#000000';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
