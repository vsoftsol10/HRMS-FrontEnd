import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🚀 Attempting login to:', 'https://hrms-backend-5wau.onrender.com/api/admin/login');
      
      const response = await fetch('https://hrms-backend-5wau.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      // ✅ Better error handling for different response types
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        console.error('❌ Non-JSON response:', textResponse);
        throw new Error('Server returned invalid response format');
      }

      console.log('📦 Response data:', data);

      if (response.ok && data.token) {
        // Store the token
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        
        console.log('✅ Login successful, redirecting to dashboard');
        navigate("/admin/dashboard");
      } else {
        setError(data.error || data.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // ✅ Better error messages based on error type
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else if (error.message.includes('CORS')) {
        setError('Server configuration error. Please contact support.');
      } else if (error.message.includes('invalid response format')) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-modal">
        <div className="admin-login-header">
          <h2 className="admin-login-title">HRMS Admin Login</h2>
          <p className="admin-login-subtitle">Please sign in to access the dashboard</p>
        </div>
        
        {error && (
          <div className="admin-login-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label">Username</label>
            <div className="admin-login-input-wrapper">
              <User className="admin-login-icon" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="admin-login-input admin-login-input-with-icon"
                required
              />
            </div>
          </div>
          
          <div className="admin-login-field">
            <label className="admin-login-label">Password</label>
            <div className="admin-login-input-wrapper">
              <Lock className="admin-login-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="admin-login-input admin-login-input-with-both-icons"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="admin-login-toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`admin-login-button ${isLoading ? 'admin-login-button-loading' : ''}`}
          >
            {isLoading ? (
              <>
                <div className="admin-login-spinner"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;