const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Middleware to validate token and extract vendor_id, vendorName, and Role
const validateVendorToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1]; // Extract the token from the Bearer header

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Extract data from the token payload
      req.vendor_id = decoded._id;
      req.vendorName = decoded.vendorName;
      req.vendorRole = decoded.Role; // Assuming Role is included in the payload

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(403); // Forbidden
      throw new Error("Invalid or expired token");
    }
  } else {
    res.status(401); // Unauthorized
    throw new Error("Token missing or invalid");
  }
});

module.exports = validateVendorToken;
