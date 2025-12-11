import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  // Array of all trips
  const [trips, setTrips] = useState([]);
  
  // ID of the currently active trip (the one being edited/viewed)
  const [currentTripId, setCurrentTripId] = useState(null);

  // Helper to get the current active trip object
  const currentTrip = trips.find(t => t.id === currentTripId) || null;

  // Create a new trip and set it as active
  const createTrip = (details) => {
    const newTrip = {
      id: Date.now().toString(), // Simple unique ID
      ...details,
      favorites: [], // Each trip has its own favorites list
      createdAt: new Date().toISOString()
    };
    
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripId(newTrip.id);
    return newTrip.id;
  };

  // Add a place to the current active trip
  const addToFavorites = (place) => {
    if (!currentTripId) return; // No active trip selected

    setTrips(prev => prev.map(trip => {
      if (trip.id === currentTripId) {
        if (trip.favorites.find(p => p.id === place.id)) return trip;
        return { ...trip, favorites: [...trip.favorites, place] };
      }
      return trip;
    }));
  };

  // Remove a place from the current active trip
  const removeFromFavorites = (placeId) => {
    if (!currentTripId) return;

    setTrips(prev => prev.map(trip => {
      if (trip.id === currentTripId) {
        return { ...trip, favorites: trip.favorites.filter(p => p.id !== placeId) };
      }
      return trip;
    }));
  };

  // Check if a place is in the current active trip
  const isFavorite = (placeId) => {
    return currentTrip?.favorites.some(p => p.id === placeId) || false;
  };

  // Delete an entire trip
  const deleteTrip = (tripId) => {
    setTrips(prev => prev.filter(t => t.id !== tripId));
    if (currentTripId === tripId) {
      setCurrentTripId(null);
    }
  };

  // Switch active trip
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
    // Maintaining these names for backward compatibility with components, 
    // but they now operate on the *current active trip*
    favorites: currentTrip?.favorites || [], 
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    // Alias for backward compatibility
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
