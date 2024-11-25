const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  categoryCode: {
    type: String,
    required: true,
  },
  // categoryIcon:{
  //   type: String,
  //   required: true,
  // },
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

module.exports = mongoose.model('Categories', categorySchema);
