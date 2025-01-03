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
    type:String,
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
  yearOfManufacture:{
    type: Number,
    required: true,
  },
  exteriorImages: [{
    type: String, 
    required: true,
  }],
  vin: {
    type: Number,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  doors: {
    type: Number,
    required: true,
  },
  driveTerrain: {
    type: String,
    required: true,
  },
  tireCondition: {
    type: String,
    required: true,
  },
  tradingOption: {
    type: String,
    required: true,
  },
  priceNegotiation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Car', carSchema);
