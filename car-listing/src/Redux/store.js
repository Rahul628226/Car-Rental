import { configureStore } from '@reduxjs/toolkit';
import pricingPlansReducer from './Slicer/Admin/PricingSlicer'
import carSlice from './Slicer/Vendor/CarDetails/CarDetails';
import categoryReducer from './Slicer/Admin/CarBrand/Categoryslicer';
import seatReducer from './Slicer/Vendor/CarDetails/Seat';
import carCategoryReducer from './Slicer/Vendor/CarDetails/carCategories';
import carFeaturesReducer from './Slicer/Vendor/CarDetails/carFeaturesSlice';
import carColorsReducer from './Slicer/Vendor/CarDetails/carColorsSlice';
const store = configureStore({
  reducer: {
    
    //Admin
    pricingPlans: pricingPlansReducer,
    car: carSlice,
    categories: categoryReducer,
    seats: seatReducer,
    carCategories: carCategoryReducer,
    carFeatures: carFeaturesReducer,
    carColors: carColorsReducer,
  },
});

export default store;
