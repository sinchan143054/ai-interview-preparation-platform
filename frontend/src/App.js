import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import InterviewResult from './pages/InterviewResult';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import { Toaster } from './components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Interview user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/result/:interviewId"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <InterviewResult user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['candidate']}>
                <Analytics user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'superadmin', 'reviewer']}>
                <AdminPanel user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
