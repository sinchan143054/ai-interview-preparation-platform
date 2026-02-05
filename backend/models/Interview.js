const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  domain: String,
  difficulty: String,

  questionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    }
  ],

  currentQuestionIndex: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    default: "ongoing" // ongoing | completed
  },

  overallScore: {
    type: Number,
    default: 0
  },

  skillSummary: {
    technical: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 }
  }

}, { timestamps: true });

module.exports = mongoose.model("Interview", interviewSchema);
