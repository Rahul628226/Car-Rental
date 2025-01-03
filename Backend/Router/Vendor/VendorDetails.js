const express = require('express');
const router = express.Router();
const VendorDetails = require('../../Model/Vendor/VendorDetails'); // Adjust the path as needed
const validateVendorToken = require('../../middleware/validateVendorToken');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");



const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });


  async function uploadImagesToS3(images) {
    const uploadedImages = [];
    for (const image of images) {
      const fileName = `cars/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
        Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64'),
        ContentType: 'image/jpeg',
        ACL: "public-read",
      };
      await s3.send(new PutObjectCommand(params));
      const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
      uploadedImages.push(fileUrl);
    }
    return uploadedImages;
  }


// Create or Update VendorDetails
router.post('/vendor-details', validateVendorToken, async (req, res) => {
    const { logo, businessVerify, ...updateData } = req.body.updateData;
    const vendor_id = req.vendor_id;
  
    if (!vendor_id) {
      return res.status(400).json({ error: 'Vendor ID is required or unauthorized' });
    }
  
    try {
      // Upload logo and businessVerify if provided
      let uploadedLogo = null;
      let uploadedBusinessVerify = null;
      const isBase64 = (str) => /^data:image\/\w+;base64,/.test(str);
  
      if (logo && isBase64(logo)) {
        uploadedLogo = await uploadImagesToS3([logo]); // Assuming `logo` is a single base64 string
      }
      if (businessVerify && isBase64(businessVerify)) {
        uploadedBusinessVerify = await uploadImagesToS3([businessVerify]); // Assuming `businessVerify` is a single base64 string
      }
  
      // Find existing VendorDetails
      const existingDetails = await VendorDetails.findOne({ vendor_id });
  
      if (existingDetails) {
        // Prepare update data
        const updateFields = { ...updateData };
        if (uploadedLogo) {
          updateFields.logo = uploadedLogo[0]; // Use the first URL from uploadedLogo
        }
        if (uploadedBusinessVerify) {
          updateFields.businessVerify = uploadedBusinessVerify[0]; // Use the first URL from uploadedBusinessVerify
        }
  
        // Update existing VendorDetails
        const updatedDetails = await VendorDetails.findOneAndUpdate(
          { vendor_id },
          { $set: updateFields },
          { new: true, runValidators: true }
        );
        return res.status(200).json({ message: 'Vendor details updated', data: updatedDetails });
      } else {
        // Create new VendorDetails
        const newDetails = new VendorDetails({
          vendor_id,
          ...updateData,
          logo: uploadedLogo ? uploadedLogo[0] : null,
          businessVerify: uploadedBusinessVerify ? uploadedBusinessVerify[0] : null,
        });
        await newDetails.save();
        return res.status(201).json({ message: 'Vendor details created', data: newDetails });
      }
    } catch (error) {
      console.error(`Error in POST /vendor-details: ${error.message}`);
      return res.status(500).json({ error: 'An internal error occurred' });
    }
  });
  

// Fetch VendorDetails by vendor_id from URL
router.get('/vendor-details/:vendor_id', async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const vendorDetails = await VendorDetails.findOne({ vendor_id });

    if (!vendorDetails) {
      return res.status(404).json({ error: 'Vendor details not found' });
    }

    return res.status(200).json({ data: vendorDetails });
  } catch (error) {
    console.error(`Error in GET /vendor-details/:vendor_id: ${error.message}`);
    return res.status(500).json({ error: 'An internal error occurred' });
  }
});

// Fetch VendorDetails for logged-in vendor
router.get('/vendor-details', validateVendorToken, async (req, res) => {
  const vendor_id = req.vendor_id;

  try {
    const vendorDetails = await VendorDetails.findOne({ vendor_id });

    if (!vendorDetails) {
      return res.status(404).json({ error: 'Vendor details not found' });
    }

    return res.status(200).json({ data: vendorDetails });
  } catch (error) {
    console.error(`Error in GET /vendor-details: ${error.message}`);
    return res.status(500).json({ error: 'An internal error occurred' });
  }
});

module.exports = router;
