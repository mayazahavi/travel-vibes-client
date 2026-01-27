import styles from "../../styles/VibesPage.module.css";

function VibeSuccessModal({ isOpen, onClose, vibe }) {
  if (!isOpen || !vibe) return null;

  return (
    <div className={`modal is-active ${styles.successModal}`}>
      <div
        className={`modal-background ${styles.modalBackdrop}`}
        onClick={onClose}
      ></div>
      <div className="modal-content">
        <div className={styles.modalCard}>
          <div className={styles.successIcon}>
            <span className={styles.vibeEmoji}>{vibe.emoji}</span>
          </div>
          <h2 className={styles.successTitle}>Vibe Selected!</h2>
          <p className={styles.successMessage}>
            You've chosen <strong>{vibe.title}</strong> for your next adventure!
          </p>
          <p className={styles.successNote}>{vibe.details}</p>
          <p className={styles.redirectMessage}>
            Taking you to trip planning... ✈️
          </p>
        </div>
      </div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
}

export default VibeSuccessModal;
