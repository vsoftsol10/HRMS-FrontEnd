import React, { useState, useEffect } from 'react';
import "./EmployeeDashboardcss.css"
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard1 = () => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const storedEmployeeInfo = localStorage.getItem('employeeInfo');

    if (isLoggedIn === 'true' && storedEmployeeInfo) {
      setEmployeeInfo(JSON.parse(storedEmployeeInfo));
      setIsLoading(false);
    } else {
      // Redirect to login if not authenticated
      navigate('/employee/login');
    }
  }, [navigate]);

  // Handle navigation to My Profile
  const handleMyProfileClick = () => {
    if (employeeInfo && employeeInfo.employeeId) {
      navigate(`/profile/${employeeInfo.employeeId}`);
    }
  };

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('employeeInfo');
    
    // Redirect to login
    navigate('/employee/login');
  };

  if (isLoading) {
    return (
      <div className="emp-loading-container">
        <div className="emp-loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!employeeInfo) {
    return null; // Will redirect to login
  }

  return (
    <div className="emp-employee-dashboard">
      <aside className="emp-sidebar">
        <div className="emp-sidebar-header">
          <h2>HRMS Portal</h2>
          <span className="emp-employee-badge">Employee</span>
        </div>
        <nav className="emp-sidebar-nav">
          <ul>
            <li className="emp-nav-item emp-active">
              Dashboard
            </li>
            <li className="emp-nav-item" onClick={handleMyProfileClick}>
              My Profile
            </li>
            <li className="emp-nav-item">
              Attendance
            </li>
            <li className="emp-nav-item">
              Leave Requests
            </li>
            <li
              className="emp-nav-item"
              onClick={() => navigate(`/payslip/${employeeInfo.id}`)}
            >
              Payslips
            </li>
            <li className="emp-nav-item">
              Policies
            </li>
          </ul>
        </nav>
        <div className="emp-sidebar-footer">
          <div className="emp-employee-info">
            <div className="emp-employee-avatar">
              {employeeInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="emp-employee-details">
              <span className="emp-employee-name">{employeeInfo.name}</span>
              <span className="emp-employee-id">ID: {employeeInfo.employeeId}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="emp-logout-btn">
            <span className="emp-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="emp-dashboard-main">
        <header className="emp-dashboard-header">
          <div className="emp-header-content">
            <h1>Welcome back, {employeeInfo.name}! 👋</h1>
            <div className="emp-employee-meta">
              {/* <span className="emp-employee-position">{employeeInfo.position}</span> */}
              {/* <span className="emp-employee-department">{employeeInfo.department}</span> */}
            </div>
          </div>
          <div className="emp-header-actions">
            <div className="emp-current-time">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <button className="emp-clock-in-btn">Clock In</button>
          </div>
        </header>

        <section className="emp-dashboard-cards">
          <div className="emp-dashboard-card emp-present-days">
            <div className="emp-card-icon">📅</div>
            <div className="emp-card-content">
              <h3>Present Days</h3>
              <p>18</p>
              <span className="emp-card-subtitle">This month</span>
            </div>
          </div>
          <div className="emp-dashboard-card emp-leaves-taken">
            <div className="emp-card-icon">🏖️</div>
            <div className="emp-card-content">
              <h3>Leaves Taken</h3>
              <p>2</p>
              <span className="emp-card-subtitle">This month</span>
            </div>
          </div>
          <div className="emp-dashboard-card emp-upcoming-holidays">
            <div className="emp-card-icon">🎉</div>
            <div className="emp-card-content">
              <h3>Upcoming Holidays</h3>
              <p>3</p>
              <span className="emp-card-subtitle">Next 30 days</span>
            </div>
          </div>
          <div className="emp-dashboard-card emp-last-payslip">
            <div className="emp-card-icon">💸</div>
            <div className="emp-card-content">
              <h3>Last Payslip</h3>
              <p>
                ₹
                {employeeInfo.lastSalary
                  ? employeeInfo.lastSalary.toLocaleString()
                  : "45,000"}
              </p>
              <span className="emp-card-subtitle">Last month</span>
            </div>
          </div>
        </section>

        <div className="emp-dashboard-content">
          <section className="emp-recent-activity">
            <div className="emp-section-header">
              <h2>Recent Updates</h2>
              <button className="emp-view-all-btn">View All</button>
            </div>
            <div className="emp-activity-list">
              <div className="emp-activity-item">
                <div className="emp-activity-icon emp-success">✅</div>
                <div className="emp-activity-content">
                  <h4>Attendance Marked</h4>
                  <p>Successfully marked attendance for today</p>
                  <span className="emp-activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="emp-activity-item">
                <div className="emp-activity-icon emp-approved">✅</div>
                <div className="emp-activity-content">
                  <h4>Leave Request Approved</h4>
                  <p>Your leave request for June 20-22 has been approved</p>
                  <span className="emp-activity-time">1 day ago</span>
                </div>
              </div>
              <div className="emp-activity-item">
                <div className="emp-activity-icon emp-info">📄</div>
                <div className="emp-activity-content">
                  <h4>Payslip Available</h4>
                  <p>Latest payslip is ready for download</p>
                  <span className="emp-activity-time">3 days ago</span>
                </div>
              </div>
              <div className="emp-activity-item">
                <div className="emp-activity-icon emp-holiday">🎉</div>
                <div className="emp-activity-content">
                  <h4>Holiday Announcement</h4>
                  <p>Company holiday scheduled for June 15, 2024</p>
                  <span className="emp-activity-time">1 week ago</span>
                </div>
              </div>
            </div>
          </section>

          <section className="emp-quick-actions">
            <div className="emp-section-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="emp-actions-grid">
              <button className="emp-action-btn">
                <span className="emp-action-icon">📝</span>
                <span>Apply Leave</span>
              </button>
              <button className="emp-action-btn">
                <span className="emp-action-icon">📊</span>
                <span>View Reports</span>
              </button>
              <button className="emp-action-btn">
                <span className="emp-action-icon">💬</span>
                <span>Contact HR</span>
              </button>
              <button className="emp-action-btn">
                <span className="emp-action-icon">⚙️</span>
                <span>Settings</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard1;