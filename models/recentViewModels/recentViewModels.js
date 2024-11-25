const mongoose = require('mongoose');

const recentViewsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // Corrected usage of required
  },
  productId: {
    type: String,
    required: true, // Corrected usage of required
  },
  productDetails: {
    type: Object, // Stores the full product details as an object
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now, // Automatically set the view time
  },
});
recentViewsSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('RecentView', recentViewsSchema);
