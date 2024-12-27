import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/CarColor`; // Adjust the base URL as needed

// Async Thunks
export const fetchCarColors = createAsyncThunk('carColors/fetchCarColors', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createCarColor = createAsyncThunk('carColors/createCarColor', async (CarColor, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, { CarColor });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCarColor = createAsyncThunk('carColors/updateCarColor', async ({ id, CarColor }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, { CarColor });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteCarColor = createAsyncThunk('carColors/deleteCarColor', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const carColorsSlice = createSlice({
  name: 'carColors',
  initialState: {
    colors: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Car Colors
    builder
      .addCase(fetchCarColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarColors.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = action.payload;
      })
      .addCase(fetchCarColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Car Color
    builder
      .addCase(createCarColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors.push(action.payload);
      })
      .addCase(createCarColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Car Color
    builder
      .addCase(updateCarColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarColor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.colors.findIndex((color) => color._id === action.payload._id);
        if (index !== -1) {
          state.colors[index] = action.payload;
        }
      })
      .addCase(updateCarColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Car Color
    builder
      .addCase(deleteCarColor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCarColor.fulfilled, (state, action) => {
        state.loading = false;
        state.colors = state.colors.filter((color) => color._id !== action.payload);
      })
      .addCase(deleteCarColor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carColorsSlice.reducer;
