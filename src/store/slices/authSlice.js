import { createSlice } from "@reduxjs/toolkit";

// Helper to safely read from localStorage
const loadAuthFromStorage = () => {
  try {
    const user = localStorage.getItem("auth_user");
    const token = localStorage.getItem("auth_token");
    if (user && token) {
      return {
        user: JSON.parse(user),
        token: token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error("Failed to load auth from storage:", error);
  }
  return null;
};

const savedAuth = loadAuthFromStorage();

const initialState = {
  user: savedAuth ? savedAuth.user : null,
  token: savedAuth ? savedAuth.token : null,
  isAuthenticated: savedAuth ? savedAuth.isAuthenticated : false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save to localStorage
      try {
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        localStorage.setItem("auth_token", action.payload.token);
      } catch (error) {
        console.error("Failed to save auth to storage:", error);
      }
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear from localStorage
      try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      } catch (error) {
        console.error("Failed to clear auth from storage:", error);
      }
    },
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Save to localStorage
      try {
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
        localStorage.setItem("auth_token", action.payload.token);
      } catch (error) {
        console.error("Failed to save auth to storage:", error);
      }
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

