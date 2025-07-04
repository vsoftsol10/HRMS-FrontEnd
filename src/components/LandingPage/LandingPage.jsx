import React, { useState } from 'react';
import './LandingPage.css';
import logo from "../../assets/logo1.png";
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigation = useNavigate();
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showLearningModal,setShowLearningModal] = useState(false);

  const handleNavigation = (portal) => {
    switch(portal) {
      case 'employee':
        setShowEmployeeModal(true);
        console.log('Opening Employee Portal Modal');
        break;
      case 'career':
        // Navigate to career portal
        console.log('Navigating to Non Employee Portal');
        break;
      case 'learning':
        setShowLearningModal(true);
        console.log('Navigating to Learning Portal');
        break;
      default:
        break;
    }
  };

  const handleEmployeeAccess = (accessType) => {
    switch(accessType) {
      case 'admin':
        navigation("/admin/login");
        console.log('Navigating to Admin Dashboard');
        break;
      case 'employee':
        navigation("/employee/login");
        console.log('Navigating to Employee Dashboard');
        break;
      default:
        break;
    }
    setShowEmployeeModal(false);
  };

  const handleLearning =(acesstype)=>{
    switch(acesstype) {
      case 'course':
        navigation("/learn/course");
        console.log('Navigating to Course Dashboard')
        break;
      case 'intern' :
        navigation ("/intern/login");
        console.log('Navigating to intern dashboard')
        break;
      default:
        break;
    }
    setShowLearningModal(false);
  }

  const closeModal = () => {
    setShowEmployeeModal(false);
    setShowLearningModal(false)
  };

  return (
    <div className="landing-container">
      <div className="left-section">
        <div className="logo-section">
          <div className="logo-container">
            <img src={logo} alt="VSoft Solutions Logo" className="logo-image" />
          </div>
        </div>
        
        <div className="welcome-content">
          <h1>Welcome to VSoft Solutions</h1>
          <p>Empowering growth through innovation and dedication</p>
        </div>
      </div>

      <div className="right-section">
        <div className="portal-section">
          <h2>Choose Your Portal</h2>
          
          <div className="portal-buttons">
            <button 
              className="portal-btn employee-btn"
              onClick={() => handleNavigation('employee')}
            >
              Employee Portal
            </button>
            
            <button 
              className="portal-btn career-btn"
              onClick={() => handleNavigation('career')}
            >
              Non Employee Portal
            </button>
            
            <button 
              className="portal-btn learning-btn"
              onClick={() => handleNavigation('learning')}
            >
              Learning Portal
            </button>
          </div>
          
          <p className="helper-text">Choose your path to get started</p>
        </div>
      </div>

      {/* Employee Access Modal */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header" >
              <h3>Employee Portal Access</h3>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <p>Please select your access level:</p>
              
              <div className="access-buttons">
                <button 
                  className="access-btn admin-access-btn"
                  onClick={() => handleEmployeeAccess('admin')}
                >
                  <div className="access-icon">🔐</div>
                  <div className="access-info">
                    <h4>Admin Access</h4>
                    <p>Full system administration</p>
                  </div>
                </button>
                
                <button 
                  className="access-btn employee-access-btn"
                  onClick={() => handleEmployeeAccess('employee')}
                >
                  <div className="access-icon">👤</div>
                  <div className="access-info">
                    <h4>Employee Access</h4>
                    <p>Standard employee dashboard</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Learning Portal Modal */}
      {showLearningModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header" >
              <h3>Learning Portal</h3>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <p>Please choose yours to get trained:</p>
              
              <div className="access-buttons">
                <button 
                  className="access-btn admin-access-btn"
                  onClick={() => handleLearning('course')}
                >
                  <div className="access-icon">🎓</div>
                  <div className="access-info">
                    <h4>Course</h4>
                    <p>Course Platform</p>
                  </div>
                </button>
                
                <button 
                  className="access-btn employee-access-btn"
                  onClick={() => handleLearning('intern')}
                >
                  <div className="access-icon">👥</div>
                  <div className="access-info">
                    <h4>Internship</h4>
                    <p>Internship Training</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;