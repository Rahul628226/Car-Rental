import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const fetchCarFeatures = createAsyncThunk('carFeatures/fetch', async () => {
  const response = await axios.get(`${BASE_URL}/api/carFeatures`);
  return response.data.data;
});

export const createCarFeature = createAsyncThunk('carFeatures/create', async (feature) => {
  const response = await axios.post(`${BASE_URL}/api/carFeatures`, feature);
  return response.data.data;
});

export const updateCarFeature = createAsyncThunk('carFeatures/update', async ({ id, featureName }) => {
  const response = await axios.put(`${BASE_URL}/api/carFeatures/${id}`, { featureName });
  return response.data.data;
});

export const deleteCarFeature = createAsyncThunk('carFeatures/delete', async (id) => {
  await axios.delete(`${BASE_URL}/api/carFeatures/${id}`);
  return id;
});

const carFeaturesSlice = createSlice({
  name: 'carFeatures',
  initialState: {
    features: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
      })
      .addCase(fetchCarFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createCarFeature.fulfilled, (state, action) => {
        state.features.push(action.payload);
      })
      .addCase(updateCarFeature.fulfilled, (state, action) => {
        const index = state.features.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) state.features[index] = action.payload;
      })
      .addCase(deleteCarFeature.fulfilled, (state, action) => {
        state.features = state.features.filter((f) => f._id !== action.payload);
      });
  },
});

export default carFeaturesSlice.reducer;
