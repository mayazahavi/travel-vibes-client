import { useNavigate } from 'react-router-dom';
import { FaSuitcase, FaCalendarAlt, FaTrash, FaPlus, FaArrowRight } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';

function MyTripsPage() {
  const { trips, selectTrip, deleteTrip } = useFavorites();
  const navigate = useNavigate();

  const handleTripSelect = (tripId) => {
    selectTrip(tripId);
    navigate('/favorites');
  };

  const handleDeleteTrip = (e, tripId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this trip?')) {
      deleteTrip(tripId);
    }
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection}>
        <span className={styles.headerEyebrow}>YOUR ADVENTURES</span>
        <h1 className={styles.mainTitle}>My Trips</h1>
        <div className={styles.headerDivider}></div>
        <p className={styles.mainSubtitle}>
          Manage all your planned journeys in one place.
        </p>
      </div>

      <div className="container" style={{ padding: '0 20px', maxWidth: '1000px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
          <button 
            onClick={() => navigate('/create-trip')}
            className={styles.detailsButton} 
            style={{ 
              background: '#0ea5e9', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '50px', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
            }}
          >
            <FaPlus /> Plan New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <FaSuitcase className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No trips planned yet</h3>
            <p className={styles.emptyText}>Start planning your next dream vacation!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
            {trips.map(trip => (
              <div 
                key={trip.id} 
                className={styles.placeCard} 
                onClick={() => handleTripSelect(trip.id)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div className={styles.imageWrapper} style={{ height: '160px' }}>
                  {/* Using a generic travel image or the first favorite place image if available */}
                  <img 
                    src={trip.favorites?.[0]?.imageUrl || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"} 
                    alt={trip.name} 
                    className={styles.placeImage} 
                  />
                  <div className={styles.placeRating} style={{ top: '10px', left: '10px', fontSize: '12px' }}>
                    <span>{trip.favorites?.length || 0} Places</span>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteTrip(e, trip.id)}
                    className={styles.deleteButton}
                    title="Delete Trip"
                    style={{ top: '10px', right: '10px', width: '30px', height: '30px' }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                
                <div className={styles.cardContent}>
                  <h3 className={styles.placeName} style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{trip.name}</h3>
                  
                  <div className={styles.placeLocation} style={{ marginBottom: '8px' }}>
                    <FaCalendarAlt className={styles.locationIcon} />
                    <span>
                      {trip.startDate && new Date(trip.startDate).toLocaleDateString()} 
                      {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                    </span>
                  </div>

                  <div className={styles.tagsContainer} style={{ marginTop: 'auto', paddingTop: '15px' }}>
                     <span className={styles.vibeTag} style={{ background: '#e0f2fe', color: '#0ea5e9' }}>
                       {trip.vibe || 'General'}
                     </span>
                     <span style={{ marginLeft: 'auto', color: '#0ea5e9', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px', fontWeight: '600' }}>
                       View <FaArrowRight size={12} />
                     </span>
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

export default MyTripsPage;

