const express = require('express');
const mongoose = require('mongoose');
const Car = require('../../Model/CarDetails/CarDetails'); // Adjust the path as needed

const router = express.Router();

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Create a new car
router.post('/cars', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

// Update a car by _id
router.put('/cars/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', updatedCar });
  } catch (error) {
    res.status(400).json({ message: 'Error updating car', error: error.message });
  }
});

// Display all cars
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ message: 'Cars retrieved successfully', cars });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cars', error: error.message });
  }
});

// Display cars based on vendorId
router.get('/cars/vendor/:vendorId', async (req, res) => {
  try {
    const cars = await Car.find({ vendorId: req.params.vendorId });
    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found for the given vendorId' });
    }
    res.status(200).json({ message: 'Cars retrieved successfully', cars });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cars', error: error.message });
  }
});

// Delete a car by _id
router.delete('/cars/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car deleted successfully', deletedCar });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
});

module.exports = router;
