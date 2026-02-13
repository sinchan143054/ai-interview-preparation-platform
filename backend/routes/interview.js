const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const router = express.Router();

/* ========= TEST ========= */
router.get("/test", (req, res) => {
  res.json({ message: "INTERVIEW ROUTE WORKING 🚀" });
});

/* ========= START INTERVIEW ========= */
router.post("/start", async (req, res) => {
  try {
    const { userId, domain, difficulty } = req.body;

    const questions = await Question.find({
      domain: domain.toLowerCase(),
      difficulty: difficulty.toLowerCase()
    }).limit(5);

    if (!questions.length) {
      return res.status(400).json({ message: "No questions found" });
    }

    const interview = await Interview.create({
      userId,
      domain: domain.toLowerCase(),
      difficulty: difficulty.toLowerCase(),
      questionIds: questions.map(q => q._id),
      currentQuestionIndex: 0,
      status: "ongoing"
    });

    res.json({
      interviewId: interview._id,
      question: questions[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= SUBMIT ANSWER ========= */
router.post("/answer", async (req, res) => {
  try {
    const { interviewId, userAnswer } = req.body;

    const interview = await Interview.findById(interviewId).populate("questionIds");
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    const index = interview.currentQuestionIndex;
    const question = interview.questionIds[index];

    if (!question) {
      return res.json({ message: "Interview finished" });
    }

    /* ==== fallback scoring ==== */
    let ai = {
      aiScore: Math.min(userAnswer.length, 100),
      sentiment: "neutral",
      technical: Math.min(userAnswer.length / 5, 25),
      communication: Math.min(userAnswer.length / 4, 25),
      confidence: Math.min(userAnswer.length / 6, 25)
    };

    /* ==== AI service ==== */
    try {
      const aiRes = await axios.post(
        "https://ai-evaluator-vgca.onrender.com/evaluate",
        { userAnswer, modelAnswer: question.modelAnswer }
      );
      ai = aiRes.data;
    } catch (e) {
      console.log("AI service failed, using fallback");
    }

    /* ==== save answer ==== */
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
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= FINAL SCORE + SAVE ========= */
router.post("/finish", async (req, res) => {
  try {
    const { interviewId } = req.body;

    const answers = await Answer.find({ interviewId });
    if (!answers.length) {
      return res.status(400).json({ message: "No answers" });
    }

    let total = 0, tech = 0, comm = 0, conf = 0, prob = 0;

    answers.forEach(a => {
      total += a.aiScore || 0;
      tech += a.skillScores?.technical || 0;
      comm += a.skillScores?.communication || 0;
      conf += a.skillScores?.confidence || 0;
      prob += a.skillScores?.problemSolving || 0;
    });

    const count = answers.length;

    const finalScore = {
      overallScore: Math.round(total / count),
      technical: Math.round(tech / count),
      communication: Math.round(comm / count),
      confidence: Math.round(conf / count),
      problemSolving: Math.round(prob / count)
    };

    /* ===== SAVE INTO INTERVIEW DB ===== */
    await Interview.findByIdAndUpdate(interviewId, {
      status: "completed",
      overallScore: finalScore.overallScore,
      skillSummary: {
        technical: finalScore.technical,
        communication: finalScore.communication,
        confidence: finalScore.confidence,
        problemSolving: finalScore.problemSolving
      }
    });

    res.json(finalScore);

  } catch (err) {
    console.log("FINISH ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ========= USER ANALYTICS ========= */
router.get("/analytics/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const interviews = await Interview.find({
      userId,
      status: "completed"
    });

    if (!interviews.length) {
      return res.json({
        totalInterviews: 0,
        avgScore: 0,
        skills: {
          technical: 0,
          communication: 0,
          confidence: 0,
          problemSolving: 0
        },
        history: []
      });
    }

    let totalScore = 0;
    let tech = 0, comm = 0, conf = 0, prob = 0;

    interviews.forEach(i => {
      totalScore += i.overallScore || 0;
      tech += i.skillSummary?.technical || 0;
      comm += i.skillSummary?.communication || 0;
      conf += i.skillSummary?.confidence || 0;
      prob += i.skillSummary?.problemSolving || 0;
    });

    const count = interviews.length;

    res.json({
      totalInterviews: count,
      avgScore: Math.round(totalScore / count),
      skills: {
        technical: Math.round(tech / count),
        communication: Math.round(comm / count),
        confidence: Math.round(conf / count),
        problemSolving: Math.round(prob / count)
      },
      history: interviews
    });

  } catch (err) {
    console.log("ANALYTICS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
