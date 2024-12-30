import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import CarDetails from "./Components/carDetails/CarDetails";
import CarListing from "./Components/carDetails/CarListing";
import CarPage from "./Components/carDetails/CarPage";
import Subscription from "./Components/AdminDashboard/Subscription/Subscription";
import PricingDetails from "./Components/AdminDashboard/Subscription/Pricing";

import CategoryManager from "./Components/carDetails/Carbrand/CategoryManager";
import CarFeatures from "./Components/carDetails/CarFeature";
import EditCarDetails from "./Components/carDetails/EditCarDetails";
import LoginPage from "./Components/Common/LoginPage";
import CarSeat from "./Components/carDetails/CarSeat";
import CarColors from "./Components/carDetails/CarColors";
import CarCategories from "./Components/carDetails/CarCategory";
import Tags from "./Components/carDetails/Tags/Tags";


const AppRoutes = () => {
    return (
        <Routes>
            
            <Route path="/statistics" element={<h1>Statistics Page</h1>} />
            <Route path="/customers" element={<h1>Customers Page</h1>} />
            <Route path="/diagrams" element={<h1>Diagrams Page</h1>} />
            <Route path="/car-details" element={<CarDetails/>} />
            <Route path="/car-list" element={<CarListing/>} />
            <Route path="/car-page/:carId" element={<CarPage/>} />

            {/* Subscription */}
            <Route path="/create-subscription" element={<PricingDetails/>} />

            <Route path="/create-carbrand" element={<CategoryManager/>} />
            <Route path="/create-carseat" element={<CarSeat/>} />
            <Route path="/create-carcolors" element={<CarColors/>} />
            <Route path="/create-carcategories" element={<CarCategories/>} />

            <Route path="/create-carFeature" element={<CarFeatures/>} />
            <Route path="/cardetails" element={<EditCarDetails/>} />

            <Route path="/create-tags" element={<Tags/>} />
        </Routes>
    );
};

export default AppRoutes;
