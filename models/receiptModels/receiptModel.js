const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const receiptSchema = new mongoose.Schema({
  uniqueKeyId: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4, // Generate a unique key ID by default
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId, // Assuming you are referencing the User model
    ref: "User",
    required: true,
  },
  orderIds: [
    {
      type: mongoose.Schema.Types.ObjectId, // Assuming you are referencing the Order model
      ref: "Order",
      required: true,
    },
  ],
  
  totalProductQuantity: {
    type: Number,
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

module.exports = mongoose.model("Receipts", receiptSchema);
