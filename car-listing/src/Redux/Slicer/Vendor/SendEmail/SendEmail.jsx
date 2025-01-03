import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/send`;



// Async thunk to send email
export const sendVerificationEmail = createAsyncThunk(
  'email/sendVerificationEmail',
  async ({ to, userId,html,subject }, { rejectWithValue }) => {
    try {
     
      
     
      const response = await axios.post(API_URL, { to, subject, html });
      return { ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    loading: false,
    success: false,
    error: null
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(sendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  }
});

export const { resetState } = emailSlice.actions;
export default emailSlice.reducer;
