import { Link } from "react-router-dom";
import styles from "../styles/HomePage.module.css";
function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
        textAlign: "center",
        paddingTop: "100px",
      }}
    >
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: "900",
          color: "#0ea5e9",
          marginBottom: "20px",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "15px",
          color: "#333",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "30px",
          maxWidth: "500px",
        }}
      >
        Oops! The destination you're looking for seems to be off the map.
      </p>
      <Link
        to="/"
        className={styles.ctaButton}
        style={{ display: "inline-flex" }}
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFoundPage;
