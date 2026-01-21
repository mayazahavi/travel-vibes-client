import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function HeaderHome({ theme, toggleTheme }) {
  const handleAboutClick = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        position: "absolute",
        width: "100%",
        zIndex: 1000,
        borderBottom: "none",
        boxShadow: "none",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "100%", padding: "0 40px" }}
      >
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <span
              style={{
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#000000",
                letterSpacing: "-0.5px",
              }}
            >
              🌍 TravelVibes
            </span>
          </Link>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMain"
            style={{ color: "#000000" }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div
          id="navbarMain"
          className="navbar-menu"
          style={{ background: "transparent" }}
        >
          <div className="navbar-end" style={{ alignItems: "center" }}>
            <Link
              to="/"
              className="navbar-item"
              style={{
                color: "#000000",
                fontWeight: "700",
                fontSize: "17px",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
              }}
            >
              Home
            </Link>
            <a
              href="#"
              onClick={handleAboutClick}
              className="navbar-item"
              style={{
                color: "#000000",
                fontWeight: "500",
                fontSize: "17px",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
              }}
            >
              About
            </a>
            <a
              href="#"
              onClick={handleContactClick}
              className="navbar-item"
              style={{
                color: "#000000",
                fontWeight: "500",
                fontSize: "17px",
                padding: "0.5rem 0.75rem",
                cursor: "pointer",
              }}
            >
              Contact
            </a>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <div className="navbar-item" style={{ padding: "0.5rem 0.75rem", display: "flex", gap: "10px" }}>
              <Link
                to="/login"
                className="button is-light"
                style={{
                  background: "transparent",
                  borderColor: "white",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "12px",
                  padding: "0.5rem 1.5rem",
                  fontSize: "16px",
                  borderWidth: "2px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="button is-primary"
                style={{
                  background: "white",
                  borderColor: "white",
                  color: "#000000",
                  fontWeight: "700",
                  borderRadius: "12px",
                  padding: "0.5rem 1.5rem",
                  fontSize: "16px",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.1)";
                }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HeaderHome;
