import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaClock,
  FaStar,
  FaWalking,
} from "react-icons/fa";

function PlaceCard({ place, favorites, onToggleFavorite, styles }) {
  const isFavorite = favorites.find((p) => p.id === place.id);

  return (
    <div className={styles.placeCard}>
      <div className={styles.placeImageWrapper}>
        <img src={place.image} alt={place.name} className={styles.placeImage} />
        <button
          className={`${styles.likeButton} ${isFavorite ? styles.liked : ""}`}
          onClick={() => onToggleFavorite(place)}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
        {place.rating && (
          <div className={styles.ratingBadge}>
            <FaStar /> {place.rating}
          </div>
        )}
      </div>
      <div className={styles.placeContent}>
        <h3 className={styles.placeName}>{place.name}</h3>
        <p className={styles.placeAddress}>
          <FaMapMarkerAlt className={styles.icon} /> {place.address}
        </p>
        <div className={styles.categoryRow}>
          <span className={styles.placeCategory}>
            {place.category.split(".")[1] || place.category}
          </span>
          <span className={styles.distanceBadge}>
            <FaWalking /> {place.distance}
          </span>
        </div>
        <div className={styles.contactInfo}>
          {place.phone && (
            <a href={`tel:${place.phone}`} className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>{place.phone}</span>
            </a>
          )}
          {place.website && (
            <a
              href={
                place.website.startsWith("http")
                  ? place.website
                  : `https://${place.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <FaGlobe className={styles.contactIcon} />
              <span>Visit Website</span>
            </a>
          )}
          {place.openingHours && (
            <div className={styles.contactItem}>
              <FaClock className={styles.contactIcon} />
              <span>Open Now</span>
            </div>
          )}
        </div>
        {place.description && (
          <p className={styles.placeDescription}>
            {place.description.substring(0, 100)}
            {place.description.length > 100 && "..."}
          </p>
        )}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewMapLink}
        >
          View on Map →
        </a>
      </div>
    </div>
  );
}

export default PlaceCard;
