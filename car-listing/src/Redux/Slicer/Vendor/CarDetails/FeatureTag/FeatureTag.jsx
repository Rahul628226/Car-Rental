import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for CRUD operations
export const fetchFeatureTags = createAsyncThunk('featureTag/fetchFeatureTags', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/featureTags`);
  return response.data;
});

export const fetchFeatureTagById = createAsyncThunk('featureTag/fetchFeatureTagById', async (id) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/featureTags/${id}`);
  return response.data;
});

export const createFeatureTag = createAsyncThunk('featureTag/createFeatureTag', async (newFeatureTag) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/featureTags`, newFeatureTag);
  return response.data;
});

export const updateFeatureTag = createAsyncThunk('featureTag/updateFeatureTag', async ({ id, updatedFeatureTag }) => {
  const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/featureTags/${id}`, updatedFeatureTag);
  return response.data;
});

export const deleteFeatureTag = createAsyncThunk('featureTag/deleteFeatureTag', async (id) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/featureTags/${id}`);
  return id;
});

const featureTagSlice = createSlice({
  name: 'featureTag',
  initialState: {
    featureTags: [],
    featureTag: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatureTags.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeatureTags.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.featureTags = action.payload;
      })
      .addCase(fetchFeatureTags.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchFeatureTagById.fulfilled, (state, action) => {
        state.featureTag = action.payload;
      })
      .addCase(createFeatureTag.fulfilled, (state, action) => {
        state.featureTags.push(action.payload);
      })
      .addCase(updateFeatureTag.fulfilled, (state, action) => {
        const index = state.featureTags.findIndex(tag => tag._id === action.payload._id);
        state.featureTags[index] = action.payload;
      })
      .addCase(deleteFeatureTag.fulfilled, (state, action) => {
        state.featureTags = state.featureTags.filter(tag => tag._id !== action.payload);
      });
  }
});

export default featureTagSlice.reducer;
