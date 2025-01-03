import React, { useState, useEffect } from "react";
import { SLayout, SMain, SHeader, SSidebarContainer } from "./styles";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVendorInfo } from "../../Redux/Slicer/Vendor/VendorReg/VendorReg";
import { fetchVendorSubscription } from "../../Redux/Slicer/Vendor/VendorReg/vendorSubscription";
import { fetchVendorDetails } from "../../Redux/Slicer/Vendor/VendorReg/vendorDetailsSlice";
import GuidedTour from "../Common/GuidedTour";

const Layout = ({ children }) => {
    const { vendor } = useSelector((state) => state.vendor);
    const { loading, subscription } = useSelector((state) => state.vendorSubscription);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        const vendorId = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        if (vendorId && !vendor) {
            dispatch(fetchVendorInfo(vendorId));
            dispatch(fetchVendorSubscription());
            dispatch(fetchVendorDetails());
        }
    }, [dispatch, vendor, navigate]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        // if (vendor?.Role === "Vendor" && subscription?.SubScriptionstatus !== "active") {
        //     navigate("/business-info");
        // }
    }, [vendor?.Role, subscription?.SubScriptionstatus, navigate]);

    const handleOpen = () => setSidebarVisible(true);
    const handleClose = () => setSidebarVisible(false);

    return (
        <SLayout>
            <SHeader>
                <Header handleOpen={handleOpen} handleClose={handleClose} />
            </SHeader>
            <SSidebarContainer isSidebarVisible={isSidebarVisible}>
                <Sidebar />
            </SSidebarContainer>
            
            <SMain>
            <GuidedTour stepNo={0} onTourComplete={() => console.log('Tour complete')} />
                {children}</SMain>
        </SLayout>
    );
};

export default Layout;
