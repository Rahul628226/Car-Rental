import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchVendorInfo } from './VendorReg';
import { selectVendorAuthState } from '../../../selecters';

// Thunk to fetch vendor authentication data
export const fetchGoogleVendor = createAsyncThunk(
  'vendorgoogleauth/fetchGoogleVendor',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const state = getState();
      const vendorAuthState = selectVendorAuthState(state);
      const existingVendorId = vendorAuthState.vendor?._id || localStorage.getItem('id');

      // Fetch vendor authentication data
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/login/success`, {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const { _id: vendorId } = response.data.user; // Extract vendor ID and token
      const token=response.data.token;
      if (vendorId !== existingVendorId) {
        localStorage.setItem('id', vendorId);
        localStorage.setItem('token', token);// Store token in localStorage
        dispatch(fetchVendorInfo(vendorId));
      }
      localStorage.setItem('token', token);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to log out vendor
export const logoutGoogleVendor = createAsyncThunk(
  'vendorgoogleauth/logoutGoogleVendor',
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem('id');
      localStorage.removeItem('token'); // Remove token from localStorage
      return null; // Reset vendor state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const vendorgoogleauthSlice = createSlice({
  name: 'vendorgoogleauth',
  initialState: {
    loading: false,
    vendor: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoogleVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoogleVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = null;
      })
      .addCase(fetchGoogleVendor.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
      })
      .addCase(logoutGoogleVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutGoogleVendor.fulfilled, (state) => {
        state.loading = false;
        state.vendor = null; // Reset vendor state on logout
        state.error = null;
      })
      .addCase(logoutGoogleVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default vendorgoogleauthSlice.reducer;
