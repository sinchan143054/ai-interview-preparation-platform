const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  domain: String,        // frontend, backend, fullstack, etc
  difficulty: String,    // easy, medium, hard
  question: String,
  modelAnswer: String
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
