import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';
import { FaMapMarkerAlt, FaPlus, FaCalendarDay, FaCalendarAlt, FaTrash } from 'react-icons/fa';

function ItineraryPage() {
  const { favorites, assignPlaceToDay, tripDetails } = useFavorites();
  const [selectedDay, setSelectedDay] = useState(1);
  const navigate = useNavigate();

  const getDaysCount = () => {
    if (!tripDetails?.startDate || !tripDetails?.endDate) return 3; 
    const start = new Date(tripDetails.startDate);
    const end = new Date(tripDetails.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
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

  const daysCount = getDaysCount();
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const unscheduledPlaces = favorites.filter(p => !p.assignedDay);
  const dayPlaces = favorites.filter(p => p.assignedDay === selectedDay);

  const handleAssign = (placeId) => {
    assignPlaceToDay(placeId, selectedDay);
  };

  const handleUnassign = (placeId) => {
    assignPlaceToDay(placeId, null);
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection} style={{ padding: '100px 20px 120px 20px', backgroundSize: 'cover' }}>
        <span className={styles.headerEyebrow}>DAILY PLANNER</span>
        <h1 className={styles.mainTitle} style={{ marginBottom: '10px' }}>
          {tripDetails?.name || "My Trip Itinerary"}
        </h1>
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

        <div style={{ marginTop: '25px' }}>
          <button 
            onClick={() => navigate('/favorites')}
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
          >
            <span className="icon">
              <FaMapMarkerAlt />
            </span>
            <span>Back to Favorites</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ padding: '0 20px', maxWidth: '1400px', marginTop: '-80px', position: 'relative', zIndex: 10 }}>
        <div className="columns" style={{ marginTop: '0' }}>
          <div className="column is-3">
            <div className="panel is-info" style={{ height: '100%', minHeight: '80vh', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <p className="panel-heading" style={{ background: '#f8fafc', color: '#0f172a', borderBottom: '1px solid #e2e8f0', fontSize: '1rem', fontWeight: '700', borderRadius: '16px 16px 0 0' }}>
                Unscheduled ({unscheduledPlaces.length})
              </p>
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '75vh', overflowY: 'auto' }}>
                {unscheduledPlaces.map(place => (
                  <div key={place.id} className="box p-2" style={{ marginBottom: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <img src={place.imageUrl} alt={place.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h4>
                      <button 
                        className="button is-small is-info is-light is-rounded" 
                        style={{ fontSize: '0.7rem', height: '22px', padding: '0 10px', width: '100%' }}
                        onClick={() => handleAssign(place.id)}
                      >
                        <FaPlus size={8} className="mr-1" /> Add to Day {selectedDay}
                      </button>
                    </div>
                  </div>
                ))}
                {unscheduledPlaces.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8' }}>
                    <FaMapMarkerAlt size={24} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <p className="is-size-7">All places scheduled!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="column is-9">
            <div className="tabs is-toggle is-fullwidth is-rounded mb-5" style={{ background: 'white', padding: '5px', borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
              <ul>
                {days.map(day => (
                  <li key={day} className={selectedDay === day ? 'is-active' : ''}>
                    <a 
                      onClick={() => setSelectedDay(day)} 
                      style={{ 
                        background: selectedDay === day ? '#0ea5e9' : 'transparent', 
                        borderColor: 'transparent',
                        color: selectedDay === day ? 'white' : '#64748b',
                        borderRadius: '50px',
                        transition: 'all 0.2s ease',
                        fontWeight: selectedDay === day ? '700' : '500'
                      }}
                    >
                      <span className="icon is-small"><FaCalendarDay /></span>
                      <span>Day {day}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="box" style={{ 
              minHeight: '70vh', 
              background: '#f0f9ff', 
              borderRadius: '20px', 
              padding: '30px', 
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.05)',
              border: '1px solid #e0f2fe'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid rgba(14, 165, 233, 0.1)' }}>
                <h3 className="title is-4 mb-0" style={{ color: '#0f172a' }}>Day {selectedDay} Itinerary</h3>
                <span className="tag is-info is-light is-rounded">{dayPlaces.length} Activities</span>
              </div>
              
              {dayPlaces.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b', background: 'white', borderRadius: '16px', border: '2px dashed #bae6fd', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                    <FaCalendarAlt size={32} style={{ color: '#0ea5e9' }} />
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>Empty Schedule</h4>
                  <p className="is-size-6 mt-2">Drag or add places from the sidebar to plan this day.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '20px' }}>
                  {/* Timeline Line */}
                  <div style={{ position: 'absolute', left: '0', top: '20px', bottom: '20px', width: '2px', background: '#bae6fd', borderRadius: '2px' }}></div>
                  
                  {dayPlaces.map((place, index) => (
                    <div key={place.id} className="card" style={{ display: 'flex', overflow: 'hidden', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'all 0.2s ease', position: 'relative' }}>
                      {/* Timeline Dot */}
                      <div style={{ position: 'absolute', left: '-26px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', background: '#0ea5e9', borderRadius: '50%', border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}></div>
                      
                      <div style={{ width: '140px', position: 'relative' }}>
                        <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className="tag is-light is-info" style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: '600', borderRadius: '8px' }}>
                              Activity #{index + 1}
                            </span>
                            <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: '#0f172a', marginBottom: '5px' }}>{place.name}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                              <FaMapMarkerAlt size={12} style={{ color: '#0ea5e9' }} />
                              <span>{place.location?.split(',')[0] || place.location}</span>
                            </div>
                          </div>
                          <button 
                            className="button is-small is-white is-rounded"
                            title="Remove from day"
                            onClick={() => handleUnassign(place.id)}
                            style={{ height: '32px', width: '32px', padding: 0, color: '#ef4444', border: '1px solid #fee2e2' }}
                          >
                            <span className="icon is-small"><FaTrash size={12} /></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItineraryPage;

