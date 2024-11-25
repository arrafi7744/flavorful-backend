const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
  },
  subCategoryCode:{
    type: Number,
    required: true,
  },
  // subCategoryIconName:{
  //   type: String,
  //   required: true,
  // },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
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
module.exports = mongoose.model("Subcategories", subCategorySchema);
