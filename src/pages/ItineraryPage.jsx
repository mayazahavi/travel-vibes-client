import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoritesPage.module.css';
import { FaMapMarkerAlt, FaPlus, FaCalendarDay, FaCalendarAlt, FaTrash, FaMapPin, FaClock } from 'react-icons/fa';

function ItineraryPage() {
  const { favorites, assignPlaceToDay, tripDetails, updatePlaceTime } = useFavorites();
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

  const getDayDate = (dayIndex) => {
    if (!tripDetails?.startDate) return `Day ${dayIndex}`;
    const date = new Date(tripDetails.startDate);
    date.setDate(date.getDate() + (dayIndex - 1));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getLocationsSubtitle = () => {
    if (favorites.length === 0) return null;
    const locations = [...new Set(favorites.map(place => {
      if (place.city && place.country) return `${place.city}, ${place.country}`;
      if (!place.location) return '';
      const parts = place.location.split(',');
      if (parts.length >= 2) return parts.slice(-2).map(p => p.replace(/[0-9]/g, '').trim()).filter(p => p.length > 1).join(', ');
      return '';
    }))].filter(Boolean);

    if (locations.length === 0) return null;

    return (
      <div style={{ marginTop: '8px', fontSize: '1rem', color: '#0f172a', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <FaMapMarkerAlt style={{ color: '#0ea5e9' }} />
        <span>{locations.join(' • ')}</span>
      </div>
    );
  };

  const daysCount = getDaysCount();
  const days = Array.from({ length: daysCount }, (_, i) => i + 1);

  const unscheduledPlaces = favorites.filter(p => !p.assignedDay);
  const dayPlaces = favorites
    .filter(p => p.assignedDay === selectedDay)
    .sort((a, b) => {
      if (!a.assignedTime) return 1;
      if (!b.assignedTime) return -1;
      return a.assignedTime.localeCompare(b.assignedTime);
    });

  const handleAssign = (placeId) => {
    assignPlaceToDay(placeId, selectedDay);
  };

  const handleUnassign = (placeId) => {
    assignPlaceToDay(placeId, null);
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.headerSection} style={{ 
        padding: '100px 20px 30px 20px', 
        marginBottom: '20px',
        background: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.65)), url('https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        minHeight: 'auto'
      }}>
        <span className={styles.headerEyebrow} style={{ color: '#0f172a', fontWeight: '800', fontSize: '11px', marginBottom: '5px' }}>DAILY PLANNER</span>
        <h1 className={styles.mainTitle} style={{ marginBottom: '5px', color: '#000000', fontSize: '2rem' }}>
          {tripDetails?.name || "My Trip Itinerary"}
        </h1>
        <div className={styles.headerDivider} style={{ marginBottom: '10px', background: '#0f172a', height: '3px', width: '30px' }}></div>
        
        {tripDetails?.startDate && tripDetails?.endDate && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1e293b', fontWeight: '700', fontSize: '15px', marginBottom: '5px' }}>
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

      <div className="container" style={{ padding: '0 20px', maxWidth: '1400px', marginTop: '20px', position: 'relative', zIndex: 10 }}>
        
        {/* Main Planner Card */}
        <div className="card" style={{ borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          <div className="columns is-gapless mb-0">
            
            {/* Left Sidebar - Unscheduled */}
            <div className="column is-3" style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', minHeight: '800px' }}>
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 className="title is-6 is-uppercase mb-0" style={{ letterSpacing: '1px', fontSize: '0.8rem', color: '#0f172a', fontWeight: '700' }}>Unscheduled</h3>
                  <span className="tag is-rounded">{unscheduledPlaces.length}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {unscheduledPlaces.map(place => (
                    <div key={place.id} className="box p-3" style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', cursor: 'pointer', transition: 'transform 0.2s' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <img src={place.imageUrl} alt={place.name} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{place.name}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: '500' }}>{place.category?.split('.')[1] || 'Place'}</p>
                        </div>
                        <button 
                          className="button is-small is-info is-light is-rounded" 
                          onClick={() => handleAssign(place.id)}
                          style={{ height: '28px', width: '28px', padding: 0 }}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {unscheduledPlaces.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', opacity: 0.5 }}>
                      <FaMapPin size={24} className="mb-2" />
                      <p className="is-size-7">All places scheduled!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Main Content - Calendar View */}
            <div className="column is-9" style={{ background: 'white' }}>
              
              {/* Days Navigation Header */}
              <div style={{ padding: '20px 30px', borderBottom: '1px solid #e2e8f0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                <div className="buttons are-small" style={{ flexWrap: 'nowrap' }}>
                  {days.map(day => (
                    <button 
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`button is-rounded ${selectedDay === day ? 'is-info' : 'is-white'}`}
                      style={{ 
                        border: selectedDay === day ? 'none' : '1px solid #e2e8f0',
                        fontWeight: '600',
                        padding: '0 20px',
                        height: '36px',
                        boxShadow: selectedDay === day ? '0 4px 10px rgba(14, 165, 233, 0.3)' : 'none'
                      }}
                    >
                      <span>Day {day}</span>
                      <span style={{ marginLeft: '8px', opacity: 0.7, fontWeight: '400' }}>
                        {getDayDate(day)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Content */}
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h2 className="title is-4 mb-1" style={{ color: '#000000', fontWeight: '800' }}>Day {selectedDay}</h2>
                    <p className="subtitle is-6" style={{ color: '#334155', fontWeight: '500' }}>{getDayDate(selectedDay)} • {dayPlaces.length} Activities</p>
                  </div>
                </div>

                {dayPlaces.length === 0 ? (
                  <div style={{ 
                    border: '2px dashed #e2e8f0', 
                    borderRadius: '20px', 
                    padding: '60px', 
                    textAlign: 'center',
                    background: '#f8fafc'
                  }}>
                    <div style={{ width: '64px', height: '64px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#94a3b8' }}>
                      <FaCalendarDay size={24} />
                    </div>
                    <h3 className="title is-6 has-text-grey">Your schedule is empty</h3>
                    <p className="subtitle is-7 has-text-grey-light">Start building your day by adding places from the sidebar.</p>
                  </div>
                ) : (
                  <div className="timeline-container" style={{ paddingLeft: '20px' }}>
                    {dayPlaces.map((place, index) => (
                      <div key={place.id} style={{ display: 'flex', marginBottom: '30px', position: 'relative' }}>
                        
                        {/* Timeline Line & Dot */}
                        <div style={{ 
                          position: 'absolute', 
                          left: '-29px', 
                          top: '0', 
                          bottom: index === dayPlaces.length - 1 ? 'auto' : '-30px', 
                          width: '2px', 
                          background: '#e2e8f0' 
                        }}></div>
                        <div style={{ 
                          position: 'absolute', 
                          left: '-35px', 
                          top: '0', 
                          width: '14px', 
                          height: '14px', 
                          borderRadius: '50%', 
                          background: '#0ea5e9', 
                          border: '3px solid white', 
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
                        }}></div>

                        {/* Time Slot (Real) */}
                        <div style={{ width: '85px', flexShrink: 0, paddingTop: '0', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', position: 'relative' }}>
                          <div style={{ 
                            background: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '8px', 
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'border-color 0.2s'
                          }}>
                            <input 
                              type="time" 
                              value={place.assignedTime || ''}
                              onChange={(e) => updatePlaceTime(place.id, e.target.value)}
                              style={{
                                border: 'none',
                                outline: 'none',
                                color: '#475569',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                                width: '100%',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                textAlign: 'center'
                              }}
                            />
                          </div>
                          {!place.assignedTime && (
                            <span style={{
                              fontSize: '0.7rem', 
                              color: '#cbd5e1', 
                              display: 'block', 
                              marginTop: '4px', 
                              textAlign: 'center',
                              fontWeight: '500'
                            }}>
                              Set Time
                            </span>
                          )}
                        </div>

                        {/* Activity Card */}
                        <div className="card" style={{ flex: 1, borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: '120px', position: 'relative' }}>
                            <img src={place.imageUrl} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <div style={{ flex: 1, padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <h4 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#000000', marginBottom: '5px' }}>{place.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.85rem', fontWeight: '500' }}>
                                  <FaMapMarkerAlt size={12} style={{ color: '#0ea5e9' }} />
                                  <span>{place.location?.split(',')[0]}</span>
                                </div>
                                {place.openingHours && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.75rem', marginTop: '8px', fontWeight: '600' }}>
                                    <FaClock size={10} />
                                    <span>Open</span>
                                  </div>
                                )}
                              </div>
                              <button 
                                className="button is-small is-white is-rounded"
                                onClick={() => handleUnassign(place.id)}
                                style={{ color: '#ef4444', border: '1px solid #fee2e2' }}
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
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
    </div>
  );
}

export default ItineraryPage;
