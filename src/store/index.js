import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { apiSlice } from './api/apiSlice';
import { articlesApi } from './api/articlesApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(apiSlice.middleware)
    .concat(articlesApi.middleware),

  devTools: process.env.NODE_ENV !== 'production',
});

export default store;