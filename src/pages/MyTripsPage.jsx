import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlaneDeparture, FaCalendarAlt, FaTrash, FaPlus, FaMapMarkerAlt, FaArrowRight, FaUserFriends } from 'react-icons/fa';
// import { useFavorites } from '../context/FavoritesContext'; // Removing Context
import { 
  selectTrips, 
  setCurrentTrip, 
  deleteTrip 
} from '../store/slices/tripsSlice';
import styles from '../styles/FavoritesPage.module.css';
import { VIBE_IMAGES } from '../constants/vibes';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function MyTripsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux Selectors
  const trips = useSelector(selectTrips);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, tripId: null });

  const handleTripSelect = (tripId) => {
    dispatch(setCurrentTrip(tripId));
    navigate('/favorites');
  };

  const handleTripSchedule = (e, tripId) => {
    e.stopPropagation();
    dispatch(setCurrentTrip(tripId));
    navigate('/itinerary');
  };

  const handleDeleteClick = (e, tripId) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, tripId });
  };

  const confirmDelete = () => {
    if (deleteModal.tripId) {
      dispatch(deleteTrip(deleteModal.tripId));
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
        <button 
          onClick={() => navigate('/create-trip')}
          className="button is-info is-rounded"
          style={{ 
            marginTop: '25px',
            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)',
            fontWeight: '600',
            border: 'none',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            height: '48px',
            paddingLeft: '24px',
            paddingRight: '24px'
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
          <span>Plan New Trip</span>
        </button>
      </div>

      <div className="container" style={{ padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div className="level mb-5">
            <div className="level-left">
                <p className="level-item">
                    <strong className="title is-4 has-text-grey-dark" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaPlaneDeparture style={{ color: '#0ea5e9' }} />
                        {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Planned
                    </strong>
                </p>
            </div>
        </div>

        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <FaPlaneDeparture className={styles.emptyIcon} />
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
                        className="button is-white is-rounded"
                        title="Delete Trip"
                        style={{ 
                            position: 'absolute', 
                            top: '15px', 
                            right: '15px', 
                            height: '32px',
                            width: '32px',
                            padding: 0,
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            color: '#ef4444',
                            transition: 'all 0.2s ease',
                            zIndex: 5
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#fee2e2';
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <span className="icon is-small">
                          <FaTrash size={12} />
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
                        <div style={{ display: 'flex', alignItems: 'center', color: '#64748b', marginBottom: '8px' }}>
                            <FaCalendarAlt className="mr-2" style={{ color: '#0ea5e9' }} />
                            <span style={{ fontSize: '0.9rem' }}>
                                {trip.startDate && new Date(trip.startDate).toLocaleDateString()} 
                                {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                            </span>
                        </div>
                        {trip.travelers && (
                          <div style={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
                              <FaUserFriends className="mr-2" style={{ color: '#0ea5e9' }} />
                              <span style={{ fontSize: '0.9rem' }}>
                                  {trip.travelers} {parseInt(trip.travelers) === 1 ? 'Traveler' : 'Travelers'}
                              </span>
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                        <button 
                          onClick={() => handleTripSelect(trip.id)}
                          className="button is-white is-rounded has-text-weight-bold"
                          style={{ 
                            flex: 1, 
                            border: '1px solid #e2e8f0', 
                            color: '#64748b',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#cbd5e1';
                            e.currentTarget.style.color = '#334155';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.color = '#64748b';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <span className="icon is-small mr-1">
                            <FaMapMarkerAlt />
                          </span>
                          <span style={{ fontSize: '0.9rem' }}>Places</span>
                        </button>
                        <button 
                          onClick={(e) => handleTripSchedule(e, trip.id)}
                          className="button is-info is-rounded has-text-weight-bold shadow-sm"
                          style={{ 
                            flex: 1,
                            border: 'none',
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                            boxShadow: '0 4px 6px rgba(14, 165, 233, 0.2)'
                          }}
                        >
                          <span style={{ color: 'white', fontSize: '0.9rem' }}>Schedule</span>
                          <span className="icon is-small ml-2" style={{ color: 'white' }}>
                              <FaArrowRight />
                          </span>
                        </button>
                      </div>
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
