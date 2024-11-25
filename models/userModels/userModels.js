const mongoose = require('mongoose');

const UserTypes = {
  FARMER: 101,
  BUYER: 103,
  ADMIN: 109,
};

const userSchema = new mongoose.Schema({
  userType: {
    type: Number,
    required: false,
    enum: [UserTypes.FARMER, UserTypes.BUYER, UserTypes.ADMIN],
  },
  approvalId: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: true,
  },
  userFullName: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPass: {
    type: String,
    required: false,
  },
  userImg: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
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
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model('Users', userSchema);
