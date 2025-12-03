import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import VibeCard from "../components/VibeCard.jsx";
import styles from "../styles/VibesPage.module.css";

const vibeImages = {
  foodie: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80",
  culture: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
  nature: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
  urban: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1000&q=80",
  romantic: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=1000&q=80",
  nightlife: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1000&q=80"
};

const vibes = [
  {
    id: "foodie",
    title: "Foodie Vibe",
    emoji: "🍽️",
    short: "Restaurants, cafes, street food & markets.",
    details: "Perfect for travelers who love local flavors, cozy cafes, pubs and food markets. Experience the world through its cuisine.",
    image: vibeImages.foodie
  },
  {
    id: "culture",
    title: "Culture Seeker",
    emoji: "🏛️",
    short: "Museums, art, history & national sites.",
    details: "Great for people who enjoy museums, galleries, historical sites, temples and cultural shows. Dive deep into heritage.",
    image: vibeImages.culture
  },
  {
    id: "nature",
    title: "Nature Explorer",
    emoji: "🏞️",
    short: "Mountains, beaches, forests & national parks.",
    details: "Ideal for hiking, viewpoints, waterfalls, beaches and big green parks. Connect with the great outdoors.",
    image: vibeImages.nature
  },
  {
    id: "urban",
    title: "Urban Adventure",
    emoji: "🌆",
    short: "Shopping, markets & city lifestyle.",
    details: "For travelers who love city vibes, shopping malls, old streets and lifestyle areas. Discover the city's hidden gems.",
    image: vibeImages.urban
  },
  {
    id: "romantic",
    title: "Romantic Escape",
    emoji: "💑",
    short: "Sunsets, promenades & viewpoints.",
    details: "Perfect for couples looking for quiet beaches, gardens, promenades and sunset spots. Create unforgettable moments together.",
    image: vibeImages.romantic
  },
  {
    id: "nightlife",
    title: "Nightlife & Fun",
    emoji: "🎉",
    short: "Bars, clubs, pubs & live music.",
    details: "For those who want bars, pubs, live music venues and fun night experiences. Experience the city after dark.",
    image: vibeImages.nightlife
  }
];

function VibesPage() {
  const [selectedVibe, setSelectedVibe] = useState(vibes[0]);
  const detailsRef = useRef(null);

  const handleVibeSelect = (vibe) => {
    setSelectedVibe(vibe);
  };

  return (
    <div className={styles.vibesPage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>DISCOVER YOUR STYLE</span>
        <h1 className={styles.mainTitle}>Choose Your Travel Vibe</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.mainSubtitle}>
          Select a vibe that matches your mood. We'll curate the perfect destinations and experiences for your next journey.
        </p>
      </div>
      <div className="container">
        <div className={`columns is-multiline is-centered ${styles.vibesGrid}`}>
          {vibes.map((vibe) => (
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
            <img src={selectedVibe.image} alt={selectedVibe.title} className={styles.detailsImage} />
            <div className={styles.detailsOverlay}></div>
          </div>
          <div className={styles.detailsContent}>
            <span className={styles.detailsEyebrow}>SELECTED EXPERIENCE</span>
            <h2 className={styles.detailsTitle}>
              {selectedVibe.emoji} {selectedVibe.title}
            </h2>
            <p className={styles.detailsText}>
              {selectedVibe.details}
            </p>
            <Link to={`/create-trip?vibe=${selectedVibe.id}`} className={styles.detailsButton}>
              Start Planning <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VibesPage;
