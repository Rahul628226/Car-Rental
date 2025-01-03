const express = require('express');
const mongoose = require('mongoose');
const Car = require('../../Model/CarDetails/CarDetails'); // Adjust the path as needed
const capacity = require('../../Model/CarDetails/Seat')
const router = express.Router();
const CarBrand = require('../../Model/CarDetails/CarBrand/Carbrand')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

// Helper function to upload images to S3
async function uploadImagesToS3(images) {
  const uploadedImages = [];
  for (const image of images) {
    const fileName = `cars/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
      ContentType: 'image/jpeg',
      ACL: "public-read",
    };
    await s3.send(new PutObjectCommand(params));
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    uploadedImages.push(fileUrl);
  }
  return uploadedImages;
}

// Create a new car
router.post('/cars', async (req, res) => {
  try {
    const { images, exteriorImages, ...carData } = req.body;
    
    // Upload images to S3
    const uploadedCarImages = await uploadImagesToS3(images);
    const uploadedExteriorImages = await uploadImagesToS3(exteriorImages);

    const car = new Car({
      ...carData,
      carImage: uploadedCarImages,
      exteriorImages: uploadedExteriorImages
    });
    await car.save();
    res.status(201).json({ message: 'Car created successfully', car });
  } catch (error) {
    res.status(400).json({ message: 'Error creating car', error: error.message });
  }
});

// Update a car by _id
router.put('/cars/:id', async (req, res) => {
  try {
    const { images, exteriorImages, ...updateData } = req.body;
    
    if (images) {
      // Upload new car images to S3
      const uploadedCarImages = await uploadImagesToS3(images);
      updateData.carImage = uploadedCarImages;
    }

    if (exteriorImages) {
      // Upload new exterior images to S3
      const uploadedExteriorImages = await uploadImagesToS3(exteriorImages);
      updateData.exteriorImages = uploadedExteriorImages;
    }

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id, 
      { $set: updateData },
      { new: true }
    );
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
    const carsWithDetails = await Promise.all(cars.map(async (car) => {
      const seat = await capacity.findById(car.capacity);
      const brand = await CarBrand.findById(car.brand);
      return {
        ...car.toObject(),
        capacity: seat ? seat.seatNumber : null,
        brand: brand ? brand.name : null,
      };
    }));
    res.status(200).json({ message: 'Cars retrieved successfully', cars: carsWithDetails });
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

router.get('/cars/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car retrieved successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving car', error: error.message });
  }
});

module.exports = router;