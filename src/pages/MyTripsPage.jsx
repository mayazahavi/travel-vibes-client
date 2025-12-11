import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSuitcase, FaCalendarAlt, FaTrash, FaPlus, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';
import { VIBE_IMAGES } from '../constants/vibes';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function MyTripsPage() {
  const { trips, selectTrip, deleteTrip } = useFavorites();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tripId: null });

  const handleTripSelect = (tripId) => {
    selectTrip(tripId);
    navigate('/favorites');
  };

  const handleDeleteClick = (e, tripId) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, tripId });
  };

  const confirmDelete = () => {
    if (deleteModal.tripId) {
      deleteTrip(deleteModal.tripId);
      setDeleteModal({ isOpen: false, tripId: null });
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

      <div className="container" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div className="level mb-5">
            <div className="level-left">
                <p className="level-item">
                    <strong className="title is-4 has-text-grey-dark">
                        {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Planned
                    </strong>
                </p>
            </div>
            <div className="level-right">
                <button 
                    onClick={() => navigate('/create-trip')}
                    className="button is-info is-rounded" 
                    style={{ 
                    boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                    fontWeight: '600'
                    }}
                >
                    <span className="icon">
                        <FaPlus />
                    </span>
                    <span>Plan New Trip</span>
                </button>
            </div>
        </div>

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <FaSuitcase className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No trips planned yet</h3>
            <p className={styles.emptyText}>Start planning your next dream vacation!</p>
            <button 
                onClick={() => navigate('/create-trip')}
                className="button is-info is-rounded mt-4"
            >
                Start Planning
            </button>
          </div>
        ) : (
          <div className="columns is-multiline">
            {trips.map(trip => (
              <div key={trip.id} className="column is-12-mobile is-6-tablet is-4-desktop">
                  <div 
                    className="card h-100" 
                    onClick={() => handleTripSelect(trip.id)}
                    style={{ 
                        borderRadius: '16px', 
                        overflow: 'hidden', 
                        border: 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
                    }}
                  >
                    <div className="card-image" style={{ position: 'relative' }}>
                      <figure className="image is-2by1">
                        <img 
                          src={VIBE_IMAGES[trip.vibe] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80"} 
                          alt={trip.vibe}
                          style={{ objectFit: 'cover', height: '200px' }}
                        />
                      </figure>
                      <div className="tags" style={{ position: 'absolute', top: '15px', left: '15px' }}>
                          <span className="tag is-white is-medium is-rounded has-text-weight-bold" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                              <span className="icon has-text-danger mr-1"><FaMapMarkerAlt /></span>
                              {trip.favorites?.length || 0} Places
                          </span>
                      </div>
                      <button 
                        onClick={(e) => handleDeleteClick(e, trip.id)}
                        className="button is-danger is-light is-rounded"
                        title="Delete Trip"
                        style={{ 
                            position: 'absolute', 
                            top: '15px', 
                            right: '15px', 
                            height: '36px',
                            width: '36px',
                            padding: 0,
                            border: '1px solid rgba(255, 56, 96, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span className="icon is-small">
                          <FaTrash />
                        </span>
                      </button>
                    </div>
                    
                    <div className="card-content" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                      <div className="media mb-3">
                        <div className="media-content">
                          <p className="title is-5 mb-2" style={{ fontWeight: '700' }}>{trip.name}</p>
                          <div className="tags are-small">
                              {trip.vibe && (
                                  <span className="tag is-info is-light">
                                      {trip.vibe} Vibe
                                  </span>
                              )}
                          </div>
                        </div>
                      </div>

                      <div className="content mb-4" style={{ flex: '1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                            <FaCalendarAlt className="mr-2" />
                            <span>
                                {trip.startDate && new Date(trip.startDate).toLocaleDateString()} 
                                {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                            </span>
                        </div>
                      </div>

                      <button 
                        className="button is-info is-fullwidth is-rounded has-text-weight-bold shadow-sm"
                        style={{ 
                          marginTop: 'auto', 
                          transition: 'all 0.2s',
                          border: 'none',
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                          boxShadow: '0 4px 6px rgba(14, 165, 233, 0.25)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 6px 12px rgba(14, 165, 233, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 6px rgba(14, 165, 233, 0.25)';
                        }}
                      >
                        <span style={{ color: 'white' }}>View Trip Details</span>
                        <span className="icon is-small ml-2" style={{ color: 'white' }}>
                            <FaArrowRight />
                        </span>
                      </button>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
        
        <DeleteConfirmationModal 
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, tripId: null })}
          onConfirm={confirmDelete}
          title="Delete Trip?"
          message="Are you sure you want to remove this trip? All saved places for this trip will be lost."
        />
      </div>
    </div>
  );
}

export default MyTripsPage;
