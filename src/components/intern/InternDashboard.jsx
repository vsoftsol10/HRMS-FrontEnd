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
import './InternDashboard.css';

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
    // ✅ FIX: Always use direct production URL first in development
    {
      name: 'Direct Production',
      baseUrl: 'https://hrms-backend-5wau.onrender.com/api',
      description: 'Direct production server connection'
    },
    // Only try proxy as fallback
    ...(isDevelopment ? [{
      name: 'Development Proxy',
      baseUrl: '/api',
      description: 'Development proxy (fallback)'
    }] : [])
  ];

  return configs;
};

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const validateAuth = () => {
    const token = getToken();
    if (!token) {
      console.warn('No authentication token found');
      // Don't redirect immediately in development for testing
      if (process.env.NODE_ENV !== 'development') {
        window.location.href = '/intern/login';
      }
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && payload.exp < Date.now() / 1000) {
        console.warn('Token expired');
        localStorage.removeItem('token');
        if (process.env.NODE_ENV !== 'development') {
          window.location.href = '/intern/login';
        }
        return false;
      }
    } catch (e) {
      console.warn('Invalid token format:', e);
      return process.env.NODE_ENV === 'development'; // Allow in dev for testing
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
        console.log("current Token: ",getToken())
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            // Add CORS headers for direct requests
            'Accept': 'application/json',
            ...options.headers,
          },
          // Add timeout
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
            localStorage.removeItem('token');
            if (process.env.NODE_ENV !== 'development') {
              window.location.href = '/intern/login';
            }
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

  // Enhanced data fetching with better error handling
