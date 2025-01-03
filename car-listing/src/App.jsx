import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./Components/Styles/globalStyles";
import { darkTheme, lightTheme } from "./Components/Styles/theme";
import Layout from "./Components/Layout/Layout";
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
import FeaturedProductManagement from "./Components/carDetails/Tags/FeaturedProductManagement";
import SignUp from "./Components/SignUp/SignUp";
import "./index.css";
import { useDispatch } from "react-redux";
import { fetchGoogleVendor } from "./Redux/Slicer/Vendor/VendorReg/VendorGoogleLogin";
import VerifiedEmail from "./Components/EmailTemplate/VerifiedEmail";
import BusinessDetails from "./Components/Vendor/BusinessDetails";
import { VendorPricing } from "./Components/Vendor/VendorPricing";
import VendorSubscription from "./Components/Vendor/VendorSubscription";
import { checkTokenValidity } from "./Redux/Slicer/TokenValidity/TokenValidity";
import CreateAdminUser from "./Components/AdminDashboard/AdminUser/CreateAdminUser";
import HowItWorks from "./Components/AdminDashboard/AdminUser/HowItWorks";
import GuidedTour from "./Components/Common/GuidedTour";

// Theme Context
export const ThemeContext = React.createContext(null);

// 404 Page Component
const NotFound = () => (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>404</h1>
        <p>Page Not Found</p>
    </div>
);

// RequireAuth Component
const RequireAuth = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/loginpage");
        } else {
            dispatch(checkTokenValidity());
        }
    }, [navigate, dispatch]);

    return children;
};

// Login Redirect Component
const LoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        } else {
            navigate("/loginpage");
        }
    }, [navigate]);

    return null;
};

// Main App Component
const App = () => {
    const [theme, setTheme] = useState("light");
    const themeStyle = theme === "light" ? lightTheme : darkTheme;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchGoogleVendor());
    }, [dispatch]);

    return (
        <ThemeContext.Provider value={{ setTheme, theme }}>
            <ThemeProvider theme={themeStyle}>
                <GlobalStyle />
                
                <Router>
                
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LoginRedirect />} />
                        <Route path="/loginpage" element={<LoginPage />} />
                        <Route path="/create-account" element={<SignUp />} />
                        <Route path="/verify-email/:vendorId/:token" element={<VerifiedEmail />} />
                        <Route path="/subscription-plan/:planId" element={<VendorSubscription />} />
                        {/* Protected Routes */}
                        <Route
                            path="/*"
                            element={
                                <RequireAuth>
                                    <Layout>
                                        <Routes>
                                       
                                            <Route path="/dashboard" element={<HomePage />} />
                                            <Route path="/car-list" element={<CarListing />} />
                                            <Route path="/car-details" element={<CarDetails />} />
                                            
                                            <Route path="/car-page/:carId" element={<CarPage />} />
                                            <Route path="/create-subscription" element={<PricingDetails />} />
                                            <Route path="/create-carbrand" element={<CategoryManager />} />
                                            <Route path="/create-carseat" element={<CarSeat />} />
                                            <Route path="/create-carcolors" element={<CarColors />} />
                                            <Route path="/create-carcategories" element={<CarCategories />} />
                                            <Route path="/create-carFeature" element={<CarFeatures />} />
                                            <Route path="/cardetails" element={<EditCarDetails />} />
                                            <Route path="/create-tags" element={<Tags />} />
                                            <Route path="/create-FeaturedList" element={<FeaturedProductManagement />} />
                                            <Route path="/business-info" element={<BusinessDetails />} />
                                            <Route path="/subscription-plan" element={<VendorPricing />} />

                                            <Route path="/create-admin" element={<CreateAdminUser />} />
                                            <Route path="/guide-tutor" element={<HowItWorks />} />
                                            {/* 404 Page */}
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </Layout>
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </Router>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default App;
