const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId, ref: 'CarBrand',
    required: true,
  },
  model: {
    type: mongoose.Schema.Types.ObjectId, ref: 'carmodel',
    required: true,
  },
  vendorId:{
    type: String,
   
  },
  color: {
    type: mongoose.Schema.Types.ObjectId, ref: 'CarColor',
    required: true,
  },
  capacity: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Seat',
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
   
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, 
  },
  carImage: [{
    type: String, 
    required: true,
  }],
  additionalFeatures: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'CarFeature',
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: 'CarCategory',
    required: true,
  },
  vehicleAge: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Car', carSchema);
