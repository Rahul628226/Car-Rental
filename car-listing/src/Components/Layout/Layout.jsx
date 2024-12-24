import React, { useState } from "react";
import { SLayout, SMain, SHeader, SSidebarContainer } from "./styles";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Layout = ({ children }) => {
    // State to control sidebar visibility on mobile
    const [isSidebarVisible, setSidebarVisible] = useState(false);

    const handleOpen = () => {
        setSidebarVisible(true);
    }

    const handleClose = () => {
        setSidebarVisible(false);
    }
    return (
        <SLayout>
            <SHeader>
                <Header handleOpen={handleOpen} handleClose={handleClose}/>
            </SHeader>
            <SSidebarContainer isSidebarVisible={isSidebarVisible}>
                <Sidebar />
            </SSidebarContainer>
            <SMain>{children}</SMain>
        </SLayout>
    );
};

export default Layout;
