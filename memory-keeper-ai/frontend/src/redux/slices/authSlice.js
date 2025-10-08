// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth.api';

// --- No changes needed for the async thunks themselves ---
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      // We will handle localStorage inside the reducer for consistency
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      // We will handle localStorage inside the reducer for consistency
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// --- START OF FIXES ---

// Helper function to safely parse user data from localStorage
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
};

const storedUser = getUserFromStorage();
const storedToken = localStorage.getItem('token');

// Define the initial state based on what's in localStorage
const initialState = {
  // The 'user' object will contain id, name, email, role, and createdAt
  user: storedUser || null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  
  // Extract family info from the stored user object
  familyId: storedUser?.familyId || null,
  familyInviteCode: storedUser?.familyInviteCode || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.familyId = null;
      state.familyInviteCode = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Unified handler for when login or signup starts
      .addMatcher(
        (action) => (action.type === login.pending.type || action.type === signup.pending.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Unified handler for when login or signup succeeds
      .addMatcher(
        (action) => (action.type === login.fulfilled.type || action.type === signup.fulfilled.type),
        (state, action) => {
          const payload = action.payload;

          state.loading = false;
          state.isAuthenticated = true;
          
          // The entire API response payload is our user object
          state.user = payload; 
          
          // Extract specific fields for easy access and storage
          state.token = payload.token;
          state.familyId = payload.familyId;
          state.familyInviteCode = payload.familyInviteCode;
          
          // Update localStorage with the latest data
          localStorage.setItem('token', payload.token);
          localStorage.setItem('user', JSON.stringify(payload));
        }
      )
      // Unified handler for when login or signup fails
      .addMatcher(
        (action) => (action.type === login.rejected.type || action.type === signup.rejected.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      );
  }
});
// --- END OF FIXES ---

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;