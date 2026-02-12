const express = require("express");
const axios = require("axios");

const Interview = require("../models/Interview");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const mongoose = require("mongoose");

const router = express.Router();

/* =========================
TEST ROUTE
========================= */
router.post("/test", (req, res) => {
res.json({ message: "INTERVIEW ROUTE WORKING" });
});

/* =========================
ADD QUESTION
========================= */
router.post("/add-question", async (req, res) => {
try {
const { domain, difficulty, question, modelAnswer } = req.body;

```
const saved = await Question.create({
  domain,
  difficulty,
  question,
  modelAnswer
});

res.status(201).json(saved);
```

} catch (err) {
res.status(500).json({ error: err.message });
}
});

/* =========================
START INTERVIEW
========================= */
router.post("/start", async (req, res) => {
  try {
    const { userId, domain, difficulty } = req.body;

    console.log("BODY RECEIVED:", req.body);

    if (!domain || !difficulty) {
      return res.status(400).json({ message: "Domain and difficulty required" });
    }

    // 🔥 MAKE SEARCH CASE INSENSITIVE
    const questions = await Question.find({
      domain: { $regex: new RegExp("^" + domain + "$", "i") },
      difficulty: { $regex: new RegExp("^" + difficulty + "$", "i") }
    }).limit(5);

    console.log("QUESTIONS FOUND:", questions.length);

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: "No questions found in DB" });
    }

    const interview = await Interview.create({
      userId: userId || "demoUser",
      domain,
      difficulty,
      questionIds: questions.map(q => q._id),
      currentQuestionIndex: 0
    });

    res.status(201).json({
      interviewId: interview._id,
      question: questions[0]
    });

  } catch (err) {
    console.error("START ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
ANSWER QUESTION
========================= */
router.post("/answer", async (req, res) => {
try {
const { interviewId, userAnswer } = req.body;


const interview = await Interview.findById(interviewId).populate("questionIds");
if (!interview) {
  return res.status(404).json({ message: "Interview not found" });
}

const index = interview.currentQuestionIndex;
const question = interview.questionIds[index];
if (!question) {
  return res.status(400).json({ message: "No more questions" });
}

// Basic AI scoring
let ai = {
  aiScore: Math.min(userAnswer.length, 100),
  sentiment: "neutral",
  technical: Math.min(userAnswer.length / 5, 25),
  communication: Math.min(userAnswer.length / 4, 25),
  confidence: Math.min(userAnswer.length / 6, 25)
};

// Try Python AI
try {
  const aiResponse = await axios.post("https://ai-evaluator-vgca.onrender.com/evaluate", {
    userAnswer,
    modelAnswer: question.modelAnswer
  });
  ai = aiResponse.data;
} catch (e) {
  console.log("AI service failed, using fallback");
}

await Answer.create({
  interviewId,
  questionId: question._id,
  userAnswer,
  aiScore: ai.aiScore,
  sentiment: ai.sentiment,
  skillScores: {
    technical: ai.technical,
    communication: ai.communication,
    confidence: ai.confidence,
    problemSolving: ai.technical
  }
});

interview.currentQuestionIndex += 1;
await interview.save();

/* ===== IF INTERVIEW FINISHED ===== */
if (interview.currentQuestionIndex >= interview.questionIds.length) {

  const answers = await Answer.find({ interviewId });

  let total = 0;
  answers.forEach(a => {
    total += a.aiScore || 0;
  });

  const finalScore = Math.round(total / answers.length);

  return res.json({
    interviewFinished: true,
    finalScore: finalScore,
    feedback:
      finalScore > 70
        ? "Excellent performance 🔥"
        : "Good try 👍 Keep improving"
  });
}

/* ===== NEXT QUESTION ===== */
res.json({
  nextQuestion: interview.questionIds[interview.currentQuestionIndex]
});


} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});

module.exports = router;
