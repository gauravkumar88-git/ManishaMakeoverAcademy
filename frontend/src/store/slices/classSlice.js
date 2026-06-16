import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ─── Classes Slice ────────────────────────────────────────────────────────────
export const fetchClasses = createAsyncThunk('classes/fetchAll', async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/classes?${query}`);
  return res.data;
});

export const fetchUpcomingClasses = createAsyncThunk('classes/upcoming', async () => {
  const res = await api.get('/classes/upcoming');
  return res.data;
});

export const createClass = createAsyncThunk('classes/create', async (formData) => {
  const res = await api.post('/classes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
});

export const updateClass = createAsyncThunk('classes/update', async ({ id, formData }) => {
  const res = await api.put(`/classes/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res.data;
});

export const deleteClass = createAsyncThunk('classes/delete', async (id) => {
  await api.delete(`/classes/${id}`);
  return id;
});

const classSlice = createSlice({
  name: 'classes',
  initialState: { list: [], upcoming: [], loading: false, total: 0, pages: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClasses.pending, (state) => { state.loading = true; })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.classes;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchClasses.rejected, (state) => { state.loading = false; })
      .addCase(fetchUpcomingClasses.fulfilled, (state, action) => { state.upcoming = action.payload.classes; })
      .addCase(deleteClass.fulfilled, (state, action) => { state.list = state.list.filter(c => c._id !== action.payload); })
      .addCase(createClass.fulfilled, (state, action) => { state.list.unshift(action.payload.class); })
      .addCase(updateClass.fulfilled, (state, action) => {
        const idx = state.list.findIndex(c => c._id === action.payload.class._id);
        if (idx !== -1) state.list[idx] = action.payload.class;
      });
  },
});

export default classSlice.reducer;
