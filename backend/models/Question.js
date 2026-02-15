<<<<<<< HEAD
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    domain: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    modelAnswer: {
      type: String,
      required: true,
    },
    keywords: [String],
    category: {
      type: String,
      default: 'general',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
=======
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  domain: String,        // frontend, backend, fullstack, etc
  difficulty: String,    // easy, medium, hard
  question: String,
  modelAnswer: String
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
