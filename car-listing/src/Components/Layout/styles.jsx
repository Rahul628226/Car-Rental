import styled from "styled-components";
import { v } from "../Styles/variables";

export const SLayout = styled.div`
    display: flex;
`;

export const SMain = styled.main`
    // padding: calc(${v.smSpacing} * 2);
    margin-left:300px;
    margin-top:100px;
    h1 {
        font-size: 14px;
    }
        @media(max-width: 900px)
        {
        margin-left:0px;
        margin-top:200px;
        }
`;

export const SHeader = styled.header`
    width: 100%;
    position: fixed;
    top: 0;
    z-index: 1000;
    background-color: ${(props) => props.theme.bg};
    box-shadow: 0 4px 6px ${(props) => props.theme.bgAlpha};
`;

export const SSidebarContainer = styled.div`
    margin-top: 60px; /* Adjust this value to match the height of the header */
    width: 250px;
    
    height: calc(100vh - 60px); /* Full height minus the header height */
    position: fixed;
    background-color: ${(props) => props.theme.bg2};
    box-shadow: 2px 0 6px ${(props) => props.theme.bgAlpha};

    /* Always visible on desktop */
    @media (min-width: 900px) {
        display: block;
    }

    /* Conditionally visible on mobile */
    @media (max-width: 900px) {
        display: ${(props) => (props.isSidebarVisible ? "block" : "none")};
        margin-top: 150px;
    }
`;
