const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

mongoose
  .connect(`${MONGO_URL}/${DB_NAME}`)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);

// Health check route
app.get('/api', (req, res) => {
  res.json({ message: 'AI Interview Platform API is running 🚀' });
});

// Start server on port 8001 (required for deployment)
const PORT = 8001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
