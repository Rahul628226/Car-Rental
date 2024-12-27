const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true,
    unique: true
  }
}, { timestamps: true });

const Seat = mongoose.model('Seat', seatSchema);

module.exports = Seat;
