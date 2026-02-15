<<<<<<< HEAD
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const adminRoutes = require('./routes/admin');
const analyticsRoutes = require('./routes/analytics');
const reportRoutes = require('./routes/reports');
=======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const interviewRoutes = require("./routes/interview");
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
<<<<<<< HEAD
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
=======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Routes
app.use("/api/interview", interviewRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("AI Interview Platform Backend is running 🚀");
});

// IMPORTANT: use process.env.PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
});
