import React, { useState, useEffect } from "react";
import {
  Users, CheckCircle, XCircle, UserCheck, UserX, ClipboardList,
  Upload, Calendar, Award, Edit, Trash2, Search, BarChart3,
  TrendingUp, Clock, Plus, RefreshCw, AlertCircle, X, Bell,
  Settings, LogOut,
} from "lucide-react";
import "./AdminIntern.css";
import { useNavigate } from "react-router-dom";

const AdminIntern = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [data, setData] = useState({
    stats: {
      totalInterns: 0, pendingApprovals: 0, activeInterns: 0,
      completedInterns: 0, avgProgress: 0
    },
    interns: [], tasks: [], resources: [], 
    attendance: [], certificates: [], batches: [], activities: []
  });

  const [filters, setFilters] = useState({
    searchTerm: "", filterStatus: "all", currentPage: 1, totalPages: 1
  });

  const [modals, setModals] = useState({
    showTaskModal: false, showResourceModal: false, showAttendanceModal: false,
    editingTask: null, editingIntern: null
  });

  const [forms, setForms] = useState({
    task: { title: "", description: "", assigned_to: "", due_date: "" },
    resource: {
      title: "", description: "", type: "pdf", batch: "All Batches",
      external_url: "", file: null
    },
    attendance: {
      intern_id: "", date: new Date().toISOString().split("T")[0],
      status: "present", check_in_time: "", check_out_time: "", notes: ""
    }
  });

  const API_BASE_URL = "https://hrms-backend-5wau.onrender.com";
  const getAuthToken = () => localStorage.getItem("adminToken");

  // API helper
  const apiCall = async (endpoint, options = {}) => {
    const token = getAuthToken();
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions, ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API call failed");
    }
    return response.json();
  };

  // Generic data loader
  const loadData = async (endpoints) => {
    try {
      setLoading(true);
      return await Promise.all(endpoints.map(endpoint => apiCall(endpoint)));
    } catch (err) {
      setError("Failed to load data: " + err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Data loading functions
  const loadDashboardData = async () => {
    const [statsData, activitiesData] = await loadData([
      "/api/admin/dashboard/stats",
      "/api/admin/dashboard/activities"
    ]);
    setData(prev => ({
      ...prev,
      stats: statsData || prev.stats,
      activities: activitiesData?.activities || []
    }));
  };

  const loadInterns = async () => {
    const params = new URLSearchParams({
      page: filters.currentPage,
      limit: 10,
      ...(filters.searchTerm && { search: filters.searchTerm }),
      ...(filters.filterStatus !== "all" && { status: filters.filterStatus })
    });
    
    const [result] = await loadData([`/api/admin/interns?${params}`]);
    setData(prev => ({ ...prev, interns: result?.interns || [] }));
    setFilters(prev => ({ ...prev, totalPages: result?.totalPages || 1 }));
  };

  const loadOtherData = async (type) => {
    const endpoints = {
      tasks: ["/api/admin/tasks"],
      resources: ["/api/admin/resources"],
      attendance: ["/api/admin/attendance"],
      certificates: ["/api/admin/certificates"],
      batches: ["/api/admin/batches"]
    };
    
    const [result] = await loadData(endpoints[type] || []);
    setData(prev => ({ ...prev, [type]: result || [] }));
  };

  // CRUD operations
  const updateInternStatus = async (id, status) => {
    try {
      await apiCall(`/api/admin/interns/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setSuccess(`Intern status updated to ${status}`);
      loadInterns();
      loadDashboardData();
    } catch (err) {
      setError("Failed to update intern status: " + err.message);
    }
  };

  const handleFormSubmit = async (type, isEdit = false) => {
    try {
      const endpoints = {
        task: isEdit ? `/api/admin/tasks/${modals.editingTask.id}` : "/api/admin/tasks",
        resource: "/api/admin/resources",
        attendance: "/api/admin/attendance"
      };

      let body = forms[type];
      let headers = {};

      if (type === "resource") {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
          if (body[key] !== null && body[key] !== "") 
            formData.append(key, body[key]);
        });
        body = formData;
        headers = {};
      } else {
        body = JSON.stringify(body);
      }

      await apiCall(endpoints[type], {
        method: isEdit ? "PUT" : "POST",
        headers,
        body
      });

      setSuccess(`${type} ${isEdit ? "updated" : "created"} successfully`);
      setModals(prev => ({
        ...prev,
        [`show${type.charAt(0).toUpperCase() + type.slice(1)}Modal`]: false,
        editingTask: null
      }));
      
      setForms(prev => ({
        ...prev,
        [type]: type === "task" 
          ? { title: "", description: "", assigned_to: "", due_date: "" }
          : prev[type]
      }));
      
      loadOtherData(type + "s");
    } catch (err) {
      setError(`Failed to ${isEdit ? "update" : "create"} ${type}: ${err.message}`);
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await apiCall(`/admin/tasks/${id}`, { method: "DELETE" });
        setSuccess("Task deleted successfully");
        loadOtherData("tasks");
      } catch (err) {
        setError("Failed to delete task: " + err.message);
      }
    }
  };

  const approveCertificate = async (id) => {
    try {
      await apiCall(`/admin/certificates/${id}/approve`, { method: "PUT" });
      setSuccess("Certificate approved successfully");
      loadOtherData("certificates");
    } catch (err) {
      setError("Failed to approve certificate: " + err.message);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    const loadActions = {
      dashboard: loadDashboardData,
      interns: () => { loadInterns(); loadOtherData("batches"); },
      tasks: () => { loadOtherData("tasks"); loadInterns(); },
      resources: () => { loadOtherData("resources"); loadOtherData("batches"); },
      attendance: () => { loadOtherData("attendance"); loadInterns(); },
      certificates: () => loadOtherData("certificates")
    };
    
    loadActions[activeTab]?.();
  }, [activeTab, filters.currentPage, filters.searchTerm, filters.filterStatus]);

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Utility functions
  const getStatusColor = status => ({
    pending: "#ac84a4", active: "#80407c", completed: "#ac84a4",
    rejected: "#8f8e8e", inactive: "#8f8e8e"
  }[status] || "#8f8e8e");
  
  const formatDate = dateString => new Date(dateString).toLocaleDateString();
  
  // Component builders
  const buildStatCard = (icon, count, label, colorClass) => (
    <div className="aim-stat-card">
      <div className="aim-stat-content">
        <div className={`aim-stat-icon ${colorClass}`}>{icon}</div>
        <div className="aim-stat-info">
          <h3 className="aim-stat-number">{count}</h3>
          <p className="aim-stat-label">{label}</p>
        </div>
      </div>
    </div>
  );

  const buildActionButton = (onClick, variant, size, icon, text) => (
    <button
      onClick={onClick}
      className={`aim-btn aim-btn--${variant} ${size ? `aim-btn--${size}` : ""}`}
    >
      {icon} {text}
    </button>
  );

  const buildModal = (title, isOpen, onClose, children, onSubmit, submitText) => isOpen && (
    <div className="aim-modal-overlay">
      <div className="aim-modal">
        <div className="aim-modal-header">
          <h3 className="aim-modal-title">{title}</h3>
          <button onClick={onClose} className="aim-modal-close">
            <X className="aim-icon-sm" />
          </button>
        </div>
        <div className="aim-modal-body">{children}</div>
        <div className="aim-modal-actions">
          <button onClick={onSubmit} className="aim-btn aim-btn--primary">
            {submitText}
          </button>
          <button onClick={onClose} className="aim-btn aim-btn--secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const buildFormGroup = (label, children) => (
    <div className="aim-form-group">
      <label className="aim-label">{label}</label>
      {children}
    </div>
  );

  // Render functions
  const renderDashboard = () => (
    <div className="aim-dashboard">
      <div className="aim-stats-grid">
        {buildStatCard(<Users className="aim-icon" />, data.stats.totalInterns, "Total Interns", "aim-stat-icon--purple")}
        {buildStatCard(<Clock className="aim-icon" />, data.stats.pendingApprovals, "Pending Approvals", "aim-stat-icon--lavender")}
        {buildStatCard(<UserCheck className="aim-icon" />, data.stats.activeInterns, "Active Interns", "aim-stat-icon--deep-purple")}
        {buildStatCard(<Award className="aim-icon" />, data.stats.completedInterns, "Completed", "aim-stat-icon--light-purple")}
        {buildStatCard(<TrendingUp className="aim-icon" />, `${data.stats.avgProgress}%`, "Avg Progress", "aim-stat-icon--gray")}
      </div>
      <div className="aim-card">
        <div className="aim-card-header">
          <h3 className="aim-card-title">Recent Activities</h3>
        </div>
        <div className="aim-card-body">
          <div className="aim-activities">
            {data.activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="aim-activity">
                <div className="aim-activity-icon">
                  <UserCheck className="aim-icon-sm" />
                </div>
                <div className="aim-activity-content">
                  <p className="aim-activity-text">
                    <span className="aim-activity-user">{activity.intern_name || "System"}</span>{" "}
                    {activity.description}
                  </p>
                  <p className="aim-activity-date">{formatDate(activity.created_at)}</p>
                </div>
              </div>
            ))}
            {data.activities.length === 0 && <p className="aim-empty-state">No recent activities</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternCard = intern => (
    <div key={intern.id} className="aim-intern-card">
      <div className="aim-intern-header">
        <div className="aim-intern-profile">
          <div className="aim-avatar">
            {intern.full_name.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="aim-intern-info">
            <h3 className="aim-intern-name">{intern.full_name}</h3>
            <p className="aim-intern-email">{intern.email}</p>
            <p className="aim-intern-id">{intern.employee_id}</p>
          </div>
        </div>
        <span className="aim-status-badge" style={{ backgroundColor: getStatusColor(intern.status) }}>
          {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
        </span>
      </div>
      <div className="aim-progress-section">
        <div className="aim-progress-label">
          <span>Progress</span>
          <span>{intern.progress}%</span>
        </div>
        <div className="aim-progress-bar">
          <div className="aim-progress-fill" style={{ width: `${intern.progress}%` }}></div>
        </div>
      </div>
      <div className="aim-intern-details">
        <p><span className="aim-detail-label">Batch:</span> {intern.batch}</p>
        <p><span className="aim-detail-label">Phone:</span> {intern.phone || "Not provided"}</p>
        <p><span className="aim-detail-label">Start Date:</span> {intern.start_date ? formatDate(intern.start_date) : "Not set"}</p>
      </div>
      <div className="aim-intern-actions">
        {intern.status === "pending" && (
          <>
            {buildActionButton(() => updateInternStatus(intern.id, "active"), "success", "sm", <CheckCircle className="aim-icon-xs" />, "Approve")}
            {buildActionButton(() => updateInternStatus(intern.id, "rejected"), "danger", "sm", <XCircle className="aim-icon-xs" />, "Reject")}
          </>
        )}
        {intern.status === "active" && (
          <>
            {buildActionButton(() => updateInternStatus(intern.id, "completed"), "info", "sm", <Award className="aim-icon-xs" />, "Complete")}
            {buildActionButton(() => updateInternStatus(intern.id, "inactive"), "secondary", "sm", <UserX className="aim-icon-xs" />, "Deactivate")}
          </>
        )}
      </div>
    </div>
  );

  const renderInternManagement = () => (
    <div className="aim-section">
      <div className="aim-section-header">
        <h2 className="aim-section-title">Intern Management</h2>
        {buildActionButton(() => window.location.reload(), "primary", "", <RefreshCw className="aim-icon-sm" />, "Refresh")}
      </div>
      <div className="aim-card">
        <div className="aim-card-header">
          <div className="aim-filters">
            <div className="aim-search-box">
              <Search className="aim-search-icon" />
              <input
                type="text"
                placeholder="Search interns..."
                value={filters.searchTerm}
                onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="aim-search-input"
              />
            </div>
            <select
              value={filters.filterStatus}
              onChange={e => setFilters(prev => ({ ...prev, filterStatus: e.target.value }))}
              className="aim-select"
            >
              {["all", "pending", "active", "completed", "rejected"].map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="aim-loading">
            <div className="aim-spinner"></div>
            <p className="aim-loading-text">Loading interns...</p>
          </div>
        ) : (
          <div className="aim-card-body">
            <div className="aim-interns-grid">
              {data.interns.map(renderInternCard)}
            </div>
            {filters.totalPages > 1 && (
              <div className="aim-pagination">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
                  disabled={filters.currentPage === 1}
                  className="aim-btn aim-btn--light"
                >
                  Previous
                </button>
                <span className="aim-page-info">{filters.currentPage} of {filters.totalPages}</span>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, currentPage: Math.min(filters.totalPages, prev.currentPage + 1) }))}
                  disabled={filters.currentPage === filters.totalPages}
                  className="aim-btn aim-btn--light"
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
    <div className="aim-section">
      <div className="aim-section-header">
        <h2 className="aim-section-title">Task Management</h2>
        {buildActionButton(() => setModals(prev => ({ ...prev, showTaskModal: true })), "primary", "", <Plus className="aim-icon-sm" />, "Create Task")}
      </div>
      <div className="aim-card">
        <div className="aim-card-body">
          {loading ? (
            <div className="aim-loading">
              <div className="aim-spinner"></div>
              <p className="aim-loading-text">Loading tasks...</p>
            </div>
          ) : (
            <div className="aim-tasks">
              {data.tasks.map(task => (
                <div key={task.id} className="aim-task-card">
                  <div className="aim-task-header">
                    <h3 className="aim-task-title">{task.title}</h3>
                    <span className={`aim-task-status aim-task-status--${task.status.replace("_", "-")}`}>
                      {task.status.replace("_", " ").charAt(0).toUpperCase() + task.status.replace("_", " ").slice(1)}
                    </span>
                  </div>
                  <p className="aim-task-description">{task.description}</p>
                  <div className="aim-task-info">
                    <p><span className="aim-detail-label">Assigned to:</span> {task.assigned_to_name}</p>
                    <p><span className="aim-detail-label">Due Date:</span> {formatDate(task.due_date)}</p>
                  </div>
                  <div className="aim-task-actions">
                    {buildActionButton(
                      () => {
                        setModals(prev => ({ ...prev, editingTask: task, showTaskModal: true }));
                        setForms(prev => ({
                          ...prev,
                          task: {
                            title: task.title,
                            description: task.description,
                            assigned_to: task.assigned_to,
                            due_date: task.due_date
                          }
                        }));
                      },
                      "info", "sm", <Edit className="aim-icon-xs" />, "Edit"
                    )}
                    {buildActionButton(() => deleteTask(task.id), "danger", "sm", <Trash2 className="aim-icon-xs" />, "Delete")}
                  </div>
                </div>
              ))}
              {data.tasks.length === 0 && <p className="aim-empty-state">No tasks found</p>}
            </div>
          )}
        </div>
      </div>
      {buildModal(
        modals.editingTask ? "Edit Task" : "Create New Task",
        modals.showTaskModal,
        () => {
          setModals(prev => ({ ...prev, showTaskModal: false, editingTask: null }));
          setForms(prev => ({ ...prev, task: { title: "", description: "", assigned_to: "", due_date: "" } }));
        },
        <>
          {buildFormGroup("Title", 
            <input
              type="text"
              value={forms.task.title}
              onChange={e => setForms(prev => ({ ...prev, task: { ...prev.task, title: e.target.value } }))}
              className="aim-input"
            />
          )}
          {buildFormGroup("Description",
            <textarea
              value={forms.task.description}
              onChange={e => setForms(prev => ({ ...prev, task: { ...prev.task, description: e.target.value } }))}
              rows={3}
              className="aim-textarea"
            />
          )}
          {buildFormGroup("Assign to",
            <select
              value={forms.task.assigned_to}
              onChange={e => setForms(prev => ({ ...prev, task: { ...prev.task, assigned_to: e.target.value } }))}
              className="aim-select"
            >
              <option value="">Select Intern</option>
              {data.interns
                .filter(intern => intern.status === "active")
                .map(intern => (
                  <option key={intern.id} value={intern.id}>{intern.full_name}</option>
                ))}
            </select>
          )}
          {buildFormGroup("Due Date",
            <input
              type="date"
              value={forms.task.due_date}
              onChange={e => setForms(prev => ({ ...prev, task: { ...prev.task, due_date: e.target.value } }))}
              className="aim-input"
            />
          )}
        </>,
        () => handleFormSubmit("task", !!modals.editingTask),
        modals.editingTask ? "Update Task" : "Create Task"
      )}
    </div>
  );

  // Main render
  const tabContent = {
    dashboard: renderDashboard,
    interns: renderInternManagement,
    tasks: renderTaskManagement
  };

  return (
    <div className="aim-app">
      {/* Alerts */}
      {error && (
        <div className="aim-alert aim-alert--error">
          <div className="aim-alert-content">
            <AlertCircle className="aim-alert-icon" />
            <span className="aim-alert-text">{error}</span>
            <button onClick={() => setError("")} className="aim-alert-close"><X className="aim-icon-xs" /></button>
          </div>
        </div>
      )}
      
      {success && (
        <div className="aim-alert aim-alert--success">
          <div className="aim-alert-content">
            <CheckCircle className="aim-alert-icon" />
            <span className="aim-alert-text">{success}</span>
            <button onClick={() => setSuccess("")} className="aim-alert-close"><X className="aim-icon-xs" /></button>
          </div>
        </div>
      )}

      <div className="aim-layout">
        {/* Sidebar */}
        <div className="aim-sidebar">
          <div className="aim-sidebar-header">
            <h2 className="aim-sidebar-title">Admin Panel</h2>
            <div className="aim-user-info">
              <div className="aim-user-avatar">A</div>
              <span className="aim-user-name">Administrator</span>
            </div>
          </div>
          
          <nav className="aim-sidebar-nav">
            {[
              { tab: "dashboard", icon: BarChart3, label: "Dashboard" },
              { tab: "interns", icon: Users, label: "Manage Interns" },
              { tab: "tasks", icon: ClipboardList, label: "Tasks & Updates" },
              { tab: "resources", icon: Upload, label: "Learning Resources" },
              { tab: "attendance", icon: Calendar, label: "Attendance" },
              { tab: "certificates", icon: Award, label: "Certificates" }
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                className={`aim-nav-item ${activeTab === tab ? "aim-nav-item--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                <Icon className="aim-nav-icon" /> {label}
              </button>
            ))}
            
            <div className="aim-sidebar-footer">
              <button className="aim-sidebar-action">
                <Settings className="aim-sidebar-action-icon" /> Settings
              </button>
              <button className="aim-sidebar-action" onClick={()=>{navigate("/admin/dashboard")}}>
                <LogOut className="aim-sidebar-action-icon" /> Logout
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="aim-main">
          <div className="aim-header">
            <div className="aim-header-content">
              <h1 className="aim-header-title">Internship Management System</h1>
              <div className="aim-header-actions">
                <button className="aim-notification-btn">
                  <span className="aim-notification-badge">{data.stats.pendingApprovals}</span>
                  <Bell className="aim-icon" />
                </button>
                <div className="aim-user-profile">
                  <div className="aim-user-avatar">A</div>
                  <span className="aim-user-name">Administrator</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="aim-content">
            {tabContent[activeTab] ? tabContent[activeTab]() : renderDashboard()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIntern;
