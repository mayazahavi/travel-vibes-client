/* Reusing styles from module */
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaTrash, FaWalking, FaPhone, FaGlobe, FaClock, FaPlus, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';

function FavoritesPage() {
  const { favorites, removeFromFavorites, tripDetails } = useFavorites();
  const navigate = useNavigate();

  const handleAddMore = () => {
    const vibeParam = tripDetails?.vibe ? `?vibe=${tripDetails.vibe}` : '';
    navigate(`/explore${vibeParam}`);
  };

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
      return `Planned for ${start} - ${end}`;
    }
    return `Your personal collection of dream destinations.`;
  };

  const getLocationsSubtitle = () => {
    if (favorites.length === 0) return null;
    const locations = [...new Set(favorites.map(place => {
      if (place.city && place.country) {
        return `${place.city}, ${place.country}`;
      }

      if (!place.location) return '';

      const parts = place.location.split(',');
      let relevantParts = parts;

      if (parts.length >= 2) {
        relevantParts = parts.slice(-2);
      }

      const cleanLocation = relevantParts
        .map(part => part.replace(/[0-9]/g, '').trim())
        .filter(part => part.length > 1)
        .join(', ');

      return cleanLocation;
    }))].filter(Boolean);

    if (locations.length === 0) return null;

    return (
      <div style={{ marginTop: '8px', fontSize: '1rem', color: '#64748b', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <FaMapMarkerAlt style={{ color: '#0ea5e9' }} />
        <span>{locations.join(' • ')}</span>
      </div>
    );
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection} style={{ padding: '100px 20px 40px 20px' }}>
        <span className={styles.headerEyebrow}>TRIP ITINERARY</span>
        <h1 className={styles.mainTitle} style={{ marginBottom: '10px' }}>{getPageTitle()}</h1>
        <div className={styles.headerDivider} style={{ marginBottom: '15px' }}></div>

        {tripDetails?.startDate && tripDetails?.endDate && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', marginBottom: '5px' }}>
            <FaCalendarAlt style={{ color: '#0ea5e9' }} />
            <span>
              {new Date(tripDetails.startDate).toLocaleDateString()} - {new Date(tripDetails.endDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {getLocationsSubtitle()}

        <div style={{ marginTop: '25px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={handleAddMore}
            className="button is-info is-rounded"
            style={{ 
              boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
              fontWeight: '600',
              border: 'none',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              paddingLeft: '24px',
              paddingRight: '24px',
              height: '48px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(14, 165, 233, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.4)';
            }}
          >
            <span className="icon">
              <FaPlus />
            </span>
            <span>Add More Places</span>
          </button>

          <button 
            onClick={() => navigate('/my-trips')}
            className="button is-white is-rounded"
            style={{ 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              fontWeight: '600',
              border: '1px solid #e2e8f0',
              color: '#64748b',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              paddingLeft: '24px',
              paddingRight: '24px',
              height: '48px',
              display: 'inline-flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <span className="icon">
              <FaArrowLeft />
            </span>
            <span>All Trips</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {favorites.length > 0 && (
          <div className="level mb-5">
            <div className="level-left">
              <p className="level-item">
                <strong className="title is-4 has-text-grey-dark" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaHeart style={{ color: '#ef4444' }} />
                  {favorites.length} {favorites.length === 1 ? 'Place' : 'Places'} Saved
                </strong>
              </p>
            </div>
          </div>
        )}

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
          <div className="columns is-multiline is-mobile">
            {favorites.map(place => (
              <div key={place.id} className="column is-12-mobile is-6-tablet is-4-desktop is-3-widescreen">
                <div className={styles.placeCard} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className={styles.imageWrapper} style={{ height: '180px' }}>
                    <img src={place.imageUrl} alt={place.name} className={styles.placeImage} />
                    <div className={styles.placeRating}>
                      <span>⭐ {place.rating}</span>
                    </div>
                    <button
                      onClick={() => removeFromFavorites(place.id)}
                      className="button is-danger is-light is-rounded"
                      title="Remove from favorites"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        height: '36px',
                        width: '36px',
                        padding: 0,
                        border: '1px solid rgba(255, 56, 96, 0.2)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 10
                      }}
                    >
                      <span className="icon is-small">
                        <FaTrash />
                      </span>
                    </button>
                  </div>
                  <div className={styles.cardContent}>
                    {/* Location Badge */}
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: '#0ea5e9',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {place.location?.split(',').slice(-2).join(', ') || place.location}
                      </span>
                    </div>

                    {/* Place Name */}
                    <h3 className={styles.placeName} style={{ marginBottom: '12px', fontSize: '1.25rem' }}>
                      {place.name}
                    </h3>

                    {/* Full Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      <FaMapMarkerAlt style={{ color: '#0ea5e9', marginTop: '3px', flexShrink: 0 }} />
                      <span>{place.location}</span>
                    </div>

                    {/* Description */}
                    {place.description && (
                      <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '15px', lineHeight: '1.5' }}>
                        {place.description.length > 120 ? place.description.substring(0, 120) + '...' : place.description}
                      </p>
                    )}

                    {/* Tags Row */}
                    <div className={styles.tagsContainer} style={{ marginBottom: '20px' }}>
                      {place.vibe && <span className={styles.vibeTag}>{place.vibe}</span>}
                      {place.distance && (
                        <span style={{
                          background: '#f8fafc',
                          color: '#64748b',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <FaWalking size={10} /> {place.distance}
                        </span>
                      )}
                    </div>

                    {/* Info Section */}
                    <div style={{
                      marginTop: 'auto',
                      paddingTop: '15px',
                      borderTop: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {place.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                          <div style={{ width: '24px', height: '24px', background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaPhone style={{ color: '#0ea5e9', fontSize: '10px' }} />
                          </div>
                          <a href={`tel:${place.phone}`} style={{ color: '#64748b', textDecoration: 'none' }}>{place.phone}</a>
                        </div>
                      )}

                      {place.website && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                          <div style={{ width: '24px', height: '24px', background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaGlobe style={{ color: '#0ea5e9', fontSize: '10px' }} />
                          </div>
                          <a
                            href={place.website.startsWith('http') ? place.website : `https://${place.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '500' }}
                          >
                            Visit Website
                          </a>
                        </div>
                      )}

                      {place.openingHours && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                          <div style={{ width: '24px', height: '24px', background: '#f0f9ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaClock style={{ color: '#0ea5e9', fontSize: '10px' }} />
                          </div>
                          <span style={{ color: '#64748b' }}>Open Now</span>
                        </div>
                      )}

                      {place.lat && place.lon && (
                        <div style={{ marginTop: '5px' }}>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: '#0ea5e9',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            View on Map →
                          </a>
                        </div>
                      )}
                    </div>
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
