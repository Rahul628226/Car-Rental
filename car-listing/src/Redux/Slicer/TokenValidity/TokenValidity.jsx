import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for checking token validity
export const checkTokenValidity = createAsyncThunk(
    'tokenValidity/check',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/check-token`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const tokenValiditySlice = createSlice({
    name: 'tokenValidity',
    initialState: {
        isValid: false,
        isLoading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(checkTokenValidity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(checkTokenValidity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isValid = !action.payload.isExpired;
            })
            .addCase(checkTokenValidity.rejected, (state, action) => {
                state.isLoading = false;
                state.isValid = false;
                state.error = action.payload;

                localStorage.removeItem('token');

                
            });
    }
});

export default tokenValiditySlice.reducer;
