import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  Award, 
  Home, 
  User, 
  FileText, 
  Trophy, 
  Bell, 
  HelpCircle, 
  LogOut,
  Download,
  Eye,
  Upload,
  MessageCircle,
  AlertCircle,
  Loader
} from 'lucide-react';

const InternDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internData, setInternData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // API base URL - adjust according to your backend
  const API_BASE_URL = 'https://hrms-backend-5wau.onrender.com/api';

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/intern/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/dashboard');
      setInternData(data.internData);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const data = await apiCall('/tasks');
      setTasks(data);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Tasks fetch error:', error);
    }
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const data = await apiCall('/announcements');
      setAnnouncements(data);
    } catch (error) {
      setError('Failed to fetch announcements');
      console.error('Announcements fetch error:', error);
    }
  };

  // Fetch timeline
  const fetchTimeline = async () => {
    try {
      const data = await apiCall('/timeline');
      setTimelineSteps(data);
    } catch (error) {
      setError('Failed to fetch timeline');
      console.error('Timeline fetch error:', error);
    }
  };

  // Submit task
  const submitTask = async (taskId) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('submissionText', submissionText);
      if (submissionFile) {
        formData.append('file', submissionFile);
      }

      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit task');
      }

      // Refresh tasks after submission
      await fetchTasks();
      await fetchDashboardData();
      setSelectedTask(null);
      setSubmissionText('');
      setSubmissionFile(null);
      alert('Task submitted successfully!');
    } catch (error) {
      setError('Failed to submit task');
      console.error('Task submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Download certificate
  const downloadCertificate = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/certificate/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Certificate not available');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificate.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Certificate not available for download yet');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/intern/login';
  };

  // Load data on component mount
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = '/intern/login';
      return;
    }

    fetchDashboardData();
    fetchTasks();
    fetchAnnouncements();
    fetchTimeline();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Submitted': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'tasks', icon: FileText, label: 'My Tasks' },
    { id: 'certificates', icon: Trophy, label: 'Certificates' },
    { id: 'announcements', icon: Bell, label: 'Announcements' },
    { id: 'help', icon: HelpCircle, label: 'Help & Support' },
    { id: 'logout', icon: LogOut, label: 'Logout' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader className="animate-spin" size={24} />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Intern Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => item.id === 'logout' ? handleLogout() : setActiveNav(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeNav === item.id 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
              {internData?.name?.split(' ').map(n => n[0]).join('') || 'IN'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {internData?.name || 'Intern'}!</h1>
              <p className="text-blue-100">Your training ends on: {internData?.trainingEndDate || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Tasks Completed</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {internData?.tasksCompleted || 0} of {internData?.totalTasks || 0}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Days Remaining</h3>
                  <p className="text-2xl font-bold text-gray-900">{internData?.daysRemaining || 0} Days</p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Upcoming Deadline</h3>
                  <p className="text-sm font-medium text-gray-900">
                    {internData?.upcomingDeadline || 'No upcoming deadlines'}
                  </p>
                </div>
                <Clock className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Certificate Progress</h3>
                  <p className="text-2xl font-bold text-gray-900">{internData?.certificateProgress || 0}%</p>
                </div>
                <Award className="text-purple-500" size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Status Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Task Status</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{task.assignedDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{task.dueDate}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => setSelectedTask(task)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              {task.status === 'Pending' && (
                                <button 
                                  onClick={() => setSelectedTask(task)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Submit Task"
                                >
                                  <Upload size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Announcements */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">📢 Announcements</h2>
                </div>
                <div className="p-6 space-y-4">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                      {announcement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">🎓 Certificate</h2>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {internData?.certificateProgress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${internData?.certificateProgress || 0}%` }}
                    ></div>
                  </div>
                  <button 
                    onClick={downloadCertificate}
                    disabled={internData?.certificateProgress !== 100}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      internData?.certificateProgress === 100 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Download size={16} />
                    <span>Download Certificate</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Complete all tasks to unlock your certificate
                  </p>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">💬 Help & Support</h2>
                </div>
                <div className="p-6">
                  <a 
                    href="mailto:info@thevsoft.com" 
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
                  >
                    <span>📧</span>
                    <span>info@thevsoft.com</span>
                  </a>
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <MessageCircle size={16} />
                    <span>Live Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress Timeline */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">🛣️ Training Progress Timeline</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap justify-between items-center space-y-4 md:space-y-0">
                  {timelineSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : step.status === 'current' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-800">{step.title}</h3>
                        <p className="text-xs text-gray-500">{step.date}</p>
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div className="hidden md:block absolute top-4 left-full w-16 h-0.5 bg-gray-200 transform translate-x-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">{selectedTask.title}</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedTask.description || 'No description provided'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <p className="text-sm text-gray-600">{selectedTask.dueDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                </div>

                {selectedTask.feedback && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback
                    </label>
                    <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                      {selectedTask.feedback}
                    </p>
                  </div>
                )}

                {selectedTask.status === 'Pending' && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Submit Task</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Submission Text
                        </label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your submission details..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload File (Optional)
                        </label>
                        <input
                          type="file"
                          onChange={(e) => setSubmissionFile(e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              {selectedTask.status === 'Pending' && (
                <button
                  onClick={() => submitTask(selectedTask.id)}
                  disabled={submitting || !submissionText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting && <Loader className="animate-spin" size={16} />}
                  <span>{submitting ? 'Submitting...' : 'Submit Task'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternDashboard;