import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { Progress } from '../components/ui/progress';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';

const Interview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const interviewData = location.state?.interviewData;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!interviewData) {
      toast.error('No interview data found');
      navigate('/dashboard');
      return;
    }

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewData, navigate]);

  if (!interviewData) return null;

  const { interviewId, allQuestions } = interviewData;
  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/interview/answer`,
        {
          interviewId,
          questionId: currentQuestion.questionId,
          userAnswer,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Answer submitted!');

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setUserAnswer('');
      } else {
        handleFinishInterview();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishInterview = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/interview/finish`,
        { interviewId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Interview completed!');
      navigate(`/interview/result/${interviewId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to finish interview');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(to bottom right, #0a0a0a, #1a1a2e)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Interview in Progress</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-gray-900/50 border-gray-800 mb-6" data-testid="question-card">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{currentQuestionIndex + 1}</span>
              </div>
              <div className="flex-1">
                <CardTitle className="text-white text-xl leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Your Answer</label>
                <Textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here... Be clear and concise."
                  data-testid="answer-textarea"
                  className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Provide detailed explanations with examples for better scoring
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  disabled={loading}
                  className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
                >
                  Exit Interview
                </Button>
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={loading}
                  data-testid="submit-answer-btn"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold"
                >
                  {loading ? (
                    'Submitting...'
                  ) : currentQuestionIndex < totalQuestions - 1 ? (
                    <>
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Finish Interview <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question List Progress */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Questions Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {allQuestions.map((_, index) => (
                <div
                  key={index}
                  className={`h-12 rounded-lg flex items-center justify-center font-semibold ${
                    index < currentQuestionIndex
                      ? 'bg-green-600/30 text-green-300 border border-green-500'
                      : index === currentQuestionIndex
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500'
                      : 'bg-gray-800/30 text-gray-500 border border-gray-700'
                  }`}
                >
                  {index < currentQuestionIndex ? <CheckCircle className="h-5 w-5" /> : index + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
