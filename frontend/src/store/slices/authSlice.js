import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import toast from 'react-hot-toast';

// Async thunks
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (token, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/google', { token });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Google login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/logout');
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const res = await api.put('/auth/update-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; state.isAuthenticated = true; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.token) localStorage.setItem('token', action.payload.token);
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      toast.error(action.payload || 'Something went wrong');
    };

    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, action) => { handleAuth(state, action); toast.success('Welcome to Beauty Master Academy! 🌸'); })
      .addCase(register.rejected, handleRejected)

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, action) => { handleAuth(state, action); toast.success(`Welcome back, ${action.payload.user.name}! 💄`); })
      .addCase(login.rejected, handleRejected)

      .addCase(googleLogin.pending, handlePending)
      .addCase(googleLogin.fulfilled, (state, action) => { handleAuth(state, action); toast.success('Logged in with Google! 🎉'); })
      .addCase(googleLogin.rejected, handleRejected)

      .addCase(getMe.pending, (state) => { state.loading = true; })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token');
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success('Profile updated!');
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
