import styles from "../styles/VibesPage.module.css";

function VibeCard({ vibe, isSelected, onSelect }) {
  return (
    <div
      className={`card ${styles.vibeCard} ${isSelected ? styles.vibeCardSelected : ""}`}
      onClick={onSelect}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {isSelected && (
        <div className={styles.checkMark}>
          <i className="fas fa-check"></i>
        </div>
      )}
      <div className={styles.cardImage}>
        <img src={vibe.image} alt={vibe.title} className={styles.vibeImage} />
      </div>
      <div className={styles.cardContent}>
        <div className="content">
          <h3 className={`title is-5 has-text-centered ${styles.vibeTitle}`}>{vibe.title}</h3>
          <p className={`subtitle is-6 has-text-centered ${styles.vibeShort}`}>{vibe.short}</p>
        </div>
      </div>
    </div>
  );
}

export default VibeCard;
