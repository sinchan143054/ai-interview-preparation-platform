const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    interviewId: {
      type: String,
      required: true,
    },
    domain: String,
    difficulty: String,
    technical: Number,
    communication: Number,
    confidence: Number,
    problemSolving: Number,
    overall: Number,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Score', scoreSchema);
