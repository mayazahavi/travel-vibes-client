import { useEffect, useState } from "react";
import styles from "../styles/Toast.module.css";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); 
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.content}>{message}</div>
      <button className={styles.closeButton} onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Toast;

