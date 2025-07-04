import React from 'react';
import './InternPortal.css';

const InternPortal = () => {
  return (
    <div className="intern-dashboard">
      <aside className="sidebar">
        <h2>HRMS Intern</h2>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>My Tasks</li>
            <li>Progress</li>
            <li>Attendance</li>
            <li>Certificate</li>
            <li>Support</li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, Intern 👋</h1>
          <p>Here's your daily summary and quick tools</p>
        </header>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Tasks Completed</h3>
            <p>15</p>
          </div>
          <div className="dashboard-card">
            <h3>Pending Tasks</h3>
            <p>3</p>
          </div>
          <div className="dashboard-card">
            <h3>Attendance %</h3>
            <p>92%</p>
          </div>
          <div className="dashboard-card">
            <h3>Certificate Status</h3>
            <p>Ready</p>
          </div>
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>✅ Completed task: "UI Fixes"</li>
            <li>📅 Attendance marked today</li>
            <li>🔔 Reminder: Final project due June 20</li>
            <li>📄 Certificate available for download</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default InternPortal;
