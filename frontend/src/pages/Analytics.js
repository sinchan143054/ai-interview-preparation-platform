import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { toast } from 'sonner';

const Analytics = () => {
  const navigate = useNavigate();
  const [progression, setProgression] = useState([]);
  const [insights, setInsights] = useState(null);
  const [domainPerformance, setDomainPerformance] = useState([]);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');

      const [progressionRes, insightsRes, domainRes, recentRes] = await Promise.all([
        axios.get(`${API}/analytics/progression`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/analytics/insights`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/analytics/domain-performance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/analytics/recent`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setProgression(progressionRes.data.progression);
      setInsights(insightsRes.data);
      setDomainPerformance(domainRes.data.domainPerformance);
      setRecentInterviews(recentRes.data.recentInterviews);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const downloadAllCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/reports/csv-all`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all-interviews-summary.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('CSV downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download CSV');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)' }}>
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  const progressionData = progression.map((p, index) => ({
    name: `Interview ${index + 1}`,
    technical: p.technical,
    communication: p.communication,
    confidence: p.confidence,
    overall: p.overall,
  }));

  const radarData = insights?.skillAverages
    ? [
        { skill: 'Technical', score: insights.skillAverages.technical },
        { skill: 'Communication', score: insights.skillAverages.communication },
        { skill: 'Confidence', score: insights.skillAverages.confidence },
        { skill: 'Problem Solving', score: insights.skillAverages.problemSolving },
      ]
    : [];

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Performance Analytics</h1>
            <p className="text-gray-400">Track your progress and identify areas for improvement</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={downloadAllCSV}
              variant="outline"
              className="bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              data-testid="back-btn"
              variant="outline"
              className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>

        {/* Skill Averages Cards */}
        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 text-sm font-medium">Overall Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{insights.skillAverages.overall}</div>
                <p className="text-xs text-blue-200 mt-1">Across all interviews</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-300 text-sm font-medium">Technical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{insights.skillAverages.technical}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-300 text-sm font-medium">Communication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{insights.skillAverages.communication}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-300 text-sm font-medium">Confidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{insights.skillAverages.confidence}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Progression Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Skill Progression Over Time</CardTitle>
              <CardDescription className="text-gray-400">Track your improvement across interviews</CardDescription>
            </CardHeader>
            <CardContent>
              {progressionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="technical" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="communication" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="confidence" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="overall" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  No progression data yet. Complete more interviews!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Skill Distribution</CardTitle>
              <CardDescription className="text-gray-400">Overall skill assessment radar</CardDescription>
            </CardHeader>
            <CardContent>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                    <Radar name="Skills" dataKey="score" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                  No skill data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Domain Performance */}
        {domainPerformance.length > 0 && (
          <Card className="bg-gray-900/50 border-gray-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Domain-wise Performance</CardTitle>
              <CardDescription className="text-gray-400">Compare your performance across different domains</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={domainPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="domain" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#F3F4F6' }}
                  />
                  <Legend />
                  <Bar dataKey="technical" fill="#3B82F6" />
                  <Bar dataKey="communication" fill="#10B981" />
                  <Bar dataKey="confidence" fill="#F59E0B" />
                  <Bar dataKey="overall" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Insights */}
        {insights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            {insights.strengths && insights.strengths.length > 0 && (
              <Card className="bg-green-900/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-300 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.strengths.map((strength, index) => (
                      <li key={index} className="text-green-200 flex items-start gap-2">
                        <Award className="h-4 w-4 mt-1 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Weaknesses */}
            {insights.weaknesses && insights.weaknesses.length > 0 && (
              <Card className="bg-orange-900/20 border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-orange-300 flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-orange-200 flex items-start gap-2">
                        <span className="text-orange-400 mt-1">\u2022</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
