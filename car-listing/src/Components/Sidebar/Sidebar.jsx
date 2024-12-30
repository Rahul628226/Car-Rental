import React, { useContext, useState } from "react";
import {
    SDivider,
    SLink,
    SLinkContainer,
    SLinkIcon,
    SLinkLabel,
    SLinkNotification,
    SSidebar,
    STheme,
    SThemeLabel,
    SThemeToggler,
    SToggleThumb,
} from "./styles";
import {
    AiOutlineApartment,
    AiOutlineHome,
    AiOutlineDown,
    AiOutlineSetting,
} from "react-icons/ai";
import { MdLogout, MdOutlineAnalytics } from "react-icons/md";
import { ThemeContext } from "./../../App";
import { useMatch } from "react-router-dom";

const Sidebar = () => {
    const { setTheme, theme } = useContext(ThemeContext);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [carAttributesOpen, setCarAttributesOpen] = useState(false); // Manage visibility of "Car Attributes"

    // Precompute matches for all routes to ensure consistent hook usage
    const routeMatches = linksArray.concat(secondaryLinksArray.flatMap((item) => item.subcategories || [])).reduce((acc, item) => {
        acc[item.to] = useMatch(item.to);
        return acc;
    }, {});

    return (
        <SSidebar isOpen={sidebarOpen}>
            {/* Main Links */}
            {linksArray.map(({ icon, label, notification, to }) => (
                <SLinkContainer key={label} isActive={!!routeMatches[to]}>
                    <SLink to={to} style={!sidebarOpen ? { width: `fit-content` } : {}}>
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && (
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                                {!!notification && (
                                    <SLinkNotification>{notification}</SLinkNotification>
                                )}
                            </>
                        )}
                    </SLink>
                </SLinkContainer>
            ))}

            <SDivider />

            {/* Secondary Links */}
            {secondaryLinksArray.map(({ icon, label, subcategories }) => (
                <SLinkContainer key={label}>
                    {/* Parent Link */}
                    <div
                        onClick={() =>
                            label === "Car Attributes" &&
                            setCarAttributesOpen((prev) => !prev)
                        }
                        style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            width: sidebarOpen ? "100%" : "fit-content",
                        }}
                    >
                        <SLinkIcon>{icon}</SLinkIcon>
                        {sidebarOpen && (
                            <>
                                <SLinkLabel>{label}</SLinkLabel>
                                {label === "Car Attributes" && (
                                    <AiOutlineDown
                                        style={{
                                            marginLeft: "auto",
                                            transform: carAttributesOpen
                                                ? "rotate(180deg)"
                                                : "rotate(0)",
                                            transition: "transform 0.2s",
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    {/* Subcategories */}
                    {label === "Car Attributes" &&
                        carAttributesOpen &&
                        sidebarOpen && (
                            <div style={{ marginLeft: "1.5rem" }}>
                                {subcategories.map(({ label, to }) => (
                                    <SLinkContainer key={label} isActive={!!routeMatches[to]}>
                                        <SLink to={to}>
                                            <SLinkLabel>{label}</SLinkLabel>
                                        </SLink>
                                    </SLinkContainer>
                                ))}
                            </div>
                        )}
                </SLinkContainer>
            ))}

            <SDivider />

            {/* Theme Toggle */}
            <STheme>
                {sidebarOpen && <SThemeLabel>Dark Mode</SThemeLabel>}
                <SThemeToggler
                    isActive={theme === "dark"}
                    onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
                >
                    <SToggleThumb style={theme === "dark" ? { right: "1px" } : {}} />
                </SThemeToggler>
            </STheme>
        </SSidebar>
    );
};

export default Sidebar;

const linksArray = [
    {
        label: "Home",
        icon: <AiOutlineHome />,
        to: "/",
        notification: 0,
    },
    {
        label: "Our Cars",
        icon: <MdOutlineAnalytics />,
        to: "/car-list",
        notification: 3,
    },
    {
        label: "Subscription",
        icon: <AiOutlineApartment />,
        to: "/create-subscription",
        notification: 1,
    },
    {
        label: "Feature Tags",
        icon: <AiOutlineApartment />,
        to: "/create-tags",
        notification: 1,
    },
];

const secondaryLinksArray = [
    {
        label: "Car Attributes",
        icon: <AiOutlineSetting />,
        subcategories: [
            { label: "Car Brand", to: "/create-carbrand" },
            { label: "Car Categories", to: "/create-carcategories" },
            { label: "Car Features", to: "/create-carFeature" },
            { label: "Car Color", to: "/create-carcolors" },
            { label: "Car Capacity", to: "/create-carseat" },
        ],
    },
    {
        label: "Logout",
        icon: <MdLogout />,
    },
];
