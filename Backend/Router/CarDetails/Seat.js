const express = require('express');
const Seat = require('../../Model/CarDetails/Seat'); // Adjust the path as per your directory structure
const router = express.Router();

// Create a new seat
router.post('/seats', async (req, res) => {
  try {
    const { seatNumber } = req.body.seatNumber;
    const seat = new Seat({ seatNumber });
    await seat.save();
    res.status(201).json({ success: true, message: 'Seat created successfully', data: seat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.put('/seats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { seatNumber } = req.body;
    const seat = await Seat.findByIdAndUpdate(id, { seatNumber }, { new: true });
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.json({ success: true, message: 'Seat updated successfully', data: seat });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});


router.get('/seats', async (req, res) => {
  try {
    const seats = await Seat.find();
    res.json({ success: true, data: seats });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete a seat by ID
router.delete('/seats/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const seat = await Seat.findByIdAndDelete(id);
    if (!seat) {
      return res.status(404).json({ success: false, message: 'Seat not found' });
    }
    res.json({ success: true, message: 'Seat deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
