import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

function Header() {
  const location = useLocation();
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const getCurrentPageName = () => {
    switch (location.pathname) {
      case "/vibes":
        return "Vibes";
      case "/explore":
        return "Explore";
      case "/create-trip":
        return "Create Trip";
      case "/my-trips":
        return "My Trips";
      case "/favorites":
        return "Trip Details";
      default:
        return "Dashboard";
    }
  };

  const getOtherPages = () => {
    const allPages = [
      { path: "/vibes", name: "Vibes" },
      { path: "/explore", name: "Explore" },
      { path: "/create-trip", name: "Create Trip" },
      { path: "/my-trips", name: "My Trips" }
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
    <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation" style={{
      background: 'rgba(240, 249, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      borderBottom: '1px solid rgba(14, 165, 233, 0.1)'
    }}>
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
          <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarMain" style={{ color: '#000000' }}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbarMain" className="navbar-menu">
          <div className="navbar-end" style={{ alignItems: 'center' }}>
            <Link to="/" className="navbar-item" style={{ 
              color: '#000000', 
              fontWeight: '500',
              fontSize: '17px',
              padding: '0.5rem 0.75rem'
            }}>
              Home
            </Link>
            <div className={`navbar-item has-dropdown ${isDropdownActive ? 'is-active' : ''}`} style={{ padding: '0.5rem 0.75rem', position: 'relative' }}>
              <a className="navbar-link" onClick={toggleDropdown} style={{ 
                color: '#000000', 
                fontWeight: '700',
                fontSize: '17px',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0.5rem',
                paddingRight: '2.5rem',
                border: 'none'
              }}>
                {currentPage}
              </a>
              <div className="navbar-dropdown" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #cbd5e1',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(14, 165, 233, 0.1)',
                borderRadius: '16px',
                marginTop: '12px',
                padding: '8px',
                minWidth: '180px',
                animation: isDropdownActive ? 'fadeInDown 0.3s ease' : 'none'
              }}>
                {otherPages.map(page => (
                  <Link 
                    key={page.path}
                    to={page.path} 
                    className="navbar-item" 
                    onClick={closeDropdown}
                    style={{ 
                      color: '#1e293b',
                      fontWeight: '600',
                      fontSize: '15px',
                      transition: 'all 0.2s ease',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      margin: '2px 0',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)';
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#1e293b';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="navbar-item" style={{ padding: '0.5rem 0.75rem' }}>
              <Link to="/" className="button" style={{ 
                borderColor: '#38bdf8', 
                color: '#0ea5e9',
                fontWeight: '600',
                borderRadius: '10px',
                padding: '0.4rem 1rem',
                transition: 'all 0.2s ease',
                background: '#e0f2fe',
                fontSize: '15px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#0ea5e9';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#0ea5e9';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#e0f2fe';
                e.target.style.color = '#0ea5e9';
                e.target.style.borderColor = '#38bdf8';
                e.target.style.fontSize = '15px';
              }}>
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
