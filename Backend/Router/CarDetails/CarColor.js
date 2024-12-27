const express = require('express');
const CarColor = require('../../Model/CarDetails/CarColor'); // Adjust the path to your model
const router = express.Router();

// Create a new car color
router.post('/CarColor', async (req, res) => {
  try {
    const { CarColor: carColorName } = req.body.CarColor;

   

    // Ensure CarColor is a string
    if (typeof carColorName !== 'string') {
      return res.status(400).json({ success: false, error: 'CarColor must be a string' });
    }

    const color = new CarColor({ CarColor: carColorName });
    await color.save();
    res.status(201).json({ success: true, message: 'Car color created successfully', data: color });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update an existing car color
router.put('/CarColor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { CarColor: carColorName } = req.body;

    if (typeof carColorName !== 'string') {
      return res.status(400).json({ success: false, error: 'CarColor must be a string' });
    }

    const color = await CarColor.findByIdAndUpdate(id, { CarColor: carColorName }, { new: true });
    if (!color) {
      return res.status(404).json({ success: false, message: 'Car color not found' });
    }

    res.json({ success: true, message: 'Car color updated successfully', data: color });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all car colors
router.get('/CarColor', async (req, res) => {
  try {
    const colors = await CarColor.find();
    res.json({ success: true, data: colors });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a car color
router.delete('/CarColor/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const color = await CarColor.findByIdAndDelete(id);

    if (!color) {
      return res.status(404).json({ success: false, message: 'Car color not found' });
    }

    res.json({ success: true, message: 'Car color deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
