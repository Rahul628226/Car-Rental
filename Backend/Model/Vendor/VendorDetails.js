const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema
const VendorDetailsSchema = new Schema(
  {
    vendor_id: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor', // Replace 'Vendor' with the exact name of your vendor model
      required: true,
    },
    location: { type: String, trim: true },
    address: { type: String, trim: true },
    street: { type: String, trim: true },
    door: { type: String, trim: true },
    building: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    starttime: { type: String, trim: true },
    endtime: { type: String },
    logo: { type: String },
    businessVerify: { type: String },
    phone: { type: String, trim: true },
    registrationNumber: { type: String, trim: true, unique: true },
    yearsInBusiness: { type: Number, min: 0 },
    currency: { type: String, trim: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Pre-save middleware to auto-generate registrationNumber
VendorDetailsSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  const currentYear = new Date().getFullYear().toString().slice(-2); // Last two digits of the year
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); // Month in MM format

  const prefix = `${currentYear}${currentMonth}`;
  
  // Find the latest registrationNumber starting with the current prefix
  const latestVendor = await this.constructor
    .findOne({ registrationNumber: new RegExp(`^${prefix}`) })
    .sort({ registrationNumber: -1 })
    .exec();

  let nextNumber = 1;

  if (latestVendor && latestVendor.registrationNumber) {
    const lastNumber = parseInt(latestVendor.registrationNumber.slice(-3), 10);
    nextNumber = lastNumber + 1;
  }

  this.registrationNumber = `${prefix}${String(nextNumber).padStart(3, '0')}`;
  next();
});

module.exports = mongoose.model('VendorDetails', VendorDetailsSchema);
