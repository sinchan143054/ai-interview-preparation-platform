<<<<<<< HEAD
# Here are your Instructions
=======
# AI Interview Preparation Platform

## Overview

This project is an AI-powered interview preparation platform that simulates a text-based technical interview and evaluates candidate answers using NLP-based scoring.

The platform allows users to practice interviews and receive instant feedback with skill-based scoring.

## Features (Phase 1)

* Text-based interview simulation
* Role-based questions (Frontend, Backend, etc.)
* AI/NLP answer evaluation
* Skill-based scoring:

  * Technical
  * Communication
  * Confidence
* Sentiment analysis
* Candidate feedback dashboard
* Final score generation after interview

## Tech Stack

Frontend: React + Vite
Backend: Node.js + Express
AI Service: Python (Flask/FastAPI)
Database: MongoDB Atlas

## Project Structure

frontend/  – React user interface
backend/   – Node.js API server
ai-service/ – AI/NLP evaluation service

## How It Works

1. User starts interview from frontend.
2. Questions are fetched from MongoDB.
3. User submits answers.
4. Backend sends answer to AI service.
5. AI service evaluates answer using NLP logic.
6. Scores are generated and stored.
7. Final feedback dashboard is shown.

## API Routes

POST /api/interview/start
Starts interview and returns first question.

POST /api/interview/answer
Evaluates answer and returns next question.

POST /api/interview/finish
Calculates final score and returns feedback.

GET /api/interview/test
Checks backend status.

## Phase Status

Phase 1 – Interview Simulation and Core AI Evaluation Engine
Status: Completed

## Deployment

Frontend hosted on Vercel
Backend hosted on Render
AI service hosted on Render
Database hosted on MongoDB Atlas

## Future Improvements

* Voice-based interview support
* Resume-based question generation
* Admin panel for managing questions
* Performance history tracking
>>>>>>> 8003e494214bb2133a2047589e7457e31cba5851
