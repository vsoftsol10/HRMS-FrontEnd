import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Building, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import './InternLogin.css';
import logo from "../../assets/logo1.png"
import { useNavigate } from 'react-router-dom';

const InternLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const navigate = useNavigate();
  
  const API_BASE_URL = 'https://vsofthrms-production.up.railway.app/api';

  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const strength = {
      minLength: password.length >= passwordRequirements.minLength,
      hasUpperCase: passwordRequirements.hasUpperCase.test(password),
      hasLowerCase: passwordRequirements.hasLowerCase.test(password),
      hasNumbers: passwordRequirements.hasNumbers.test(password),
      hasSpecialChar: passwordRequirements.hasSpecialChar.test(password)
    };
    
    const score = Object.values(strength).filter(Boolean).length;
    return { strength, score, isStrong: score >= 4 };
  };

  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z\s\-']{2,50}$/;
    return nameRegex.test(name);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (isSignUp) {
          const { isStrong } = validatePassword(value);
          if (!isStrong) {
            newErrors.password = 'Password must meet security requirements';
          } else {
            delete newErrors.password;
          }
        } else {
          delete newErrors.password;
        }
        break;
        
      case 'confirmPassword':
        if (isSignUp) {
          if (!value) {
            newErrors.confirmPassword = 'Please confirm your password';
          } else if (value !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;
        
      case 'fullName':
        if (isSignUp) {
          if (!value) {
            newErrors.fullName = 'Full name is required';
          } else if (!validateFullName(value)) {
            newErrors.fullName = 'Please enter a valid full name (2-50 characters)';
          } else {
            delete newErrors.fullName;
          }
        }
        break;
                
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    if (successMessage) {
      setSuccessMessage('');
    }
    
    validateField(name, sanitizedValue);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp) {
      const { isStrong } = validatePassword(formData.password);
      if (!isStrong) {
        newErrors.password = 'Password must meet security requirements';
      }
    }
    
    if (isSignUp) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      } else if (!validateFullName(formData.fullName)) {
        newErrors.fullName = 'Please enter a valid full name';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      const endpoint = isSignUp ? '/auth/register' : '/auth/login';
      const payload = isSignUp 
        ? {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
          }
        : {
            email: formData.email,
            password: formData.password
          };

      console.log('API URL:', `${API_BASE_URL}${endpoint}`);
      console.log('Payload:', payload);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        // Success
        if (isSignUp) {
          setSuccessMessage(data.message || 'Account created successfully! Please check your email for verification.');
          // Clear form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
          });
        } else {
          // Login success
          setSuccessMessage(data.message || 'Login successful!');
          // Store token if needed
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          // Redirect
          navigate('/intern/dashboard');
        }
      } else {
        // Handle different types of errors
        if (data.details && Array.isArray(data.details)) {
          // Validation errors from express-validator
          const validationErrors = {};
          data.details.forEach(detail => {
            const field = detail.path || detail.param;
            validationErrors[field] = detail.msg;
          });
          setErrors(validationErrors);
        } else if (data.error) {
          // Handle specific error cases
          if (data.error === 'Please verify your email address before signing in') {
            setErrors({ 
              submit: data.error,
              needsVerification: true // Flag to show resend button
            });
          } else {
            setErrors({ submit: data.error });
          }
        } else {
          // Fallback error message
          setErrors({ submit: 'An error occurred. Please try again.' });
        }
      }

    } catch (error) {
      console.error('Request failed:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message || 'Password reset link sent to your email!');
      } else {
        setErrors({ submit: data.error || 'Failed to send reset email. Please try again.' });
      }
    } catch (error) {
      console.error('Forgot password failed:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Add the handleResendVerification function
  const handleResendVerification = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage(data.message || 'Verification email sent! Please check your inbox.');
      } else {
        setErrors({ submit: data.error || 'Failed to send verification email. Please try again.' });
      }
    } catch (error) {
      console.error('Resend verification failed:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setSuccessMessage('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    });
  };

  const getPasswordStrengthColor = (score) => {
    if (score < 2) return 'text-red';
    if (score < 4) return 'text-yellow';
    return 'text-green';
  };

  const getPasswordStrengthText = (score) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  const passwordValidation = isSignUp ? validatePassword(formData.password) : null;

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="header">
          <div className="logo-container">
              <img src={logo} alt="logo" className='logoPic' />
          </div>
          <h1 className="title">Intern Portal</h1>
          <p className="subtitle">Welcome to your workspace</p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher">
          <button
            className={`tab-button ${!isSignUp ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => handleModeSwitch()}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            className={`tab-button ${isSignUp ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => handleModeSwitch()}
            disabled={isLoading}
          >
            Sign Up
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">
            <CheckCircle className="message-icon" />
            <span className="message-text">{successMessage}</span>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="error-message">
            <AlertCircle className="message-icon" />
            <span className="message-text">{errors.submit}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          {isSignUp && (
            <>
              {/* Full Name */}
              <div className="input-group">
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`input ${errors.fullName ? 'input-error' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.fullName && (
                  <p className="field-error">
                    <AlertCircle className="error-icon" />
                    {errors.fullName}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Email */}
          <div className="input-group">
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className={`input ${errors.email ? 'input-error' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="field-error">
                <AlertCircle className="error-icon" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`input input-with-toggle ${errors.password ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="field-error">
                <AlertCircle className="error-icon" />
                {errors.password}
              </p>
            )}
            
            {/* Password Strength Indicator */}
            {isSignUp && formData.password && (
              <div className="password-strength">
                <div className="strength-header">
                  <span className="strength-label">Password Strength:</span>
                  <span className={`strength-value ${getPasswordStrengthColor(passwordValidation?.score)}`}>
                    {getPasswordStrengthText(passwordValidation?.score)}
                  </span>
                </div>
                <div className="strength-bar-container">
                  <div 
                    className={`strength-bar ${
                      passwordValidation?.score < 2 ? 'strength-weak' : 
                      passwordValidation?.score < 4 ? 'strength-medium' : 'strength-strong'
                    }`}
                    style={{ width: `${(passwordValidation?.score / 5) * 100}%` }}
                  ></div>
                </div>
                <div className="strength-requirements">
                  <span className={passwordValidation?.strength.minLength ? 'requirement-met' : 'requirement-unmet'}>
                    ✓ 8+ characters
                  </span>
                  <span className={passwordValidation?.strength.hasUpperCase ? 'requirement-met' : 'requirement-unmet'}>
                    ✓ Uppercase
                  </span>
                  <span className={passwordValidation?.strength.hasLowerCase ? 'requirement-met' : 'requirement-unmet'}>
                    ✓ Lowercase
                  </span>
                  <span className={passwordValidation?.strength.hasNumbers ? 'requirement-met' : 'requirement-unmet'}>
                    ✓ Numbers
                  </span>
                  <span className={passwordValidation?.strength.hasSpecialChar ? 'requirement-met' : 'requirement-unmet'}>
                    ✓ Special chars
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          {isSignUp && (
            <div className="input-group">
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input input-with-toggle ${errors.confirmPassword ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="field-error">
                  <AlertCircle className="error-icon" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? (
              <>
                <Loader className="loader-icon" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          {/* Forgot Password */}
          {!isSignUp && (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="forgot-password-button"
            >
              Forgot Password?
            </button>
          )}

          {/* Resend Verification Button - NEW */}
          {!isSignUp && errors.needsVerification && (
            <div className="verification-notice">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="forgot-password-button"
                style={{ marginTop: '8px' }}
              >
                Resend Verification Email
              </button>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            {isSignUp ? "Already have an account?" : "New to the portal?"}{" "}
            <button
              className="footer-link"
              onClick={handleModeSwitch}
              disabled={isLoading}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InternLogin;