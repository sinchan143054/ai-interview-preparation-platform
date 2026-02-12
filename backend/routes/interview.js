const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const router = express.Router();

/* =========================
   TEST ROUTE
========================= */
router.get("/test", (req, res) => {
  res.json({ message: "INTERVIEW ROUTE WORKING 🚀" });
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
      domain: domain.toLowerCase(),
      difficulty: difficulty.toLowerCase(),
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
  try {
    const { userId, domain, difficulty } = req.body;

    console.log("BODY RECEIVED:", req.body);

    if (!domain || !difficulty) {
      return res.status(400).json({ message: "Domain & difficulty required" });
    }

    // ✅ FORCE LOWERCASE (IMPORTANT FIX)
    const domainLower = domain.toLowerCase();
    const difficultyLower = difficulty.toLowerCase();

    // ✅ FIND QUESTIONS
    const questions = await Question.find({
      domain: domainLower,
      difficulty: difficultyLower
    }).limit(5);

    if (!questions.length) {
      return res.status(400).json({
        message: "No questions found in DB",
        hint: "Check domain & difficulty spelling in MongoDB"
      });
    }

    // ✅ CREATE INTERVIEW
    const interview = await Interview.create({
      userId: userId || "demoUser",
      domain: domainLower,
      difficulty: difficultyLower,
      questionIds: questions.map(q => q._id),
      currentQuestionIndex: 0,
      status: "ongoing"
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

    /* ===== DEFAULT SCORING ===== */
    let ai = {
      aiScore: Math.min(userAnswer.length, 100),
      sentiment: "neutral",
      technical: Math.min(userAnswer.length / 5, 25),
      communication: Math.min(userAnswer.length / 4, 25),
      confidence: Math.min(userAnswer.length / 6, 25)
    };

    /* ===== TRY AI SERVICE ===== */
    try {
      const aiResponse = await axios.post(
        "https://ai-evaluator-vgca.onrender.com/evaluate",
        {
          userAnswer,
          modelAnswer: question.modelAnswer
        }
      );

      ai = aiResponse.data;
    } catch (e) {
      console.log("⚠️ AI service failed, using fallback scoring");
    }

    /* ===== SAVE ANSWER ===== */
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

    /* ===== NEXT QUESTION ===== */
    interview.currentQuestionIndex += 1;
    await interview.save();

  if (interview.currentQuestionIndex >= interview.questionIds.length) {

  // ===== CALCULATE FINAL SCORE =====
  /* =========================
   FINISH INTERVIEW + SCORE
========================= */
router.post("/finish", async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ message: "InterviewId required" });
    }

    // ✅ convert to ObjectId properly
    const answers = await Answer.find({
      interviewId: interviewId
    });

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

    const finalScore = {
      overallScore: Math.round(total / count),
      technical: Math.round(tech / count),
      communication: Math.round(comm / count),
      confidence: Math.round(conf / count)
    };

    res.json(finalScore);

  } catch (err) {
    console.log("FINISH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
