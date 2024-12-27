const express = require("express");
const {
  getPricingPlans,
  addPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} = require("../../Controllers/pricingPlanController/pricingPlanController");

const router = express.Router();

// Define routes and map them to controller functions
router.get("/pricing-plans", getPricingPlans);
router.post("/pricing-plans", addPricingPlan);
router.put("/pricing-plans/:id", updatePricingPlan);
router.delete("/pricing-plans/:id", deletePricingPlan);

module.exports = router;
