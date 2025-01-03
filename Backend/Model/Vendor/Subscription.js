const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    PricingPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PricingPlan',
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    plantype: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    start_date: {
        type: Date,
        required: true
    },
    duration: {
        type: String,
        enum: ['monthly', 'yearly'],
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    SubScriptionstatus: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
