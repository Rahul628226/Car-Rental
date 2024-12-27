import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Async thunks for fetching data
export const fetchMainCategories = createAsyncThunk(
  'categories/fetchMainCategories',
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getMainCategories`);
    return response.data;
  }
);

export const fetchCategoriesByParent = createAsyncThunk(
  'categories/fetchCategoriesByParent',
  async (parentCategory) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getCategoriesByParent/${parentCategory}`);
    return response.data;
  }
);

export const fetchSubcategories = createAsyncThunk(
  'categories/fetchSubcategories',
  async ({ parentCategory, Category }) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/getSubcategories/${parentCategory}/${Category}`);
    return response.data;
  }
);

// Async thunks for adding data
export const addMainCategory = createAsyncThunk(
  'categories/addMainCategory',
  async (name) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/addMainCategory`, { name });
    return response.data;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ name, parentCategory }) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/addCategory`, { name, parentCategory });
    return response.data;
  }
);


// Async thunks for updating data
export const updateMainCategory = createAsyncThunk(
  'categories/updateMainCategory',
  async ({ id, name }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/MainCategory/${id}`, { name });
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name, parentCategory }) => {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/updateCategory/${id}`, { name, parentCategory });
    return response.data;
  }
);



// Async thunks for deleting data
export const deleteMainCategory = createAsyncThunk(
  'categories/deleteMainCategory',
  async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/MainCategory/${id}`);
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/deleteCategory/${id}`);
    return response.data;
  }
);



// Initial state
const initialState = {
  mainCategories: [],
  categories: [],
  subcategories: [],
  selectedMainCategory: null,
  selectedCategory: null,
  selectedParent: null,
  status: 'idle',
  error: null,
};

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    selectMainCategory: (state, action) => {
      state.selectedMainCategory = action.payload;
    },
    selectCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },

    selectParent: (state, action) => {
      state.selectedParent = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch main categories
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.mainCategories = action.payload;
      })
      // Fetch categories by parent
      .addCase(fetchCategoriesByParent.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch subcategories
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.subcategories = action.payload;
      })
      // Add main category
      .addCase(addMainCategory.fulfilled, (state, action) => {
        state.mainCategories.push(action.payload);
        // toast.success("Main category added successfully!");
      })
      .addCase(addMainCategory.rejected, (state, action) => {
        // toast.error("Failed to add main category!");
      })
      // Add category
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
        // toast.success("Category added successfully!");
      })
      .addCase(addCategory.rejected, (state, action) => {
        // toast.error("Failed to add category!");
      })

      // Update main category
      .addCase(updateMainCategory.fulfilled, (state, action) => {
        const index = state.mainCategories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.mainCategories[index] = action.payload;
        }
        // toast.success("Main category updated successfully!");
      })
      .addCase(updateMainCategory.rejected, (state, action) => {
        // toast.error("Failed to update main category!");
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        // toast.success("Category updated successfully!");
      })
      .addCase(updateCategory.rejected, (state, action) => {
        // toast.error("Failed to update category!");
      })

      // Delete main category
      .addCase(deleteMainCategory.fulfilled, (state, action) => {
        state.mainCategories = state.mainCategories.filter(cat => cat._id !== action.meta.arg);
        // toast.success("Main category deleted successfully!");
      })
      .addCase(deleteMainCategory.rejected, (state, action) => {
        // toast.error("Failed to delete main category!");
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat._id !== action.meta.arg);
        // toast.success("Category deleted successfully!");
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        // toast.error("Failed to delete category!");
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.error.message;
        }
      );
  },
});

export const { selectMainCategory, selectCategory, selectParent } = categorySlice.actions;
export default categorySlice.reducer;
