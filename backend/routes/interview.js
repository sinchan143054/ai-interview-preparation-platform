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
   ADD QUESTION (ADMIN)
========================= */
router.post("/add-question", async (req, res) => {
  try {
    const { domain, difficulty, question, modelAnswer } = req.body;

    if (!domain || !difficulty || !question || !modelAnswer) {
      return res.status(400).json({ error: "All fields required" });
    }

    const saved = await Question.create({
      domain,
      difficulty,
      question,
      modelAnswer
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   START INTERVIEW
========================= */
router.post("/start", async (req, res) => {
  console.log("BODY RECEIVED:", req.body);

  try {
    const { userId, domain, difficulty } = req.body;

    const questions = await Question.aggregate([
      { $match: { domain, difficulty } },
      { $sample: { size: 5 } }
    ]);

    if (!questions.length) {
      return res.status(400).json({ message: "No questions found" });
    }

    const interview = await Interview.create({
      userId,
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
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ANSWER QUESTION (AI)
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

    // ✅ SAFE DEFAULT SCORES (PHASE-1)
    let ai = {
      aiScore: Math.min(userAnswer.length, 100),
      sentiment: "neutral",
      technical: Math.min(userAnswer.length / 5, 25),
      communication: Math.min(userAnswer.length / 4, 25),
      confidence: Math.min(userAnswer.length / 6, 25)
    };

    // 🔥 TRY AI (OPTIONAL)
    try {
      const aiResponse = await axios.post("http://127.0.0.1:8000/evaluate", {
        userAnswer,
        modelAnswer: question.modelAnswer
      });
      ai = aiResponse.data;
    } catch (e) {
      console.log("⚠️ AI service failed, using fallback scores");
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

    if (interview.currentQuestionIndex >= interview.questionIds.length) {
      return res.json({ message: "Interview finished" });
    }

    res.json({
      nextQuestion: interview.questionIds[interview.currentQuestionIndex]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   FINISH INTERVIEW
  =========================*/
  router.post("/finish", async (req, res) => {
  try {
    const { interviewId } = req.body;

    const answers = await Answer.find({
      interviewId: new mongoose.Types.ObjectId(interviewId)
    });

    // ✅ SAFETY CHECK (INSIDE ROUTE)
    if (!answers.length) {
      return res.status(400).json({ message: "No answers found" });
    }

    let total = 0, tech = 0, comm = 0, conf = 0;

    answers.forEach(a => {
      total += a.aiScore || 0;
      tech += a.skillScores?.technical || 0;
      comm += a.skillScores?.communication || 0;
      conf += a.skillScores?.confidence || 0;
    });

    const count = answers.length;

    const interview = await Interview.findByIdAndUpdate(
      interviewId,
      {
        status: "completed",
        overallScore: Math.round(total / count),
        skillSummary: {
          technical: Math.round(tech / count),
          communication: Math.round(comm / count),
          confidence: Math.round(conf / count),
          problemSolving: Math.round(tech / count)
        }
      },
      { new: true }
    );

    res.json(interview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});






module.exports = router;
