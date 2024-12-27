import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Common/LoginPage";



const HomeRouter = () => {
    return (
        <Routes>
            
            <Route path="/" element={<LoginPage/>} />
            
        </Routes>
    );
};

export default HomeRouter;
