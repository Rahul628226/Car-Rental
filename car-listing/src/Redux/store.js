import { configureStore } from '@reduxjs/toolkit';
import pricingPlansReducer from './Slicer/Admin/PricingSlicer'
import carSlice from './Slicer/Vendor/CarDetails/CarDetails';
import categoryReducer from './Slicer/Admin/CarBrand/Categoryslicer';
import seatReducer from './Slicer/Vendor/CarDetails/Seat';
import carCategoryReducer from './Slicer/Vendor/CarDetails/carCategories';
import carFeaturesReducer from './Slicer/Vendor/CarDetails/carFeaturesSlice';
import carColorsReducer from './Slicer/Vendor/CarDetails/carColorsSlice';
import featureTagReducer from './Slicer/Vendor/CarDetails/FeatureTag/FeatureTag';
import vendorReducer from './Slicer/Vendor/VendorReg/VendorReg';
import vendorgoogleauthReducer from './Slicer/Vendor/VendorReg/VendorGoogleLogin';
import emailReducer from './Slicer/Vendor/SendEmail/SendEmail';
import vendorDetailsReducer from './Slicer/Vendor/VendorReg/vendorDetailsSlice';
import vendorSubscriptionReducer from './Slicer/Vendor/VendorReg/vendorSubscription';
import tokenValidityReducer from './Slicer/TokenValidity/TokenValidity';
import descriptionReducer from './Slicer/Vendor/CarDetails/descriptionSlice';
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
    featureTag: featureTagReducer,
    vendor: vendorReducer,
    vendorgoogleauth: vendorgoogleauthReducer,
    email: emailReducer,
    vendorDetails: vendorDetailsReducer,
    vendorSubscription: vendorSubscriptionReducer,
    tokenValidity: tokenValidityReducer,
    description: descriptionReducer,
  },
});

export default store;
