const express = require('express');
const axios = require('axios');
const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Score = require('../models/Score');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8002';

// Start interview
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { domain, difficulty } = req.body;
    const userId = req.user.userId;

    const questions = await Question.find({
      domain,
      difficulty,
      isActive: true,
    }).limit(5);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this domain and difficulty' });
    }

    const interview = new Interview({
      userId,
      userName: req.user.email,
      domain,
      difficulty,
      questions: [],
      status: 'ongoing',
    });

    await interview.save();

    res.json({
      message: 'Interview started',
      interviewId: interview._id,
      firstQuestion: {
        questionId: questions[0]._id,
        question: questions[0].question,
        index: 0,
        totalQuestions: questions.length,
      },
      allQuestions: questions.map((q) => ({
        questionId: q._id,
        question: q.question,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to start interview', error: error.message });
  }
});

// Submit answer
router.post('/answer', authMiddleware, async (req, res) => {
  try {
    const { interviewId, questionId, userAnswer } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Call AI service for evaluation
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/evaluate`, {
      userAnswer,
      modelAnswer: question.modelAnswer,
      difficulty: interview.difficulty,
    });

    const scores = aiResponse.data;

    interview.questions.push({
      questionId: question._id,
      question: question.question,
      userAnswer,
      modelAnswer: question.modelAnswer,
      scores: {
        technical: scores.technical || 0,
        communication: scores.communication || 0,
        confidence: scores.confidence || 0,
        overall: scores.aiScore || 0,
      },
      sentiment: scores.sentiment || 'neutral',
      answeredAt: new Date(),
    });

    await interview.save();

    res.json({
      message: 'Answer submitted successfully',
      scores,
      questionNumber: interview.questions.length,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Failed to submit answer', error: error.message });
  }
});

// Finish interview
router.post('/finish', authMiddleware, async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate final scores
    let totalTechnical = 0;
    let totalCommunication = 0;
    let totalConfidence = 0;
    let count = interview.questions.length;

    interview.questions.forEach((q) => {
      totalTechnical += q.scores.technical || 0;
      totalCommunication += q.scores.communication || 0;
      totalConfidence += q.scores.confidence || 0;
    });

    const finalScore = {
      technical: count > 0 ? Math.round(totalTechnical / count) : 0,
      communication: count > 0 ? Math.round(totalCommunication / count) : 0,
      confidence: count > 0 ? Math.round(totalConfidence / count) : 0,
      problemSolving: count > 0 ? Math.round((totalTechnical + totalCommunication) / (count * 2)) : 0,
    };

    finalScore.overall = Math.round(
      (finalScore.technical + finalScore.communication + finalScore.confidence + finalScore.problemSolving) / 4
    );

    interview.finalScore = finalScore;
    interview.status = 'completed';
    interview.completedAt = new Date();
    interview.duration = Math.round((interview.completedAt - interview.startedAt) / 1000 / 60);

    await interview.save();

    // Generate insights
    const strengths = [];
    const weaknesses = [];
    const recommendations = [];

    if (finalScore.technical >= 70) strengths.push('Strong technical knowledge');
    else weaknesses.push('Technical knowledge needs improvement');

    if (finalScore.communication >= 70) strengths.push('Excellent communication skills');
    else weaknesses.push('Communication clarity can be improved');

    if (finalScore.confidence >= 70) strengths.push('Confident responses');
    else weaknesses.push('Work on confidence and clarity');

    if (finalScore.technical < 70) recommendations.push('Review core technical concepts');
    if (finalScore.communication < 70) recommendations.push('Practice articulating answers clearly');
    if (finalScore.confidence < 70) recommendations.push('Practice mock interviews to build confidence');

    // Save score record
    const scoreRecord = new Score({
      userId: interview.userId,
      interviewId: interview._id,
      domain: interview.domain,
      difficulty: interview.difficulty,
      ...finalScore,
      strengths,
      weaknesses,
      recommendations,
    });

    await scoreRecord.save();

    res.json({
      message: 'Interview completed',
      finalScore,
      strengths,
      weaknesses,
      recommendations,
      duration: interview.duration,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to finish interview', error: error.message });
  }
});

// Get interview history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const interviews = await Interview.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .select('-questions');

    res.json({ interviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
});

// Get interview details
router.get('/:interviewId', authMiddleware, async (req, res) => {
  try {
    const { interviewId } = req.params;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview', error: error.message });
  }
});

module.exports = router;
