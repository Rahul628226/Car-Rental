const express = require('express');
const mongoose = require('mongoose');
const User = require('../../Model/Vendor/VendorReg'); 
const Profile = require('../../Model/Customerside/CustomerReg/Profile'); 
const CustomerAddress = require('../../Model/Customerside/CustomerReg/CustomerAddress'); 

const router = express.Router();

// Route to list userId, name, accountType, createdAt from customer collection, with filtering
router.get('/Customerlist', async (req, res) => {
    try {
      const { searchItem, accountType } = req.query;
      const userQuery = {};
  
      if (searchItem) {
        const regex = new RegExp(searchItem, 'i');
        userQuery.$or = [
          { name: { $regex: regex } },
          { userId: { $regex: regex } }
        ];
      }
  
      // Fetch users matching the search criteria
      const users = await User.find(userQuery).select('userId name createdAt');
  
      // Create a list of userIds to filter profiles
      const userIds = users.map(user => user._id);
  
      // Fetch profiles matching the userIds and accountType (if specified)
      const profileQuery = { userId: { $in: userIds } };
      if (accountType) {
        profileQuery.accountType = accountType;
      }
      
      const profiles = await Profile.find(profileQuery).select('userId accountType');
  
      // Create a map of profiles for easier access
      const profileMap = profiles.reduce((map, profile) => {
        map[profile.userId.toString()] = profile;
        return map;
      }, {});
  
      // Merge user details with account types, only if profile matches accountType
      const userProfiles = users.filter(user => profileMap[user._id.toString()]).map(user => {
        const profile = profileMap[user._id.toString()];
        return {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          lastlogin: user.lastlogin,
          accountType: profile.accountType,
          createdAt: user.createdAt
        };
      });
  
      res.json(userProfiles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

// Route to get all details based on _id, including address details
router.get('/Customerlist/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('userId name email phone createdAt lastlogin');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = await Profile.findOne({ userId: user._id }).select('accountType name trnNo officeNo');
    const addresses = await CustomerAddress.find({ userId: user._id });

    res.json({ user, profile, addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
