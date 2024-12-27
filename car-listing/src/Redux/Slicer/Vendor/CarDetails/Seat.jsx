import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/seats`;

// Async Thunks
export const fetchSeats = createAsyncThunk('seats/fetchSeats', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createSeat = createAsyncThunk('seats/createSeat', async (seatNumber, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, { seatNumber });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateSeat = createAsyncThunk('seats/updateSeat', async ({ id, seatNumber }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, { seatNumber });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteSeat = createAsyncThunk('seats/deleteSeat', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const seatSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Seats
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Seat
    builder
      .addCase(createSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.seats.push(action.payload);
      })
      .addCase(createSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Seat
    builder
      .addCase(updateSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSeat.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.seats.findIndex((seat) => seat._id === action.payload._id);
        if (index !== -1) {
          state.seats[index] = action.payload;
        }
      })
      .addCase(updateSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Seat
    builder
      .addCase(deleteSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSeat.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = state.seats.filter((seat) => seat._id !== action.payload);
      })
      .addCase(deleteSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default seatSlice.reducer;
