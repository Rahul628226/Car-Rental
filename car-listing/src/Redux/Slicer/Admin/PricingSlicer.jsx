import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api/admin/pricing-plans`;

// Async thunks
export const fetchPricingPlans = createAsyncThunk(
  "pricingPlans/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addPricingPlan = createAsyncThunk(
  "pricingPlans/add",
  async (planData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BASE_URL, planData);
      return response.data.plan;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePricingPlan = createAsyncThunk(
  "pricingPlans/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
      return response.data.plan;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePricingPlan = createAsyncThunk(
  "pricingPlans/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const pricingPlansSlice = createSlice({
  name: "pricingPlans",
  initialState: {
    plans: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch plans
      .addCase(fetchPricingPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricingPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPricingPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add plan
      .addCase(addPricingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPricingPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans.push(action.payload);
      })
      .addCase(addPricingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update plan
      .addCase(updatePricingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePricingPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.map((plan) =>
          plan._id === action.payload._id ? action.payload : plan
        );
      })
      .addCase(updatePricingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete plan
      .addCase(deletePricingPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePricingPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = state.plans.filter((plan) => plan._id !== action.payload);
      })
      .addCase(deletePricingPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pricingPlansSlice.reducer;
