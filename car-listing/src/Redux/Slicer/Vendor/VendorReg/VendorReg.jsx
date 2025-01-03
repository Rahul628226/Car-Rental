import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Define async actions
export const postVendor = createAsyncThunk('vendor/postVendor', async (vendorData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, vendorData);
    localStorage.setItem('id', response.data._id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Login with email or phone and password
export const loginVendor = createAsyncThunk('vendor/loginVendor', async ({ identifier, password }, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { identifier, password });

    
    // Verify and fetch vendor info after setting vendorId
    dispatch(verifyVendor(vendorId));
    dispatch(fetchVendorInfo(vendorId));
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Login with phone only
export const loginVendorByPhone = createAsyncThunk('vendor/loginVendorByPhone', async (phone, { dispatch, rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { phone });
    const vendorId = response.data.user._id;
    localStorage.setItem('id', vendorId);
    
    // Verify and fetch vendor info after setting vendorId
    dispatch(verifyVendor(vendorId));
    dispatch(fetchVendorInfo(vendorId));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchVendorInfo = createAsyncThunk('vendor/fetchVendorInfo', async (vendorId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${vendorId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const verifyVendor = createAsyncThunk('vendor/verifyVendor', async (vendorId, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/verify/${vendorId}`);
    const Id = response.data._id;
    const token	= response.data.token;	
    localStorage.setItem('token',token)
    localStorage.setItem('id', Id);
    return response.data;

  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Create a slice
const vendorSlice = createSlice({
  name: 'VendorReg',
  initialState: {
    loading: false,
    error: '',
    vendor: null,
    vendorVerified: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('id');
      state.vendor = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Post Vendor
      .addCase(postVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(postVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = '';
      })
      .addCase(postVendor.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
      })
      // Login Vendor
      .addCase(loginVendor.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = '';
        toast.success(`Welcome ${action.payload.user.name || action.payload.user.email || action.payload.user.phone}`);
      })
      .addCase(loginVendor.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
      })
      // Login Vendor by Phone
      .addCase(loginVendorByPhone.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginVendorByPhone.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = '';
        toast.success(`Welcome ${action.payload.user.name || action.payload.user.email || action.payload.user.phone}`);
      })
      .addCase(loginVendorByPhone.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
      })
      // Fetch Vendor Info
      .addCase(fetchVendorInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendorInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = '';
      })
      .addCase(fetchVendorInfo.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
      })
      // Verify Vendor
      .addCase(verifyVendor.pending, (state) => {
        state.loading = true;
        state.vendorVerified = false;
      })
      .addCase(verifyVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendor = action.payload;
        state.error = '';
        state.vendorVerified = true;
      })
      .addCase(verifyVendor.rejected, (state, action) => {
        state.loading = false;
        state.vendor = null;
        state.error = action.payload;
        state.vendorVerified = false;
      });
  }
});

export const { logout } = vendorSlice.actions;

export default vendorSlice.reducer;
