import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call delay
    setTimeout(() => {
      // Simple validation - in real app, you'd authenticate with backend
      if (loginData.username === 'admin' && loginData.password === 'admin01') {
        alert('Login successful! Redirecting to dashboard...');
        // In a real app, you would redirect to the dashboard here
        // window.location.href = '/dashboard';
        navigate("/admin/dashboard")
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 1000);
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <style>
          {`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            color: '#2e3a59',
            fontSize: '24px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>HRMS Admin Login</h2>
          <p style={{
            color: '#666',
            fontSize: '14px'
          }}>Please sign in to access the dashboard</p>
        </div>
        
        {error && (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ffcdd2'
          }}>
            {error}
          </div>
        )}
        
        <div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} size={20} />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={loginData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }} size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 45px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3f51b5'}
                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '0'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button 
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? '#ccc' : '#3f51b5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#303f9f';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = '#3f51b5';
              }
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
          
        
        
       
      </div>
    </div>
  );
};

export default AdminLogin;