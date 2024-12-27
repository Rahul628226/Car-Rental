import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/Carcategory`;

// Async Thunks
export const fetchCarCategories = createAsyncThunk('carCategories/fetchCarCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createCarCategory = createAsyncThunk('carCategories/createCarCategory', async (Carcategory, { rejectWithValue }) => {
  try {
    const response = await axios.post(BASE_URL, { Carcategory });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateCarCategory = createAsyncThunk('carCategories/updateCarCategory', async ({ id, Carcategory }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, { Carcategory });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteCarCategory = createAsyncThunk('carCategories/deleteCarCategory', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const carCategorySlice = createSlice({
  name: 'carCategories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCarCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCarCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCarCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Category
    builder
      .addCase(createCarCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCarCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Category
    builder
      .addCase(updateCarCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCarCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex((category) => category._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCarCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Category
    builder
      .addCase(deleteCarCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCarCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((category) => category._id !== action.payload);
      })
      .addCase(deleteCarCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default carCategorySlice.reducer;
