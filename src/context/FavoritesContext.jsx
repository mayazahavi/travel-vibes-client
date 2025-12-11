import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [trips, setTrips] = useState([]);
  const [currentTripId, setCurrentTripId] = useState(null);
  const currentTrip = trips.find(t => t.id === currentTripId) || null;
  const createTrip = (details) => {
    const newTrip = {
      id: Date.now().toString(), 
      ...details,
      favorites: [], 
      createdAt: new Date().toISOString()
    };
    
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripId(newTrip.id);
    return newTrip.id;
  };

 
  const addToFavorites = (place) => {
    if (!currentTripId) return; 

    setTrips(prev => prev.map(trip => {
      if (trip.id === currentTripId) {
        if (trip.favorites.find(p => p.id === place.id)) return trip;
        return { ...trip, favorites: [...trip.favorites, place] };
      }
      return trip;
    }));
  };

  const removeFromFavorites = (placeId) => {
    if (!currentTripId) return;

    setTrips(prev => prev.map(trip => {
      if (trip.id === currentTripId) {
        return { ...trip, favorites: trip.favorites.filter(p => p.id !== placeId) };
      }
      return trip;
    }));
  };

  const isFavorite = (placeId) => {
    return currentTrip?.favorites.some(p => p.id === placeId) || false;
  };

  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (currentTripId === tripId) {
      setCurrentTripId(null);
    }
  };
  const selectTrip = (tripId) => {
    setCurrentTripId(tripId);
  };

  const value = {
    trips,
    currentTrip,
    currentTripId,
    createTrip,
    deleteTrip,
    selectTrip,

    favorites: currentTrip?.favorites || [], 
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    saveTripDetails: createTrip, 
    tripDetails: currentTrip
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
