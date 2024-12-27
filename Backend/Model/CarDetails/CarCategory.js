const mongoose = require('mongoose');

const CarCategorySchema = new mongoose.Schema({
  Carcategory: {
    type: String,
    required: true,
    trim: true,
  },
});

const CarCategory = mongoose.model('CarCategory', CarCategorySchema);
module.exports = CarCategory;
