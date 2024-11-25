const mongoose = require("mongoose");

const ratingMapperSchema = new mongoose.Schema({
  ratingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review",
    default: null,
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

module.exports = mongoose.model("RatingMapper", ratingMapperSchema);
