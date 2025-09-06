import { configureStore } from '@reduxjs/toolkit';
import { api } from '../api';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // <-- REQUIRED
    auth: authReducer,              // keep your other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // <-- REQUIRED
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
