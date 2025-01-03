const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Define a schema for tracking the last sequence number
const sequenceSchema = new Schema({
  yearMonth: { type: String, unique: true },
  lastSeqNumber: { type: Number, default: 0 }
});

const Sequence = mongoose.model('custoNo', sequenceSchema);

const userSchema = new Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },

  Role: {
    type: String,
    required:true,
  },

  email: {
    type: String,
    lowercase: true,
    sparse: true, // Allow for sparse indexing
  },
  password: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    unique: true,
  },
  lastlogin: {
    type: String,
  },
}, {
  timestamps: true
});

// Pre-save middleware to hash password and generate userId
userSchema.pre('save', async function (next) {
  const user = this;

  // Hash the password if it is modified
  if (user.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    } catch (error) {
      return next(error);
    }
  }

  // Generate the userId if it is a new document
  if (user.isNew) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
      const month = ('0' + (now.getMonth() + 1)).slice(-2); // Current month
      const yearMonth = year + month;

      let sequence = await Sequence.findOne({ yearMonth });
      if (!sequence) {
        sequence = new Sequence({ yearMonth });
      }
      sequence.lastSeqNumber += 1;
      await sequence.save();

      const seqNumber = ('0000' + sequence.lastSeqNumber).slice(-4); // Zero-padded sequence number
      user.userId = `${yearMonth}USR${seqNumber}`;
    } catch (error) {
      return next(error);
    }
  }

  next();
});

const User = mongoose.model('Vendor', userSchema);

module.exports = User;
