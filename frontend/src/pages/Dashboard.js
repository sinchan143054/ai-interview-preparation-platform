import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { BarChart, TrendingUp, Clock, Award, LogOut } from 'lucide-react';

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [domain, setDomain] = useState('frontend');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/interview/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterviewHistory(response.data.interviews);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/analytics/insights`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API}/interview/start`,
        { domain, difficulty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Interview started!');
      navigate('/interview', { state: { interviewData: response.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-400">Ready to practice your interview skills?</p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'candidate' && (
              <>
                <Button
                  variant="outline"
                  data-testid="analytics-btn"
                  onClick={() => navigate('/analytics')}
                  className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </>
            )}
            {(user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'reviewer') && (
              <Button
                variant="outline"
                data-testid="admin-panel-btn"
                onClick={() => navigate('/admin')}
                className="bg-purple-600/20 border-purple-500 text-purple-300 hover:bg-purple-600/30"
              >
                Admin Panel
              </Button>
            )}
            <Button
              variant="outline"
              data-testid="logout-btn"
              onClick={handleLogout}
              className="bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 text-sm font-medium">Overall Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.skillAverages?.overall || 0}</div>
                <p className="text-xs text-blue-200 mt-1">Average performance</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-300 text-sm font-medium">Technical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.skillAverages?.technical || 0}</div>
                <p className="text-xs text-purple-200 mt-1">Knowledge score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-300 text-sm font-medium">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.skillAverages?.communication || 0}</div>
                <p className="text-xs text-green-200 mt-1">Clarity score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-300 text-sm font-medium">Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{stats.skillAverages?.confidence || 0}</div>
                <p className="text-xs text-orange-200 mt-1">Confidence level</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Start New Interview */}
        {user?.role === 'candidate' && (
          <Card className="bg-gray-900/50 border-gray-800 mb-8" data-testid="start-interview-card">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Start New Interview</CardTitle>
              <CardDescription className="text-gray-400">
                Select your domain and difficulty level to begin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Domain</label>
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white" data-testid="domain-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="frontend">Frontend Development</SelectItem>
                      <SelectItem value="backend">Backend Development</SelectItem>
                      <SelectItem value="fullstack">Full Stack Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Difficulty</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white" data-testid="difficulty-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={startInterview}
                    disabled={loading}
                    data-testid="start-interview-btn"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                  >
                    {loading ? 'Starting...' : 'Start Interview'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview History */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Recent Interview History</CardTitle>
            <CardDescription className="text-gray-400">Your past interview attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {interviewHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No interviews yet. Start your first interview!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviewHistory.slice(0, 5).map((interview) => (
                  <div
                    key={interview._id}
                    data-testid={`interview-history-${interview._id}`}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition cursor-pointer"
                    onClick={() => navigate(`/interview/result/${interview._id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold capitalize">
                          {interview.domain} - {interview.difficulty}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(interview.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{interview.finalScore?.overall || 0}</div>
                      <div className="text-xs text-gray-400">Overall Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
