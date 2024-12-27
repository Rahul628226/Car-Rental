const mongoose = require("mongoose");

const PricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  monthlyprice: {
    type: Number,
    required: true,
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      required: true
    }
  }],
  yearlyDiscountedPrice: {
    type: Number,
  },
  yearlyprice: {
    type: Number,
    required: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  maxProducts: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("PricingPlan", PricingPlanSchema);
