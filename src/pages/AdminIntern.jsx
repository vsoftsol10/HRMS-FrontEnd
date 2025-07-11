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
  Filter,
  BarChart3,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

import "./AdminIntern.css"

const AdminIntern = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [interns, setInterns] = useState([
    { id: 1, name: 'John Doe', email: 'john@email.com', status: 'pending', progress: 45, batch: 'Batch A' },
    { id: 2, name: 'Jane Smith', email: 'jane@email.com', status: 'active', progress: 78, batch: 'Batch B' },
    { id: 3, name: 'Mike Johnson', email: 'mike@email.com', status: 'completed', progress: 100, batch: 'Batch A' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@email.com', status: 'active', progress: 92, batch: 'Batch C' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'React Basics', assignedTo: 'John Doe', status: 'pending', dueDate: '2025-07-15' },
    { id: 2, title: 'Database Design', assignedTo: 'Jane Smith', status: 'submitted', dueDate: '2025-07-12' },
    { id: 3, title: 'API Integration', assignedTo: 'Mike Johnson', status: 'completed', dueDate: '2025-07-10' },
  ]);

  const [resources, setResources] = useState([
    { id: 1, title: 'React Documentation', type: 'pdf', batch: 'All Batches', uploadDate: '2025-07-01' },
    { id: 2, title: 'Database Tutorial', type: 'video', batch: 'Batch A', uploadDate: '2025-07-02' },
    { id: 3, title: 'API Best Practices', type: 'link', batch: 'Batch B', uploadDate: '2025-07-03' },
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, internName: 'John Doe', date: '2025-07-10', status: 'present' },
    { id: 2, internName: 'Jane Smith', date: '2025-07-10', status: 'present' },
    { id: 3, internName: 'Mike Johnson', date: '2025-07-10', status: 'absent' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const stats = {
    totalInterns: interns.length,
    pendingApprovals: interns.filter(i => i.status === 'pending').length,
    activeInterns: interns.filter(i => i.status === 'active').length,
    completedInterns: interns.filter(i => i.status === 'completed').length,
    avgProgress: Math.round(interns.reduce((sum, intern) => sum + intern.progress, 0) / interns.length)
  };

  const approveIntern = (id) => {
    setInterns(interns.map(intern => 
      intern.id === id ? { ...intern, status: 'active' } : intern
    ));
  };

  const rejectIntern = (id) => {
    setInterns(interns.map(intern => 
      intern.id === id ? { ...intern, status: 'rejected' } : intern
    ));
  };

  const toggleInternStatus = (id) => {
    setInterns(interns.map(intern => 
      intern.id === id ? { 
        ...intern, 
        status: intern.status === 'active' ? 'inactive' : 'active' 
      } : intern
    ));
  };

  const markCompleted = (id) => {
    setInterns(interns.map(intern => 
      intern.id === id ? { ...intern, status: 'completed', progress: 100 } : intern
    ));
  };

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || intern.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const renderDashboard = () => (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users />
          </div>
          <div className="stat-info">
            <h3>{stats.totalInterns}</h3>
            <p>Total Interns</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <UserCheck />
          </div>
          <div className="stat-info">
            <h3>{stats.activeInterns}</h3>
            <p>Active Interns</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Award />
          </div>
          <div className="stat-info">
            <h3>{stats.completedInterns}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp />
          </div>
          <div className="stat-info">
            <h3>{stats.avgProgress}%</h3>
            <p>Avg Progress</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon"><UserCheck /></div>
              <div className="activity-content">
                <p><strong>John Doe</strong> submitted React Basics assignment</p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><Award /></div>
              <div className="activity-content">
                <p><strong>Sarah Wilson</strong> completed internship</p>
                <span>1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon"><Upload /></div>
              <div className="activity-content">
                <p>New resource uploaded: API Documentation</p>
                <span>2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInternManagement = () => (
    <div className="intern-management">
      <div className="management-header">
        <div className="search-filter-bar">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search interns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="intern-grid">
        {filteredInterns.map(intern => (
          <div key={intern.id} className="intern-card">
            <div className="intern-header">
              <div className="intern-avatar">
                {intern.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="intern-info">
                <h3>{intern.name}</h3>
                <p>{intern.email}</p>
                <span className="batch-tag">{intern.batch}</span>
              </div>
              <div className="intern-status">
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(intern.status) }}
                >
                  {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-header">
                <span>Progress</span>
                <span>{intern.progress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${intern.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="intern-actions">
              {intern.status === 'pending' && (
                <>
                  <button 
                    className="action-btn approve-btn"
                    onClick={() => approveIntern(intern.id)}
                  >
                    <CheckCircle /> Approve
                  </button>
                  <button 
                    className="action-btn reject-btn"
                    onClick={() => rejectIntern(intern.id)}
                  >
                    <XCircle /> Reject
                  </button>
                </>
              )}
              
              {intern.status === 'active' && (
                <>
                  <button 
                    className="action-btn complete-btn"
                    onClick={() => markCompleted(intern.id)}
                  >
                    <Award /> Mark Complete
                  </button>
                  <button 
                    className="action-btn deactivate-btn"
                    onClick={() => toggleInternStatus(intern.id)}
                  >
                    <UserX /> Deactivate
                  </button>
                </>
              )}
              
              {intern.status === 'completed' && (
                <button className="action-btn certificate-btn">
                  <Award /> Approve Certificate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTaskManagement = () => (
    <div className="task-management">
      <div className="section-header">
        <h2>Task Management</h2>
        <button className="primary-btn">
          <ClipboardList /> Create New Task
        </button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`task-status ${task.status}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            </div>
            <div className="task-details">
              <p><strong>Assigned to:</strong> {task.assignedTo}</p>
              <p><strong>Due Date:</strong> {task.dueDate}</p>
            </div>
            <div className="task-actions">
              <button className="action-btn edit-btn">
                <Edit /> Edit
              </button>
              <button className="action-btn view-btn">
                <Eye /> View Submission
              </button>
              <button className="action-btn delete-btn">
                <Trash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResourceManagement = () => (
    <div className="resource-management">
      <div className="section-header">
        <h2>Learning Resources</h2>
        <button className="primary-btn">
          <Upload /> Upload Resource
        </button>
      </div>

      <div className="resource-grid">
        {resources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-icon">
              {resource.type === 'pdf' && <FileText />}
              {resource.type === 'video' && <Video />}
              {resource.type === 'link' && <Link />}
            </div>
            <div className="resource-info">
              <h3>{resource.title}</h3>
              <p>Type: {resource.type.toUpperCase()}</p>
              <p>Batch: {resource.batch}</p>
              <p>Uploaded: {resource.uploadDate}</p>
            </div>
            <div className="resource-actions">
              <button className="action-btn view-btn">
                <Eye /> View
              </button>
              <button className="action-btn edit-btn">
                <Edit /> Edit
              </button>
              <button className="action-btn delete-btn">
                <Trash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAttendanceManagement = () => (
    <div className="attendance-management">
      <div className="section-header">
        <h2>Attendance Management</h2>
        <div className="attendance-controls">
          <button className="primary-btn">
            <Download /> Export Report
          </button>
          <button className="primary-btn">
            <Calendar /> Mark Attendance
          </button>
        </div>
      </div>

      <div className="attendance-table">
        <div className="table-header">
          <div>Intern Name</div>
          <div>Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {attendance.map(record => (
          <div key={record.id} className="table-row">
            <div>{record.internName}</div>
            <div>{record.date}</div>
            <div>
              <span className={`attendance-status ${record.status}`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </div>
            <div>
              <button className="action-btn edit-btn">
                <Edit /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCertificateApproval = () => (
    <div className="certificate-approval">
      <div className="section-header">
        <h2>Certificate Approval</h2>
      </div>

      <div className="certificate-grid">
        {interns.filter(intern => intern.progress >= 80).map(intern => (
          <div key={intern.id} className="certificate-card">
            <div className="certificate-header">
              <div className="intern-avatar">
                {intern.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="intern-details">
                <h3>{intern.name}</h3>
                <p>{intern.email}</p>
                <p>{intern.batch}</p>
              </div>
            </div>
            
            <div className="certificate-progress">
              <div className="progress-circle">
                <span>{intern.progress}%</span>
              </div>
              <p>Completion Progress</p>
            </div>
            
            <div className="certificate-actions">
              {intern.status === 'completed' ? (
                <button className="action-btn approved-btn">
                  <Award /> Certificate Approved
                </button>
              ) : (
                <button className="action-btn approve-cert-btn">
                  <Award /> Approve Certificate
                </button>
              )}
            </div>
          </div>
        ))}
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
    <div className="admin-intern-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <div className="admin-info">
            <div className="admin-avatar">A</div>
            <span>Administrator</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 /> Dashboard
          </button>
          <button 
            className={`nav-item ${activeTab === 'interns' ? 'active' : ''}`}
            onClick={() => setActiveTab('interns')}
          >
            <Users /> Manage Interns
          </button>
          <button 
            className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            <ClipboardList /> Tasks & Updates
          </button>
          <button 
            className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <Upload /> Learning Resources
          </button>
          <button 
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Calendar /> Attendance
          </button>
          <button 
            className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award /> Certificates
          </button>
        </nav>
      </div>

      <div className="admin-main">
        <div className="main-header">
          <h1>Internship Management System</h1>
          <div className="header-actions">
            <button className="notification-btn">
              <span className="notification-badge">3</span>
              🔔
            </button>
          </div>
        </div>
        
        <div className="main-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminIntern;