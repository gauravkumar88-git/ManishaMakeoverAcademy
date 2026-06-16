import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const res = await api.get('/notifications');
  return res.data;
});

export const markAllRead = createAsyncThunk('notifications/markRead', async () => {
  await api.put('/notifications/mark-read');
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload.notifications;
        state.unreadCount = action.payload.notifications.filter(n => !n.read).length;
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.unreadCount = 0;
        state.list = state.list.map(n => ({ ...n, read: true }));
      });
  },
});

export default notificationSlice.reducer;
