function SuccessModal({ isOpen, onClose, favorites, styles }) {
  if (!isOpen) return null;

  return (
    <div className={`modal is-active ${styles.successModal}`}>
      <div
        className="modal-background"
        onClick={onClose}
        style={{ background: "rgba(0,0,0,0.5)" }}
      ></div>
      <div className="modal-content">
        <div className={styles.modalCard}>
          <div className={styles.successIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 className={styles.successTitle}>Places Saved!</h2>
          <p className={styles.successMessage}>
            You've saved{" "}
            <strong>
              {favorites.length} amazing{" "}
              {favorites.length === 1 ? "place" : "places"}
            </strong>{" "}
            to your favorites.
          </p>
          <div className={styles.savedPlacesList}>
            {favorites.slice(0, 3).map((place) => (
              <div key={place.id} className={styles.savedPlaceItem}>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "#0ea5e9" }}
                ></i>
                <span>{place.name}</span>
              </div>
            ))}
            {favorites.length > 3 && (
              <div className={styles.morePlaces}>
                + {favorites.length - 3} more places
              </div>
            )}
          </div>
          <p className={styles.successNote}>
            Ready to turn these into a trip? We'll help you plan it soon!
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

export default SuccessModal;
