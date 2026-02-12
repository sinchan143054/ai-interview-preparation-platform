const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const interviewRoutes = require("./routes/interview");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
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
});
