import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.sub || payload.id,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      exp: payload.exp,
    };
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return Date.now() >= decoded.exp * 1000;
};

const getInitialState = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && !isTokenExpired(token) && user) {
    return {
      token,
      user: JSON.parse(user),
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  }
  
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;
      const user = decodeToken(token);
      
      if (user && !isTokenExpired(token)) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
        state.error = null;
        
        // Store in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(
        apiSlice.endpoints.login.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchFulfilled,
        (state, action) => {
          state.loading = false;
          const { token } = action.payload;
          const user = decodeToken(token);
          
          if (user) {
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      )
      .addMatcher(
        apiSlice.endpoints.login.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.data?.message || 'Login failed';
          state.isAuthenticated = false;
        }
      )
      // Register
      .addMatcher(
        apiSlice.endpoints.register.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.register.matchFulfilled,
        (state) => {
          state.loading = false;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.register.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.data?.message || 'Registration failed';
        }
      );
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;