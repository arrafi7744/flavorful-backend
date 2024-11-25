const mongoose = require('mongoose');

var deliverCharge = new mongoose.Schema({
    deliveryFee: {
        type: Number,
        required: true,
    },
    deliveryShift: {
        type: String,
        required: true,
    },
    deliveryShiftNumber: {
        type: Number,
        required :true,
        unqiue: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
    deletedDate: {
        type: Date,
        default: null,
    },
});

module.exports = mongoose.model('DeliveryCharge', deliverCharge);