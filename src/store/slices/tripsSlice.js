import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trips: [],
  currentTripId: null,
};

export const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    createTrip: (state, action) => {
      const newTrip = {
        id: Date.now().toString(),
        ...action.payload,
        favorites: [],
        createdAt: new Date().toISOString()
      };
      state.trips.push(newTrip);
      state.currentTripId = newTrip.id;
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter(trip => trip.id !== action.payload);
      if (state.currentTripId === action.payload) {
        state.currentTripId = null;
      }
    },
    setCurrentTrip: (state, action) => {
      state.currentTripId = action.payload;
    },
    addToFavorites: (state, action) => {
      let targetTripId = state.currentTripId;

      if (!targetTripId) {
        const newTrip = {
          id: Date.now().toString(),
          name: "My Trip",
          startDate: new Date().toISOString(), 
          endDate: new Date().toISOString(),
          vibe: action.payload.vibe || "General",
          travelers: "1",
          favorites: [],
          createdAt: new Date().toISOString()
        };
        state.trips.push(newTrip);
        state.currentTripId = newTrip.id;
        targetTripId = newTrip.id;
      }

      const tripIndex = state.trips.findIndex(t => t.id === targetTripId);
      if (tripIndex !== -1) {
        const trip = state.trips[tripIndex];
        const exists = trip.favorites.find(p => p.id === action.payload.id);
        if (!exists) {
          trip.favorites.push(action.payload);
        }
      }
    },
    removeFromFavorites: (state, action) => {
      if (!state.currentTripId) return;
      const trip = state.trips.find(t => t.id === state.currentTripId);
      if (trip) {
        trip.favorites = trip.favorites.filter(p => p.id !== action.payload);
      }
    },
    updateFavoritePlace: (state, action) => {
      if (!state.currentTripId) return;
      const trip = state.trips.find(t => t.id === state.currentTripId);
      if (trip) {
        const placeIndex = trip.favorites.findIndex(p => p.id === action.payload.id);
        if (placeIndex !== -1) {
          trip.favorites[placeIndex] = { ...trip.favorites[placeIndex], ...action.payload.updates };
        }
      }
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
    }
  },
});

export const { 
  createTrip, 
  deleteTrip, 
  setCurrentTrip, 
  addToFavorites, 
  removeFromFavorites, 
  updateFavoritePlace,
  setTrips
} = tripsSlice.actions;

export const selectTrips = (state) => state.trips.trips;
export const selectCurrentTripId = (state) => state.trips.currentTripId;
export const selectCurrentTrip = (state) => 
  state.trips.trips.find(t => t.id === state.trips.currentTripId) || null;
export const selectFavorites = (state) => {
  const currentTrip = state.trips.trips.find(t => t.id === state.trips.currentTripId);
  return currentTrip ? currentTrip.favorites : [];
};

export default tripsSlice.reducer;

