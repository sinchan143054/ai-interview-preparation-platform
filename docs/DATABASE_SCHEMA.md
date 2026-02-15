# 🗄️ Database Schema Documentation

## Overview

The AI Interview Platform uses MongoDB as its database with 4 main collections. All schemas use Mongoose ODM for data modeling and validation.

**Database Name**: `ai_interview_platform`

---

## 📊 Collections

1. **users** - User accounts and authentication
2. **questions** - Interview question bank
3. **interviews** - Interview sessions and responses
4. **scores** - Detailed skill assessments

---

## 👤 Users Collection

### Schema: `User`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['candidate', 'admin', 'superadmin', 'reviewer'], default: 'candidate'),
  createdBy: String (nullable),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `name` | String | Yes | Full name of the user |
| `email` | String | Yes | Email address (unique, used for login) |
| `password` | String | Yes | Hashed password (bcrypt with 10 salt rounds) |
| `role` | String | Yes | User role: candidate, reviewer, admin, or superadmin |
| `createdBy` | String | No | Email of admin who created this user |
| `createdAt` | DateTime | Auto | Timestamp when user was created |
| `updatedAt` | DateTime | Auto | Timestamp of last update |

### Indexes

```javascript
{ email: 1 } // Unique index for fast login lookups
```

### Example Document

```json
{
  "_id": "699147e297f26a834359ca80",
  "name": "Test Candidate",
  "email": "candidate@interview.com",
  "password": "$2a$10$hashed_password_string",
  "role": "candidate",
  "createdBy": null,
  "createdAt": "2026-02-15T01:00:00.000Z",
  "updatedAt": "2026-02-15T01:00:00.000Z"
}
```

### Role Permissions

- **candidate**: Can take interviews, view own data
- **reviewer**: Can view all interviews and questions (read-only)
- **admin**: Can manage questions, view all data, edit content
- **superadmin**: Full access, can create/delete users and admins

---

## ❓ Questions Collection

### Schema: `Question`

