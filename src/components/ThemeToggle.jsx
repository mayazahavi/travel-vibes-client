import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import styles from "../styles/ThemeToggle.module.css";

const ThemeToggle = ({ theme, toggleTheme }) => {
  const isDark = theme === "dark";

  return (
    <button
      className={styles.toggleButton}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className={`${styles.toggleTrack} ${isDark ? styles.dark : ""}`}>
        <div className={styles.toggleThumb}>
          {isDark ? (
            <FaMoon className={styles.icon} />
          ) : (
            <FaSun className={styles.icon} />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
