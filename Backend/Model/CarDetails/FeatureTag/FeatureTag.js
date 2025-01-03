const mongoose = require('mongoose');

const featureTagSchema = new mongoose.Schema({
  featureName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  location: {
    type: Number,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    default: 'active'
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car'
  }]
});

const FeatureTag = mongoose.model('FeatureTag', featureTagSchema);

module.exports = FeatureTag;
