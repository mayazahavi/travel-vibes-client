import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
function NotFoundPage() {
  return (
    <div className={styles.notFoundWrapper}>
      <h1 className={styles.notFoundTitle}>404</h1>
      <h2 className={styles.notFoundSubtitle}>Page Not Found</h2>
      <p className={styles.notFoundText}>
        Oops! The destination you're looking for seems to be off the map.
      </p>
      <Link
        to="/"
        className={`${styles.ctaButton} ${styles.notFoundLink}`}
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
