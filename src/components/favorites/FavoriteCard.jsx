import {
  FaTrash,
  FaWalking,
  FaPhone,
  FaGlobe,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import styles from "../../styles/FavoritesPage.module.css";

function FavoriteCard({ place, onRemove }) {
  return (
    <div
      className={`${styles.placeCard} ${styles.favoriteCard}`}
    >
      <div className={`${styles.imageWrapper} ${styles.favoriteImageWrapper}`}>
        <img
          src={place.imageUrl}
          alt={place.name}
          className={styles.placeImage}
        />
        <div className={styles.placeRating}>
          <span>⭐ {place.rating}</span>
        </div>
        <button
          onClick={() => onRemove(place.id)}
          className={`button is-white is-rounded ${styles.favoriteRemoveButton}`}
          title="Remove from favorites"
        >
          <span className="icon is-small">
            <FaTrash size={12} />
          </span>
        </button>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.locationBadge}>
          <span className={styles.locationBadgeText}>
            {place.location?.split(",").slice(-2).join(", ") || place.location}
          </span>
        </div>

        <h3
          className={`${styles.placeName} ${styles.favoritePlaceName}`}
        >
          {place.name}
        </h3>

        <div
          className={styles.addressRow}
        >
          <FaMapMarkerAlt
            className={styles.addressIcon}
          />
          <span>{place.location}</span>
        </div>

        {place.description && (
          <p className={styles.placeDescription}>
            {place.description.length > 120
              ? place.description.substring(0, 120) + "..."
              : place.description}
          </p>
        )}

        <div
          className={`${styles.tagsContainer} ${styles.tagsContainerSpacing}`}
        >
          {place.vibe && <span className={styles.vibeTag}>{place.vibe}</span>}
          {place.distance && (
            <span
              className={styles.distanceTag}
            >
              <FaWalking size={10} /> {place.distance}
            </span>
          )}
        </div>

        <div
          className={styles.infoSection}
        >
          {place.phone && (
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <FaPhone className={styles.infoIconSvg} />
              </div>
              <a
                href={`tel:${place.phone}`}
                className={styles.infoLink}
              >
                {place.phone}
              </a>
            </div>
          )}

          {place.website && (
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <FaGlobe className={styles.infoIconSvg} />
              </div>
              <a
                href={
                  place.website.startsWith("http")
                    ? place.website
                    : `https://${place.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                Visit Website
              </a>
            </div>
          )}

          {place.openingHours && (
            <div className={styles.infoRow}>
              <div className={styles.infoIcon}>
                <FaClock className={styles.infoIconSvg} />
              </div>
              <span className={styles.infoText}>Open Now</span>
            </div>
          )}

          {place.lat && place.lon && (
            <div className={styles.mapLinkWrapper}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                View on Map →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FavoriteCard;
