const mongoose = require("mongoose");

const customerReceiptSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customers",
    required: true,
  },
  receiptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receipts",
    required: true,
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

module.exports = mongoose.model("CustomerReceipts", customerReceiptSchema);
