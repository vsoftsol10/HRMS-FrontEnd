import React, { useState } from 'react';
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
  MessageCircle
} from 'lucide-react';
import './InternDashboard.css';

const InternDashboard = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  
  // Sample data
  const internData = {
    name: "Alex Johnson",
    profilePhoto: null,
    trainingEndDate: "August 15, 2025",
    tasksCompleted: 6,
    totalTasks: 10,
    daysRemaining: 14,
    upcomingDeadline: "July 2 – Task 3",
    certificateProgress: 80
  };

  const tasks = [
    { id: 1, title: "Complete Orientation Module", assignedDate: "2025-06-01", dueDate: "2025-06-05", status: "Approved" },
    { id: 2, title: "Project Planning Document", assignedDate: "2025-06-06", dueDate: "2025-06-15", status: "Completed" },
    { id: 3, title: "Mid-term Presentation", assignedDate: "2025-06-16", dueDate: "2025-07-02", status: "In Progress" },
    { id: 4, title: "Code Review Session", assignedDate: "2025-06-20", dueDate: "2025-07-10", status: "Pending" },
    { id: 5, title: "Final Project Submission", assignedDate: "2025-07-01", dueDate: "2025-08-01", status: "Pending" },
  ];

  const timelineSteps = [
    { title: "Training Start", date: "June 1, 2025", status: "completed" },
    { title: "Basic Tasks", date: "June 15, 2025", status: "completed" },
    { title: "Mid-review", date: "July 15, 2025", status: "current" },
    { title: "Final Project", date: "August 1, 2025", status: "upcoming" },
    { title: "Certificate Issued", date: "August 15, 2025", status: "upcoming" }
  ];

  const announcements = [
    "Project submission deadline extended to July 5.",
    "New training materials available in the resources section.",
    "Monthly intern meet-up scheduled for July 20th."
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'intern-dash-status-pending';
      case 'In Progress': return 'intern-dash-status-in-progress';
      case 'Completed': return 'intern-dash-status-completed';
      case 'Approved': return 'intern-dash-status-approved';
      default: return 'intern-dash-status-pending';
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

  return (
    <div className="intern-dash-container">
      {/* Sidebar */}
      <div className="intern-dash-sidebar">
        <div className="intern-dash-sidebar-header">
          <h2 className="intern-dash-sidebar-title">Intern Portal</h2>
        </div>
        <nav className="intern-dash-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`intern-dash-nav-item ${activeNav === item.id ? 'intern-dash-nav-item-active' : ''}`}
            >
              <item.icon className="intern-dash-nav-icon" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="intern-dash-main-content">
        {/* Welcome Banner */}
        <div className="intern-dash-welcome-banner">
          <div className="intern-dash-welcome-content">
            <div className="intern-dash-profile-avatar">
              {internData.profilePhoto ? (
                <img src={internData.profilePhoto} alt="Profile" className="intern-dash-profile-image" />
              ) : (
                internData.name.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div className="intern-dash-welcome-text">
              <h1 className="intern-dash-welcome-title">Welcome, {internData.name}!</h1>
              <p className="intern-dash-welcome-subtitle">Your training ends on: {internData.trainingEndDate}</p>
            </div>
          </div>
        </div>

        <div className="intern-dash-content-wrapper">
          {/* Quick Stats Cards */}
          <div className="intern-dash-stats-grid">
            <div className="intern-dash-stat-card intern-dash-stat-card-primary">
              <div className="intern-dash-stat-content">
                <div className="intern-dash-stat-info">
                  <h3 className="intern-dash-stat-title">Tasks Completed</h3>
                  <p className="intern-dash-stat-value">{internData.tasksCompleted} of {internData.totalTasks}</p>
                </div>
                <CheckCircle className="intern-dash-stat-icon" />
              </div>
            </div>

            <div className="intern-dash-stat-card intern-dash-stat-card-secondary">
              <div className="intern-dash-stat-content">
                <div className="intern-dash-stat-info">
                  <h3 className="intern-dash-stat-title">Days Remaining</h3>
                  <p className="intern-dash-stat-value">{internData.daysRemaining} Days Left</p>
                </div>
                <Calendar className="intern-dash-stat-icon" />
              </div>
            </div>

            <div className="intern-dash-stat-card intern-dash-stat-card-tertiary">
              <div className="intern-dash-stat-content">
                <div className="intern-dash-stat-info">
                  <h3 className="intern-dash-stat-title">Upcoming Deadline</h3>
                  <p className="intern-dash-stat-value-small">{internData.upcomingDeadline}</p>
                </div>
                <Clock className="intern-dash-stat-icon" />
              </div>
            </div>

            <div className="intern-dash-stat-card intern-dash-stat-card-neutral">
              <div className="intern-dash-stat-content">
                <div className="intern-dash-stat-info">
                  <h3 className="intern-dash-stat-title">Certificate Progress</h3>
                  <p className="intern-dash-stat-value">{internData.certificateProgress}% Complete</p>
                </div>
                <Award className="intern-dash-stat-icon" />
              </div>
            </div>
          </div>

          <div className="intern-dash-main-grid">
            {/* Task Status Table */}
            <div className="intern-dash-task-section">
              <div className="intern-dash-card">
                <h2 className="intern-dash-section-title">Task Status</h2>
                <div className="intern-dash-table-wrapper">
                  <table className="intern-dash-task-table">
                    <thead>
                      <tr className="intern-dash-table-header">
                        <th className="intern-dash-table-cell">Task Title</th>
                        <th className="intern-dash-table-cell">Assigned Date</th>
                        <th className="intern-dash-table-cell">Due Date</th>
                        <th className="intern-dash-table-cell">Status</th>
                        <th className="intern-dash-table-cell">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="intern-dash-table-row">
                          <td className="intern-dash-table-cell">{task.title}</td>
                          <td className="intern-dash-table-cell">{task.assignedDate}</td>
                          <td className="intern-dash-table-cell">{task.dueDate}</td>
                          <td className="intern-dash-table-cell">
                            <span className={`intern-dash-status-badge ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="intern-dash-table-cell">
                            <div className="intern-dash-action-buttons">
                              <button className="intern-dash-action-btn intern-dash-action-btn-view">
                                <Eye className="intern-dash-action-icon" />
                              </button>
                              <button className="intern-dash-action-btn intern-dash-action-btn-upload">
                                <Upload className="intern-dash-action-icon" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="intern-dash-sidebar-content">
              {/* Announcements */}
              <div className="intern-dash-announcements-card">
                <h2 className="intern-dash-card-title">📢 Announcements</h2>
                <div className="intern-dash-announcements-list">
                  {announcements.map((announcement, index) => (
                    <div key={index} className="intern-dash-announcement-item">
                      <p className="intern-dash-announcement-text">{announcement}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificate Section */}
              <div className="intern-dash-card">
                <h2 className="intern-dash-card-title">🎓 Certificate</h2>
                <div className="intern-dash-certificate-content">
                  <div className="intern-dash-progress-info">
                    <span className="intern-dash-progress-label">Progress</span>
                    <span className="intern-dash-progress-percentage">{internData.certificateProgress}%</span>
                  </div>
                  <div className="intern-dash-progress-bar">
                    <div 
                      className="intern-dash-progress-fill"
                      style={{ width: `${internData.certificateProgress}%` }}
                    ></div>
                  </div>
                </div>
                <button 
                  className={`intern-dash-certificate-btn ${internData.certificateProgress === 100 ? 'intern-dash-certificate-btn-active' : 'intern-dash-certificate-btn-disabled'}`}
                  disabled={internData.certificateProgress !== 100}
                >
                  <Download className="intern-dash-btn-icon" />
                  <span>Download Certificate</span>
                </button>
                <p className="intern-dash-certificate-note">
                  Complete all tasks to unlock your certificate
                </p>
              </div>

              {/* Help & Support */}
              <div className="intern-dash-card">
                <h2 className="intern-dash-card-title">💬 Help & Support</h2>
                <div className="intern-dash-help-links">
                  <a href="mailto:info@thevsoft.com" className="intern-dash-help-link">
                    📧 info@thevsoft.com
                  </a>
                  {/* <button className="intern-dash-help-link intern-dash-help-button">
                    📚 FAQ / Help Docs
                  </button>
                  <button className="intern-dash-help-link intern-dash-help-button intern-dash-chat-button">
                    <MessageCircle className="intern-dash-help-icon" />
                    <span>Live Chat</span>
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* Training Progress Timeline */}
          <div className="intern-dash-timeline-section">
            <div className="intern-dash-card">
              <h2 className="intern-dash-section-title">🛣️ Training Progress Timeline</h2>
              <div className="intern-dash-timeline-container">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="intern-dash-timeline-step">
                    <div className={`intern-dash-timeline-circle ${
                      step.status === 'completed' ? 'intern-dash-timeline-completed' : 
                      step.status === 'current' ? 'intern-dash-timeline-current' : 'intern-dash-timeline-upcoming'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="intern-dash-timeline-title">{step.title}</h3>
                    <p className="intern-dash-timeline-date">{step.date}</p>
                    {index < timelineSteps.length - 1 && (
                      <div className="intern-dash-timeline-connector"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternDashboard;