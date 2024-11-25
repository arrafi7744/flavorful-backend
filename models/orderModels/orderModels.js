const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userFullName: {
    type: String,
    required: true,
  },
  userPhoneNumber: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userCountry: {
    type: String,
    required: false,
  },
  userState: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  userPostalCode: {
    type: Number,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productThumb: {
    type: String,
    required: true,
  },
  productSellingPrice: {
    type: Number,
    required: true,
  },
  totalQuantity: {
    type: Number,
    requried: true,
  },
  allTotalPrice: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    require: false,
  },
  discount: {
    type: Number,
    default: 0,
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  deliveryShift: {
    type: String,
    default: "",
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  orderType: {
    type: Number,
    required: false,
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isLaunched: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model("Orders", orderSchema);
