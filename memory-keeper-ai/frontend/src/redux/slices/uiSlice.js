// src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    theme: 'light',
    currentPrompt: ''
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setCurrentPrompt: (state, action) => {
      state.currentPrompt = action.payload;
    }
  }
});

export const { toggleSidebar, setTheme, setCurrentPrompt } = uiSlice.actions;
export default uiSlice.reducer;