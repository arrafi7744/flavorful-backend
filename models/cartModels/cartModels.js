const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true,
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  totalPrice:{
    type:Number,
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

module.exports = mongoose.model("Carts", cartSchema);
