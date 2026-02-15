<<<<<<< HEAD
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['candidate', 'admin', 'superadmin', 'reviewer'],
      default: 'candidate',
    },
    createdBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
=======
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["candidate", "admin"],
    default: "candidate"
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
