// Redux Slice for Description Generation
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_URL}/api`;

// Async thunk to fetch the description
export const generateDescription = createAsyncThunk(
  "description/generateDescription",
  async ({ brand, model }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseURL}/generate-description`, {
        carBrand: brand,
        model,
      });

      // Extract the description text from the nested response
      const descriptionText =response.data.description.candidates?.[0]?.content?.parts?.[0]?.text || "No description available.";
       
      return descriptionText;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error generating description");
    }
  }
);

const descriptionSlice = createSlice({
  name: "description",
  initialState: {
    description: "",
    loading: false,
    error: null,
  },
  reducers: {
    clearDescription: (state) => {
      state.description = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateDescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateDescription.fulfilled, (state, action) => {
        state.description = action.payload;
        state.loading = false;
      })
      .addCase(generateDescription.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearDescription } = descriptionSlice.actions;

export default descriptionSlice.reducer;