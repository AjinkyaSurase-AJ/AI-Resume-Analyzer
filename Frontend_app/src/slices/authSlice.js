import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user: null,
  rememberMe: false,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.token = action.payload.token;
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
      state.isAuthenticated = true;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.rememberMe = false;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },

    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    restoreSession: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.rememberMe = action.payload.rememberMe;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  setRememberMe,
  setToken,
  setUser,
  restoreSession,
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;