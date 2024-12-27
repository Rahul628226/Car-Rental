const mongoose = require('mongoose');

const FeaturesSchema = new mongoose.Schema(
  {
    featureName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Feature = mongoose.model('CarFeature', FeaturesSchema);
module.exports = Feature;
