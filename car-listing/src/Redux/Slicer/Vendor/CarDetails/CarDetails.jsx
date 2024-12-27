import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/vendor/cars`;

// Initial State
const initialState = {
  cars: [],
  loading: false,
  error: null,
};

// Car Slice
const carSlice = createSlice({
  name: 'car',
  initialState,
  reducers: {
    fetchCarsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCarsSuccess(state, action) {
      state.loading = false;
      state.cars = action.payload;
    },
    fetchCarsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addCar(state, action) {
      state.cars.push(action.payload);
    },
    updateCar(state, action) {
      const index = state.cars.findIndex(car => car._id === action.payload._id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
    deleteCar(state, action) {
      state.cars = state.cars.filter(car => car._id !== action.payload);
    },
  },
});

export const {
  fetchCarsStart,
  fetchCarsSuccess,
  fetchCarsFailure,
  addCar,
  updateCar,
  deleteCar,
} = carSlice.actions;

// Async Thunks
export const fetchCars = () => async dispatch => {
  dispatch(fetchCarsStart());
  try {
    const response = await axios.get(API_URL);
    if (response.data && response.data.cars) {
      dispatch(fetchCarsSuccess(response.data.cars));
    } else {
      dispatch(fetchCarsFailure('No cars found.'));
    }
  } catch (error) {
    dispatch(fetchCarsFailure(error.response?.data?.message || error.message));
  }
};

export const createCar = carData => async dispatch => {
  try {
    const response = await axios.post(API_URL, carData);
    dispatch(addCar(response.data.car));
  } catch (error) {
    console.error('Error creating car:', error);
    // Optionally handle errors in the slice state if needed
  }
};

export const updateCarById = (id, carData) => async dispatch => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, carData);
    dispatch(updateCar(response.data.updatedCar));
  } catch (error) {
    console.error('Error updating car:', error);
  }
};

export const deleteCarById = id => async dispatch => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    dispatch(deleteCar(id));
  } catch (error) {
    console.error('Error deleting car:', error);
  }
};

export default carSlice.reducer;
