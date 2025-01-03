import React from "react";

const NotFound = () => {
    return (
        <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "100vh", 
            backgroundColor: "#f8f8f8", 
            color: "#333" 
        }}>
            <h1 style={{ fontSize: "5rem", margin: 0 }}>404</h1>
            <p style={{ fontSize: "1.5rem", margin: "1rem 0" }}>Page Not Found</p>
            <a 
                href="/dashboard" 
                style={{ 
                    textDecoration: "none", 
                    color: "white", 
                    backgroundColor: "#007BFF", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "5px", 
                    fontSize: "1rem" 
                }}>
                Go to Dashboard
            </a>
        </div>
    );
};

export default NotFound;
