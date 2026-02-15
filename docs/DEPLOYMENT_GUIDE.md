# 🚀 Deployment Guide - AI Interview Platform

Complete guide to deploy the AI Interview Preparation Platform to production.

---

## 📋 **Deployment Architecture**

- **Frontend**: Vercel (React Application)
- **Backend**: Render (Node.js Express API)
- **AI Service**: Render (Python FastAPI)
- **Database**: MongoDB Atlas (Cloud Database)

---

## 🗄️ **Step 1: Setup MongoDB Atlas**

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new project

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 tier
3. Select a cloud provider and region (closest to your users)
4. Name your cluster (e.g., `interview-platform`)
5. Click "Create Cluster"

### 1.3 Setup Database Access
1. Go to **Database Access** in left sidebar
2. Click "Add New Database User"
3. Create username and strong password (save these!)
4. Set privileges to "Read and write to any database"
5. Click "Add User"

### 1.4 Setup Network Access
1. Go to **Network Access** in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go back to **Database** 
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Save this connection string (you'll need it later)

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai_interview_platform?retryWrites=true&w=majority`

---

## 🔧 **Step 2: Deploy Backend to Render**

### 2.1 Prepare Backend for Deployment

Create a new file `/app/backend/.env.production`:

```env
MONGO_URL=your_mongodb_atlas_connection_string
DB_NAME=ai_interview_platform
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-secure
AI_SERVICE_URL=https://your-ai-service-url.onrender.com
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

### 2.2 Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with GitHub
3. Authorize Render to access your GitHub repositories

### 2.3 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `interview-platform-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `yarn install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. Add Environment Variables (click "Advanced" → "Add Environment Variable"):
   ```
   MONGO_URL = your_mongodb_atlas_connection_string
   DB_NAME = ai_interview_platform
   JWT_SECRET = your-super-secret-jwt-key
   AI_SERVICE_URL = https://your-ai-service.onrender.com
   CORS_ORIGINS = https://your-frontend.vercel.app
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://interview-platform-backend.onrender.com`)

### 2.4 Seed the Database
After deployment completes:
1. Go to your service dashboard
2. Click "Shell" tab
3. Run: `node seed.js`
4. Verify users and questions were created

---

## 🤖 **Step 3: Deploy AI Service to Render**

### 3.1 Deploy AI Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `interview-platform-ai`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: `ai-service`
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Plan**: Free

4. Add Environment Variable:
   ```
   AI_SERVICE_PORT = 8002
   ```

5. Click "Create Web Service"
6. Wait for deployment
7. Copy your AI service URL (e.g., `https://interview-platform-ai.onrender.com`)

### 3.2 Update Backend Environment
1. Go back to your Backend service in Render
2. Go to "Environment" tab
3. Update `AI_SERVICE_URL` with your AI service URL
4. Click "Save Changes"
5. Service will auto-redeploy

---

## 🌐 **Step 4: Deploy Frontend to Vercel**

### 4.1 Prepare Frontend for Deployment

Update `/app/frontend/.env.production`:

```env
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

### 4.2 Create Vercel Account
1. Go to [Vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Authorize Vercel

### 4.3 Deploy Frontend
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `yarn build`
   - **Output Directory**: `build`
   - **Install Command**: `yarn install`

4. Add Environment Variable:
   ```
   REACT_APP_BACKEND_URL = https://your-backend.onrender.com
   ```

5. Click "Deploy"
6. Wait for deployment (2-3 minutes)
7. Copy your frontend URL (e.g., `https://interview-platform.vercel.app`)

### 4.4 Update CORS in Backend
1. Go to your Backend service in Render
2. Update `CORS_ORIGINS` environment variable with your Vercel URL
3. Save changes

---

## ✅ **Step 5: Verification**

### 5.1 Test Backend API
```bash
curl https://your-backend.onrender.com/api
```
Should return: `{"message": "AI Interview Platform API is running 🚀"}`

### 5.2 Test AI Service
```bash
curl https://your-ai-service.onrender.com/
```
Should return: `{"message": "AI Evaluation Service Running", "status": "active"}`

### 5.3 Test Frontend
1. Visit your Vercel URL
2. Try to register a new account
3. Login with test credentials:
   - Email: `candidate@interview.com`
   - Password: `password123`
4. Start an interview
5. Submit answers and verify scoring works

---

## 🔐 **Step 6: Security Checklist**

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update MongoDB password to a strong password
- [ ] Enable MongoDB IP whitelist (remove 0.0.0.0/0 if possible)
- [ ] Set proper CORS origins (no wildcards in production)
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Review and secure all environment variables
- [ ] Set up MongoDB backups in Atlas
- [ ] Enable rate limiting on backend API

---

## 📊 **Step 7: Monitoring & Maintenance**

### Render Monitoring
- Check service logs in Render dashboard
- Monitor service health and uptime
- Set up notifications for service failures

### Vercel Monitoring
- View deployment logs
- Monitor build times
- Check analytics

### MongoDB Atlas
- Monitor database size and performance
- Set up alerts for high usage
- Review slow queries

---

## ⚙️ **Environment Variables Reference**

### Backend (.env)
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=ai_interview_platform
JWT_SECRET=your-secret-key-min-32-characters
AI_SERVICE_URL=https://your-ai-service.onrender.com
CORS_ORIGINS=https://your-frontend.vercel.app
```

### AI Service (.env)
```env
AI_SERVICE_PORT=8002
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
```

---

## 🆓 **Free Tier Limitations**

### Render Free Tier
- Services sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month per service
- Solution: Keep services active or upgrade to paid plan

### Vercel Free Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domains supported

### MongoDB Atlas Free Tier (M0)
- 512 MB storage
- Shared RAM
- No backups (manual export needed)
- Suitable for development and small projects

---

## 🚀 **Optional: Custom Domain Setup**

### Frontend (Vercel)
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

### Backend (Render)  
1. Upgrade to paid plan (required for custom domains)
2. Go to service settings → Custom Domain
3. Add domain and update DNS
4. SSL certificate is automatic

---

## 📞 **Support & Troubleshooting**

### Common Issues

**Backend not connecting to MongoDB:**
- Verify connection string format
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

**CORS Errors:**
- Verify CORS_ORIGINS matches exact frontend URL
- Check both HTTP and HTTPS
- Restart backend after changing CORS settings

**AI Service timeout:**
- Render free tier services sleep after inactivity
- First request may take 30-60 seconds
- Consider upgrading to paid tier for production

**Frontend not loading:**
- Check browser console for errors
- Verify REACT_APP_BACKEND_URL is correct
- Clear browser cache

---

## 🎯 **Production Checklist**

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render
- [ ] AI Service deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] All environment variables configured
- [ ] Database seeded with initial data
- [ ] CORS configured correctly
- [ ] All services tested and working
- [ ] Security measures implemented
- [ ] Monitoring and alerts set up
- [ ] Documentation updated with production URLs

---

## 📧 **Test Accounts**

After running seed script on production:

- **Super Admin**: `superadmin@interview.com` / `password123`
- **Admin**: `admin@interview.com` / `password123`
- **Reviewer**: `reviewer@interview.com` / `password123`
- **Candidate**: `candidate@interview.com` / `password123`

**⚠️ Important**: Change these passwords in production!

---

## 🎓 **Next Steps After Deployment**

1. Share the platform with test users
2. Gather feedback
3. Monitor performance and errors
4. Add more interview questions
5. Implement additional features
6. Consider upgrading to paid plans for better performance
7. Set up automated backups
8. Implement analytics tracking

---

**🎉 Congratulations!** Your AI Interview Platform is now live and accessible worldwide!
