const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication
router.use(authMiddleware);

// Get all users (Admin and SuperAdmin only)
router.get('/users', roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Create user (SuperAdmin only)
router.post('/users', roleMiddleware(['superadmin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const bcrypt = require('bcryptjs');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'candidate',
      createdBy: req.user.email,
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// Update user role (SuperAdmin only)
router.put('/users/:userId/role', roleMiddleware(['superadmin']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Delete user (SuperAdmin only)
router.delete('/users/:userId', roleMiddleware(['superadmin']), async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// Get all questions (All admin roles)
router.get('/questions', roleMiddleware(['admin', 'superadmin', 'reviewer']), async (req, res) => {
  try {
    const { domain, difficulty } = req.query;
    const filter = {};

    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

// Create question (Admin and SuperAdmin)
router.post('/questions', roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const { domain, difficulty, question, modelAnswer, keywords, category } = req.body;

    const newQuestion = new Question({
      domain,
      difficulty,
      question,
      modelAnswer,
      keywords: keywords || [],
      category: category || 'general',
    });

    await newQuestion.save();

    res.status(201).json({
      message: 'Question created successfully',
      question: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question', error: error.message });
  }
});

// Update question (Admin and SuperAdmin)
router.put('/questions/:questionId', roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    const question = await Question.findByIdAndUpdate(questionId, updates, { new: true });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update question', error: error.message });
  }
});

// Delete question (Admin and SuperAdmin)
router.delete('/questions/:questionId', roleMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete question', error: error.message });
  }
});

// Get all interviews (All admin roles)
router.get('/interviews', roleMiddleware(['admin', 'superadmin', 'reviewer']), async (req, res) => {
  try {
    const { status, domain } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (domain) filter.domain = domain;

    const interviews = await Interview.find(filter).sort({ createdAt: -1 });
    res.json({ interviews });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interviews', error: error.message });
  }
});

// Platform statistics (All admin roles)
router.get('/stats', roleMiddleware(['admin', 'superadmin', 'reviewer']), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'candidate' });
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    const totalQuestions = await Question.countDocuments({ isActive: true });

    const completedInterviews = await Interview.find({ status: 'completed' });
    const avgScore = completedInterviews.length > 0
      ? Math.round(
          completedInterviews.reduce((sum, i) => sum + (i.finalScore?.overall || 0), 0) /
            completedInterviews.length
        )
      : 0;

    // Domain-wise statistics
    const domainStats = await Interview.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 },
          avgScore: { $avg: '$finalScore.overall' },
        },
      },
    ]);

    // Skill-wise average scores
    const skillStats = completedInterviews.length > 0
      ? {
          technical: Math.round(
            completedInterviews.reduce((sum, i) => sum + (i.finalScore?.technical || 0), 0) /
              completedInterviews.length
          ),
          communication: Math.round(
            completedInterviews.reduce((sum, i) => sum + (i.finalScore?.communication || 0), 0) /
              completedInterviews.length
          ),
          confidence: Math.round(
            completedInterviews.reduce((sum, i) => sum + (i.finalScore?.confidence || 0), 0) /
              completedInterviews.length
          ),
          problemSolving: Math.round(
            completedInterviews.reduce((sum, i) => sum + (i.finalScore?.problemSolving || 0), 0) /
              completedInterviews.length
          ),
        }
      : { technical: 0, communication: 0, confidence: 0, problemSolving: 0 };

    // Most failed skills (skills with lowest avg scores)
    const failedSkills = [];
    if (skillStats.technical < 50) failedSkills.push({ skill: 'Technical Knowledge', avgScore: skillStats.technical });
    if (skillStats.communication < 50) failedSkills.push({ skill: 'Communication', avgScore: skillStats.communication });
    if (skillStats.confidence < 50) failedSkills.push({ skill: 'Confidence', avgScore: skillStats.confidence });
    if (skillStats.problemSolving < 50) failedSkills.push({ skill: 'Problem Solving', avgScore: skillStats.problemSolving });

    res.json({
      totalUsers,
      totalInterviews,
      totalQuestions,
      avgScore,
      domainStats,
      skillStats,
      failedSkills,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;
