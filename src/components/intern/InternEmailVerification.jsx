import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, Mail } from 'lucide-react';
import './InternEmailVerification.css';

const InternEmailVerification = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = 'https://vsofthrms-production.up.railway.app/api';

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email and try again.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            window.location.href = '/intern/login';
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.error || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Network error. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, []);

  const handleResendVerification = () => {
    // Redirect to login page where user can resend verification
    window.location.href = '/intern/login';
  };

  const handleBackToLogin = () => {
    window.location.href = '/intern/login';
  };

  return (
    <div className="iev-verification-container">
      <div className="iev-verification-card">
        {/* Header */}
        <div className="iev-header">
          <div className="iev-icon-wrapper">
            <Mail className="iev-mail-icon" />
          </div>
          <h1 className="iev-title">Email Verification</h1>
          <p className="iev-subtitle">Verifying your email address...</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="iev-content-section">
            <Loader className="iev-loader-icon" />
            <p className="iev-loading-text">Please wait while we verify your email...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && !isLoading && (
          <div className="iev-content-section">
            <CheckCircle className="iev-success-icon" />
            <h2 className="iev-success-title">Verification Successful!</h2>
            <p className="iev-message-text">{message}</p>
            <p className="iev-redirect-text">You will be redirected to the login page in a few seconds...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && !isLoading && (
          <div className="iev-content-section">
            <AlertCircle className="iev-error-icon" />
            <h2 className="iev-error-title">Verification Failed</h2>
            <p className="iev-message-text">{message}</p>
            
            <div className="iev-button-group">
              <button
                onClick={handleResendVerification}
                className="iev-btn iev-btn-primary"
              >
                Resend Verification Email
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="iev-btn iev-btn-secondary"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {/* Success Actions */}
        {status === 'success' && !isLoading && (
          <div className="iev-button-group">
            <button
              onClick={handleBackToLogin}
              className="iev-btn iev-btn-primary"
            >
              Continue to Login
            </button>
          </div>
        )}

        {/* Footer */}
        {/* <div className="iev-footer">
          <p className="iev-footer-text">
            Need help? Contact support at{' '}
            <a href="mailto:support@internportal.com" className="iev-support-link">
              support@internportal.com
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default InternEmailVerification;