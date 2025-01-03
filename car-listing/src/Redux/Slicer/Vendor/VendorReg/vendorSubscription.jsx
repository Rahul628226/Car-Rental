import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_URL}/api`;

// Async actions
export const createVendorSubscription = createAsyncThunk(
  'vendorSubscription/create',
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${baseURL}/createSubscription`,
        subscriptionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateVendorSubscription = createAsyncThunk(
  'vendorSubscription/update',
  async ({ subscriptionId, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${baseURL}/updateSubscription/${subscriptionId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVendorSubscription = createAsyncThunk(
  'vendorSubscription/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseURL}/vendor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const vendorSubscriptionSlice = createSlice({
  name: 'vendorSubscription',
  initialState: {
    subscription: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createVendorSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendorSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.error = null;
      })
      .addCase(createVendorSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create subscription';
      })
      .addCase(updateVendorSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVendorSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.subscription;
        state.error = null;
      })
      .addCase(updateVendorSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update subscription';
      })
      .addCase(fetchVendorSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload;
        state.error = null;
      })
      .addCase(fetchVendorSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch subscription';
      });
  },
});

export default vendorSubscriptionSlice.reducer;
