import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  UserX, 
  ClipboardList,
  Upload,
  Calendar,
  Award,
  Eye,
  Edit,
  Trash2,
  Download,
  FileText,
  Video,
  Link,
  Search,
  BarChart3,
  TrendingUp,
  Clock,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react';
import './AdminIntern.css';

const AdminIntern = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Data states
  const [stats, setStats] = useState({
    totalInterns: 0,
    pendingApprovals: 0,
    activeInterns: 0,
    completedInterns: 0,
    avgProgress: 0
  });
  
  const [interns, setInterns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [resources, setResources] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [batches, setBatches] = useState([]);
  const [activities, setActivities] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingIntern, setEditingIntern] = useState(null);
  
  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: ''
  });
  
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'pdf',
    batch: 'All Batches',
    external_url: '',
    file: null
  });

  const [attendanceForm, setAttendanceForm] = useState({
    intern_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    check_in_time: '',
    check_out_time: '',
    notes: ''
  });

  // API base URL - adjust this to your backend URL
  const API_BASE_URL = 'http://localhost:8080/api';
  
  // Get auth token from localStorage
  const getAuthToken = () => localStorage.getItem('adminToken');
  
  // API helper function
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  console.log("➡️ Fetching:", `${API_BASE_URL}${endpoint}`);
  console.log("🪪 Token attached:", token);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("❌ API Error Response:", errorData);
    throw new Error(errorData.error || 'API call failed');
  }

  return response.json();
};

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData] = await Promise.all([
        apiCall('/admin/dashboard/stats'),
        apiCall('/admin/dashboard/activities')
      ]);
      
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load interns data
  const loadInterns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      });
      
      const data = await apiCall(`/admin/interns?${params}`);
      setInterns(data.interns);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load interns: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks data
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/admin/tasks');
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load resources data
  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/admin/resources');
      setResources(data);
    } catch (err) {
      setError('Failed to load resources: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load attendance data
  const loadAttendance = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/admin/attendance');
      setAttendance(data);
    } catch (err) {
      setError('Failed to load attendance: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load certificates data
  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/admin/certificates');
      setCertificates(data);
    } catch (err) {
      setError('Failed to load certificates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load batches data
  const loadBatches = async () => {
    try {
      const data = await apiCall('/admin/batches');
      setBatches(data);
    } catch (err) {
      setError('Failed to load batches: ' + err.message);
    }
  };

  // Update intern status
  const updateInternStatus = async (id, status) => {
    try {
      await apiCall(`/admin/interns/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      
      setSuccess(`Intern status updated to ${status}`);
      loadInterns();
      loadDashboardData();
    } catch (err) {
      setError('Failed to update intern status: ' + err.message);
    }
  };

  // Create new task
  const createTask = async () => {
    try {
      await apiCall('/admin/tasks', {
        method: 'POST',
        body: JSON.stringify(taskForm)
      });
      
      setSuccess('Task created successfully');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', assigned_to: '', due_date: '' });
      loadTasks();
    } catch (err) {
      setError('Failed to create task: ' + err.message);
    }
  };

  // Upload resource
  const uploadResource = async () => {
    try {
      const formData = new FormData();
      Object.keys(resourceForm).forEach(key => {
        if (resourceForm[key] !== null && resourceForm[key] !== '') {
          formData.append(key, resourceForm[key]);
        }
      });

      await apiCall('/admin/resources', {
        method: 'POST',
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: formData
      });
      
      setSuccess('Resource uploaded successfully');
      setShowResourceModal(false);
      setResourceForm({
        title: '',
        description: '',
        type: 'pdf',
        batch: 'All Batches',
        external_url: '',
        file: null
      });
      loadResources();
    } catch (err) {
      setError('Failed to upload resource: ' + err.message);
    }
  };

  // Mark attendance
  const markAttendance = async () => {
    try {
      await apiCall('/admin/attendance', {
        method: 'POST',
        body: JSON.stringify(attendanceForm)
      });
      
      setSuccess('Attendance marked successfully');
      setShowAttendanceModal(false);
      setAttendanceForm({
        intern_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'present',
        check_in_time: '',
        check_out_time: '',
        notes: ''
      });
      loadAttendance();
    } catch (err) {
      setError('Failed to mark attendance: ' + err.message);
    }
  };

  // Approve certificate
  const approveCertificate = async (id) => {
    try {
      await apiCall(`/admin/certificates/${id}/approve`, {
        method: 'PUT'
      });
      
      setSuccess('Certificate approved successfully');
      loadCertificates();
    } catch (err) {
      setError('Failed to approve certificate: ' + err.message);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiCall(`/admin/tasks/${id}`, {
          method: 'DELETE'
        });
        
        setSuccess('Task deleted successfully');
        loadTasks();
      } catch (err) {
        setError('Failed to delete task: ' + err.message);
      }
    }
  };

  // Update task
  const updateTask = async () => {
    try {
      await apiCall(`/admin/tasks/${editingTask.id}`, {
        method: 'PUT',
        body: JSON.stringify(taskForm)
      });
      
      setSuccess('Task updated successfully');
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskForm({ title: '', description: '', assigned_to: '', due_date: '' });
      loadTasks();
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    switch (activeTab) {
      case 'dashboard':
        loadDashboardData();
        break;
      case 'interns':
        loadInterns();
        loadBatches();
        break;
      case 'tasks':
        loadTasks();
        loadInterns();
        break;
      case 'resources':
        loadResources();
        loadBatches();
        break;
      case 'attendance':
        loadAttendance();
        loadInterns();
        break;
      case 'certificates':
        loadCertificates();
        break;
    }
  }, [activeTab, currentPage, searchTerm, filterStatus]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ff9800';
      case 'active': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'rejected': return '#f44336';
      case 'inactive': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDashboard = () => (
    <div className="ai-dashboard">
      <div className="ai-stats-grid">
        <div className="ai-stat-card">
          <div className="ai-stat-content">
            <div className="ai-stat-icon ai-stat-icon--blue">
              <Users className="ai-icon" />
            </div>
            <div className="ai-stat-info">
              <h3 className="ai-stat-number">{stats.totalInterns}</h3>
              <p className="ai-stat-label">Total Interns</p>
            </div>
          </div>
        </div>
        
        <div className="ai-stat-card">
          <div className="ai-stat-content">
            <div className="ai-stat-icon ai-stat-icon--orange">
              <Clock className="ai-icon" />
            </div>
            <div className="ai-stat-info">
              <h3 className="ai-stat-number">{stats.pendingApprovals}</h3>
              <p className="ai-stat-label">Pending Approvals</p>
            </div>
          </div>
        </div>
        
        <div className="ai-stat-card">
          <div className="ai-stat-content">
            <div className="ai-stat-icon ai-stat-icon--green">
              <UserCheck className="ai-icon" />
            </div>
            <div className="ai-stat-info">
              <h3 className="ai-stat-number">{stats.activeInterns}</h3>
              <p className="ai-stat-label">Active Interns</p>
            </div>
          </div>
        </div>
        
        <div className="ai-stat-card">
          <div className="ai-stat-content">
            <div className="ai-stat-icon ai-stat-icon--purple">
              <Award className="ai-icon" />
            </div>
            <div className="ai-stat-info">
              <h3 className="ai-stat-number">{stats.completedInterns}</h3>
              <p className="ai-stat-label">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="ai-stat-card">
          <div className="ai-stat-content">
            <div className="ai-stat-icon ai-stat-icon--indigo">
              <TrendingUp className="ai-icon" />
            </div>
            <div className="ai-stat-info">
              <h3 className="ai-stat-number">{stats.avgProgress}%</h3>
              <p className="ai-stat-label">Avg Progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ai-card">
        <div className="ai-card-header">
          <h3 className="ai-card-title">Recent Activities</h3>
        </div>
        <div className="ai-card-body">
          <div className="ai-activities">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="ai-activity">
                <div className="ai-activity-icon">
                  <UserCheck className="ai-icon-sm" />
                </div>
                <div className="ai-activity-content">
                  <p className="ai-activity-text">
                    <span className="ai-activity-user">{activity.intern_name || 'System'}</span> {activity.description}
                  </p>
                  <p className="ai-activity-date">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="ai-empty-state">No recent activities</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternManagement = () => (
    <div className="ai-section">
      <div className="ai-section-header">
        <h2 className="ai-section-title">Intern Management</h2>
        <button onClick={() => window.location.reload()} className="ai-btn ai-btn--primary">
          <RefreshCw className="ai-icon-sm" />
          Refresh
        </button>
      </div>

      <div className="ai-card">
        <div className="ai-card-header">
          <div className="ai-filters">
            <div className="ai-search-box">
              <Search className="ai-search-icon" />
              <input
                type="text"
                placeholder="Search interns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ai-search-input"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="ai-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="ai-loading">
            <div className="ai-spinner"></div>
            <p className="ai-loading-text">Loading interns...</p>
          </div>
        ) : (
          <div className="ai-card-body">
            <div className="ai-interns-grid">
              {interns.map(intern => (
                <div key={intern.id} className="ai-intern-card">
                  <div className="ai-intern-header">
                    <div className="ai-intern-profile">
                      <div className="ai-avatar">
                        {intern.full_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ai-intern-info">
                        <h3 className="ai-intern-name">{intern.full_name}</h3>
                        <p className="ai-intern-email">{intern.email}</p>
                        <p className="ai-intern-id">{intern.employee_id}</p>
                      </div>
                    </div>
                    <span
                      className="ai-status-badge"
                      style={{ backgroundColor: getStatusColor(intern.status) }}
                    >
                      {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                    </span>
                  </div>

                  <div className="ai-progress-section">
                    <div className="ai-progress-label">
                      <span>Progress</span>
                      <span>{intern.progress}%</span>
                    </div>
                    <div className="ai-progress-bar">
                      <div
                        className="ai-progress-fill"
                        style={{ width: `${intern.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="ai-intern-details">
                    <p><span className="ai-detail-label">Batch:</span> {intern.batch}</p>
                    <p><span className="ai-detail-label">Phone:</span> {intern.phone || 'Not provided'}</p>
                    <p><span className="ai-detail-label">Start Date:</span> {intern.start_date ? formatDate(intern.start_date) : 'Not set'}</p>
                  </div>

                  <div className="ai-intern-actions">
                    {intern.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateInternStatus(intern.id, 'active')}
                          className="ai-btn ai-btn--success ai-btn--sm"
                        >
                          <CheckCircle className="ai-icon-xs" />
                          Approve
                        </button>
                        <button
                          onClick={() => updateInternStatus(intern.id, 'rejected')}
                          className="ai-btn ai-btn--danger ai-btn--sm"
                        >
                          <XCircle className="ai-icon-xs" />
                          Reject
                        </button>
                      </>
                    )}

                    {intern.status === 'active' && (
                      <>
                        <button
                          onClick={() => updateInternStatus(intern.id, 'completed')}
                          className="ai-btn ai-btn--info ai-btn--sm"
                        >
                          <Award className="ai-icon-xs" />
                          Complete
                        </button>
                        <button
                          onClick={() => updateInternStatus(intern.id, 'inactive')}
                          className="ai-btn ai-btn--secondary ai-btn--sm"
                        >
                          <UserX className="ai-icon-xs" />
                          Deactivate
                        </button>
                      </>
                    )}

                    {intern.status === 'completed' && (
                      <button className="ai-btn ai-btn--purple ai-btn--sm">
                        <Award className="ai-icon-xs" />
                        Certificate
                      </button>
                    )}

                    <button
                      onClick={() => setEditingIntern(intern)}
                      className="ai-btn ai-btn--light ai-btn--sm"
                    >
                      <Edit className="ai-icon-xs" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="ai-pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="ai-btn ai-btn--light"
                >
                  Previous
                </button>
                <span className="ai-page-info">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ai-btn ai-btn--light"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderTaskManagement = () => (
    <div className="ai-section">
      <div className="ai-section-header">
        <h2 className="ai-section-title">Task Management</h2>
        <button
          onClick={() => setShowTaskModal(true)}
          className="ai-btn ai-btn--primary"
        >
          <Plus className="ai-icon-sm" />
          Create Task
        </button>
      </div>

      <div className="ai-card">
        <div className="ai-card-body">
          {loading ? (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p className="ai-loading-text">Loading tasks...</p>
            </div>
          ) : (
            <div className="ai-tasks">
              {tasks.map(task => (
                <div key={task.id} className="ai-task-card">
                  <div className="ai-task-header">
                    <h3 className="ai-task-title">{task.title}</h3>
                    <span className={`ai-task-status ai-task-status--${task.status.replace('_', '-')}`}>
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  <p className="ai-task-description">{task.description}</p>
                  <div className="ai-task-info">
                    <p><span className="ai-detail-label">Assigned to:</span> {task.assigned_to_name}</p>
                    <p><span className="ai-detail-label">Due Date:</span> {formatDate(task.due_date)}</p>
                    <p><span className="ai-detail-label">Created:</span> {formatDate(task.created_at)}</p>
                  </div>
                  {task.submission_text && (
                    <div className="ai-task-submission">
                      <p className="ai-submission-label">Submission:</p>
                      <p className="ai-submission-text">{task.submission_text}</p>
                    </div>
                  )}
                  <div className="ai-task-actions">
                    <button 
                      onClick={() => {
                        setEditingTask(task);
                        setTaskForm({
                          id: task.id,
                          title: task.title,
                          description: task.description,
                          assigned_to: task.assigned_to,
                          due_date: task.due_date
                        });
                        setShowTaskModal(true);
                      }}
                      className="ai-btn ai-btn--info ai-btn--sm"
                    >
                      <Edit className="ai-icon-xs" />
                      Edit
                    </button>
                    <button className="ai-btn ai-btn--light ai-btn--sm">
                      <Eye className="ai-icon-xs" />
                      View Details
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="ai-btn ai-btn--danger ai-btn--sm"
                    >
                      <Trash2 className="ai-icon-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="ai-empty-state">No tasks found</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task Creation/Edit Modal */}
      {showTaskModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <div className="ai-modal-header">
              <h3 className="ai-modal-title">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                  setTaskForm({ title: '', description: '', assigned_to: '', due_date: '' });
                }}
                className="ai-modal-close"
              >
                <X className="ai-icon-sm" />
              </button>
            </div>
            <div className="ai-modal-body">
              <div className="ai-form-group">
                <label className="ai-label">Title</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="ai-input"
                />
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  rows={3}
                  className="ai-textarea"
                />
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Assign to</label>
                <select
                  value={taskForm.assigned_to}
                  onChange={(e) => setTaskForm({...taskForm, assigned_to: e.target.value})}
                  className="ai-select"
                >
                  <option value="">Select Intern</option>
                  {interns.filter(intern => intern.status === 'active').map(intern => (
                    <option key={intern.id} value={intern.id}>{intern.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Due Date</label>
                <input
                  type="date"
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({...taskForm, due_date: e.target.value})}
                  className="ai-input"
                />
              </div>
            </div>
            <div className="ai-modal-actions">
              <button
                onClick={editingTask ? updateTask : createTask}
                className="ai-btn ai-btn--primary"
              >
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
              <button
                onClick={() => {
                  setShowTaskModal(false);
                  setEditingTask(null);
                  setTaskForm({ title: '', description: '', assigned_to: '', due_date: '' });
                }}
                className="ai-btn ai-btn--secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderResourceManagement = () => (
    <div className="ai-section">
      <div className="ai-section-header">
        <h2 className="ai-section-title">Learning Resources</h2>
        <button
          onClick={() => setShowResourceModal(true)}
          className="ai-btn ai-btn--primary"
        >
          <Upload className="ai-icon-sm" />
          Upload Resource
        </button>
      </div>

      <div className="ai-card">
        <div className="ai-card-body">
          {loading ? (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p className="ai-loading-text">Loading resources...</p>
            </div>
          ) : (
            <div className="ai-resources-grid">
              {resources.map(resource => (
                <div key={resource.id} className="ai-resource-card">
                  <div className="ai-resource-header">
                    <div className="ai-resource-icon">
                      {resource.type === 'pdf' && <FileText className="ai-icon-sm ai-text-red" />}
                      {resource.type === 'video' && <Video className="ai-icon-sm ai-text-blue" />}
                      {resource.type === 'link' && <Link className="ai-icon-sm ai-text-green" />}
                      {resource.type === 'document' && <FileText className="ai-icon-sm ai-text-gray" />}
                    </div>
                    <div className="ai-resource-info">
                      <h3 className="ai-resource-title">{resource.title}</h3>
                      <p className="ai-resource-type">{resource.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <p className="ai-resource-description">{resource.description}</p>
                  <div className="ai-resource-meta">
                    <p>Batch: {resource.batch}</p>
                    <p>Uploaded: {formatDate(resource.created_at)}</p>
                  </div>
                  <div className="ai-resource-actions">
                    <button className="ai-btn ai-btn--info ai-btn--sm">
                      <Eye className="ai-icon-xs" />
                      View
                    </button>
                    <button className="ai-btn ai-btn--light ai-btn--sm">
                      <Edit className="ai-icon-xs" />
                      Edit
                    </button>
                    <button className="ai-btn ai-btn--danger ai-btn--sm">
                      <Trash2 className="ai-icon-xs" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {resources.length === 0 && (
                <div className="ai-empty-state-full">
                  <p className="ai-empty-state">No resources found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Resource Upload Modal */}
      {showResourceModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <div className="ai-modal-header">
              <h3 className="ai-modal-title">Upload Resource</h3>
              <button
                onClick={() => setShowResourceModal(false)}
                className="ai-modal-close"
              >
                <X className="ai-icon-sm" />
              </button>
            </div>
            <div className="ai-modal-body">
              <div className="ai-form-group">
                <label className="ai-label">Title</label>
                <input
                  type="text"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({...resourceForm, title: e.target.value})}
                  className="ai-input"
                />
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Description</label>
                <textarea
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({...resourceForm, description: e.target.value})}
                  rows={3}
                  className="ai-textarea"
                />
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Type</label>
                <select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm({...resourceForm, type: e.target.value})}
                  className="ai-select"
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Batch</label>
                <select
                  value={resourceForm.batch}
                  onChange={(e) => setResourceForm({...resourceForm, batch: e.target.value})}
                  className="ai-select"
                >
                  <option value="All Batches">All Batches</option>
                  {batches.map(batch => (
                    <option key={batch.id} value={batch.batch_name}>{batch.batch_name}</option>
                  ))}
                </select>
              </div>
              {resourceForm.type === 'link' ? (
                <div className="ai-form-group">
                  <label className="ai-label">URL</label>
                  <input
                    type="url"
                    value={resourceForm.external_url}
                    onChange={(e) => setResourceForm({...resourceForm, external_url: e.target.value})}
                    className="ai-input"
                  />
                </div>
              ) : (
                <div className="ai-form-group">
                  <label className="ai-label">File</label>
                  <input
                    type="file"
                    onChange={(e) => setResourceForm({...resourceForm, file: e.target.files[0]})}
                    className="ai-input"
                  />
                </div>
              )}
            </div>
            <div className="ai-modal-actions">
              <button
                onClick={uploadResource}
                className="ai-btn ai-btn--primary"
              >
                Upload
              </button>
              <button
                onClick={() => setShowResourceModal(false)}
                className="ai-btn ai-btn--secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAttendanceManagement = () => (
    <div className="ai-section">
      <div className="ai-section-header">
        <h2 className="ai-section-title">Attendance Management</h2>
        <div className="ai-header-actions">
          <button className="ai-btn ai-btn--success">
            <Download className="ai-icon-sm" />
            Export
          </button>
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="ai-btn ai-btn--primary"
          >
            <Calendar className="ai-icon-sm" />
            Mark Attendance
          </button>
        </div>
      </div>

      <div className="ai-card">
        {loading ? (
          <div className="ai-loading">
            <div className="ai-spinner"></div>
            <p className="ai-loading-text">Loading attendance...</p>
          </div>
        ) : (
          <div className="ai-table-container">
            <table className="ai-table">
              <thead className="ai-table-header">
                <tr>
                  <th className="ai-table-th">Intern Name</th>
                  <th className="ai-table-th">Date</th>
                  <th className="ai-table-th">Status</th>
                  <th className="ai-table-th">Check In</th>
                  <th className="ai-table-th">Check Out</th>
                  <th className="ai-table-th">Notes</th>
                  <th className="ai-table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="ai-table-body">
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td className="ai-table-td ai-table-td--name">{record.intern_name}</td>
                    <td className="ai-table-td">{formatDate(record.date)}</td>
                    <td className="ai-table-td">
                      <span className={`ai-attendance-status ai-attendance-status--${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                    <td className="ai-table-td">{record.check_in_time ? formatTime(record.check_in_time) : '-'}</td>
                    <td className="ai-table-td">{record.check_out_time ? formatTime(record.check_out_time) : '-'}</td>
                    <td className="ai-table-td ai-table-td--notes">{record.notes || '-'}</td>
                    <td className="ai-table-td">
                      <div className="ai-table-actions">
                        <button className="ai-btn-icon ai-btn-icon--primary">
                          <Edit className="ai-icon-xs" />
                        </button>
                        <button className="ai-btn-icon ai-btn-icon--danger">
                          <Trash2 className="ai-icon-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendance.length === 0 && (
              <div className="ai-empty-state-table">
                <p className="ai-empty-state">No attendance records found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal">
            <div className="ai-modal-header">
              <h3 className="ai-modal-title">Mark Attendance</h3>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="ai-modal-close"
              >
                <X className="ai-icon-sm" />
              </button>
            </div>
            <div className="ai-modal-body">
              <div className="ai-form-group">
                <label className="ai-label">Select Intern</label>
                <select
                  value={attendanceForm.intern_id}
                  onChange={(e) => setAttendanceForm({...attendanceForm, intern_id: e.target.value})}
                  className="ai-select"
                >
                  <option value="">Select Intern</option>
                  {interns.filter(intern => intern.status === 'active').map(intern => (
                    <option key={intern.id} value={intern.id}>{intern.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Date</label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                  className="ai-input"
                />
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Status</label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                  className="ai-select"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="excused">Excused</option>
                </select>
              </div>
              <div className="ai-form-row">
                <div className="ai-form-group">
                  <label className="ai-label">Check In Time</label>
                  <input
                    type="time"
                    value={attendanceForm.check_in_time}
                    onChange={(e) => setAttendanceForm({...attendanceForm, check_in_time: e.target.value})}
                    className="ai-input"
                  />
                </div>
                <div className="ai-form-group">
                  <label className="ai-label">Check Out Time</label>
                  <input
                    type="time"
                    value={attendanceForm.check_out_time}
                    onChange={(e) => setAttendanceForm({...attendanceForm, check_out_time: e.target.value})}
                    className="ai-input"
                  />
                </div>
              </div>
              <div className="ai-form-group">
                <label className="ai-label">Notes</label>
                <textarea
                  value={attendanceForm.notes}
                  onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                  rows={2}
                  className="ai-textarea"
                />
              </div>
            </div>
            <div className="ai-modal-actions">
              <button
                onClick={markAttendance}
                className="ai-btn ai-btn--primary"
              >
                Mark Attendance
              </button>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="ai-btn ai-btn--secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCertificateApproval = () => (
    <div className="ai-section">
      <div className="ai-section-header">
        <h2 className="ai-section-title">Certificate Management</h2>
        <button className="ai-btn ai-btn--success">
          <Download className="ai-icon-sm" />
          Export Certificates
        </button>
      </div>

      <div className="ai-card">
        <div className="ai-card-body">
          {loading ? (
            <div className="ai-loading">
              <div className="ai-spinner"></div>
              <p className="ai-loading-text">Loading certificates...</p>
            </div>
          ) : (
            <div className="ai-certificates-grid">
              {certificates.map(cert => (
                <div key={cert.id} className="ai-certificate-card">
                  <div className="ai-certificate-header">
                    <div className="ai-avatar ai-avatar--purple">
                      {cert.intern_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ai-certificate-info">
                      <h3 className="ai-certificate-name">{cert.intern_name}</h3>
                      <p className="ai-certificate-email">{cert.email}</p>
                      <p className="ai-certificate-batch">{cert.batch}</p>
                    </div>
                  </div>

                  <div className="ai-certificate-details">
                    <p><span className="ai-detail-label">Type:</span> {cert.certificate_type}</p>
                    <p>
                      <span className="ai-detail-label">Status:</span>
                      <span className={`ai-certificate-status ai-certificate-status--${cert.status}`}>
                        {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                      </span>
                    </p>
                    <p><span className="ai-detail-label">Requested:</span> {formatDate(cert.created_at)}</p>
                    {cert.approved_at && (
                      <p><span className="ai-detail-label">Approved:</span> {formatDate(cert.approved_at)}</p>
                    )}
                  </div>

                  <div className="ai-certificate-actions">
                    {cert.status === 'pending' && (
                      <button
                        onClick={() => approveCertificate(cert.id)}
                        className="ai-btn ai-btn--success ai-btn--sm"
                      >
                        <CheckCircle className="ai-icon-xs" />
                        Approve
                      </button>
                    )}
                    <button className="ai-btn ai-btn--info ai-btn--sm">
                      <Eye className="ai-icon-xs" />
                      View
                    </button>
                    {cert.status === 'approved' && (
                      <button className="ai-btn ai-btn--purple ai-btn--sm">
                        <Download className="ai-icon-xs" />
                        Generate
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <div className="ai-empty-state-full">
                  <p className="ai-empty-state">No certificate requests found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'interns': return renderInternManagement();
      case 'tasks': return renderTaskManagement();
      case 'resources': return renderResourceManagement();
      case 'attendance': return renderAttendanceManagement();
      case 'certificates': return renderCertificateApproval();
      default: return renderDashboard();
    }
  };

  return (
    <div className="ai-app">
      {/* Error/Success Messages */}
      {error && (
        <div className="ai-alert ai-alert--error">
          <div className="ai-alert-content">
            <AlertCircle className="ai-alert-icon" />
            <span className="ai-alert-text">{error}</span>
            <button onClick={() => setError('')} className="ai-alert-close">
              <X className="ai-icon-xs" />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="ai-alert ai-alert--success">
          <div className="ai-alert-content">
            <CheckCircle className="ai-alert-icon" />
            <span className="ai-alert-text">{success}</span>
            <button onClick={() => setSuccess('')} className="ai-alert-close">
              <X className="ai-icon-xs" />
            </button>
          </div>
        </div>
      )}

      <div className="ai-layout">
        {/* Sidebar */}
        <div className="ai-sidebar">
          <div className="ai-sidebar-header">
            <h2 className="ai-sidebar-title">Admin Panel</h2>
            <div className="ai-user-info">
              <div className="ai-user-avatar">A</div>
              <span className="ai-user-name">Administrator</span>
            </div>
          </div>
          
          <nav className="ai-sidebar-nav">
            <button 
              className={`ai-nav-item ${activeTab === 'dashboard' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="ai-nav-icon" />
              Dashboard
            </button>
            <button 
              className={`ai-nav-item ${activeTab === 'interns' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('interns')}
            >
              <Users className="ai-nav-icon" />
              Manage Interns
            </button>
            <button 
              className={`ai-nav-item ${activeTab === 'tasks' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              <ClipboardList className="ai-nav-icon" />
              Tasks & Updates
            </button>
            <button 
              className={`ai-nav-item ${activeTab === 'resources' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <Upload className="ai-nav-icon" />
              Learning Resources
            </button>
            <button 
              className={`ai-nav-item ${activeTab === 'attendance' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              <Calendar className="ai-nav-icon" />
              Attendance
            </button>
            <button 
              className={`ai-nav-item ${activeTab === 'certificates' ? 'ai-nav-item--active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award className="ai-nav-icon" />
              Certificates
            </button>
            
            <div className="ai-sidebar-footer">
              <button className="ai-sidebar-action">
                <Settings className="ai-sidebar-action-icon" />
                Settings
              </button>
              <button className="ai-sidebar-action">
                <LogOut className="ai-sidebar-action-icon" />
                Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="ai-main">
          <div className="ai-header">
            <div className="ai-header-content">
              <h1 className="ai-header-title">Internship Management System</h1>
              <div className="ai-header-actions">
                <button className="ai-notification-btn">
                  <span className="ai-notification-badge">{stats.pendingApprovals}</span>
                  <Bell className="ai-icon" />
                </button>
                <div className="ai-user-profile">
                  <div className="ai-user-avatar">A</div>
                  <span className="ai-user-name">Administrator</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="ai-content">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="ai-loading-overlay">
          <div className="ai-loading-modal">
            <div className="ai-spinner"></div>
            <span className="ai-loading-text">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIntern;