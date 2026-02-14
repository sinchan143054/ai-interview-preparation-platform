import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileQuestion, BarChart3, Plus, Edit, Trash2, ArrowLeft, Shield } from 'lucide-react';

const AdminPanel = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  // Form states
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [newQuestion, setNewQuestion] = useState({
    domain: 'frontend',
    difficulty: 'easy',
    question: '',
    modelAnswer: '',
    keywords: '',
    category: 'general',
  });

  const canEdit = user?.role === 'admin' || user?.role === 'superadmin';
  const canDelete = user?.role === 'superadmin';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [usersRes, questionsRes, statsRes] = await Promise.all([
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/questions`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUsers(usersRes.data.users);
      setQuestions(questionsRes.data.questions);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
  };

  const handleCreateUser = async () => {
    if (!canDelete) {
      toast.error('Only Super Admin can create users');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/admin/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('User created successfully!');
      setIsUserDialogOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'candidate' });
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!canDelete) {
      toast.error('Only Super Admin can delete users');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('User deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleCreateQuestion = async () => {
    if (!canEdit) {
      toast.error('Insufficient permissions');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const questionData = {
        ...newQuestion,
        keywords: newQuestion.keywords.split(',').map((k) => k.trim()),
      };

      await axios.post(`${API}/admin/questions`, questionData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Question created successfully!');
      setIsQuestionDialogOpen(false);
      setNewQuestion({
        domain: 'frontend',
        difficulty: 'easy',
        question: '',
        modelAnswer: '',
        keywords: '',
        category: 'general',
      });
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!canEdit) {
      toast.error('Insufficient permissions');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Question deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete question');
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="h-10 w-10 text-purple-400" />
              Admin Panel
            </h1>
            <p className="text-gray-400">
              Role: <span className="text-purple-400 font-semibold capitalize">{user?.role}</span>
            </p>
          </div>
          <div className="flex gap-3">
            {user?.role === 'candidate' && (
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-red-600/20 border-red-500 text-red-300 hover:bg-red-600/30"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-blue-300 text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-blue-200 mt-1">Registered candidates</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-300 text-sm font-medium">Total Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{stats.totalInterviews}</div>
                <p className="text-xs text-green-200 mt-1">Completed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-purple-300 text-sm font-medium">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{stats.totalQuestions}</div>
                <p className="text-xs text-purple-200 mt-1">Active questions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-300 text-sm font-medium">Avg Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{stats.avgScore}</div>
                <p className="text-xs text-orange-200 mt-1">Platform average</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-700">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700">
              <Users className="h-4 w-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="questions" className="data-[state=active]:bg-gray-700">
              <FileQuestion className="h-4 w-4 mr-2" />
              Questions ({questions.length})
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Skill Stats */}
              {stats && (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Skill Statistics</CardTitle>
                    <CardDescription className="text-gray-400">
                      Average scores across all interviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={[
                          { skill: 'Technical', score: stats.skillStats.technical },
                          { skill: 'Communication', score: stats.skillStats.communication },
                          { skill: 'Confidence', score: stats.skillStats.confidence },
                          { skill: 'Problem Solving', score: stats.skillStats.problemSolving },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="skill" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="score" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Domain Stats */}
              {stats && stats.domainStats && stats.domainStats.length > 0 && (
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Domain-wise Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.domainStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="_id" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1F2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="avgScore" fill="#3B82F6" name="Average Score" />
                        <Bar dataKey="count" fill="#10B981" name="Interview Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">User Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage platform users and roles</CardDescription>
                  </div>
                  {canDelete && (
                    <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-user-btn">
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>Create New User</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Add a new user to the platform
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={newUser.name}
                              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white"
                              placeholder="John Doe"
                            />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={newUser.email}
                              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div>
                            <Label>Password</Label>
                            <Input
                              type="password"
                              value={newUser.password}
                              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white"
                              placeholder="••••••••"
                            />
                          </div>
                          <div>
                            <Label>Role</Label>
                            <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="candidate">Candidate</SelectItem>
                                <SelectItem value="reviewer">Reviewer</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="superadmin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleCreateUser} disabled={loading} className="w-full">
                            {loading ? 'Creating...' : 'Create User'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300">Created</TableHead>
                        {canDelete && <TableHead className="text-gray-300">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u._id} className="border-gray-700" data-testid={`user-row-${u._id}`}>
                          <TableCell className="text-white">{u.name}</TableCell>
                          <TableCell className="text-gray-300">{u.email}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                u.role === 'superadmin'
                                  ? 'bg-purple-600/30 text-purple-300'
                                  : u.role === 'admin'
                                  ? 'bg-blue-600/30 text-blue-300'
                                  : u.role === 'reviewer'
                                  ? 'bg-green-600/30 text-green-300'
                                  : 'bg-gray-600/30 text-gray-300'
                              }`}
                            >
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-400 text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </TableCell>
                          {canDelete && (
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(u._id)}
                                data-testid={`delete-user-${u._id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Question Management</CardTitle>
                    <CardDescription className="text-gray-400">Manage interview questions</CardDescription>
                  </div>
                  {canEdit && (
                    <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="add-question-btn">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Domain</Label>
                              <Select
                                value={newQuestion.domain}
                                onValueChange={(value) => setNewQuestion({ ...newQuestion, domain: value })}
                              >
                                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                  <SelectItem value="frontend">Frontend</SelectItem>
                                  <SelectItem value="backend">Backend</SelectItem>
                                  <SelectItem value="fullstack">Full Stack</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Difficulty</Label>
                              <Select
                                value={newQuestion.difficulty}
                                onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                              >
                                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label>Question</Label>
                            <Textarea
                              value={newQuestion.question}
                              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white"
                              placeholder="Enter the interview question..."
                            />
                          </div>
                          <div>
                            <Label>Model Answer</Label>
                            <Textarea
                              value={newQuestion.modelAnswer}
                              onChange={(e) => setNewQuestion({ ...newQuestion, modelAnswer: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white min-h-[100px]"
                              placeholder="Enter the ideal answer..."
                            />
                          </div>
                          <div>
                            <Label>Keywords (comma-separated)</Label>
                            <Input
                              value={newQuestion.keywords}
                              onChange={(e) => setNewQuestion({ ...newQuestion, keywords: e.target.value })}
                              className="bg-gray-900 border-gray-700 text-white"
                              placeholder="react, component, state"
                            />
                          </div>
                          <Button onClick={handleCreateQuestion} disabled={loading} className="w-full">
                            {loading ? 'Creating...' : 'Create Question'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div
                      key={q._id}
                      className="p-4 bg-gray-800/30 rounded-lg"
                      data-testid={`question-${q._id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-600/30 text-blue-300 rounded text-xs font-semibold">
                              {q.domain}
                            </span>
                            <span className="px-2 py-1 bg-purple-600/30 text-purple-300 rounded text-xs font-semibold">
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-white font-medium">{q.question}</p>
                        </div>
                        {canEdit && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuestion(q._id)}
                            data-testid={`delete-question-${q._id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
