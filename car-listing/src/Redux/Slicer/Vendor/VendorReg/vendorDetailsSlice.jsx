import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
});

// Thunk to create or update vendor details
export const createOrUpdateVendorDetails = createAsyncThunk(
  'vendorDetails/createOrUpdate',
  async (updateData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/vendor-details', updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Thunk to fetch vendor details for logged-in vendor
export const fetchVendorDetails = createAsyncThunk(
  'vendorDetails/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/vendor-details');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

// Thunk to fetch vendor details by vendor_id
export const fetchVendorDetailsById = createAsyncThunk(
  'vendorDetails/fetchById',
  async (vendor_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/vendor-details/${vendor_id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const vendorDetailsSlice = createSlice({
  name: 'vendorDetails',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetVendorDetails: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrUpdateVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrUpdateVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        toast.success('Vendor details saved successfully!');
      })
      .addCase(createOrUpdateVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || 'Failed to save vendor details!');
      })
      .addCase(fetchVendorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        
      })
      .addCase(fetchVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      })
      .addCase(fetchVendorDetailsById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
       
      })
      .addCase(fetchVendorDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
      });
  },
});

export const { resetVendorDetails } = vendorDetailsSlice.actions;
export default vendorDetailsSlice.reducer;
