const express = require('express');
const Feature = require('../../Model/CarDetails/Features'); // Adjust the path as per your directory structure
const router = express.Router();

// Create a new feature
router.post('/carFeatures', async (req, res) => {
  try {
    const { featureName } = req.body;
    const carFeature = new Feature({ featureName });
    await carFeature.save();
    res.status(201).json({ success: true, message: 'Feature created successfully', data: carFeature });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a feature
router.put('/carFeatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { featureName } = req.body;
    const carFeature = await Feature.findByIdAndUpdate(id, { featureName }, { new: true });
    if (!carFeature) {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }
    res.json({ success: true, message: 'Feature updated successfully', data: carFeature });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Fetch all features
router.get('/carFeatures', async (req, res) => {
  try {
    const carFeatures = await Feature.find();
    res.json({ success: true, data: carFeatures });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a feature by ID
router.delete('/carFeatures/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const carFeature = await Feature.findByIdAndDelete(id);
    if (!carFeature) {
      return res.status(404).json({ success: false, message: 'Feature not found' });
    }
    res.json({ success: true, message: 'Feature deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
