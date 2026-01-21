import { configureStore } from "@reduxjs/toolkit";
import tripsReducer from "./slices/tripsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    trips: tripsReducer,
    auth: authReducer,
  },
});
