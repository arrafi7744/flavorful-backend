const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces from the beginning and end
    },
    shopFullName: {
      type: String,
      required: false,
      trim: true, // Removes extra spaces from the beginning and end
    },
    shopDescription: {
      type: String,
      required: true,
    },

    shopLogo: {
      type: String,
      required: false,
    },
    shopCategory: {
      type: String,
      required: false,
    },
    products: {
      type: Array,
      default: [],
    },
    location: {
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      state: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: false,
        // match: /^[0-9]{5}$/, // Optional: regex for postal code validation
      },
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
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model('Shops', shopSchema);
