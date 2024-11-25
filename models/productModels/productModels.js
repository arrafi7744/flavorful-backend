const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  shopId: {
    type: String,
    required: false,
  },
  categoryId: {
    required: true,
  },
  // shopName: {
  //   type: String,
  //   required: false,
  // },
  // shopCategory: {
  //   type: String,
  //   required: false,
  // },
  // shopAddress: {
  //   type: Object,
  //   address: {
  //     type: String,
  //     required: false,
  //   },
  //   city: {
  //     type: String,
  //     required: false,
  //   },
  //   state: {
  //     type: String,
  //     required: false,
  //   },
  //   country: {
  //     type: String,
  //     required: false,
  //   },
  //   postalCode: {
  //     type: String,
  //     required: false,
  //   },
  // },

  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productThumb: {
    type: String,
    required: false,
  },
  productsImg: [],
  buyingPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  categoryId: {
    // type: mongoose.Schema.Types.ObjectId,
    type: String,
    ref: "Category",
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

module.exports = mongoose.model("Products", productSchema);
