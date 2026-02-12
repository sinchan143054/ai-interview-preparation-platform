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
