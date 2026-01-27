import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as tripsService from "../../services/tripsService";

const initialState = {
  trips: [],
  currentTripId: null,
  loading: false,
  error: null,
};

export const fetchUserTrips = createAsyncThunk(
  "trips/fetchUserTrips",
  async (_, { rejectWithValue }) => {
    try {
      const trips = await tripsService.getUserTrips();
      return trips;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTripAsync = createAsyncThunk(
  "trips/createTrip",
  async (tripData, { rejectWithValue }) => {
    try {
      const trip = await tripsService.createTrip(tripData);
      return trip;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTripAsync = createAsyncThunk(
  "trips/updateTrip",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const trip = await tripsService.updateTrip(id, updates);
      return trip;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTripAsync = createAsyncThunk(
  "trips/deleteTrip",
  async (tripId, { rejectWithValue }) => {
    try {
      await tripsService.deleteTrip(tripId);
      return tripId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFavoriteAsync = createAsyncThunk(
  "trips/addFavorite",
  async ({ place }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let tripId = state.trips.currentTripId;
      if (!tripId) {
        const newTrip = await tripsService.createTrip({
          name: "My Trip",
          destination: place.city || place.location || "Unknown",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          vibe: place.vibe || "adventure",
          travelers: 1,
        });
        tripId = newTrip._id;
      }
      const updatedTrip = await tripsService.addFavorite(tripId, place);
      return updatedTrip;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavoriteAsync = createAsyncThunk(
  "trips/removeFavorite",
  async (placeId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const tripId = state.trips.currentTripId;

      if (!tripId) {
        throw new Error("No trip selected");
      }

      const updatedTrip = await tripsService.removeFavorite(tripId, placeId);
      return updatedTrip;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFavoriteAsync = createAsyncThunk(
  "trips/updateFavorite",
  async ({ placeId, updates }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const tripId = state.trips.currentTripId;

      if (!tripId) {
        throw new Error("No trip selected");
      }

      const updatedTrip = await tripsService.updateFavorite(tripId, placeId, updates);
      return updatedTrip;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setCurrentTrip: (state, action) => {
      state.currentTripId = action.payload;
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    createTrip: (state, action) => {
      const newTrip = {
        _id: Date.now().toString(),
        ...action.payload,
        favorites: [],
        createdAt: new Date().toISOString(),
      };
      state.trips.push(newTrip);
      state.currentTripId = newTrip._id;
    },
    deleteTrip: (state, action) => {
      state.trips = state.trips.filter((trip) => trip._id !== action.payload);
      if (state.currentTripId === action.payload) {
        state.currentTripId = null;
      }
    },

    updateTrip: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.trips.findIndex((t) => t._id === id);
      if (index !== -1) {
        state.trips[index] = { ...state.trips[index], ...updates };
      }
    },
    
    addToFavorites: (state, action) => {
      let targetTripId = state.currentTripId;

      if (!targetTripId) {
        const newTrip = {
          _id: Date.now().toString(),
          name: "My Trip",
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          vibe: action.payload.vibe || "General",
          travelers: "1",
          favorites: [],
          createdAt: new Date().toISOString(),
        };
        state.trips.push(newTrip);
        state.currentTripId = newTrip._id;
        targetTripId = newTrip._id;
      }

      const tripIndex = state.trips.findIndex((t) => t._id === targetTripId);
      if (tripIndex !== -1) {
        const trip = state.trips[tripIndex];
        const exists = trip.favorites.find((p) => p.id === action.payload.id);
        if (!exists) {
          trip.favorites.push(action.payload);
        }
      }
    },
  
    removeFromFavorites: (state, action) => {
      if (!state.currentTripId) return;
      const trip = state.trips.find((t) => t._id === state.currentTripId);
      if (trip) {
        trip.favorites = trip.favorites.filter((p) => p.id !== action.payload);
      }
    },

    updateFavoritePlace: (state, action) => {
      if (!state.currentTripId) return;
      const trip = state.trips.find((t) => t._id === state.currentTripId);
      if (trip) {
        const placeIndex = trip.favorites.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (placeIndex !== -1) {
          trip.favorites[placeIndex] = {
            ...trip.favorites[placeIndex],
            ...action.payload.updates,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
        if (!state.currentTripId && action.payload.length > 0) {
          state.currentTripId = action.payload[0]._id;
        }
      })
      .addCase(fetchUserTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createTripAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTripAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
        state.currentTripId = action.payload._id;
      })
      .addCase(createTripAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateTripAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTripAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(updateTripAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteTripAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTripAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter((trip) => trip._id !== action.payload);
        if (state.currentTripId === action.payload) {
          state.currentTripId = null;
        }
      })
      .addCase(deleteTripAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add favorite
    builder
      .addCase(addFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        } else {
          state.trips.push(action.payload);
        }
        state.currentTripId = action.payload._id;
      })
      .addCase(addFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(removeFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(removeFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    
    builder
      .addCase(updateFavoriteAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFavoriteAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(updateFavoriteAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  createTrip,
  deleteTrip,
  updateTrip,
  setCurrentTrip,
  addToFavorites,
  removeFromFavorites,
  updateFavoritePlace,
  setTrips,
  clearError,
} = tripsSlice.actions;

export const selectTrips = (state) => state.trips.trips;
export const selectCurrentTripId = (state) => state.trips.currentTripId;
export const selectCurrentTrip = (state) =>
  state.trips.trips.find((t) => t._id === state.trips.currentTripId) || null;
export const selectFavorites = (state) => {
  const currentTrip = state.trips.trips.find(
    (t) => t._id === state.trips.currentTripId,
  );
  return currentTrip ? currentTrip.favorites : [];
};
export const selectTripsLoading = (state) => state.trips.loading;
export const selectTripsError = (state) => state.trips.error;

export default tripsSlice.reducer;
