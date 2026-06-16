import { createSlice } from '@reduxjs/toolkit';

// ─── UI Slice ─────────────────────────────────────────────────────────────────
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('darkMode') !== 'false',
    sidebarOpen: false,
    modalOpen: null,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    closeSidebar: (state) => { state.sidebarOpen = false; },
    openModal: (state, action) => { state.modalOpen = action.payload; },
    closeModal: (state) => { state.modalOpen = null; },
  },
});

export const { toggleDarkMode, toggleSidebar, closeSidebar, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
