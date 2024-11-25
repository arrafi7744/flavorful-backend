const mongoose = require("mongoose");

var ratingReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  userFullName:{
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  productThumb:{
    type: String,
    required: true,
  },
  productName:{
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  review: {
    type: String,
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

//Export the model
module.exports = mongoose.model("RatingReview", ratingReviewSchema);
