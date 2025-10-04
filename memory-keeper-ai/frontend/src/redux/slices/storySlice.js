// src/redux/slices/storySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storyAPI } from '../../api/story.api';

export const fetchUserStories = createAsyncThunk(
  'story/fetchUserStories',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await storyAPI.getUserStories(userId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const fetchStoryById = createAsyncThunk(
  'story/fetchStoryById',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await storyAPI.getStory(storyId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const createStory = createAsyncThunk(
  'story/createStory',
  async (storyData, { rejectWithValue }) => {
    try {
      const response = await storyAPI.createStory(storyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState: {
    stories: [],
    currentStory: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentStory: (state) => {
      state.currentStory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchUserStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStory = action.payload;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
      });
  }
});

export const { clearCurrentStory } = storySlice.actions;
export default storySlice.reducer;