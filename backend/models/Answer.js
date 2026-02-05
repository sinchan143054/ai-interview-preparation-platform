const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview"
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  userAnswer: String,

  aiScore: Number,
  sentiment: String,
  aiFeedback: String,

  skillScores: {
    technical: Number,
    communication: Number,
    problemSolving: Number,
    confidence: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("Answer", answerSchema);
