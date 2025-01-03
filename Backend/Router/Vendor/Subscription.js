const express = require('express');
const router = express.Router();
const Subscription = require('../../Model/Vendor/Subscription');
const Vendor = require('../../Model/Vendor/VendorReg');
const nodemailer = require('nodemailer');
const validateVendorToken = require('../../middleware/validateVendorToken');
const cron = require('node-cron');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper function to calculate end date
const calculateEndDate = (startDate, duration) => {
  const end = new Date(startDate);
  if (duration === 'monthly') {
    end.setMonth(end.getMonth() + 1);
  } else if (duration === 'yearly') {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
};

// Helper function to send subscription email
const sendSubscriptionEmail = async (vendorEmail, subscriptionDetails) => {
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50;">Subscription Confirmation</h2>
      <p>Thank you for subscribing to our service!</p>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #2c3e50;">Subscription Details:</h3>
        <p><strong>Plan:</strong> ${subscriptionDetails.planName}</p>
        <p><strong>Start Date:</strong> ${subscriptionDetails.startDate.toLocaleDateString()}</p>
        <p><strong>End Date:</strong> ${subscriptionDetails.endDate.toLocaleDateString()}</p>
        <p><strong>Amount Paid:</strong> $${subscriptionDetails.amount}</p>
      </div>
      <p>Your subscription will expire on ${subscriptionDetails.endDate.toLocaleDateString()}. We'll send you a reminder before the expiration date.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: vendorEmail,
    subject: 'Subscription Confirmation',
    html: emailTemplate
  });
};

// Add subscription
router.post('/createSubscription', validateVendorToken, async (req, res) => {
  try {
    const vendor_id = req.vendor_id;
    const { PricingPlanId, duration, amount, plantype } = req.body;

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const existingSubscription = await Subscription.findOne({
      vendor_id,
      SubScriptionstatus: 'active'
    });

    if (existingSubscription) return res.status(400).json({ message: 'Vendor already has an active subscription' });

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, duration);

    const subscription = new Subscription({
      vendor_id,
      PricingPlanId,
      start_date: startDate,
      end_date: endDate,
      plantype,
      duration,
      amount,
      SubScriptionstatus: 'active',
      payment_status: 'completed',
      status: true
    });

    await subscription.save();
    await sendSubscriptionEmail(vendor.email, { planName: duration === 'monthly' ? 'Monthly Plan' : 'Yearly Plan', startDate, endDate, amount });

    res.status(201).json({ message: 'Subscription added successfully', subscription });

  } catch (error) {
    res.status(500).json({ message: 'Error adding subscription', error: error.message });
  }
});

// Update subscription
router.put('/updateSubscription/:subscription_id', validateVendorToken, async (req, res) => {
  try {
    const { subscription_id } = req.params;
    const vendor_id = req.vendor_id;
    const { plan_id, duration, amount } = req.body;

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const subscription = await Subscription.findOne({ _id: subscription_id, vendor_id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, duration);

    subscription.PricingPlanId = plan_id || subscription.PricingPlanId;
    subscription.duration = duration || subscription.duration;
    subscription.amount = amount || subscription.amount;
    subscription.start_date = startDate;
    subscription.end_date = endDate;

    await subscription.save();
    await sendSubscriptionEmail(vendor.email, { planName: duration === 'monthly' ? 'Monthly Plan' : 'Yearly Plan', startDate, endDate, amount });

    res.json({ message: 'Subscription updated successfully', subscription });

  } catch (error) {
    res.status(500).json({ message: 'Error updating subscription', error: error.message });
  }
});

// Fetch subscription by vendor_id
router.get('/vendor', validateVendorToken, async (req, res) => {
  try {
    const vendor_id = req.vendor_id;

    const subscription = await Subscription.findOne({
      vendor_id,
      SubScriptionstatus: 'active'
    }).populate('PricingPlanId');

    if (!subscription) return res.status(404).json({ message: 'No active subscription found' });

    res.json(subscription);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
});

// Check and update expired subscriptions daily at 10 AM
cron.schedule('0 10 * * *', async () => {
  try {
    const today = new Date();
    console.log('Subscription cron Activity');

    const subscriptions = await Subscription.find({ SubScriptionstatus: 'active' }).populate('vendor_id');

    for (const subscription of subscriptions) {
      const vendor = subscription.vendor_id;

      if (subscription.end_date <= today) {
        subscription.SubScriptionstatus = 'expired';
        await subscription.save();

        const expirationTemplate = `
          <div style="font-family: Arial, sans-serif;">
            <h2>Subscription Expired</h2>
            <p>Your subscription expired on ${subscription.end_date.toLocaleDateString()}.</p>
          </div>
        `;

        await transporter.sendMail({ from: process.env.SMTP_USER, to: vendor.email, subject: 'Subscription Expired', html: expirationTemplate });
      } else if (subscription.end_date <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        const reminderTemplate = `
          <div style="font-family: Arial, sans-serif;">
            <h2>Subscription Expiring Soon</h2>
            <p>Your subscription will expire on ${subscription.end_date.toLocaleDateString()}.</p>
          </div>
        `;

        await transporter.sendMail({ from: process.env.SMTP_USER, to: vendor.email, subject: 'Subscription Expiring Soon', html: reminderTemplate });
      }
    }
  } catch (error) {
    console.error('Error checking and updating subscriptions:', error);
  }
});

module.exports = router;
