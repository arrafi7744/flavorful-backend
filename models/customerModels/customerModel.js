const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userType: {
    type: Number,
    default: 103,
  },
  shippingCountry: {
    type: String,
    required: false,
  },
  shippingState: {
    type: String,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  shippingPostalCode: {
    type: Number,
    requird: true,
  },
  status: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Customers", customerSchema);
