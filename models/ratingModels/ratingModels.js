const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  ratingCount: {
    type: Number,
    required: true,
  },
  totalRating: {
    type: Number,
    default: 0,
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Product",
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

module.exports = mongoose.model("Rating", ratingSchema);