const fetchDashboardData = async () => {
  try {
    setLoading(true);
    setError(null);
    
    console.log('📊 Fetching dashboard data...');
    const data = await apiCall("/dashboard");
    
    if (data) {
      // The backend now returns the data directly, not nested in internData
      setInternData(data);
      console.log('✅ Dashboard data loaded:', data);
    }
  } catch (error) {
    const errorMsg = `Failed to fetch dashboard data: ${error.message}`;
    setError(errorMsg);
    console.error("Dashboard fetch error:", error);
    
    // Set mock data in development for testing UI
    if (process.env.NODE_ENV === 'development') {
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
    }
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
    if (process.env.NODE_ENV === 'development') {
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
      if (process.env.NODE_ENV === 'development') {
        setAnnouncements([
          "🎉 Welcome to the internship program!",
          "📚 New learning resources available in the portal",
          "⏰ Weekly standup meetings every Monday at 10 AM"
        ]);
      }
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
      if (process.env.NODE_ENV === 'development') {
        setTimelineSteps([
          { title: "Onboarding", date: "Week 1", status: "completed" },
          { title: "Training Phase 1", date: "Week 2-4", status: "completed" },
          { title: "Project Work", date: "Week 5-8", status: "current" },
          { title: "Final Review", date: "Week 9", status: "pending" },
          { title: "Completion", date: "Week 10", status: "pending" }
        ]);
      }
    }
  };

  // File upload with enhanced error handling
  const apiCallWithFile = async (endpoint, formData) => {
    try {
      const token = getToken();
      const configs = getApiConfig();
      
      for (const config of configs) {
        try {
          const response = await fetch(`${config.baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
          });

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem("token");
              if (process.env.NODE_ENV !== 'development') {
                window.location.href = "/intern/login";
              }
              throw new Error('Authentication failed');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          console.error(`File upload failed with ${config.name}:`, error);
          if (config === configs[configs.length - 1]) {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      throw error;
    }
  };

  // Submit task with better error handling
  const submitTask = async (taskId) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("submissionText", submissionText);
      if (submissionFile) {
        formData.append("file", submissionFile);
      }

      await apiCallWithFile(`/tasks/${taskId}/submit`, formData);

      // Refresh data after submission
      await Promise.all([fetchTasks(), fetchDashboardData()]);

      // Reset form
      setSelectedTask(null);
      setSubmissionText("");
      setSubmissionFile(null);

      alert("Task submitted successfully!");
    } catch (error) {
      setError("Failed to submit task: " + error.message);
      console.error("Task submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Download certificate with enhanced error handling
  const downloadCertificate = async () => {
    try {
      const token = getToken();
      const configs = getApiConfig();
      
      for (const config of configs) {
        try {
          const response = await fetch(`${config.baseUrl}/certificate/download`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Certificate not yet available");
            }
            throw new Error("Failed to download certificate");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${internData?.name || "intern"}_certificate.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return;
        } catch (error) {
          if (config === configs[configs.length - 1]) {
            throw error;
          }
        }
      }
    } catch (error) {
      alert(error.message || "Certificate not available for download yet");
    }
  };

  // Logout
  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/intern/login";
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
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Continuing in development mode...');
      } else {
        return;
      }
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
        return "idp-status-pending";
      case "In Progress":
        return "idp-status-in-progress";
      case "Completed":
        return "idp-status-completed";
      case "Submitted":
        return "idp-status-submitted";
      case "Approved":
        return "idp-status-approved";
      default:
        return "idp-status-default";
    }
  };

  const navItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "tasks", icon: FileText, label: "My Tasks" },
    { id: "certificates", icon: Trophy, label: "Certificates" },
    { id: "announcements", icon: Bell, label: "Announcements" },
    { id: "logout", icon: LogOut, label: "Logout" },
  ];

  // Connection status indicator
  const ConnectionStatus = () => {
    const getStatusInfo = () => {
      switch (connectionStatus) {
        case 'connected':
          return { icon: Wifi, color: 'idp-status-connected', text: 'Connected' };
        case 'disconnected':
          return { icon: WifiOff, color: 'idp-status-disconnected', text: 'Disconnected' };
        case 'checking':
          return { icon: Loader, color: 'idp-status-checking', text: 'Connecting...', animate: true };
        default:
          return { icon: AlertCircle, color: 'idp-status-unknown', text: 'Unknown' };
      }
    };

    const { icon: Icon, color, text, animate } = getStatusInfo();

    return (
      <div className={`idp-connection-status ${color}`}>
        <Icon size={16} className={animate ? 'idp-animate-spin' : ''} />
        <span>{text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="idp-loading-screen">
        <div className="idp-loading-content">
          <Loader className="idp-loading-spinner" size={48} />
          <h2 className="idp-loading-title">Loading Dashboard...</h2>
          <p className="idp-loading-subtitle">Connecting to server and fetching your data</p>
          <ConnectionStatus />
        </div>
      </div>
    );
  }

  if (error && !internData) {
    return (
      <div className="idp-error-screen">
        <div className="idp-error-content">
          <AlertCircle className="idp-error-icon" size={48} />
          <h2 className="idp-error-title">Connection Error</h2>
          <p className="idp-error-subtitle">{error}</p>
          <ConnectionStatus />
          <div className="idp-error-actions">
            <button onClick={retryFetchAll} className="idp-btn idp-btn-primary">
              <RefreshCw size={16} />
              <span>Retry Connection</span>
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button onClick={() => window.location.reload()} className="idp-btn idp-btn-secondary">
                Reload Page
              </button>
            )}
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="idp-debug-info">
              <h3>🔧 Development Debug Info:</h3>
              <ul>
                <li>• Check if your backend server is running</li>
                <li>• Verify proxy configuration in vite.config.js or package.json</li>
                <li>• Check backend CORS settings</li>
                <li>• Ensure backend is accessible at: https://hrms-backend-5wau.onrender.com</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="idp-dashboard-container">
      {/* Sidebar */}
      <div className="idp-sidebar">
        <div className="idp-sidebar-header">
          <h2 className="idp-sidebar-title">Intern Portal</h2>
          <div className="idp-sidebar-status">
            {/* <ConnectionStatus /> */}
          </div>
        </div>
        <nav className="idp-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() =>
                item.id === "logout" ? handleLogout() : setActiveNav(item.id)
              }
              className={`idp-nav-item ${
                activeNav === item.id ? "idp-nav-item-active" : ""
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="idp-main-content">
        {/* Welcome Banner */}
        <div className="idp-welcome-banner">
          <div className="idp-banner-content">
            <div className="idp-user-info">
              <div className="idp-user-avatar">
                {internData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "IN"}
              </div>
              <div className="idp-user-details">
                <h1 className="idp-welcome-title">
                  Welcome, {internData?.name || "Intern"}!
                </h1>
                <p className="idp-welcome-subtitle">
                  Your training ends on:{" "}
                  {internData?.trainingEndDate || "Not set"}
                </p>
              </div>
            </div>
            
            {error && (
              <button onClick={retryFetchAll} className="idp-retry-button" title="Retry failed requests">
                <RefreshCw size={16} />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="idp-error-banner">
            <div className="idp-error-banner-content">
              <AlertCircle className="idp-error-banner-icon" size={20} />
              <div className="idp-error-banner-text">
                <p>{error}</p>
              </div>
              <button onClick={() => setError(null)} className="idp-error-banner-close">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="idp-content-area">
          {/* Quick Stats Cards */}
          <div className="idp-stats-grid">
            <div className="idp-stat-card">
              <div className="idp-stat-content">
                <div className="idp-stat-info">
                  <h3 className="idp-stat-label">Tasks Completed</h3>
                  <p className="idp-stat-value">
                    {internData?.tasksCompleted || 0} of{" "}
                    {internData?.totalTasks || 0}
                  </p>
                </div>
                <CheckCircle className="idp-stat-icon idp-stat-icon-green" size={24} />
              </div>
            </div>

            <div className="idp-stat-card">
              <div className="idp-stat-content">
                <div className="idp-stat-info">
                  <h3 className="idp-stat-label">Days Remaining</h3>
                  <p className="idp-stat-value">
                    {internData?.daysRemaining || 0} Days
                  </p>
                </div>
                <Calendar className="idp-stat-icon idp-stat-icon-primary" size={24} />
              </div>
            </div>

            <div className="idp-stat-card">
              <div className="idp-stat-content">
                <div className="idp-stat-info">
                  <h3 className="idp-stat-label">Upcoming Deadline</h3>
                  <p className="idp-stat-value-small">
                    {internData?.upcomingDeadline || "No upcoming deadlines"}
                  </p>
                </div>
                <Clock className="idp-stat-icon idp-stat-icon-orange" size={24} />
              </div>
            </div>

            <div className="idp-stat-card">
              <div className="idp-stat-content">
                <div className="idp-stat-info">
                  <h3 className="idp-stat-label">Certificate Progress</h3>
                  <p className="idp-stat-value">
                    {internData?.certificateProgress || 0}%
                  </p>
                </div>
                <Award className="idp-stat-icon idp-stat-icon-purple" size={24} />
              </div>
            </div>
          </div>

          <div className="idp-main-grid">
            {/* Task Status Table */}
            <div className="idp-main-section">
              <div className="idp-card">
                <div className="idp-card-header">
                  <h2 className="idp-card-title">Task Status</h2>
                </div>
                <div className="idp-table-container">
                  <table className="idp-task-table">
                    <thead>
                      <tr>
                        <th>Task Title</th>
                        <th>Assigned Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.length > 0 ? (
                        tasks.map((task) => (
                          <tr key={task.id} className="idp-task-row">
                            <td className="idp-task-title">{task.title}</td>
                            <td className="idp-task-date">{task.assignedDate}</td>
                            <td className="idp-task-date">{task.dueDate}</td>
                            <td>
                              <span className={`idp-status-badge ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td>
                              <div className="idp-task-actions">
                                <button
                                  onClick={() => setSelectedTask(task)}
                                  className="idp-action-button idp-view-button"
                                  title="View Details"
                                >
                                  <Eye size={16} />
                                </button>
                                {task.status === "Pending" && (
                                  <button
                                    onClick={() => setSelectedTask(task)}
                                    className="idp-action-button idp-submit-button"
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
                          <td colSpan={5} className="idp-empty-state">
                            <div className="idp-empty-content">
                              <FileText className="idp-empty-icon" size={48} />
                              <p>No tasks available</p>
                              {connectionStatus === 'disconnected' && (
                                <button onClick={retryFetchAll} className="idp-retry-link">
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
            <div className="idp-sidebar-right">
              {/* Announcements */}
              <div className="idp-card">
                <div className="idp-card-header">
                  <h2 className="idp-card-title">📢 Announcements</h2>
                </div>
                <div className="idp-announcements-content">
                  {announcements.length > 0 ? (
                    announcements.map((announcement, index) => (
                      <div key={index} className="idp-announcement-item">
                        {announcement}
                      </div>
                    ))
                  ) : (
                    <div className="idp-empty-announcements">
                      <Bell className="idp-empty-icon" size={32} />
                      <p>No announcements yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Section */}
              <div className="idp-card">
                <div className="idp-card-header">
                  <h2 className="idp-card-title">🎓 Certificate</h2>
                </div>
                <div className="idp-certificate-content">
                  <div className="idp-progress-header">
                    <span className="idp-progress-label">Progress</span>
                    <span className="idp-progress-value">
                      {internData?.certificateProgress || 0}%
                    </span>
                  </div>
                  <div className="idp-progress-bar">
                    <div
                      className="idp-progress-fill"
                      style={{
                        width: `${internData?.certificateProgress || 0}%`,
                      }}
                    ></div>
                  </div>
                  <button
                    onClick={downloadCertificate}
                    disabled={internData?.certificateProgress !== 100}
                    className={`idp-download-button ${
                      internData?.certificateProgress === 100
                        ? "idp-download-enabled"
                        : "idp-download-disabled"
                    }`}
                  >
                    <Download size={16} />
                    <span>Download Certificate</span>
                  </button>
                  <p className="idp-certificate-note">
                    Complete all tasks to unlock your certificate
                  </p>
                </div>
              </div>

              {/* Help & Support */}
              <div className="idp-card">
                <div className="idp-card-header">
                  <h2 className="idp-card-title">💬 Help & Support</h2>
                </div>
                <div className="idp-help-content">
                  <a href="mailto:info@thevsoft.com" className="idp-help-email">
                    <span>📧</span>
                    <span>info@thevsoft.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress Timeline */}
          <div className="idp-timeline-section">
            <div className="idp-card">
              <div className="idp-card-header">
                <h2 className="idp-card-title">🛣️ Training Progress Timeline</h2>
              </div>
              <div className="idp-timeline-content">
                {timelineSteps.length > 0 ? (
                  <div className="idp-timeline-container">
                    {timelineSteps.map((step, index) => (
                      <div key={index} className="idp-timeline-step">
                        <div
                          className={`idp-timeline-marker ${
                            step.status === "completed"
                              ? "idp-timeline-completed"
                              : step.status === "current"
                              ? "idp-timeline-current"
                              : "idp-timeline-pending"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="idp-timeline-info">
                          <h3 className="idp-timeline-title">{step.title}</h3>
                          <p className="idp-timeline-date">{step.date}</p>
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div className="idp-timeline-connector"></div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="idp-empty-timeline">
                    <Calendar className="idp-empty-icon" size={48} />
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
        <div className="idp-modal-overlay">
          <div className="idp-modal-content">
            <div className="idp-modal-header">
              <h2 className="idp-modal-title">{selectedTask.title}</h2>
            </div>
            <div className="idp-modal-body">
              <div className="idp-modal-section">
                <div className="idp-form-group">
                  <label className="idp-form-label">Task Description</label>
                  <p className="idp-task-description">
                    {selectedTask.description || "No description provided"}
                  </p>
                </div>

                <div className="idp-modal-grid">
                  <div className="idp-form-group">
                    <label className="idp-form-label">Due Date</label>
                    <p className="idp-form-value">{selectedTask.dueDate}</p>
                  </div>
                  <div className="idp-form-group">
                    <label className="idp-form-label">Status</label>
                    <span className={`idp-status-badge ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                </div>

                {selectedTask.feedback && (
                  <div className="idp-form-group">
                    <label className="idp-form-label">Feedback</label>
                    <p className="idp-feedback-text">{selectedTask.feedback}</p>
                  </div>
                )}

                {selectedTask.status === "Pending" && (
                  <div className="idp-submission-section">
                    <h3 className="idp-submission-title">Submit Task</h3>
                    <div className="idp-submission-form">
                      <div className="idp-form-group">
                        <label className="idp-form-label">Submission Text</label>
                        <textarea
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          rows={4}
                          className="idp-form-textarea"
                          placeholder="Enter your submission details..."
                        />
                      </div>
                      <div className="idp-form-group">
                        <label className="idp-form-label">Upload File (Optional)</label>
                        <input
                          type="file"
                          onChange={(e) => setSubmissionFile(e.target.files[0])}
                          className="idp-form-file"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="idp-modal-footer">
              <button
                onClick={() => setSelectedTask(null)}
                className="idp-btn idp-btn-secondary"
              >
                Close
              </button>
              {selectedTask.status === "Pending" && (
                <button
                  onClick={() => submitTask(selectedTask.id)}
                  disabled={submitting || !submissionText.trim()}
                  className="idp-btn idp-btn-primary"
                >
                  {submitting && <Loader className="idp-btn-spinner" size={16} />}
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