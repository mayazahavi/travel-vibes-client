import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import VibeCard from "../components/VibeCard.jsx";
import styles from "../styles/VibesPage.module.css";
import { DETAILED_VIBES } from "../constants/vibes";
import VibeSuccessModal from "../components/vibes/VibeSuccessModal";

function VibesPage() {
  const [selectedVibe, setSelectedVibe] = useState(DETAILED_VIBES[0]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const detailsRef = useRef(null);
  const navigate = useNavigate();

  const handleVibeSelect = (vibe) => {
    setSelectedVibe(vibe);
  };

  const handleStartPlanning = (e) => {
    e.preventDefault();
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigate(`/create-trip?vibe=${selectedVibe.id}`);
      window.scrollTo(0, 0);
    }, 3000);
  };

  return (
    <div className={styles.vibesPage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>DISCOVER YOUR STYLE</span>
        <h1 className={styles.mainTitle}>Choose Your Travel Vibe</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.mainSubtitle}>
          Select a vibe that matches your mood. We'll curate the perfect
          destinations and experiences for your next journey.
        </p>
      </div>
      <div className="container">
        <div className={`columns is-multiline is-centered ${styles.vibesGrid}`}>
          {DETAILED_VIBES.map((vibe) => (
            <div key={vibe.id} className="column is-4-tablet is-4-desktop">
              <VibeCard
                vibe={vibe}
                isSelected={selectedVibe.id === vibe.id}
                onSelect={() => handleVibeSelect(vibe)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.detailsSection} ref={detailsRef}>
        <div className={styles.detailsCard}>
          <div className={styles.detailsImageWrapper}>
            <img
              src={selectedVibe.image}
              alt={selectedVibe.title}
              className={styles.detailsImage}
            />
            <div className={styles.detailsOverlay}></div>
          </div>
          <div className={styles.detailsContent}>
            <span className={styles.detailsEyebrow}>SELECTED EXPERIENCE</span>
            <h2 className={styles.detailsTitle}>
              {selectedVibe.emoji} {selectedVibe.title}
            </h2>
            <p className={styles.detailsText}>{selectedVibe.details}</p>
            <a
              href="#"
              onClick={handleStartPlanning}
              className={styles.detailsButton}
            >
              Start Planning <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
      <VibeSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        vibe={selectedVibe}
      />
    </div>
  );
}

export default VibesPage;
