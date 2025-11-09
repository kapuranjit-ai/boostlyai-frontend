// components/LandingPage/LoginModal.js
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, initialType = 'login', onSwitchAuthType }) => {
  const [authType, setAuthType] = useState(initialType);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    agreeToTerms: false 
  });
  const [errors, setErrors] = useState({});
  
  const { login, register, isLoading } = useApp();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!signupData.name.trim()) newErrors.name = 'Name is required';
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!signupData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const loginErrors = validateLogin();
    if (Object.keys(loginErrors).length > 0) {
      setErrors(loginErrors);
      return;
    }

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      onClose();
      navigate('/app');
    } else {
      setErrors({ submit: result.error });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const signupErrors = validateSignup();
    if (Object.keys(signupErrors).length > 0) {
      setErrors(signupErrors);
      return;
    }

    const result = await register(
      signupData.name, 
      signupData.email, 
      signupData.password
    );
    
    if (result.success) {
      onClose();
      navigate('/app');
    } else {
      setErrors({ submit: result.error });
    }
  };

  const switchAuthType = (type) => {
    setAuthType(type);
    setErrors({});
    if (onSwitchAuthType) {
      onSwitchAuthType(type);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={(e) => e.target.classList.contains('modal') && onClose()}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        
        <div className="auth-tabs">
          <button 
            className={`tab-button ${authType === 'login' ? 'active' : ''}`}
            onClick={() => switchAuthType('login')}
          >
            Sign In
          </button>
          <button 
            className={`tab-button ${authType === 'register' ? 'active' : ''}`}
            onClick={() => switchAuthType('register')}
          >
            Create Account
          </button>
        </div>

        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}

        {/* Login Form */}
        {authType === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {authType === 'register' && (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={signupData.agreeToTerms}
                  onChange={handleSignupChange}
                  className={errors.agreeToTerms ? 'error' : ''}
                  disabled={isLoading}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the <a href="#" className="terms-link">Terms & Conditions</a>
                </label>
              </div>
              {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;