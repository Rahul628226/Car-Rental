const express = require("express");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/check-token", asyncHandler(async (req, res) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ 
            status: "error",
            message: "Token missing or invalid format" 
        });
    }

    token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({
            status: "success", 
            message: "Token is valid",
            isExpired: false
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(200).json({
                status: "success",
                message: "Token has expired",
                isExpired: true
            });
        }
        return res.status(400).json({
            status: "error",
            message: "Invalid token",
            error: error.message
        });
    }
}));

module.exports = router;
