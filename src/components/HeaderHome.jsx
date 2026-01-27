import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "./HeaderHome.module.css";

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
      className={`navbar is-fixed-top ${styles.homeNav}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div
        className={`container ${styles.homeContainer}`}
      >
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <span className={styles.brandText}>
              🌍 TravelVibes
            </span>
          </Link>
          <a
            role="button"
            className={`navbar-burger ${styles.burger}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMain"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div
          id="navbarMain"
          className={`navbar-menu ${styles.menuTransparent}`}
        >
          <div className={`navbar-end ${styles.navEnd}`}>
            <Link
              to="/"
              className={`navbar-item ${styles.navItem} ${styles.navItemStrong}`}
            >
              Home
            </Link>
            <a
              href="#"
              onClick={handleAboutClick}
              className={`navbar-item ${styles.navItem}`}
            >
              About
            </a>
            <a
              href="#"
              onClick={handleContactClick}
              className={`navbar-item ${styles.navItem}`}
            >
              Contact
            </a>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <div className={`navbar-item ${styles.actionGroup}`}>
              <Link
                to="/login"
                className={`button is-light ${styles.loginButton}`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className={`button is-primary ${styles.signupButton}`}
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
