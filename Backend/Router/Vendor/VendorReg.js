const express = require('express');
const router = express.Router();
const User = require('../../Model/Vendor/VendorReg');
const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");

const generateToken = (id, vendorName,Role) => {
  return jwt.sign({ _id: id, vendorName,Role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

router.post('/register', async (req, res) => {
  try {
    const { lastName, firstName, email, password, Role,verify } = req.body;

    // Check if a user with the provided phone or email already exists
    let existingUser = null;

    if (email) {
      existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      // Update the existing user's details if they match the input email or phone
      existingUser.firstname = firstName;
      existingUser.lastname = lastName;
      existingUser.Role = Role;
      existingUser.email = email || existingUser.email;
      existingUser.password = password;
      existingUser.verify = verify || false; // Update the verify field to false
      const updatedUser = await existingUser.save();
      res.status(200).json({ _id: updatedUser._id });
    } else {
      // Create a new user
      const newUser = new User({
        firstname: firstName,
        lastname: lastName,
        email,
        password,
        Role,
        verify: verify || false
      });

      // Save the new user to the database
      const savedUser = await newUser.save();
      res.status(201).json({ _id: savedUser._id });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.put('/verify/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the verify field to true
    user.verify = true;

    // Save the updated user
    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id, updatedUser.firstname, updatedUser.Role)
    const userWithToken = updatedUser.toObject();
    userWithToken.token = token;
    res.json(userWithToken);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a user by _id
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firsname', 'lastname', 'email', 'password', 'verify'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;