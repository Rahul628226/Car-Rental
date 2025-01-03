import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vendor/cars`;

// Async Thunks
export const fetchCars = createAsyncThunk('car/fetchCars', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(API_URL);
    return response.data.cars || [];
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const fetchCarById = createAsyncThunk('car/fetchCarById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.car;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createCar = createAsyncThunk('car/createCar', async (carData, { rejectWithValue }) => {
  try {
    const response = await axios.post(API_URL, carData);
    return response.data.car;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateCarById = createAsyncThunk('car/updateCarById', async ({ id, carData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, carData);
    return response.data.updatedCar;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteCarById = createAsyncThunk('car/deleteCarById', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Initial State
const initialState = {
  cars: [],
  selectedCar: null,
  loading: false,
  error: null,
};

// Car Slice
const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Cars
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Car By ID
    builder
      .addCase(fetchCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Car
    builder
      .addCase(createCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.push(action.payload);
      })
      .addCase(createCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Car
    builder
      .addCase(updateCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cars.findIndex(car => car._id === action.payload._id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(updateCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Car
    builder
      .addCase(deleteCarById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCarById.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter(car => car._id !== action.payload);
      })
      .addCase(deleteCarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carSlice.reducer;
