import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const handleGoHome = () => {
    // In a real app, you'd use React Router's navigate or Next.js router
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="not-found-container">
      {/* Animated background elements */}
      <div className="background-overlay">
        <div className="bg-element bg-element-1"></div>
        <div className="bg-element bg-element-2"></div>
        <div className="bg-element bg-element-3"></div>
      </div>
      
      <div className="content-wrapper">
        {/* 404 Number with glitch effect */}
        <div className="error-number-container">
          <h1 className="error-number">404</h1>
          <div className="error-number-shadow">404</div>
        </div>
        
        {/* Main content */}
        <div className="main-card">
          <div className="card-content">
            <div className="icon-container">
              <Search className="search-icon" />
            </div>
            <h2 className="main-title">
              Oops! Page Not Found
            </h2>
            <p className="description">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry though – even the best explorers sometimes take a wrong turn.
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="button-container">
            <button
              onClick={handleGoHome}
              className="btn btn-primary"
            >
              <Home className="btn-icon btn-icon-pulse" />
              Go Home
            </button>
            
            <button
              onClick={handleGoBack}
              className="btn btn-secondary"
            >
              <ArrowLeft className="btn-icon btn-icon-slide" />
              Go Back
            </button>
          </div>
          
          {/* Additional help text */}
          <div className="help-section">
            <p className="help-text">
              If you believe this is an error, please contact our support team or try refreshing the page.
            </p>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="floating-element floating-element-1"></div>
        <div className="floating-element floating-element-2"></div>
        <div className="floating-element floating-element-3"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;