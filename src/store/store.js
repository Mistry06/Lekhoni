// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Correct path to your authSlice

const store = configureStore({
  reducer: {
    auth: authReducer, // Make sure 'auth' is the key for your authReducer
    // Add other reducers here if you have them, e.g., post: postReducer
  },
  // Optionally, you can add middleware or devTools options here
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware),
  // devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

export default store;