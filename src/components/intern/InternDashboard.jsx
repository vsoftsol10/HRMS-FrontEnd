
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
  Loader,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';

const InternDashboard = () => {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [internData, setInternData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Enhanced API configuration with multiple fallback options
  const getApiConfig = () => {
    const isDevelopment = process.env.NODE_ENV === "development";
    
    const configs = [
      // Primary: Proxy in development, direct production URL in production
      {
        name: 'Primary',
        baseUrl: isDevelopment ? '/api' : 'https://hrms-backend-5wau.onrender.com/api',
        description: isDevelopment ? 'Development proxy' : 'Production server'
      },
      // Fallback 1: Always try direct production URL
      {
        name: 'Direct Production',
        baseUrl: 'https://hrms-backend-5wau.onrender.com/api',
        description: 'Direct production server connection'
      },
    ];

    return configs;
  };

  // Get token from localStorage (mock for demo)
  const getToken = () => {
    return "mock-token-for-demo";
  };

  const validateAuth = () => {
    const token = getToken();
    if (!token) {
      console.warn('No authentication token found');
      return false;
    }
    return true;
  };

  // Enhanced API call with multiple fallback attempts
  const apiCall = async (endpoint, options = {}) => {
    const configs = getApiConfig();
    let lastError = null;
    
    console.log(`🔄 Attempting API call to ${endpoint}`);
    
    for (let i = 0; i < configs.length; i++) {
      const config = configs[i];
      
      try {
        console.log(`📡 Trying ${config.name}: ${config.baseUrl}${endpoint}`);
        
        const token = getToken();
        const url = `${config.baseUrl}${endpoint}`;
        console.log("current Token: ", getToken());
        
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            'Accept': 'application/json',
            ...options.headers,
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        console.log(`📊 Response from ${config.name}:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          if (response.status === 401) {
            console.warn('Authentication failed');
            throw new Error('Authentication failed');
          }
          
          // Try to get error message from response
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.message || errorMessage;
            } else {
              // If we get HTML, it might be an error page
              const text = await response.text();
              if (text.includes('<html>')) {
                errorMessage = `Server returned HTML instead of JSON (${response.status}). Backend might be down.`;
              }
            }
          } catch (parseError) {
            console.warn('Could not parse error response:', parseError);
          }
          
          throw new Error(errorMessage);
        }

        // Validate JSON response
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON but received: ${contentType || 'unknown'}`);
        }

        const data = await response.json();
        console.log(`✅ Success with ${config.name}:`, data);
        
        // Update connection status on successful call
        setConnectionStatus('connected');
        
        return data;

      } catch (error) {
        console.error(`❌ Failed with ${config.name}:`, error);
        lastError = error;
        
        // Don't try other configs for auth errors
        if (error.message.includes('Authentication failed')) {
          break;
        }
        
        // Continue to next config
        continue;
      }
    }
    
    // All configs failed
    setConnectionStatus('disconnected');
    
    // Provide helpful error message based on the last error
    if (lastError.name === 'TypeError' && lastError.message.includes('fetch')) {
      throw new Error('🔌 Cannot connect to server. Please check your internet connection and try again.');
    }
    
    if (lastError.name === 'AbortError') {
      throw new Error('⏱️ Request timed out. The server might be slow or down.');
    }
    
    if (lastError.message.includes('CORS')) {
      throw new Error('🚫 CORS error. Backend server configuration issue.');
    }
    
    throw new Error(`🚨 All connection attempts failed. Last error: ${lastError.message}`);
  };

  // Test API connectivity
  const testConnection = async () => {
    try {
      setConnectionStatus('checking');
      console.log('🔍 Testing API connectivity...');
      
      // Try a simple health check or the dashboard endpoint
      await apiCall('/dashboard');
      
      setConnectionStatus('connected');
      console.log('✅ API connection successful');
      return true;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  };

  // FIXED: Enhanced data fetching with corrected endpoint
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Fetching dashboard data...');
      // FIXED: Remove the extra '/api' prefix - was "/api/dashboard", now "/dashboard"
      const data = await apiCall("/dashboard");
      
      if (data) {
        setInternData(data);
        console.log('✅ Dashboard data loaded:', data);
      }
    } catch (error) {
      const errorMsg = `Failed to fetch dashboard data: ${error.message}`;
      setError(errorMsg);
      console.error("Dashboard fetch error:", error);
      
      // Set mock data in development for testing UI
      console.log('🔧 Setting mock data for development');
      setInternData({
        name: "Test Intern",
        trainingEndDate: "2025-08-25",
        tasksCompleted: 3,
        totalTasks: 5,
        daysRemaining: 45,
        upcomingDeadline: "Project Review - Aug 1",
        certificateProgress: 60
      });
    } finally {
      setLoading(false);
    }
  };

  // Also fix the tasks fetch to handle the date field correctly
  const fetchTasks = async () => {
    try {
      console.log('📋 Fetching tasks...');
      const data = await apiCall("/tasks");
      
      if (data) {
        setTasks(Array.isArray(data) ? data : []);
        console.log('✅ Tasks loaded:', data);
      }
    } catch (error) {
      const errorMsg = `Failed to fetch tasks: ${error.message}`;
      setError(errorMsg);
      console.error("Tasks fetch error:", error);
      
      // Set mock data in development
      setTasks([
        {
          id: 1,
          title: "Complete React Tutorial",
          assignedDate: "2025-07-20",
          dueDate: "2025-07-30",
          status: "Pending",
          description: "Complete the React fundamentals tutorial and submit your project."
        },
        {
          id: 2,
          title: "API Documentation Review",
          assignedDate: "2025-07-22",
          dueDate: "2025-08-01",
          status: "In Progress",
          description: "Review and provide feedback on the API documentation."
        }
      ]);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      console.log('📢 Fetching announcements...');
      const data = await apiCall("/announcements");
      
      if (data) {
        setAnnouncements(Array.isArray(data) ? data : []);
        console.log('✅ Announcements loaded:', data);
      }
    } catch (error) {
      const errorMsg = `Failed to fetch announcements: ${error.message}`;
      console.error("Announcements fetch error:", error);
      
      // Set mock data in development
      setAnnouncements([
        "🎉 Welcome to the internship program!",
        "📚 New learning resources available in the portal",
        "⏰ Weekly standup meetings every Monday at 10 AM"
      ]);
    }
  };

  const fetchTimeline = async () => {
    try {
      console.log('📅 Fetching timeline...');
      const data = await apiCall("/timeline");
      
      if (data) {
        setTimelineSteps(Array.isArray(data) ? data : []);
        console.log('✅ Timeline loaded:', data);
      }
    } catch (error) {
      const errorMsg = `Failed to fetch timeline: ${error.message}`;
      console.error("Timeline fetch error:", error);
      
      // Set mock data in development
      setTimelineSteps([
        { title: "Onboarding", date: "Week 1", status: "completed" },
        { title: "Training Phase 1", date: "Week 2-4", status: "completed" },
        { title: "Project Work", date: "Week 5-8", status: "current" },
        { title: "Final Review", date: "Week 9", status: "pending" },
        { title: "Completion", date: "Week 10", status: "pending" }
      ]);
    }
  };

  // Logout
  const handleLogout = () => {
    alert("Logout clicked (demo mode)");
  };

  // Retry all data fetching
  const retryFetchAll = async () => {
    setError(null);
    setLoading(true);
    
    try {
      await testConnection();
      await Promise.all([
        fetchDashboardData(),
        fetchTasks(),
        fetchAnnouncements(),
        fetchTimeline()
      ]);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    console.log('🚀 InternDashboard mounting...');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Configs:', getApiConfig());
    
    if (!validateAuth()) {
      console.warn('⚠️ Authentication validation failed');
      console.log('🔧 Continuing in demo mode...');
    }

    // Initialize data fetching
    const initializeData = async () => {
      await testConnection();
      await Promise.all([
        fetchDashboardData(),
        fetchTasks(),
        fetchAnnouncements(),
        fetchTimeline()
      ]);
    };

    initializeData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Submitted":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "profile", icon: User, label: "My Profile" },
    { id: "tasks", icon: FileText, label: "My Tasks" },
    { id: "certificates", icon: Trophy, label: "Certificates" },
    { id: "announcements", icon: Bell, label: "Announcements" },
    { id: "help", icon: HelpCircle, label: "Help & Support" },
    { id: "logout", icon: LogOut, label: "Logout" },
  ];

  // Connection status indicator
  const ConnectionStatus = () => {
    const getStatusInfo = () => {
      switch (connectionStatus) {
        case 'connected':
          return { icon: Wifi, color: 'text-green-500', text: 'Connected' };
        case 'disconnected':
          return { icon: WifiOff, color: 'text-red-500', text: 'Disconnected' };
        case 'checking':
          return { icon: Loader, color: 'text-yellow-500', text: 'Connecting...', animate: true };
        default:
          return { icon: AlertCircle, color: 'text-gray-500', text: 'Unknown' };
      }
    };

    const { icon: Icon, color, text, animate } = getStatusInfo();

    return (
      <div className={`flex items-center space-x-2 text-sm ${color}`}>
        <Icon size={16} className={animate ? 'animate-spin' : ''} />
        <span>{text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Dashboard...</h2>
          <p className="text-gray-600 mb-4">Connecting to server and fetching your data</p>
          <ConnectionStatus />
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
          <div className="mt-2">
            <ConnectionStatus />
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.id === "logout" ? handleLogout() : setActiveNav(item.id)
              }
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                activeNav === item.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg font-bold">
                {internData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "TI"}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome, {internData?.name || "Test Intern"}!
                </h1>
                <p className="text-blue-100">
                  Your training ends on:{" "}
                  {internData?.trainingEndDate || "2025-08-25"}
                </p>
              </div>
            </div>
            
            {error && (
              <button
                onClick={retryFetchAll}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 text-sm"
                title="Retry failed requests"
              >
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <div className="flex-1">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Tasks Completed
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {internData?.tasksCompleted || 0} of{" "}
                    {internData?.totalTasks || 0}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Days Remaining
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {internData?.daysRemaining || 0} Days
                  </p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Upcoming Deadline
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    {internData?.upcomingDeadline || "No upcoming deadlines"}
                  </p>
                </div>
                <Clock className="text-orange-500" size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">
                    Certificate Progress
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {internData?.certificateProgress || 0}%
                  </p>
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    Task Status
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Task Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <tr key={task.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {task.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {task.dueDate}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                                  task.status
                                )}`}
                              >
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
                                {task.status === "Pending" && (
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                            <div className="flex flex-col items-center space-y-2">
                              <FileText className="text-gray-300" size={48} />
                              <p>No tasks available</p>
                              {connectionStatus === 'disconnected' && (
                                <button
                                  onClick={retryFetchAll}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  Retry loading tasks
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    📢 Announcements
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((announcement, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg"
                      >
                        {announcement}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      <Bell className="text-gray-300 mx-auto mb-2" size={32} />
                      <p className="text-sm">No announcements yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Section */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">
                    🎓 Certificate
                  </h2>
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
                      style={{
                        width: `${internData?.certificateProgress || 0}%`,
                      }}
                    ></div>
                  </div>
                  <button
                    onClick={downloadCertificate}
                    disabled={internData?.certificateProgress !== 100}
                    className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      internData?.certificateProgress === 100
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
                  <h2 className="text-lg font-semibold text-gray-800">
                    💬 Help & Support
                  </h2>
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
                  
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">🔧 Debug Actions</h4>
                      <div className="space-y-2">
                        <button
                          onClick={testConnection}
                          className="w-full text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                        >
                          Test Connection
                        </button>
                        <button
                          onClick={() => {
                            console.log('Current State:', {
                              internData,
                              tasks,
                              announcements,
                              timelineSteps,
                              connectionStatus,
                              error
                            });
                          }}
                          className="w-full text-xs bg-green-100 text-green-700 px-2 py-1 rounded"
                        >
                          Log State
                        </button>
                        <button
                          onClick={() => {
                            localStorage.clear();
                            window.location.reload();
                          }}
                          className="w-full text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                        >
                          Clear Storage & Reload
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress Timeline */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  🛣️ Training Progress Timeline
                </h2>
              </div>
              <div className="p-6">
                {timelineSteps.length > 0 ? (
                  <div className="flex flex-wrap justify-between items-center space-y-4 md:space-y-0">
                    {timelineSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center space-y-2 relative"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step.status === "completed"
                              ? "bg-green-500 text-white"
                              : step.status === "current"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="text-center">
                          <h3 className="text-sm font-medium text-gray-800">
                            {step.title}
                          </h3>
                          <p className="text-xs text-gray-500">{step.date}</p>
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className="hidden md:block absolute top-4 left-full w-16 h-0.5 bg-gray-200 transform translate-x-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Calendar className="text-gray-300 mx-auto mb-2" size={48} />
                    <p>Timeline not available</p>
                  </div>
                )}
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
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedTask.title}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description
                  </label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedTask.description || "No description provided"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <p className="text-sm text-gray-600">
                      {selectedTask.dueDate}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        selectedTask.status
                      )}`}
                    >
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

                {selectedTask.status === "Pending" && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Submit Task
                    </h3>
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
              {selectedTask.status === "Pending" && (
                <button
                  onClick={() => submitTask(selectedTask.id)}
                  disabled={submitting || !submissionText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting && <Loader className="animate-spin" size={16} />}
                  <span>{submitting ? "Submitting..." : "Submit Task"}</span>
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
                              