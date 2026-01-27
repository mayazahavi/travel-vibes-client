import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

function Header({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
      { path: "/my-trips", name: "My Trips" },
    ];
    return allPages.filter((page) => page.path !== location.pathname);
  };

  const currentPage = getCurrentPageName();
  const otherPages = getOtherPages();

  const toggleDropdown = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const closeDropdown = () => {
    setIsDropdownActive(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav
      className={`navbar is-fixed-top ${styles.headerNav}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div className={`container ${styles.headerContainer}`}>
        <div className="navbar-brand">
          <Link
            to="/"
            className={`navbar-item ${styles.brandLink}`}
          >
            <span className={styles.brandText}>
              🌍 TravelVibes
            </span>
          </Link>
          <button
            type="button"
            className={`navbar-burger ${styles.burger}`}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMain"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div id="navbarMain" className="navbar-menu">
          <div className={`navbar-end ${styles.navEnd}`}>
            <Link
              to="/"
              className={`navbar-item ${styles.navItem}`}
            >
              Home
            </Link>
            <div
              className={`navbar-item has-dropdown ${styles.dropdownWrapper} ${isDropdownActive ? "is-active" : ""}`}
            >
              <button
                type="button"
                className={`navbar-link ${styles.dropdownToggle}`}
                onClick={toggleDropdown}
              >
                {currentPage}
              </button>
              <div
                className={`navbar-dropdown ${styles.dropdownMenu} ${isDropdownActive ? styles.dropdownMenuActive : ""}`}
              >
                {otherPages.map((page) => (
                  <Link
                    key={page.path}
                    to={page.path}
                    className={`navbar-item ${styles.dropdownLink}`}
                    onClick={closeDropdown}
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </div>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <div className={`navbar-item ${styles.logoutItem}`}>
              <button
                onClick={handleLogout}
                className={`button ${styles.logoutButton}`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
