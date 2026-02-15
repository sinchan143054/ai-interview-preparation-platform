<<<<<<< HEAD
const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: String,
    domain: String,
    difficulty: String,
    questions: [
      {
        questionId: String,
        question: String,
        userAnswer: String,
        modelAnswer: String,
        scores: {
          technical: Number,
          communication: Number,
          confidence: Number,
          overall: Number,
        },
        sentiment: String,
        answeredAt: Date,
      },
    ],
    status: {
      type: String,
      enum: ['ongoing', 'completed', 'abandoned'],
      default: 'ongoing',
    },
    finalScore: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      problemSolving: { type: Number, default: 0 },
      overall: { type: Number, default: 0 },
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
    duration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interview', interviewSchema);
=======
const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "demoUser"
  },
  domain: String,
  difficulty: String,
  questionIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Question" }
  ],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: "ongoing"
  }
});

module.exports = mongoose.model("Interview", interviewSchema);
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
