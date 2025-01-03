const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../../Model/Vendor/VendorReg'); // Adjust the path to your User model
const router = express.Router();


// Route for customer login
router.post('/customerlogin', async (req, res) => {
  const { email, password,recaptchaToken } = req.body;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Set in your environment
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify`;

  try {

    const recaptchaResponse = await axios.post(recaptchaUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaToken,
      },
    });

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update the last login date to the current date
    user.lastlogin = new Date();
    await user.save();

    res.json({
      userId: user._id,
      isVerified: user.verify, // Include the verification status
      message: 'Login successful',
      
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route for identifying user by email
router.post('/finduserbyemail', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is verified
    const response = {
      userId: user._id,
      verifiedStatus: user.verify
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route for updating password
router.put('/updatepassword', async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'User ID and new password are required' });
    }

    // Update the user's password directly
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword; // Set the new password
    user.verify = true;
    await user.save(); // This will trigger the pre-save hook to hash the password

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route for verifying user
router.put('/verifyuser/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the user's verification status
    const user = await User.findByIdAndUpdate(id, { verify: true }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User verified successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
