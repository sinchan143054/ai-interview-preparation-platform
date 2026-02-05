const express = require("express");
const Question = require("../models/Question");

const router = express.Router();

// Add question (admin)
router.post("/add-question", async (req, res) => {
  try {
    const q = await Question.create(req.body);
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get questions (candidate)
router.get("/questions", async (req, res) => {
  try {
    const { role, difficulty } = req.query;
    const questions = await Question.find({ role, difficulty }).limit(5);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