```javascript
{
  domain: String (required),
  difficulty: String (enum: ['easy', 'medium', 'hard'], required),
  question: String (required),
  modelAnswer: String (required),
  keywords: [String],
  category: String (default: 'general'),
  isActive: Boolean (default: true),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

### Fields Description

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `domain` | String | Yes | Interview domain (frontend, backend, fullstack) |
| `difficulty` | String | Yes | Question difficulty (easy, medium, hard) |
| `question` | String | Yes | The interview question text |
| `modelAnswer` | String | Yes | Ideal/reference answer for AI comparison |
| `keywords` | Array[String] | No | Key concepts for evaluation |
| `category` | String | No | Question category (general, technical, system-design) |
| `isActive` | Boolean | No | Whether question is available for interviews |
| `createdAt` | DateTime | Auto | When question was added |
| `updatedAt` | DateTime | Auto | Last modification time |

### Indexes

```javascript
{ domain: 1, difficulty: 1, isActive: 1 } // Compound index for interview question selection
```

### Example Document

```json
{
  "_id": "699147e297f26a834359ca81",
  "domain": "frontend",
  "difficulty": "medium",
  "question": "Explain the concept of state management in React.",
  "modelAnswer": "State management in React refers to handling data that changes over time within components. useState hook manages local state, while useContext or state management libraries like Redux or Zustand handle global state...",
  "keywords": ["state", "useState", "redux", "context", "data flow", "hooks"],
  "category": "technical",
  "isActive": true,
  "createdAt": "2026-02-15T01:00:00.000Z",
  "updatedAt": "2026-02-15T01:00:00.000Z"
}
```

### Domains

- **frontend**: React, HTML, CSS, JavaScript
- **backend**: Node.js, Express, APIs, Databases
- **fullstack**: End-to-end development

### Categories

- **general**: Basic concepts and definitions
- **technical**: Implementation and coding
- **system-design**: Architecture and scalability

---

## 🎤 Interviews Collection

### Schema: `Interview`

```javascript
{
  userId: String (required),
  userName: String,
  domain: String,
  difficulty: String,
  questions: [{
    questionId: String,
    question: String,
    userAnswer: String,
    modelAnswer: String,
    scores: {
      technical: Number,
      communication: Number,
      confidence: Number,
      overall: Number
    },
    sentiment: String,
    answeredAt: DateTime
  }],
  status: String (enum: ['ongoing', 'completed', 'abandoned'], default: 'ongoing'),
  finalScore: {
    technical: Number (default: 0),
    communication: Number (default: 0),
    confidence: Number (default: 0),
    problemSolving: Number (default: 0),
    overall: Number (default: 0)
  },
  startedAt: DateTime (default: now),
  completedAt: DateTime,
  duration: Number (minutes),
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

### Fields Description

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Interview session identifier |
| `userId` | String | Reference to user who took the interview |
| `userName` | String | User's email (for quick reference) |
| `domain` | String | Interview domain selected |
| `difficulty` | String | Difficulty level chosen |
| `questions` | Array | All questions and answers in this interview |
| `questions[].questionId` | String | ID of the question |
| `questions[].question` | String | Question text (stored for history) |
| `questions[].userAnswer` | String | Candidate's answer |
| `questions[].modelAnswer` | String | Reference answer |
| `questions[].scores` | Object | AI evaluation scores for this answer |
| `questions[].sentiment` | String | Sentiment analysis result |
| `questions[].answeredAt` | DateTime | When this answer was submitted |
| `status` | String | Interview completion status |
| `finalScore` | Object | Aggregated scores for entire interview |
| `startedAt` | DateTime | Interview start time |
| `completedAt` | DateTime | Interview completion time |
| `duration` | Number | Interview duration in minutes |

### Indexes

```javascript
{ userId: 1, status: 1, completedAt: -1 } // For user history queries
{ status: 1 } // For admin filtering
{ domain: 1 } // For domain analytics
```

### Example Document

```json
{
  "_id": "699147f097f26a834359ca82",
  "userId": "699147e297f26a834359ca80",
  "userName": "candidate@interview.com",
  "domain": "frontend",
  "difficulty": "medium",
  "questions": [
    {
      "questionId": "699147e297f26a834359ca81",
      "question": "Explain state management in React.",
      "userAnswer": "State management involves using useState and useContext...",
      "modelAnswer": "State management in React refers to...",
      "scores": {
        "technical": 18,
        "communication": 20,
        "confidence": 15,
        "overall": 53
      },
      "sentiment": "neutral",
      "answeredAt": "2026-02-15T01:10:00.000Z"
    }
  ],
  "status": "completed",
  "finalScore": {
    "technical": 18,
    "communication": 20,
    "confidence": 15,
    "problemSolving": 19,
    "overall": 72
  },
  "startedAt": "2026-02-15T01:00:00.000Z",
  "completedAt": "2026-02-15T01:25:00.000Z",
  "duration": 25,
  "createdAt": "2026-02-15T01:00:00.000Z",
  "updatedAt": "2026-02-15T01:25:00.000Z"
}
```

### Status Values

- **ongoing**: Interview in progress
- **completed**: Interview finished successfully
- **abandoned**: User left before completing (not currently used)

---

## 📊 Scores Collection

### Schema: `Score`

```javascript
{
  userId: String (required),
  interviewId: String (required),
  domain: String,
  difficulty: String,
  technical: Number,
  communication: Number,
  confidence: Number,
  problemSolving: Number,
  overall: Number,
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  createdAt: DateTime (auto),
  updatedAt: DateTime (auto)
}
```

### Fields Description

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Score record identifier |
| `userId` | String | User who received this score |
| `interviewId` | String | Associated interview session |
| `domain` | String | Interview domain |
| `difficulty` | String | Difficulty level |
| `technical` | Number | Technical knowledge score (0-25) |
| `communication` | Number | Communication clarity score (0-25) |
| `confidence` | Number | Confidence level score (0-25) |
| `problemSolving` | Number | Problem-solving score (0-25) |
| `overall` | Number | Total score (0-100) |
| `strengths` | Array[String] | Identified strengths |
| `weaknesses` | Array[String] | Areas needing improvement |
| `recommendations` | Array[String] | Personalized suggestions |
| `createdAt` | DateTime | Score generation time |

### Indexes

```javascript
{ userId: 1, createdAt: 1 } // For progression tracking
{ interviewId: 1 } // For interview lookup
{ domain: 1 } // For domain analytics
```

### Example Document

```json
{
  "_id": "699147f297f26a834359ca83",
  "userId": "699147e297f26a834359ca80",
  "interviewId": "699147f097f26a834359ca82",
  "domain": "frontend",
  "difficulty": "medium",
  "technical": 18,
  "communication": 20,
  "confidence": 15,
  "problemSolving": 19,
  "overall": 72,
  "strengths": [
    "Excellent communication skills",
    "Good grasp of concepts"
  ],
  "weaknesses": [
    "Work on confidence and clarity"
  ],
  "recommendations": [
    "Practice mock interviews to build confidence",
    "Review core technical concepts"
  ],
  "createdAt": "2026-02-15T01:25:00.000Z",
  "updatedAt": "2026-02-15T01:25:00.000Z"
}
```

---

## 🔗 Relationships

### Data Flow

```
User (candidate)
  └── Interview (1:many)
       ├── Questions (embedded array)
       └── Score (1:1)

User (admin)
  └── Question (1:many created/managed)
```

### Reference Fields

- `Interview.userId` → `User._id` (as string)
- `Score.userId` → `User._id` (as string)
- `Score.interviewId` → `Interview._id` (as string)
- `Interview.questions[].questionId` → `Question._id` (as string)

**Note**: MongoDB ObjectIds are stored as strings for easier JSON serialization.

---

## 📈 Analytics Queries

### User Progress Over Time

```javascript
db.scores.find({ userId: "<userId>" }).sort({ createdAt: 1 })
```

### Platform Statistics

```javascript
db.interviews.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$domain",
      count: { $sum: 1 },
      avgScore: { $avg: "$finalScore.overall" }
    }
  }
])
```

### Domain Performance

```javascript
db.scores.aggregate([
  { $match: { userId: "<userId>" } },
  { $group: {
      _id: "$domain",
      avgTechnical: { $avg: "$technical" },
      avgCommunication: { $avg: "$communication" },
      avgConfidence: { $avg: "$confidence" },
      avgOverall: { $avg: "$overall" }
    }
  }
])
```

---

## 🛠️ Seeding Data

Run the seed script to populate initial data:

```bash
node seed.js
```

**Creates:**
- 5 users (Super Admin, Admin, Reviewer, 2 Candidates)
- 21 interview questions across all domains and difficulties

---

## 🔒 Security Considerations

- Passwords are hashed with bcrypt (10 salt rounds)
- No plain text passwords stored
- User emails are unique (enforced by index)
- MongoDB ObjectIds used instead of sequential IDs
- Sensitive data (JWT secrets) in environment variables
- Role-based access controlled at API level

---

## 📊 Database Size Estimates

### Per Collection (approximate)

- **Users**: ~500 bytes per user
- **Questions**: ~1-2 KB per question
- **Interviews**: ~5-10 KB per interview (with 5 questions)
- **Scores**: ~1 KB per score

### For 1000 Users

- Users: ~500 KB
- Questions: ~50 KB (25 questions)
- Interviews: ~50 MB (10 interviews per user average)
- Scores: ~10 MB

**Total**: ~60-70 MB

**MongoDB Atlas M0 Free Tier**: 512 MB (sufficient for 5000-8000 interviews)

---

## 🔧 Maintenance

### Backup

```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/ai_interview_platform"
```

### Restore

```bash
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/ai_interview_platform" dump/
```

### Clear All Data

```javascript
db.users.deleteMany({})
db.questions.deleteMany({})
db.interviews.deleteMany({})
db.scores.deleteMany({})
```

---

## 📚 Schema Evolution

### Version History

- **v1.0** (Current): Initial schema with 4 collections
- Future: Add indexes for performance optimization
- Future: Add user preferences collection
- Future: Add feedback collection for questions

---

This schema design supports all Phase 1 and Phase 2 features with room for future enhancements.