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

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/statistics" element={<h1>Statistics Page</h1>} />
            <Route path="/customers" element={<h1>Customers Page</h1>} />
            <Route path="/diagrams" element={<h1>Diagrams Page</h1>} />
            <Route path="/car-details" element={<CarDetails/>} />
            <Route path="/car-list" element={<CarListing/>} />
            <Route path="/car-page" element={<CarPage/>} />

            {/* Subscription */}
            <Route path="/create-subscription" element={<PricingDetails/>} />

            <Route path="/create-carbrand" element={<CategoryManager/>} />

            <Route path="/create-carFeature" element={<CarFeatures/>} />
        </Routes>
    );
};

export default AppRoutes;
