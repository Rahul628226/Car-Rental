const express = require('express');
const FeatureTag = require('../../../Model/CarDetails/FeatureTag/FeatureTag');
const router = express.Router();

// Create a new FeatureTag with auto-incrementing location
router.post('/featureTags', async (req, res) => {
  try {
    const { featureName, products } = req.body;

    // Find the highest current location
    const lastFeatureTag = await FeatureTag.findOne().sort({ location: -1 });

    const newFeatureTag = new FeatureTag({
      featureName,
      location: lastFeatureTag ? lastFeatureTag.location + 1 : 1,
      products
    });

    const savedFeatureTag = await newFeatureTag.save();
    res.status(201).json(savedFeatureTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get details based on _id
router.get('/featureTags/:id', async (req, res) => {
  try {
    const featureTag = await FeatureTag.findById(req.params.id).populate('products');
    if (!featureTag) return res.status(404).json({ message: 'FeatureTag not found' });
    res.json(featureTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all details sorted by location
router.get('/featureTags', async (req, res) => {
  try {
    const featureTags = await FeatureTag.find().sort({ location: 1 }).populate('products');
    res.json(featureTags);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get feature tags by product id
router.get('/featureTags/byProduct/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const featureTags = await FeatureTag.find({ products: productId }).populate('products');
    res.json(featureTags);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product from feature tag's products array
router.delete('/featureTags/:featureTagId/products/:productId', async (req, res) => {
  try {
    const { featureTagId, productId } = req.params;
    const featureTag = await FeatureTag.findByIdAndUpdate(
      featureTagId,
      { $pull: { products: productId } },
      { new: true }
    ).populate('products');
    if (!featureTag) return res.status(404).json({ message: 'FeatureTag not found' });
    res.json(featureTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete based on _id
router.delete('/featureTags/:id', async (req, res) => {
  try {
    const featureTag = await FeatureTag.findByIdAndDelete(req.params.id);
    if (!featureTag) return res.status(404).json({ message: 'FeatureTag not found' });
    res.json({ message: 'FeatureTag deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update based on _id
router.put('/featureTags/:id', async (req, res) => {
  try {
    const { featureName, location, products,status } = req.body;
    const featureTag = await FeatureTag.findByIdAndUpdate(
      req.params.id,
      { featureName, location, products,status },
      { new: true, runValidators: true }
    );
    if (!featureTag) return res.status(404).json({ message: 'FeatureTag not found' });
    res.json(featureTag);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
