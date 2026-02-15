import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Download, Home, TrendingUp, Award, AlertCircle } from 'lucide-react';

const InterviewResult = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewResult();
  }, [interviewId]);

  const fetchInterviewResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/interview/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterview(response.data.interview);
    } catch (error) {
      toast.error('Failed to load interview results');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/reports/pdf/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview-report-${interviewId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
    }
  };

  const downloadCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/reports/csv/${interviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `interview-report-${interviewId}.csv`);
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
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  if (!interview) return null;

  const { finalScore } = interview;
  const overallScore = finalScore?.overall || 0;
  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Interview Results</h1>
          <p className="text-gray-400">
            {interview.domain} - {interview.difficulty} | Completed on{' '}
            {new Date(interview.completedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Overall Score */}
        <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30 mb-8" data-testid="overall-score-card">
          <CardContent className="pt-8 pb-8 text-center">
            <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-gray-300 text-lg mb-2">Overall Score</h2>
            <div className={`text-7xl font-bold ${getScoreColor(overallScore)} mb-4`}>
              {overallScore}
              <span className="text-3xl text-gray-500">/100</span>
            </div>
            <p className="text-gray-400">
              {overallScore >= 70 ? '🎉 Excellent Performance!' : overallScore >= 50 ? '👍 Good Effort!' : '💪 Keep Practicing!'}
            </p>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-blue-400 text-sm">Technical Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(finalScore?.technical || 0)}`}>
                {finalScore?.technical || 0}/25
              </div>
              <Progress value={(finalScore?.technical / 25) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-green-400 text-sm">Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(finalScore?.communication || 0)}`}>
                {finalScore?.communication || 0}/25
              </div>
              <Progress value={(finalScore?.communication / 25) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-orange-400 text-sm">Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(finalScore?.confidence || 0)}`}>
                {finalScore?.confidence || 0}/25
              </div>
              <Progress value={(finalScore?.confidence / 25) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-purple-400 text-sm">Problem Solving</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${getScoreColor(finalScore?.problemSolving || 0)}`}>
                {finalScore?.problemSolving || 0}/25
              </div>
              <Progress value={(finalScore?.problemSolving / 25) * 100} className="mt-3 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Button
            onClick={() => navigate('/dashboard')}
            data-testid="back-to-dashboard-btn"
            className="bg-gray-800 hover:bg-gray-700 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/analytics')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Analytics
          </Button>
          <Button
            onClick={downloadPDF}
            data-testid="download-pdf-btn"
            variant="outline"
            className="bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            onClick={downloadCSV}
            data-testid="download-csv-btn"
            variant="outline"
            className="bg-green-600/20 border-green-500 text-green-300 hover:bg-green-600/30"
          >
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>

        {/* Question-wise Results */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Question-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {interview.questions.map((q, index) => (
                <div key={index} className="p-4 bg-gray-800/30 rounded-lg" data-testid={`question-result-${index}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-white font-semibold">Question {index + 1}</h3>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(q.scores.overall)}`}>
                        {q.scores.overall}/100
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        Sentiment: {q.sentiment}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3">{q.question}</p>

                  <div className="bg-gray-900/50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-400 mb-1">Your Answer:</p>
                    <p className="text-gray-200 text-sm">{q.userAnswer || 'No answer provided'}</p>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 p-3 rounded mb-3">
                    <p className="text-sm text-green-400 mb-1 font-semibold flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Model Answer (100% Score):
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed">{q.modelAnswer}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-gray-400">Technical:</span>{' '}
                      <span className="text-blue-400 font-semibold">{q.scores.technical}/25</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Communication:</span>{' '}
                      <span className="text-green-400 font-semibold">{q.scores.communication}/25</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span>{' '}
                      <span className="text-orange-400 font-semibold">{q.scores.confidence}/25</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewResult;
