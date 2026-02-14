const express = require('express');
const Interview = require('../models/Interview');
const Score = require('../models/Score');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// Get user's skill progression over time
router.get('/progression', async (req, res) => {
  try {
    const userId = req.user.userId;

    const scores = await Score.find({ userId }).sort({ createdAt: 1 });

    const progression = scores.map((score) => ({
      date: score.createdAt,
      domain: score.domain,
      difficulty: score.difficulty,
      technical: score.technical,
      communication: score.communication,
      confidence: score.confidence,
      problemSolving: score.problemSolving,
      overall: score.overall,
    }));

    res.json({ progression });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progression', error: error.message });
  }
});

// Get user's strengths and weaknesses
router.get('/insights', async (req, res) => {
  try {
    const userId = req.user.userId;

    const scores = await Score.find({ userId }).sort({ createdAt: -1 }).limit(10);

    if (scores.length === 0) {
      return res.json({
        strengths: [],
        weaknesses: [],
        recommendations: [],
        skillAverages: { technical: 0, communication: 0, confidence: 0, problemSolving: 0, overall: 0 },
      });
    }

    // Calculate averages
    const skillAverages = {
      technical: Math.round(scores.reduce((sum, s) => sum + s.technical, 0) / scores.length),
      communication: Math.round(scores.reduce((sum, s) => sum + s.communication, 0) / scores.length),
      confidence: Math.round(scores.reduce((sum, s) => sum + s.confidence, 0) / scores.length),
      problemSolving: Math.round(scores.reduce((sum, s) => sum + s.problemSolving, 0) / scores.length),
      overall: Math.round(scores.reduce((sum, s) => sum + s.overall, 0) / scores.length),
    };

    // Aggregate strengths and weaknesses
    const allStrengths = [];
    const allWeaknesses = [];
    const allRecommendations = [];

    scores.forEach((score) => {
      allStrengths.push(...score.strengths);
      allWeaknesses.push(...score.weaknesses);
      allRecommendations.push(...score.recommendations);
    });

    // Get unique and most common
    const strengths = [...new Set(allStrengths)];
    const weaknesses = [...new Set(allWeaknesses)];
    const recommendations = [...new Set(allRecommendations)];

    res.json({
      strengths,
      weaknesses,
      recommendations,
      skillAverages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch insights', error: error.message });
  }
});

// Get domain-wise performance
router.get('/domain-performance', async (req, res) => {
  try {
    const userId = req.user.userId;

    const domainPerformance = await Score.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$domain',
          avgTechnical: { $avg: '$technical' },
          avgCommunication: { $avg: '$communication' },
          avgConfidence: { $avg: '$confidence' },
          avgProblemSolving: { $avg: '$problemSolving' },
          avgOverall: { $avg: '$overall' },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = domainPerformance.map((d) => ({
      domain: d._id,
      technical: Math.round(d.avgTechnical),
      communication: Math.round(d.avgCommunication),
      confidence: Math.round(d.avgConfidence),
      problemSolving: Math.round(d.avgProblemSolving),
      overall: Math.round(d.avgOverall),
      interviewCount: d.count,
    }));

    res.json({ domainPerformance: formattedData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch domain performance', error: error.message });
  }
});

// Get difficulty-wise performance
router.get('/difficulty-performance', async (req, res) => {
  try {
    const userId = req.user.userId;

    const difficultyPerformance = await Score.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$difficulty',
          avgScore: { $avg: '$overall' },
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedData = difficultyPerformance.map((d) => ({
      difficulty: d._id,
      avgScore: Math.round(d.avgScore),
      count: d.count,
    }));

    res.json({ difficultyPerformance: formattedData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch difficulty performance', error: error.message });
  }
});

// Get recent interviews summary
router.get('/recent', async (req, res) => {
  try {
    const userId = req.user.userId;

    const recentInterviews = await Interview.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5)
      .select('domain difficulty finalScore completedAt duration');

    res.json({ recentInterviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recent interviews', error: error.message });
  }
});

module.exports = router;
