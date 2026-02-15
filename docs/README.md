# 🎤 AI Interview Preparation Platform

## 📌 Project Overview

An intelligent, full-stack interview preparation platform that simulates real technical interviews using AI-powered evaluation. Built for EdTech/HRTech domains to help job seekers practice and improve their interview skills through realistic simulations, instant feedback, and comprehensive analytics.

---

## 🎯 Key Features

### **Phase 1 Features** ✅
- **User Authentication**: JWT-based secure login/registration
- **Interview Simulation**: Realistic interview experience with timed questions
- **AI Answer Evaluation**: NLP-based scoring using TF-IDF and cosine similarity
- **Multi-Skill Assessment**: Technical knowledge, communication, confidence, problem-solving
- **Sentiment Analysis**: Understand candidate's emotional tone
- **Real-time Feedback**: Instant AI-generated feedback after each answer
- **Interview History**: Track all past interview attempts

### **Phase 2 Features** ✅
- **Role-Based Access Control**: 4 user roles (Candidate, Reviewer, Admin, Super Admin)
- **Admin Panel**: Comprehensive management dashboard
- **User Management**: Create, view, delete users (Super Admin only)
- **Question Bank Management**: Add, edit, delete interview questions
- **Progress Tracking**: Detailed skill progression over time
- **Analytics Dashboard**: 3 interactive charts (Line, Radar, Bar)
- **Platform Analytics**: System-wide statistics and insights
- **PDF Reports**: Downloadable detailed interview reports
- **CSV Exports**: Export individual or bulk interview data
- **Domain-wise Performance**: Track performance across different domains
- **Difficulty-wise Analysis**: Analyze performance by difficulty level

---

## 🏗️ Tech Stack

### **Frontend**
- **Framework**: React 19 with Create React App
- **UI Library**: Shadcn/ui + Radix UI components
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner (toast notifications)

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **CORS**: cors middleware
- **Environment**: dotenv
- **Report Generation**: PDFKit (PDF), csv-writer (CSV)

### **AI Service**
- **Framework**: Python FastAPI
- **NLP**: scikit-learn (TF-IDF, Cosine Similarity)
- **Server**: Uvicorn
- **Data Validation**: Pydantic

### **Database**
- **MongoDB**: Document-based NoSQL database
- **Collections**: Users, Questions, Interviews, Scores

---

## 📂 Project Structure

```
/app
├── backend/                    # Node.js Express Backend
│   ├── middleware/            # Auth middleware
│   │   └── auth.js           # JWT & role-based auth
│   ├── models/               # Mongoose models
│   │   ├── User.js          # User schema
│   │   ├── Question.js      # Question schema
│   │   ├── Interview.js     # Interview schema
│   │   └── Score.js         # Score schema
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── interview.js     # Interview management
│   │   ├── admin.js         # Admin operations
│   │   ├── analytics.js     # Analytics data
│   │   └── reports.js       # PDF/CSV generation
│   ├── seed.js              # Database seeder
│   ├── server.js            # Main server file
│   ├── package.json         # Node dependencies
│   └── .env                 # Environment variables
│
├── ai-service/              # Python FastAPI AI Service
│   ├── main.py             # AI evaluation logic
│   └── requirements.txt    # Python dependencies
│
├── frontend/               # React Frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   └── ui/       # Shadcn/ui components
│   │   ├── pages/        # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Interview.js
│   │   │   ├── InterviewResult.js
│   │   │   ├── Analytics.js
│   │   │   └── AdminPanel.js
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   ├── package.json      # React dependencies
│   └── .env              # Environment variables
│
└── docs/                  # Documentation
    ├── README.md         # This file
    ├── DATABASE_SCHEMA.md
    ├── NLP_APPROACH.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11+
- MongoDB (local or Atlas)
- Yarn package manager

### 1. Setup MongoDB
```bash
# Start local MongoDB
mongod --bind_ip_all

# Or use MongoDB Atlas (cloud)
```

### 2. Backend Setup
```bash
cd backend
yarn install

# Configure .env file
MONGO_URL=mongodb://localhost:27017
DB_NAME=ai_interview_platform
JWT_SECRET=your-secret-key
AI_SERVICE_URL=http://localhost:8002
CORS_ORIGINS=http://localhost:3000

# Seed database
node seed.js

# Start server
node server.js
# Backend runs on http://localhost:8001
```

### 3. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt

# Start AI service
python main.py
# AI service runs on http://localhost:8002
```

### 4. Frontend Setup
```bash
cd frontend
yarn install

# Configure .env
REACT_APP_BACKEND_URL=http://localhost:8001

# Start development server
yarn start
# Frontend runs on http://localhost:3000
```

### 5. Access the Platform
Open http://localhost:3000 in your browser.

**Default Credentials:**
- **Candidate**: `candidate@interview.com` / `password123`
- **Admin**: `admin@interview.com` / `password123`
- **Super Admin**: `superadmin@interview.com` / `password123`

---

## 🎮 User Roles & Permissions

| Feature | Candidate | Reviewer | Admin | Super Admin |
|---------|-----------|----------|-------|-------------|
| Take Interviews | ✅ | ❌ | ❌ | ❌ |
| View Own History | ✅ | ❌ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ | ❌ |
| Download Reports | ✅ | ❌ | ❌ | ❌ |
| View All Interviews | ❌ | ✅ | ✅ | ✅ |
| View Platform Stats | ❌ | ✅ | ✅ | ✅ |
| View All Questions | ❌ | ✅ | ✅ | ✅ |
| Add/Edit Questions | ❌ | ❌ | ✅ | ✅ |
| Delete Questions | ❌ | ❌ | ✅ | ✅ |
| View Users | ❌ | ❌ | ✅ | ✅ |
| Create Users | ❌ | ❌ | ❌ | ✅ |
| Delete Users | ❌ | ❌ | ❌ | ✅ |
| Change User Roles | ❌ | ❌ | ❌ | ✅ |

