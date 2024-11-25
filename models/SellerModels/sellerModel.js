const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  userType: {
    type: Number,
    default: 1,
  },
  productUploaded: {
    type: Number,
    default: 0,
  },
  salesGenerated: {
    type: Number,
    default: 0,
  },
  hiredDate: {
    type: Date,
    default: function () {
      return this.createdDate;
    },
  },
  initialSalary: {
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

module.exports = mongoose.model("Sellers", sellerSchema);
