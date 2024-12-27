const asyncHandler = require("express-async-handler");
const PricingPlan = require("../../Model/Pricing/pricing"); // Adjust the path as needed

// Helper function for error response
const handleError = (res, message, code = 500) => {
  res.status(code).json({ error: message });
};

// Get all pricing plans
const getPricingPlans = asyncHandler(async (req, res) => {
  const plans = await PricingPlan.find();
  res.status(200).json(plans);
});

// Add a new pricing plan
const addPricingPlan = asyncHandler(async (req, res) => {
    const { name, monthlyprice, features, yearlyDiscountedPrice, isPopular, maxProducts } = req.body;
  
    // Validate input
    if (!name || !monthlyprice || !Array.isArray(features) || !maxProducts) {
      return handleError(res, "Invalid input data", 400);
    }

    // Format features array with name and status
    const formattedFeatures = features.map(feature => {
      if (typeof feature === 'object' && feature.name) {
        return {
          name: feature.name,
          status: feature.status ?? true
        };
      }
      return {
        name: feature,
        status: true
      };
    });
  
    // Calculate yearly price
    let yearlyprice = monthlyprice * 12;
  
    // Calculate discounted yearly price if yearlyDiscountedPrice is provided as a percentage
    if (yearlyDiscountedPrice) {
      // If it's a percentage, calculate the discount amount
      yearlyprice = yearlyprice - (yearlyprice * (yearlyDiscountedPrice / 100));
    }
  
    // Create and save the new pricing plan
    const newPlan = new PricingPlan({
      name,
      monthlyprice,
      features: formattedFeatures,
      yearlyprice,
      yearlyDiscountedPrice, // Store the percentage discount for reference
      isPopular,
      maxProducts,
    });
  
    await newPlan.save();
    res.status(201).json({ message: "Pricing plan added successfully", plan: newPlan });
  });
  

// Update a pricing plan
const updatePricingPlan = asyncHandler(async (req, res) => {
  // First get existing plan
  const existingPlan = await PricingPlan.findById(req.params.id);
  if (!existingPlan) {
    return handleError(res, "Pricing plan not found", 404);
  }

  // Get fields from request, fallback to existing values if not provided
  const name = req.body.name || existingPlan.name;
  const monthlyprice = req.body.monthlyprice || existingPlan.monthlyprice;
  const maxProducts = req.body.maxProducts || existingPlan.maxProducts;
  const isPopular = req.body.isPopular !== undefined ? req.body.isPopular : existingPlan.isPopular;
  const yearlyDiscountedPrice = req.body.yearlyDiscountedPrice !== undefined ? 
    req.body.yearlyDiscountedPrice : existingPlan.yearlyDiscountedPrice;

  // Handle features - keep existing if not provided
  let formattedFeatures = existingPlan.features;
  if (req.body.features && Array.isArray(req.body.features)) {
    formattedFeatures = req.body.features.map(feature => {
      if (typeof feature === 'object' && feature.name) {
        return {
          name: feature.name,
          status: feature.status ?? true
        };
      }
      return {
        name: feature,
        status: true
      };
    });
  }

  // Calculate yearly price
  let yearlyprice = monthlyprice * 12;
  if (yearlyDiscountedPrice) {
    yearlyprice = yearlyprice - (yearlyprice * (yearlyDiscountedPrice / 100));
  }

  // Update the pricing plan
  const updatedPlan = await PricingPlan.findByIdAndUpdate(
    req.params.id,
    { 
      name, 
      monthlyprice, 
      features: formattedFeatures, 
      yearlyprice, 
      yearlyDiscountedPrice, 
      isPopular,
      maxProducts,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ message: "Pricing plan updated successfully", plan: updatedPlan });
});

// Delete a pricing plan
const deletePricingPlan = asyncHandler(async (req, res) => {
  const deletedPlan = await PricingPlan.findByIdAndDelete(req.params.id);

  if (!deletedPlan) {
    return handleError(res, "Pricing plan not found", 404);
  }

  res.status(200).json({ message: "Pricing plan deleted successfully" });
});

module.exports = {
  getPricingPlans,
  addPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
};
