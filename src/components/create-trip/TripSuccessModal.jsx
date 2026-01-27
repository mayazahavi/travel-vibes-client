import styles from "../../styles/CreateTripPage.module.css";

function TripSuccessModal({
  isOpen,
  onClose,
  tripName,
  startDate,
  endDate,
  travelers,
  vibeLabel,
}) {
  if (!isOpen) return null;

  const travelersLabel = travelers === "1" ? "Traveler" : "Travelers";
  const vibeText = vibeLabel || "Travel";

  return (
    <div className={`modal is-active ${styles.successModal}`}>
      <div
        className={`modal-background ${styles.modalBackdrop}`}
        onClick={onClose}
      ></div>
      <div className="modal-content">
        <div className={styles.modalCard}>
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className={styles.successTitle}>Trip Created Successfully!</h2>
          <p className={styles.successMessage}>
            Your trip <strong>"{tripName}"</strong> has been created.
          </p>
          <div className={styles.tripSummary}>
            <div className={styles.summaryItem}>
              <i className="fas fa-calendar-alt"></i>
              <span>
                {startDate?.toLocaleDateString()} -{" "}
                {endDate?.toLocaleDateString()}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <i className="fas fa-users"></i>
              <span>
                {travelers} {travelersLabel}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <i className="fas fa-heart"></i>
              <span>{vibeText} Vibe</span>
            </div>
          </div>
          <p className={styles.successNote}>
            Get ready for an amazing adventure! 🎉
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

export default TripSuccessModal;
