const mongoose = require("mongoose");

const { Schema } = mongoose;

const salesSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    profit: {
      type: Number,
      required: true,
    },
    loss: {
      type: Number,
      required: true,
    },
    qtySold: {
      type: Number,
      required: true,
    },
    buyingPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      default: 0,
    },
    finalPrice:{
      type: Number,
      default: function () {
        return this.sellingPrice;
      },
    },
    discount: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
