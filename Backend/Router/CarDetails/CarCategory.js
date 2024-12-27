const express = require('express');
const CarCategory = require('../../Model/CarDetails/CarCategory');
const router = express.Router();

// Create a car category
router.post('/Carcategory', async (req, res) => {
  try {
    const { Carcategory } = req.body.Carcategory;
    const category = new CarCategory({ Carcategory });
    await category.save();
    res.status(201).json({ success: true, message: 'Carcategory created successfully', data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update a car category by ID
router.put('/Carcategory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Carcategory } = req.body;
    const category = await CarCategory.findByIdAndUpdate(id, { Carcategory }, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Carcategory not found' });
    }
    res.json({ success: true, message: 'Carcategory updated successfully', data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all car categories
router.get('/Carcategory', async (req, res) => {
  try {
    const categories = await CarCategory.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a car category by ID
router.delete('/Carcategory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CarCategory.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Carcategory not found' });
    }
    res.json({ success: true, message: 'Carcategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