---

## 📊 Interview Domains & Difficulty Levels

### **Domains**
1. **Frontend Development**: React, HTML, CSS, JavaScript
2. **Backend Development**: Node.js, Express, APIs, Databases
3. **Full Stack Development**: End-to-end application development

### **Difficulty Levels**
- **Easy**: Basic concepts and definitions (21 questions total)
- **Medium**: Technical implementation and best practices
- **Hard**: System design and advanced concepts

---

## 🧠 AI Evaluation Methodology

See [NLP_APPROACH.md](./NLP_APPROACH.md) for detailed explanation.

**Quick Overview:**
- **Technical Score (25 points)**: TF-IDF + Cosine Similarity
- **Communication Score (25 points)**: Structure, clarity, grammar
- **Confidence Score (25 points)**: Tone analysis, hesitation detection
- **Problem Solving (25 points)**: Derived from technical + communication
- **Overall Score (100 points)**: Sum of all skills

---

## 📈 Analytics & Reports

### **Candidate Analytics**
- Skill progression over time (Line Chart)
- Skill distribution radar (Radar Chart)
- Domain-wise performance (Bar Chart)
- Strengths and weaknesses identification
- Personalized recommendations

### **Admin Analytics**
- Platform-wide statistics
- User engagement metrics
- Average scores by domain
- Most challenging skills
- Interview completion rates

### **Report Generation**
- **PDF Reports**: Detailed interview analysis with scores
- **CSV Exports**: Individual or bulk data export
- Includes question-wise breakdown
- Downloadable from frontend

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Fine-grained permissions
- **CORS Protection**: Configured origins
- **Input Validation**: Mongoose schema validation
- **Environment Variables**: Sensitive data protection
- **HTTP-only Cookies**: (optional enhancement)

---

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

**Recommended Stack:**
- **Frontend**: Vercel
- **Backend**: Render
- **AI Service**: Render
- **Database**: MongoDB Atlas

---

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Interview
- `POST /api/interview/start` - Start interview
- `POST /api/interview/answer` - Submit answer
- `POST /api/interview/finish` - Complete interview
- `GET /api/interview/history` - Get interview history
- `GET /api/interview/:interviewId` - Get interview details

### Analytics
- `GET /api/analytics/progression` - Skill progression data
- `GET /api/analytics/insights` - Strengths/weaknesses
- `GET /api/analytics/domain-performance` - Domain stats
- `GET /api/analytics/recent` - Recent interviews

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user (Super Admin)
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/questions` - List questions
- `POST /api/admin/questions` - Create question
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/interviews` - All interviews

### Reports
- `GET /api/reports/pdf/:interviewId` - Download PDF
- `GET /api/reports/csv/:interviewId` - Download CSV
- `GET /api/reports/csv-all` - Export all interviews

### AI Service
- `POST /evaluate` - Evaluate answer

---

## 🧪 Testing

### Manual Testing Steps
1. **Registration**: Create new account
2. **Login**: Test with different roles
3. **Start Interview**: Select domain and difficulty
4. **Answer Questions**: Submit varied answers
5. **View Results**: Check scoring accuracy
6. **Analytics**: Verify charts display correctly
7. **Admin Panel**: Test user/question management
8. **Reports**: Download PDF and CSV

### Testing Credentials
- Candidate: `candidate@interview.com` / `password123`
- Admin: `admin@interview.com` / `password123`
- Super Admin: `superadmin@interview.com` / `password123`

---

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ai_interview_platform
JWT_SECRET=your-secret-key-min-32-chars
AI_SERVICE_URL=http://localhost:8002
CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### AI Service Environment Variables
```env
AI_SERVICE_PORT=8002
```

---

## 📚 Additional Documentation

- **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)**: Complete database structure
- **[NLP_APPROACH.md](./NLP_APPROACH.md)**: AI evaluation methodology
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**: Production deployment

---

## 🐛 Troubleshooting

### Backend not connecting to MongoDB
- Check MongoDB is running
- Verify MONGO_URL in .env
- Ensure database name is correct

### AI Service timeout
- Verify AI service is running on port 8002
- Check AI_SERVICE_URL in backend .env
- Review AI service logs

### Frontend CORS errors
- Update CORS_ORIGINS in backend .env
- Restart backend after changes
- Check browser console for specific errors

### Login/Registration fails
- Verify backend is running
- Check REACT_APP_BACKEND_URL
- Inspect network requests in browser DevTools

---

## 🚦 Performance Optimization

- **Frontend**: Code splitting, lazy loading
- **Backend**: Database indexing, caching
- **AI Service**: Optimized NLP algorithms
- **Database**: Compound indexes on frequently queried fields

---

## 🔮 Future Enhancements

- Voice and video interview mode
- Real-time speech-to-text
- Resume-based question generation
- Personalized improvement plans
- AI-generated follow-up questions
- Mock interview scheduling
- Proctoring simulation
- Multi-language support
- Company-specific interview tracks

---

## 📄 License

This project is built for educational and portfolio purposes.

---

## 👥 Support

For issues, questions, or contributions:
- Check documentation in `/docs`
- Review troubleshooting section
- Test with provided credentials

---

## 🎉 Acknowledgments

- Built with modern web technologies
- Powered by AI and machine learning
- Designed for real-world interview preparation

---

**🚀 Happy Interviewing! Good Luck with your preparation!**