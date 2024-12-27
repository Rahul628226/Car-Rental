const mongoose = require('mongoose');

const CarColorSchema = new mongoose.Schema({
  CarColor: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('CarColor', CarColorSchema);
