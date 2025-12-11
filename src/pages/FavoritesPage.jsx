import { FaHeart, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';

function FavoritesPage() {
  const { favorites, removeFromFavorites, tripDetails } = useFavorites();

  const getPageTitle = () => {
    if (tripDetails?.name) {
      return tripDetails.name;
    }
    return "My Saved Trips";
  };

  const getPageSubtitle = () => {
    if (tripDetails?.startDate && tripDetails?.endDate) {
      const start = new Date(tripDetails.startDate).toLocaleDateString();
      const end = new Date(tripDetails.endDate).toLocaleDateString();
      return `Planned for ${start} - ${end} • ${favorites.length} places saved`;
    }
    return `Your personal collection of dream destinations. Keep track of the places that inspire you (${favorites.length}).`;
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>YOUR COLLECTION</span>
        <h1 className={styles.mainTitle}>{getPageTitle()}</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.mainSubtitle}>
          {getPageSubtitle()}
        </p>
      </div>

      <div className="container" style={{ padding: '0 20px' }}>
        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <FaHeart className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              No favorites yet
            </h3>
            <p className={styles.emptyText}>
              Go explore and save the places you love!
            </p>
          </div>
        ) : (
          <div className={styles.placesGrid}>
            {favorites.map(place => (
              <div key={place.id} className={styles.placeCard}>
                <div className={styles.imageWrapper}>
                  <img src={place.imageUrl} alt={place.name} className={styles.placeImage} />
                  <div className={styles.placeRating}>
                    <span>⭐ {place.rating}</span>
                  </div>
                  <button 
                    onClick={() => removeFromFavorites(place.id)}
                    className={styles.deleteButton}
                    title="Remove from favorites"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.placeName}>{place.name}</h3>
                  <div className={styles.placeLocation}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <span>{place.location}</span>
                  </div>
                  <div className={styles.tagsContainer}>
                    {place.vibe && <span className={styles.vibeTag}>{place.vibe}</span>}
                    <span className={styles.priceTag}>{place.priceLevel || '$$'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;

