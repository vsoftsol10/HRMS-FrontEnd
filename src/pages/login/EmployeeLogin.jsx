import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeLogin.css';

const EmployeeLogin = () => {
  const [loginData, setLoginData] = useState({
    employeeCode: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Hardcoded for immediate fix - replace with env var once working
  const API_BASE_URL = 'https://hrms-backend-production-abd6.up.railway.app';
  
  // Debug logs
//  console.log('Environment:', process.env.NODE_ENV);
// console.log('API_BASE_URL from env:', process.env.REACT_APP_API_BASE_URL);
console.log('Using API_BASE_URL:', API_BASE_URL);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.employeeCode || !loginData.password) {
      setLoginError('Please enter both employee code and password');
      return;
    }

    setIsLoading(true);
    setLoginError('');

    try {
      // Remove trailing slash and ensure proper URL formation
      const apiUrl = `${API_BASE_URL.replace(/\/$/, '')}/api/authenticate`;
      console.log('Making request to:', apiUrl); // Debug log
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeCode: loginData.employeeCode,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login successful - store employee data and redirect
        // Note: In production, consider using more secure storage methods
        localStorage.setItem('employeeInfo', JSON.stringify(data.employee));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to dashboard
        navigate('/employee/dashboard');
      } else {
        // Login failed
        setLoginError(data.message || 'Invalid employee code or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('API URL used:', `${API_BASE_URL.replace(/\/$/, '')}/api/authenticate`);
      setLoginError('Connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    alert('Forgot password functionality to be implemented');
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          Signing In...
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Employee Login</h2>
            <p>Welcome back! Please sign in with your employee credentials.</p>
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="employeeCode">Employee Code</label>
              <input
                type="text"
                id="employeeCode"
                name="employeeCode"
                value={loginData.employeeCode}
                onChange={handleInputChange}
                placeholder="Enter your employee code"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            
            {/* <div className="login-footer">
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;