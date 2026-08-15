import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

const token = localStorage.getItem('codenest_token');

const initialState = {
  user: null,
  token: token || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunk for user registration
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.signup(userData);
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Async thunk to get current user profile
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getMe();
    } catch (error) {
      authService.logout();
      return rejectWithValue(error.message || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
        };
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
