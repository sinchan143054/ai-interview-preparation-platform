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
